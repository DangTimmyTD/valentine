// ==================== CONFIGURATION ====================

var NO_BUTTON_MESSAGES = [
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
  "Dudu will cry!",
  "You're breaking Dudu's heart!",
  "Fine, I'll ask again...",
  "Will you be my Valentine?"
];

var GIFS = {
  asking: "https://media1.tenor.com/m/0cNM_9li440AAAAC/dudu-giving-flowers-bubu-flowers.gif",
  celebration: "https://media1.tenor.com/m/ZP9TmRmovFAAAAAC/bubu-dudu.gif"
};

// Escalating sadness - Dudu (brown bear) crying GIFs with fallbacks
var SAD_STAGES = [
  { at: 3,  gifs: [
    "https://media1.tenor.com/m/T9aXfHX_xn8AAAAC/dudu-crying-dudu-cute.gif",
    "https://media1.tenor.com/m/yZoKXA08ZyYAAAAC/bubu-bubu-dudu.gif",
    "https://media1.tenor.com/m/Q9VuGIKQqEMAAAAC/love-bear.gif"
  ]},
  { at: 5,  gifs: [
    "https://media1.tenor.com/m/x1zd-DCiu3sAAAAC/dudu-cry-gif.gif",
    "https://media1.tenor.com/m/7uQ4GHysrS0AAAAC/tkthao219-bubududu.gif",
    "https://media1.tenor.com/m/sWXhCC4A2woAAAAC/bubu-bubu-dudu.gif"
  ]},
  { at: 7,  gifs: [
    "https://media1.tenor.com/m/eU0GphP1dRoAAAAC/dudu-cry-dudu-funny.gif",
    "https://media1.tenor.com/m/qEDqOiufxykAAAAC/tkthao219-bubududu.gif",
    "https://media1.tenor.com/m/Mw5q8hX6NnIAAAAC/bubu-dudu-bubu.gif"
  ]},
  { at: 9,  gifs: [
    "https://media1.tenor.com/m/0XxZLMzjYV0AAAAC/dudu-crying-texting.gif",
    "https://media1.tenor.com/m/N004Ks6RWmkAAAAC/bubu-dudu.gif",
    "https://media1.tenor.com/m/LZ6qSGcWa-UAAAAC/twitter-tears.gif"
  ]},
  { at: 11, gifs: [
    "https://media1.tenor.com/m/HUJyzO0WfM4AAAAC/bubu-dudu.gif",
    "https://media1.tenor.com/m/9gBByPt6k4oAAAAC/bubu-dudu-twitter.gif",
    "https://media1.tenor.com/m/fpYAztgUXloAAAAC/bubu-bubu-dudu.gif"
  ]}
];

var stageLoaded = {};

// ==================== STATE ====================

var noClickCount = 0;
var yesScale = 1;
var hasEscaped = false;
var lastInteraction = 0;
var currentStage = -1;

// ==================== ELEMENTS ====================

var yesBtn = document.getElementById("yes-btn");
var noBtn = document.getElementById("no-btn");
var mainGif = document.getElementById("bubu-dudu-gif");
var questionScreen = document.getElementById("question-screen");
var celebrationScreen = document.getElementById("celebration-screen");
var contentCard = document.querySelector(".content-card");

// ==================== VIEWPORT HELPER ====================

