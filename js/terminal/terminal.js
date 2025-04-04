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
  
      this.cmdLine.addEventListener("keydown", (event) => this.handleCommandInput(event));
      document.body.addEventListener("click", () => this.cmdLine.focus());
    }
  
    // Stop any current typing animation and quickly render the whole text
    stopTyping() {
      clearTimeout(this.typingTimeout);
      this.output.innerHTML += "<br/>";  // Ensure new content starts on a new line
    }
  
    // Type out the text slowly with typing effect
    type(text, callback) {
      this.stopTyping();  // Stop any previous text rendering immediately
  
      if (isURL(text)) window.open(text);
  
      let i = 0;
      let skipped = false;
      const output = this.output;
      const skip = () => (skipped = true);
  
      document.addEventListener("dblclick", skip);  // Handle skip action
  
      const typer = () => {
        if (skipped) {
          output.innerHTML += text.substring(i).replace(/\n/g, "<br/>") + "<br/>";
          document.removeEventListener("dblclick", skip);
          if (callback) callback();
          return;
        }
  
        if (i < text.length) {
          const char = text.charAt(i);
          const isNewLine = char === "\n";
          output.innerHTML += isNewLine ? "<br/>" : char;
          i++;
          this.typingTimeout = setTimeout(typer, isNewLine ? configs.type_delay * 2 : configs.type_delay);
        } else {
          output.innerHTML += "<br/>";
          document.removeEventListener("dblclick", skip);
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
      this.prompt.textContent = this.completePrompt;
      this.cmdLine.disabled = false;
      this.cmdLine.focus();
      scrollToBottom();
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
          this.output.innerHTML += `<br/><span class="prompt-color">${this.completePrompt}</span> <span class="prompt-color2">${input}</span><br/>`;
  
          this.cmdHistory.push(input);
          this.historyIndex = this.cmdHistory.length;
  
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
        this.cmdLine.value = parts.length === 1 ? matches[0] : `${cmd} ${matches[0]}`;
      } else if (matches.length > 1) {
        this.type(matches.join("\n"), this.unlock.bind(this));
      }
    }
  
    executeCommand(input) {
      this.lock();
      const [command, ...args] = input.split(" ");
  
      if (commands[command]) {
        commands[command](this, args);
      } else {
        this.type(configs.invalid_command_message.replace("<value>", command), this.unlock.bind(this));
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
  