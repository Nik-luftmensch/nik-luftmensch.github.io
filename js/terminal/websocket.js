// websocket.js

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
  
      if (terminal.inChatMode) {
        terminal.output.innerHTML += `<span class="prompt-color2">Nik:</span> ${msg}<br/>`;
        terminal.unlock();
      } else {
        // Alert user to switch to chat
        terminal.output.innerHTML += `<span class="prompt-color2">Nik is trying to connect. Type 'chat nik' or 'secure_connect nik' to respond.</span><br/>`;
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
  