function getViewportSize() {
  if (window.visualViewport) {
    return {
      width: window.visualViewport.width,
      height: window.visualViewport.height
    };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

// ==================== GIF LOADING WITH FALLBACK ====================

function loadStageGif(stageIndex) {
  if (stageIndex === currentStage) return;
  currentStage = stageIndex;

  var stage = SAD_STAGES[stageIndex];
  var gifList = stage.gifs;
  var tryIndex = 0;

  function tryNext() {
    if (tryIndex >= gifList.length) return;
    var url = gifList[tryIndex];

    var testImg = new Image();
    testImg.onload = function () {
      mainGif.src = url;
      stageLoaded[stageIndex] = url;
    };
    testImg.onerror = function () {
      tryIndex++;
      tryNext();
    };
    testImg.src = url;
  }

  if (stageLoaded[stageIndex]) {
    mainGif.src = stageLoaded[stageIndex];
  } else {
    tryNext();
  }
}

// ==================== NO BUTTON BEHAVIOR ====================

function handleNoInteraction() {
  var now = Date.now();
  if (now - lastInteraction < 150) return;
  lastInteraction = now;

  noClickCount++;

  var msgIndex = Math.min(noClickCount, NO_BUTTON_MESSAGES.length - 1);
  noBtn.textContent = NO_BUTTON_MESSAGES[msgIndex];

  yesScale += 0.18;
  yesBtn.style.transform = "scale(" + Math.min(yesScale, 2.5) + ")";

  // Escalate through sad GIF stages
  for (var i = SAD_STAGES.length - 1; i >= 0; i--) {
    if (noClickCount >= SAD_STAGES[i].at) {
      loadStageGif(i);
      break;
    }
  }

  if (noClickCount >= 6) {
    var shrink = Math.max(0.5, 1 - (noClickCount - 5) * 0.07);
    noBtn.style.fontSize = shrink + "rem";
    noBtn.style.padding = (10 * shrink) + "px " + (28 * shrink) + "px";
  }

  teleportNoButton();
}

function overlapsCard(x, y, btnW, btnH) {
  var card = contentCard.getBoundingClientRect();
  var margin = 10;
  return !(
    x + btnW < card.left - margin ||
    x > card.right + margin ||
    y + btnH < card.top - margin ||
    y > card.bottom + margin
  );
}

function teleportNoButton() {
  if (!hasEscaped) {
    hasEscaped = true;
    noBtn.classList.add("escaped");
  }

  var viewport = getViewportSize();
  var padding = 30;
  var btnW = noBtn.offsetWidth;
  var btnH = noBtn.offsetHeight;

  var maxX = viewport.width - btnW - padding;
  var maxY = viewport.height - btnH - padding;

  var newX, newY;
  var attempts = 0;
  do {
    newX = Math.max(padding, Math.random() * maxX);
    newY = Math.max(padding, Math.random() * maxY);
    attempts++;
  } while (overlapsCard(newX, newY, btnW, btnH) && attempts < 20);

  if (overlapsCard(newX, newY, btnW, btnH)) {
    var card = contentCard.getBoundingClientRect();
    newX = Math.max(padding, Math.min(maxX, (viewport.width - btnW) / 2));
    newY = Math.min(maxY, card.bottom + 20);
  }

  noBtn.style.left = newX + "px";
  noBtn.style.top = newY + "px";
}

// Desktop: flee on hover
noBtn.addEventListener("mouseenter", function () {
  handleNoInteraction();
});

// Mobile: flee on touch start
noBtn.addEventListener("touchstart", function (e) {
  e.preventDefault();
  handleNoInteraction();
}, { passive: false });

// Mobile: also flee if they try to drag onto it
noBtn.addEventListener("touchmove", function (e) {
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
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.1, y: 0.6 },
    colors: ["#e91e63", "#f06292", "#ff4081", "#f8bbd0", "#ff80ab"]
  });

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.9, y: 0.6 },
    colors: ["#e91e63", "#f06292", "#ff4081", "#f8bbd0", "#ff80ab"]
  });

  try {
    var jsConfetti = new JSConfetti();
    jsConfetti.addConfetti({
      emojis: ["\u2764\uFE0F", "\uD83D\uDC95", "\uD83D\uDC96", "\uD83D\uDC97", "\uD83D\uDC9D", "\uD83D\uDC3B", "\uD83D\uDC3C"],
      emojiSize: 36,
      confettiNumber: 50
    });
  } catch (e) {}

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
  var allUrls = Object.values(GIFS);
  for (var i = 0; i < SAD_STAGES.length; i++) {
    allUrls.push(SAD_STAGES[i].gifs[0]);
  }
  allUrls.forEach(function (url) {
    var img = new Image();
    img.src = url;
  });
}

// ==================== INIT ====================

document.addEventListener("DOMContentLoaded", function () {
  createFloatingHearts();
  preloadImages();
});
