// command.js
import { configs, files } from "./config.js";
import { playMatrixAnimation } from "./animation.js";

export const commands = {
  ls: (terminal) => {
    const seen = new Set();
    let result = ".\n..\n";
    Object.keys(files).forEach((file) => {
      if (!seen.has(file)) {
        seen.add(file);
        result += file + "\n";
      }
    });
    terminal.type(result.trim(), terminal.unlock.bind(terminal));
  },

  cat: (terminal, args) => {
    if (args.length < 1) {
      terminal.type(`Usage: cat <file>`, terminal.unlock.bind(terminal));
      return;
    }
    const filename = args[0];
    if (filename === configs.welcome_file_name) {
      terminal.type(configs.welcome, terminal.unlock.bind(terminal));
    } else if (files[filename]) {
      terminal.type(files[filename], terminal.unlock.bind(terminal));
    } else {
      const msg = configs.file_not_found.replace("<value>", filename);
      terminal.type(msg, terminal.unlock.bind(terminal));
    }
  },

  whoami: (terminal) => {
    const result = `Username: ${configs.user}
Guest IP Address: ${terminal.guestIPAddress || "unknown"}
Guest Location: ${terminal.guestLocation || "unknown"}
Platform: ${navigator.platform}
Language: ${navigator.language}
Accessible cores: ${navigator.hardwareConcurrency}`;

    terminal.type(result, terminal.unlock.bind(terminal));
  },

  date: (terminal) => {
    terminal.type(new Date().toString(), terminal.unlock.bind(terminal));
  },

  clear: (terminal) => {
    terminal.output.innerHTML = "";
    terminal.unlock();
  },

  help: (terminal) => {
    const allCommands = Object.keys(commands).join(", ");
    const msg = `Below are the available commands:\n${allCommands}`;
    terminal.type(msg, terminal.unlock.bind(terminal));
  },

  reboot: (terminal) => {
    terminal.type(configs.reboot_message, terminal.reset.bind(terminal));
  },

  secure_connect: (terminal, args) => {
    if (args[0]?.toLowerCase() === "nik") {
      terminal.type("Establishing secure connection...\n", () => {
        playMatrixAnimation(3000, () => {
          terminal.startChatMode();
        });
      });
    } else {
      terminal.type("Usage: secure_connect nik", terminal.unlock.bind(terminal));
    }
  },

  chat: (terminal, args) => {
    if (args[0]?.toLowerCase() === "nik") {
      terminal.startChatMode();
    } else {
      terminal.type("Usage: chat nik", terminal.unlock.bind(terminal));
    }
  },

  sudo: (terminal) => {
    terminal.type(configs.sudo_message, terminal.unlock.bind(terminal));
  },

  cd: permissionDenied,
  mv: permissionDenied,
  rm: permissionDenied,
  rmdir: permissionDenied,
  touch: permissionDenied,
};

function permissionDenied(terminal, args) {
  const msg = configs.permission_denied_message.replace("<value>", args[0]);
  terminal.type(msg, terminal.unlock.bind(terminal));
}
