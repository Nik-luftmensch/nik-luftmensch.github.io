export function setupWebSocket(terminal) {
    const socket = new WebSocket("wss://nik-terminal-backend.onrender.com");
  
    socket.onopen = () => {
      console.log("✅ Connected to WebSocket server");
  
      const idMsg = {
        type: "identity",
        location: terminal.guestLocation || "unknown",
        ip: terminal.guestIPAddress || "unknown",
      };
  
      socket.send(JSON.stringify(idMsg));
    };
  
    socket.onmessage = async (event) => {
      let msg = "";
  
      if (typeof event.data === "string") {
        msg = event.data;
      } else if (event.data instanceof Blob) {
        msg = await event.data.text();
      }
  
      try {
        const parsed = JSON.parse(msg);
  
        if (parsed.type === "__typing__" || parsed.type === "__admin_typing__") {
          terminal.showTypingStatus("Nik is typing...");
        } else if (parsed.type === "chat" && parsed.message) {
          terminal.receiveMessage(parsed.message);
        }
      } catch (err) {
        // fallback if msg is just plain string (non-JSON)
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
  