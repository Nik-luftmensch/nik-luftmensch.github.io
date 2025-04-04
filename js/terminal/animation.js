export function playMatrixAnimation(duration = 6000, callback) {
    const canvas = document.getElementById("matrix-canvas");
    const ctx = canvas.getContext("2d");
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = "block";
  
    const chars = "アァイィウエカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
    const speed = 1.00;
  
    let animationFrame;
    const startTime = Date.now();
  
    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;
  
      for (let i = 0; i < drops.length; i++) {
        const char = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;
  
        ctx.fillText(char, x, y);
  
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
  
        drops[i] += speed;
      }
  
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = "none";
        if (callback) callback(); 
      } else {
        animationFrame = requestAnimationFrame(draw);
      }
    }
  
    draw();
  }
  