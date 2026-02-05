// ==================== CONFIGURATION ====================

const NO_BUTTON_MESSAGES = [
  "No",
  "Are you sure?",
  "Really sure?",
  "Think again!",
  "Last chance!",
  "Surely not?",
  "You might regret this!",
  "Give it another thought!",
  "Are you being serious?",
  "Please?",
  "Pretty please?",
  "With a cherry on top?",
  "Don't break my heart!",
  "I'll be sad...",
  "Bubu will cry!",
  "You're breaking Bubu's heart!",
  "Fine, I'll ask again...",
  "Will you be my Valentine?"
];

const GIFS = {
  asking: "https://media1.tenor.com/m/0cNM_9li440AAAAC/dudu-giving-flowers-bubu-flowers.gif",
  sad: "https://media1.tenor.com/m/sWXhCC4A2woAAAAC/bubu-bubu-dudu.gif",
  celebration: "https://media1.tenor.com/m/LgR_6-nkvnUAAAAC/casal-dudu.gif"
};

// ==================== STATE ====================

let noClickCount = 0;
let yesScale = 1;
let hasEscaped = false;

// ==================== ELEMENTS ====================

const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const mainGif = document.getElementById("bubu-dudu-gif");
const questionScreen = document.getElementById("question-screen");
const celebrationScreen = document.getElementById("celebration-screen");

// ==================== NO BUTTON BEHAVIOR ====================

function handleNoInteraction() {
  noClickCount++;

  // Cycle through messages
  const msgIndex = Math.min(noClickCount, NO_BUTTON_MESSAGES.length - 1);
  noBtn.textContent = NO_BUTTON_MESSAGES[msgIndex];

  // Grow the Yes button
  yesScale += 0.18;
  yesBtn.style.transform = "scale(" + Math.min(yesScale, 2.5) + ")";

  // Change GIF to sad after 3 attempts
  if (noClickCount === 3) {
    mainGif.src = GIFS.sad;
  }

  // Shrink No button after 6 attempts
  if (noClickCount >= 6) {
    const shrink = Math.max(0.5, 1 - (noClickCount - 5) * 0.07);
    noBtn.style.fontSize = shrink + "rem";
    noBtn.style.padding = (10 * shrink) + "px " + (28 * shrink) + "px";
  }

  // Teleport!
  teleportNoButton();
}

function teleportNoButton() {
  if (!hasEscaped) {
    hasEscaped = true;
    noBtn.classList.add("escaped");
  }

  const padding = 20;
  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;

  const maxX = window.innerWidth - btnW - padding;
  const maxY = window.innerHeight - btnH - padding;

  const newX = Math.max(padding, Math.random() * maxX);
  const newY = Math.max(padding, Math.random() * maxY);

  noBtn.style.left = newX + "px";
  noBtn.style.top = newY + "px";
}

// Desktop: flee on hover
noBtn.addEventListener("mouseenter", function () {
  handleNoInteraction();
});

// Mobile: flee on touch
noBtn.addEventListener("touchstart", function (e) {
  e.preventDefault();
  handleNoInteraction();
}, { passive: false });

// Safety: if somehow clicked, still flee
noBtn.addEventListener("click", function (e) {
  e.preventDefault();
  handleNoInteraction();
});

// ==================== YES BUTTON ====================

yesBtn.addEventListener("click", function () {
  questionScreen.classList.add("hidden");
  celebrationScreen.classList.remove("hidden");
  launchCelebration();
});

// ==================== CELEBRATION ====================

function launchCelebration() {
  // Confetti burst from left
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.1, y: 0.6 },
    colors: ["#e91e63", "#f06292", "#ff4081", "#f8bbd0", "#ff80ab"]
  });

  // Confetti burst from right
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.9, y: 0.6 },
    colors: ["#e91e63", "#f06292", "#ff4081", "#f8bbd0", "#ff80ab"]
  });

  // Emoji confetti
  try {
    var jsConfetti = new JSConfetti();
    jsConfetti.addConfetti({
      emojis: ["\u2764\uFE0F", "\uD83D\uDC95", "\uD83D\uDC96", "\uD83D\uDC97", "\uD83D\uDC9D", "\uD83D\uDC3B", "\uD83D\uDC3C"],
      emojiSize: 36,
      confettiNumber: 50
    });
  } catch (e) {
    // js-confetti not loaded, that's ok
  }

  // Continuous confetti for 3 seconds
  var end = Date.now() + 3000;
  var interval = setInterval(function () {
    if (Date.now() > end) {
      clearInterval(interval);
      return;
    }
    confetti({
      particleCount: 25,
      spread: 100,
      startVelocity: 30,
      origin: { x: Math.random(), y: Math.random() * 0.4 },
      colors: ["#e91e63", "#f06292", "#ff4081", "#ffcdd2", "#ff80ab"]
    });
  }, 250);
}

// ==================== FLOATING HEARTS ====================

function createFloatingHearts() {
  var container = document.getElementById("hearts-bg");
  var hearts = ["\u2764\uFE0F", "\uD83D\uDC95", "\uD83D\uDC96", "\uD83D\uDC97", "\uD83D\uDC9D", "\uD83E\uDE77", "\uD83E\uDD0D"];

  for (var i = 0; i < 20; i++) {
    var span = document.createElement("span");
    span.classList.add("floating-heart");
    span.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    span.style.left = (Math.random() * 100) + "vw";
    span.style.animationDelay = (Math.random() * 7) + "s";
    span.style.animationDuration = (5 + Math.random() * 5) + "s";
    span.style.fontSize = (1 + Math.random() * 1.5) + "rem";
    container.appendChild(span);
  }
}

// ==================== PRELOAD IMAGES ====================

function preloadImages() {
  Object.values(GIFS).forEach(function (url) {
    var img = new Image();
    img.src = url;
  });
}

// ==================== INIT ====================

document.addEventListener("DOMContentLoaded", function () {
  createFloatingHearts();
  preloadImages();
});