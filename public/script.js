document.addEventListener("DOMContentLoaded", function () {
  const snowflakesContainer = document.getElementById("snowflakes");

  function createSnowflake() {
    const snowflake = document.createElement("div");
    snowflake.classList.add("snowflake");
    snowflake.style.left = Math.random() * 100 + "vw";
    snowflake.style.animationDuration = Math.random() * 5 + 5 + "s"; // 5 to 10 seconds
    snowflake.style.opacity = Math.random();
    snowflake.style.width = snowflake.style.height =
      Math.random() * 10 + 5 + "px"; // 5 to 15 pixels
    snowflakesContainer.appendChild(snowflake);

    // Remove snowflake after its animation ends
    snowflake.addEventListener("animationend", function () {
      snowflake.parentElement.removeChild(snowflake);
    });
  }

  // Add new snowflakes over time
  setInterval(createSnowflake, 300);
  const backgroundMusic = document.getElementById("background-music");
  const playButton = document.getElementById("play-music");
  const words = document.querySelectorAll("#greeting span");
  let delay = 0;

  playButton.addEventListener("click", function () {
    backgroundMusic.play();
    words.forEach((word) => {
      setTimeout(() => {
        word.style.opacity = 1;
      }, delay);
      delay += 900; // Increase delay for each word
    });
    this.style.display = "none"; // Hide the button after playing
  });
});
