// autocomplete.js

export function handleTabCompletion(event, terminal) {
    event.preventDefault();
    const input = terminal.cmdLine.value.trim();
    const parts = input.split(" ");
    const commands = ["ls", "cat", "whoami", "date", "clear", "help", "reboot", "sudo", "chat", "secure_connect"];
    const files = Object.keys(terminal.availableFiles || {});
  
    if (parts.length === 1) {
      const matches = commands.filter(cmd => cmd.startsWith(parts[0]));
      if (matches.length === 1) {
        terminal.cmdLine.value = matches[0] + " ";
      } else if (matches.length > 1) {
        terminal.type(matches.join("\n"), terminal.unlock.bind(terminal));
      }
    } else if (parts[0] === "cat" && parts.length === 2) {
      const matches = files.filter(file => file.startsWith(parts[1]));
      if (matches.length === 1) {
        terminal.cmdLine.value = "cat " + matches[0];
      } else if (matches.length > 1) {
        terminal.type(matches.join("\n"), terminal.unlock.bind(terminal));
      }
    }
  }
  
  export function handleCommandHistory(event, terminal) {
    if (event.key === "ArrowUp") {
      if (terminal.historyIndex > 0) {
        terminal.historyIndex--;
        terminal.cmdLine.value = terminal.cmdHistory[terminal.historyIndex];
      }
    } else if (event.key === "ArrowDown") {
      if (terminal.historyIndex < terminal.cmdHistory.length - 1) {
        terminal.historyIndex++;
        terminal.cmdLine.value = terminal.cmdHistory[terminal.historyIndex];
      } else {
        terminal.cmdLine.value = "";
        terminal.historyIndex = terminal.cmdHistory.length;
      }
    }
  }
  