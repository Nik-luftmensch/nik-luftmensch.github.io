import { configs, files } from "./config.js";
import { setupWebSocket } from "./websocket.js";
import { scrollToBottom, isURL } from "./helper.js";
import { commands } from "./command.js";

export class Terminal {
  constructor(prompt, cmdLine, output) {
    this.prompt = prompt;
    this.cmdLine = cmdLine;
    this.output = output;

    this.typingText = "";
    this.typingIndex = 0;
    this.isTyping = false;
    this.typingTimeout = null;
    this._typingTimeoutClear = null;

    this.completePrompt = `${configs.user}@${configs.host}:~${configs.is_root ? "#" : "$"}`;
    this.inChatMode = false;
    this.chatAlias = "User";

    this.cmdHistory = [];
    this.historyIndex = -1;

    this.guestIPAddress = "unknown";
    this.guestLocation = "unknown";

    fetch("https://ipinfo.io/json?token=b65868b44e315a")
      .then((response) => response.json())
      .then((locationData) => {
        this.guestIPAddress = locationData.ip || "unknown";
        this.guestLocation = locationData.city || "unknown";
        this.completePrompt = `${this.guestLocation}@${this.guestIPAddress}:~${configs.is_root ? "#" : "$"}`;
        this.prompt.textContent = this.completePrompt;
        this.socket = setupWebSocket(this);
      })
      .catch(() => {
        this.socket = setupWebSocket(this);
      });

    this.cmdLine.addEventListener("keydown", (event) => this.handleCommandInput(event));
    document.body.addEventListener("click", () => this.cmdLine.focus());
    document.addEventListener("dblclick", () => {
      this.skipTypingIfNeeded();
      this.cmdLine.focus();
    });

    let typingDebounce;
    this.cmdLine.addEventListener("input", () => {
      if (this.inChatMode && this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: "__typing__" }));
      }
      clearTimeout(typingDebounce);
      typingDebounce = setTimeout(() => {}, 1500);
    });
  }

  getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const mins = String(now.getMinutes()).padStart(2, "0");
    return `[${hours}:${mins}]`;
  }

  skipTypingIfNeeded() {
    if (this.isTyping) {
      clearTimeout(this.typingTimeout);
      const remainder = this.typingText.substring(this.typingIndex);
      this.output.innerHTML += remainder.replace(/\n/g, "<br/>") + "<br/>";
      this.isTyping = false;
      this.typingText = "";
      this.typingIndex = 0;
      this.unlock();
      scrollToBottom();
    }
  }

  type(text, callback) {
    this.skipTypingIfNeeded();

    if (isURL(text)) window.open(text);

    if (text.includes("<") && text.includes(">")) {
      this.output.innerHTML += text + "<br/>";
      this.unlock();
      if (callback) callback();
      scrollToBottom();
      return;
    }

    this.typingText = text;
    this.typingIndex = 0;
    this.isTyping = true;

    const typer = () => {
      if (!this.isTyping) {
        if (callback) callback();
        return;
      }
      if (this.typingIndex < this.typingText.length) {
        const char = this.typingText.charAt(this.typingIndex++);
        this.output.innerHTML += (char === "\n") ? "<br/>" : char;
        const delay = (char === "\n") ? configs.type_delay * 2 : configs.type_delay;
        this.typingTimeout = setTimeout(typer, delay);
      } else {
        this.isTyping = false;
        this.output.innerHTML += "<br/>";
        if (callback) callback();
      }
      scrollToBottom();
    };

    typer();
  }

  lock() {
    this.cmdLine.disabled = true;
  }

  unlock() {
    if (!this.isTyping) {
      this.prompt.textContent = this.inChatMode
        ? `${this.chatAlias}:`
        : this.completePrompt;
      this.cmdLine.disabled = false;
      this.cmdLine.focus();
      scrollToBottom();
    }
  }

  reset() {
    this.output.innerHTML += "<br/>";
    this.prompt.textContent = "";
    this.type(configs.welcome, () => this.unlock());
  }

  handleCommandInput(event) {
    const input = this.cmdLine.value.trim();
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      this.handleHistoryNavigation(event);
    } else if (event.key === "Tab") {
      this.handleTabCompletion(event);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (input) {
        this.skipTypingIfNeeded();
        this.clearTypingStatus();
        if (this.inChatMode) {
          if (input.toLowerCase() === "exit") {
            this.stopChatMode();
          } else {
            this.output.innerHTML += `<span class="prompt-color2">${this.getCurrentTime()} ${this.chatAlias}:</span> ${input}<br/>`;
            if (this.socket && this.socket.send) {
              this.socket.send(JSON.stringify({
                type: "chat",
                name: this.chatAlias || "User",
                message: input,
                ip: this.guestIPAddress,
                city: this.guestLocation
              }));
            }
          }
        } else {
          this.type(
            `<span class="prompt-color">${this.completePrompt}</span> <span class="prompt-color2">${input}</span><br/>`,
            () => {
              this.cmdHistory.push(input);
              this.historyIndex = this.cmdHistory.length;
              this.executeCommand(input);
            }
          );
        }
      }
      this.cmdLine.value = "";
      scrollToBottom();
    }
  }

  handleHistoryNavigation(event) {
    if (event.key === "ArrowUp" && this.historyIndex > 0) {
      this.historyIndex--;
      this.cmdLine.value = this.cmdHistory[this.historyIndex];
      event.preventDefault();
    } else if (event.key === "ArrowDown" && this.historyIndex < this.cmdHistory.length - 1) {
      this.historyIndex++;
      this.cmdLine.value = this.cmdHistory[this.historyIndex];
      event.preventDefault();
    } else {
      this.cmdLine.value = "";
      this.historyIndex = this.cmdHistory.length;
    }
  }

  handleTabCompletion(event) {
    event.preventDefault();
    const current = this.cmdLine.value.trim();
    const parts = current.split(" ");
    const [cmd, partial] = [parts[0], parts[1] || ""];

    const cmds = Object.keys(commands);
    const filenames = Object.keys(files);
    const matches = [];

    if (parts.length === 1) {
      matches.push(...cmds.filter((c) => c.startsWith(cmd)));
    } else if (cmd === "cat") {
      matches.push(...filenames.filter((f) => f.startsWith(partial)));
    }

    if (matches.length === 1) {
      this.cmdLine.value = parts.length === 1 ? matches[0] : `${cmd} ${matches[0]}`;
    } else if (matches.length > 1) {
      this.type(matches.join("\n"), () => this.unlock());
    }
  }

  executeCommand(input) {
    this.lock();
    const [command, ...args] = input.split(" ");
    if (commands[command]) {
      commands[command](this, args);
    } else {
      this.type(configs.invalid_command_message.replace("<value>", command), () => this.unlock());
    }
  }

  receiveMessage(message) {
    this.clearTypingStatus();

    if (message === "__admin_typing__" || message === "__typing__") {
      if (!this.inChatMode) {
        this.skipTypingIfNeeded();
        this.startChatMode("User", false);
      }
      this.showTypingStatus("Nik is typing...");
      return;
    }

    if (!this.inChatMode) {
      this.skipTypingIfNeeded();
      this.startChatMode("User", true);
    }

    const time = this.getCurrentTime();
    this.output.innerHTML += `<span class="prompt-color2">${time} Nik:</span> ${message}<br/>`;
    scrollToBottom();
    this.unlock();
  }

  startChatMode(alias = "User", suppressConnectionMsg = false) {
    this.skipTypingIfNeeded();
    this.inChatMode = true;
    this.chatAlias = alias;

    if (!suppressConnectionMsg) {
      this.output.innerHTML += `<span class='prompt-color2'>Secure chat connected as <b>${alias}</b>.</span><br/>`;
      this.output.innerHTML += `<span class='prompt-color3'>Type 'exit' to return to normal mode.</span><br/>`;
    }

    this.prompt.textContent = `${this.chatAlias}:`;
    this.cmdLine.disabled = false;
    this.cmdLine.focus();
    scrollToBottom();
  }

  stopChatMode() {
    this.inChatMode = false;
    this.output.innerHTML += "<span class='prompt-color2'>Chat disconnected.</span><br/>";
    this.prompt.textContent = this.completePrompt;
    this.cmdLine.disabled = false;
    this.cmdLine.focus();
  }

  showTypingStatus(text) {
    this.clearTypingStatus();

    const wrapper = document.createElement("div");
    wrapper.id = "typing-indicator-wrapper";

    const indicator = document.createElement("span");
    indicator.id = "typing-indicator";
    indicator.className = "prompt-color3";
    indicator.textContent = text;

    wrapper.appendChild(indicator);
    this.output.appendChild(wrapper);

    scrollToBottom();

    this._typingTimeoutClear = setTimeout(() => {
      this.clearTypingStatus();
    }, 3000);
  }

  clearTypingStatus() {
    const wrapper = document.getElementById("typing-indicator-wrapper");
    if (wrapper) wrapper.remove();

    if (this._typingTimeoutClear) {
      clearTimeout(this._typingTimeoutClear);
      this._typingTimeoutClear = null;
    }
  }
}
