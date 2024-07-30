document.addEventListener("DOMContentLoaded", function() {
    var audioElement = document.getElementById("audio");
    var audioPlayerButton = document.getElementById("audio-player-button");
    var iconElement = audioPlayerButton.querySelector("i");

    // Function to toggle play/pause state
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

    // Toggle play/pause state when the button is clicked
    audioPlayerButton.addEventListener("click", function() {
        togglePlayState();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var video = document.getElementById('video-background');

    // Function to play the video in reverse
    function playVideoBackward() {
        video.playbackRate = -1; // Play the video in reverse
        video.play();
    }

    // Function to play the video forward
    function playVideoForward() {
        video.playbackRate = 1; // Play the video forward
        video.play();
    }

    // Play the video forward initially
    playVideoForward();

    // Listen for the 'ended' event of the video
    video.addEventListener('ended', function() {
        // Once the video ends, play it in reverse
        playVideoBackward();
        // When the reversed video ends, play it forward again
        video.addEventListener('timeupdate', function() {
            if (video.currentTime === 0) {
                playVideoForward();
            }
        });
    });
});