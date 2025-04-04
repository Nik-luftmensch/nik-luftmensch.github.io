document.addEventListener("DOMContentLoaded", function () {
    // === Audio Toggle Logic ===
    const audioElement = document.getElementById("audio");
    const audioPlayerButton = document.getElementById("audio-player-button");
    const iconElement = audioPlayerButton.querySelector("i");

    function togglePlayState() {
        if (audioElement.paused) {
            audioElement.play();
            iconElement.classList.remove("fa-volume-mute");
            iconElement.classList.add("fa-volume-up");
        } else {
            audioElement.pause();
            iconElement.classList.remove("fa-volume-up");
            iconElement.classList.add("fa-volume-mute");
        }
    }

    audioPlayerButton.addEventListener("click", togglePlayState);

    // === Video Forward/Reverse Logic ===
    const video = document.getElementById("video-background");

    function playVideoForward() {
        video.playbackRate = 1;
        video.play();
    }

    function playVideoBackward() {
        video.playbackRate = -1;
        video.play();
    }

    playVideoForward();

    video.addEventListener("ended", function () {
        playVideoBackward();
        video.addEventListener("timeupdate", function () {
            if (video.currentTime === 0) {
                playVideoForward();
            }
        });
    });

    // === IP & Location Tracker with EmailJS ===
    setTimeout(() => {
        if (typeof emailjs === "undefined") {
            console.warn("EmailJS is not available. Skipping data send.");
            return;
        }

        fetch("https://ipinfo.io/json?token=b65868b44e315a")
            .then(res => res.json())
            .then(location => {
                const data = {
                    username: "guest",
                    ip_address: location.ip || "Unknown",
                    location: `${location.city || "?"}, ${location.region || "?"}, ${location.country || "?"}`,
                    platform: navigator.platform,
                    language: navigator.language,
                    cores: navigator.hardwareConcurrency,
                    device: navigator.userAgent,
                };
                emailjs.send("service_xugurjm", "template_s8irjbp", data)
            })
            .catch(err => {
                console.error("❌ Error fetching location from ipinfo.io:", err);
            });
    }, 500); 
});
