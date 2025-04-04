// main.js
import { Terminal } from "./terminal/terminal.js";

window.onload = () => {
  const terminal = new Terminal(
    document.getElementById("prompt"),
    document.getElementById("cmdline"),
    document.getElementById("output")
  );

  terminal.cmdLine.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      terminal.handleTabCompletion?.(e);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      terminal.handleHistoryNavigation?.(e);
    }
  });

  terminal.reset();
};
