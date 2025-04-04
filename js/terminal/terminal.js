// terminal.js
import { configs, files } from "./config.js";
import { setupWebSocket } from "./websocket.js";
import { scrollToBottom, isURL } from "./helper.js";
import { commands } from "./command.js";

export class Terminal {
  constructor(prompt, cmdLine, output) {
    this.prompt = prompt;
    this.cmdLine = cmdLine;
    this.output = output;

    // Typing state
    this.typingText = "";
    this.typingIndex = 0;
    this.isTyping = false;
    this.typingTimeout = null;

    this.completePrompt = `${configs.user}@${configs.host}:~${configs.is_root ? "#" : "$"}`;
    this.inChatMode = false;

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

    // Listen for keyboard input
    this.cmdLine.addEventListener("keydown", (event) => this.handleCommandInput(event));

    // Focus input on body click
    document.body.addEventListener("click", () => this.cmdLine.focus());

    // Allow double-click to skip
    document.addEventListener("dblclick", () => this.skipTypingIfNeeded());
  }

  /**
   * Immediately finish any current typing. 
   * The remainder is appended in one go (plus a <br/>).
   */
  skipTypingIfNeeded() {
    if (this.isTyping) {
      clearTimeout(this.typingTimeout);

      const remainder = this.typingText.substring(this.typingIndex);
      this.output.innerHTML += remainder.replace(/\n/g, "<br/>") + "<br/>";

      this.isTyping = false;
      this.typingText = "";
      this.typingIndex = 0;
      scrollToBottom();
    }
  }

  /**
   * Type text with a character-by-character animation, or skip if called.
   * NOTE: This function itself does not unlock – do that in the callback if desired.
   */
  type(text, callback) {
    // If something else was typing, skip it so text doesn't get cut.
    this.skipTypingIfNeeded();

    if (isURL(text)) window.open(text);

    this.typingText = text;
    this.typingIndex = 0;
    this.isTyping = true;

    const typer = () => {
      if (!this.isTyping) {
        // If skipTypingIfNeeded() was called mid-typing
        if (callback) callback();
        return;
      }

      if (this.typingIndex < this.typingText.length) {
        const char = this.typingText.charAt(this.typingIndex++);
        this.output.innerHTML += (char === "\n") ? "<br/>" : char;

        const delay = (char === "\n") ? configs.type_delay * 2 : configs.type_delay;
        this.typingTimeout = setTimeout(typer, delay);
      } else {
        // Done
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
    // Only unlock if not typing
    if (!this.isTyping) {
      this.prompt.textContent = this.completePrompt;
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
        // 1) Skip current typing so the old text doesn't get cut
        this.skipTypingIfNeeded();

        // 2) Show the new prompt + user input
        this.output.innerHTML += `<br/><span class="prompt-color">${this.completePrompt}</span> <span class="prompt-color2">${input}</span><br/>`;

        // 3) Push to history
        this.cmdHistory.push(input);
        this.historyIndex = this.cmdHistory.length;

        // 4) Execute
        this.executeCommand(input);
      }
      this.cmdLine.value = "";
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
      this.cmdLine.value = (parts.length === 1) ? matches[0] : `${cmd} ${matches[0]}`;
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
    if (this.inChatMode) {
      this.output.innerHTML += `<span class="prompt-color2">Nik:</span> ${message}<br/>`;
      scrollToBottom();
    }
  }

  startChatMode() {
    this.inChatMode = true;
    this.output.innerHTML += "<span class='prompt-color2'>Secure chat connected. Type 'exit' to disconnect.</span><br/>";
    scrollToBottom();
  }

  stopChatMode() {
    this.inChatMode = false;
    this.output.innerHTML += "<span class='prompt-color2'>Chat disconnected.</span><br/>";
    this.unlock();
  }
}
