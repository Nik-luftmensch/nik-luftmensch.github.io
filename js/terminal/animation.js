// animation.js

export function playMatrixAnimation(duration = 3000, callback) {
    const canvas = document.getElementById("matrix-canvas");
    const ctx = canvas.getContext("2d");
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = "block";
  
    const chars = "アァイィウエカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
  
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;
  
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, y * fontSize);
        drops[i] = (y * fontSize > canvas.height && Math.random() > 0.975) ? 0 : y + 1;
      });
    };
  
    const interval = setInterval(draw, 33);
  
    setTimeout(() => {
      clearInterval(interval);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = "none";
      if (callback) callback();
    }, duration);
  }
  