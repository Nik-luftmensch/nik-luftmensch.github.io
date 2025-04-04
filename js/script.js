document.addEventListener("DOMContentLoaded", function () {
    // === Audio Toggle Logic ===
    const audioElement = document.getElementById("audio");
    const audioPlayerButton = document.getElementById("audio-player-button");
  
    if (audioElement && audioPlayerButton) {
      const iconElement = audioPlayerButton.querySelector("i");
      audioElement.loop = true;
  
      function updateIcon(isPlaying) {
        if (isPlaying) {
          iconElement.classList.remove("fa-volume-mute");
          iconElement.classList.add("fa-volume-up");
        } else {
          iconElement.classList.remove("fa-volume-up");
          iconElement.classList.add("fa-volume-mute");
        }
      }
  
      function togglePlayState() {
        if (audioElement.paused) {
          audioElement.play().then(() => updateIcon(true)).catch(console.warn);
        } else {
          audioElement.pause();
          updateIcon(false);
        }
      }
  
      audioPlayerButton.addEventListener("click", togglePlayState);
      updateIcon(!audioElement.paused);
    }
  
    // === Background Video Logic ===
    const video = document.getElementById("video-background");
    if (video) {
      video.playbackRate = 1;
      video.play();
    }
  
    // === IP & Location Tracker ===
    setTimeout(() => {
      if (typeof emailjs === "undefined") return;
  
      fetch("https://ipinfo.io/json?token=b65868b44e315a")
        .then(res => res.json())
        .then(location => {
          const data = {
            username: "guest",
            ip_address: location.ip || "Unknown",
            location: `${location.city || "?"}, ${location.region || "?"}, ${location.country || "?"}`,
            platform: navigator.platform,
            language: navigator.language,
            browser_languages: navigator.languages.join(", "),
            cores: navigator.hardwareConcurrency,
            device: navigator.userAgent,
            screen_size: screen.width + "x" + screen.height,
            window_size: window.innerWidth + "x" + window.innerHeight,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            time: new Date().toString(),
            online: navigator.onLine,
            touch_support: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            cookie_enabled: navigator.cookieEnabled,
            do_not_track: navigator.doNotTrack,
            referrer: document.referrer || "None"
          };
  
          emailjs.send("service_xugurjm", "template_s8irjbp", data);
        });
    }, 500);
  
    // === Side Navigation Setup ===
    const sidenav = document.getElementById("sidenav");
    const sidenavBtn = document.getElementById("sidenavBtn");
    const profilePic = document.getElementById("profilePic");
    const cmdLine = document.getElementById("cmdline");
  
    const fileButtons = {
      "contact.txt": "Contact",
      "academics.txt": "Academics",
      "technologies.txt": "Technologies",
      "experience.txt": "Experience",
      "linkedIn": "LinkedIn",
      "github": "GitHub",
      "about": "About You"
    };
  
    function createSidenavButton(fileKey, label) {
      const button = document.createElement("button");
      button.textContent = label;
      button.style.opacity = "0";
      button.style.transform = "translateX(-300px)";
      button.onclick = (event) => {
        event.stopPropagation(); // Prevent closing the sidenav when clicking an option
        cmdLine.value = fileKey === "about" ? "whoami" : `cat ${fileKey}`;
        cmdLine.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      };
      sidenav.appendChild(button);
    }
  
    if (sidenav && sidenavBtn && profilePic && cmdLine) {
      Object.entries(fileButtons).forEach(([file, label]) => {
        createSidenavButton(file, label);
      });
  
      sidenavBtn.addEventListener("click", () => {
        sidenav.classList.toggle("open");
  
        // Toggle hamburger ↔ arrow icon
        sidenavBtn.innerHTML = sidenav.classList.contains("open")
          ? `<span class="hamburger-icon">&#9886;</span>`
          : `<span class="hamburger-icon">&#9776;</span>`;
  
        const buttons = sidenav.querySelectorAll("button:not(#sidenavBtn)");
        buttons.forEach(btn => {
          btn.style.opacity = sidenav.classList.contains("open") ? "1" : "0";
          btn.style.transform = sidenav.classList.contains("open") ? "translateX(0)" : "translateX(-300px)";
        });
        profilePic.style.opacity = sidenav.classList.contains("open") ? "1" : "0";
      });
    }
  });
  