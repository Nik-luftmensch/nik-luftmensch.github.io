export function setupWebSocket(terminal) {
  const socket = new WebSocket("wss://nik-terminal-backend.onrender.com");

  socket.onopen = () => {
    console.log("✅ Connected to WebSocket server");

    const idMsg = {
      type: "identity",
      location: terminal.guestLocation || "unknown",
      ip: terminal.guestIPAddress || "unknown",
      name: terminal.chatAlias || "User",
    };

    socket.send(JSON.stringify(idMsg));
  };

  socket.onmessage = async (event) => {
    let msg;

    if (typeof event.data === "string") {
      msg = event.data;
    } else if (event.data instanceof Blob) {
      msg = await event.data.text();
    } else {
      console.warn("⚠️ Unknown message format:", event.data);
      return;
    }

    try {
      const parsed = JSON.parse(msg);

      switch (parsed.type) {
        case "__typing__":
        case "__admin_typing__":
          terminal.showTypingStatus("Nik is typing...");
          break;
        case "__ai_typing__":
          terminal.showTypingStatus("AI Nik is typing...");
          break;
        case "chat":
          if (parsed.message) {
            terminal.receiveMessage(parsed.message);
          }
          break;
        default:
          console.warn("⚠️ Unrecognized message type:", parsed.type);
          break;
      }
    } catch (err) {
      // Not JSON — fallback to plain message
      terminal.receiveMessage(msg);
    }
  };

  socket.onerror = (error) => {
    console.error("❌ WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("🔌 WebSocket connection closed");
  };

  return socket;
}
