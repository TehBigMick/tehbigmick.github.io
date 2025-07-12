// CVC Phonics Picture-Word Match Game JS

const levels = {
  A: [
    { word: "cat", image: "/assets/images/cat.webp" },
    { word: "dog", image: "/assets/images/dog.webp" },
    { word: "zip", image: "/assets/images/zip.webp" },
    { word: "sun", image: "/assets/images/sun.webp" },
    { word: "bag", image: "/assets/images/bag.webp" },
    { word: "pen", image: "/assets/images/pen.webp" },
    { word: "pig", image: "/assets/images/pig.webp" },
    { word: "cup", image: "/assets/images/cup.webp" },
    { word: "hat", image: "/assets/images/hat.webp" },
    { word: "fox", image: "/assets/images/fox.webp" }
  ],
  B: [
    { word: "pan", image: "/assets/images/pan.webp" },
    { word: "bun", image: "/assets/images/bun.webp" },
    { word: "cap", image: "/assets/images/cap.webp" },
    { word: "bed", image: "/assets/images/bed.webp" },
    { word: "jet", image: "/assets/images/jet.webp" },
    { word: "map", image: "/assets/images/map.webp" },
    { word: "log", image: "/assets/images/log.webp" },
    { word: "man", image: "/assets/images/man.webp" },
    { word: "mud", image: "/assets/images/mud.webp" },
    { word: "web", image: "/assets/images/web.webp" }
  ],
  C: [
    { word: "den", image: "/assets/images/den.webp" },
    { word: "fan", image: "/assets/images/fan.webp" },
    { word: "lid", image: "/assets/images/lid.webp" },
    { word: "lit", image: "/assets/images/lit.webp" },
    { word: "mop", image: "/assets/images/mop.webp" },
    { word: "pot", image: "/assets/images/pot.webp" },
    { word: "ram", image: "/assets/images/ram.webp" },
    { word: "vet", image: "/assets/images/vet.webp" },
    { word: "six", image: "/assets/images/six.webp" },
    { word: "wax", image: "/assets/images/wax.webp" }
  ],
  D: [
    { word: "bib", image: "/assets/images/bib.webp" },
    { word: "fig", image: "/assets/images/fig.webp" },
    { word: "kid", image: "/assets/images/kid.webp" },
    { word: "leg", image: "/assets/images/leg.webp" },
    { word: "mix", image: "/assets/images/mix.webp" },
    { word: "nod", image: "/assets/images/nod.webp" },
    { word: "pod", image: "/assets/images/pod.webp" },
    { word: "rob", image: "/assets/images/rob.webp" },
    { word: "sad", image: "/assets/images/sad.webp" },
    { word: "yam", image: "/assets/images/yam.webp" }
  ]
};

const levelButtons = document.querySelectorAll('.level-btn');
const levelSelectionScreen = document.getElementById('level-selection');
const gameScreen = document.getElementById('game-screen');
const backButton = document.getElementById('back-btn');
const imageContainer = document.getElementById('image-container');
const wordImage = document.getElementById('word-image');
const optionsContainer = document.getElementById('options-container');
const feedbackIcon = document.getElementById('feedback-icon');
const resultScreen = document.getElementById('result-screen');
const resultMessage = document.getElementById('result-message');
const returnBtn = document.getElementById('return-btn');

let currentLevel = null;
let currentRoundIndex = 0;
let currentLevelData = [];
let correctWord = "";
let score = 0;
let answeredThisRound = false;

// Function to start a level
function startLevel(level) {
  currentLevel = level;
  currentLevelData = [...levels[level]];
  currentRoundIndex = 0;
  score = 0;
  levelSelectionScreen.style.display = "none";
  gameScreen.style.display = "block";
  resultScreen.style.display = "none";
  showRound();
}

// Function to display the current round
function showRound() {
  answeredThisRound = false;
  imageContainer.classList.remove('correct', 'incorrect');
  feedbackIcon.style.display = "none";
  const item = currentLevelData[currentRoundIndex];
  correctWord = item.word;
  wordImage.src = item.image;
  wordImage.alt = item.word;
  const options = generateOptions(item.word);
  optionsContainer.innerHTML = "";
  options.forEach(word => {
    const btn = document.createElement('button');
    btn.textContent = word;
    btn.className = "option-btn";
    btn.setAttribute('draggable', true);
    btn.addEventListener('click', () => handleOptionSelect(word));
    btn.addEventListener('dragstart', handleDragStart);
    optionsContainer.appendChild(btn);
  });
}

// Generate options (1 correct, 2 wrong)
function generateOptions(correctWord) {
  let words = levels[currentLevel].map(obj => obj.word);
  words = words.filter(w => w !== correctWord);
  shuffleArray(words);
  const wrongWords = words.slice(0, 2);
  const trio = [correctWord, ...wrongWords];
  shuffleArray(trio);
  return trio;
}

// Handle a click/tap selection
function handleOptionSelect(selectedWord) {
  if (answeredThisRound) return;
  if (selectedWord === correctWord) {
    answeredThisRound = true;
    score++;
    showFeedback(true);
    goToNextRound();
  } else {
    showFeedback(false);
  }
}

// Provide visual feedback
function showFeedback(isCorrect) {
  if (isCorrect) {
    imageContainer.classList.add('correct');
    feedbackIcon.textContent = "✓";
    feedbackIcon.style.display = "block";
  } else {
    imageContainer.classList.add('incorrect');
    feedbackIcon.textContent = "✕";
    feedbackIcon.style.display = "block";
    setTimeout(() => {
      imageContainer.classList.remove('incorrect');
      feedbackIcon.style.display = "none";
    }, 500);
  }
}

// Next round logic
function goToNextRound() {
  currentRoundIndex++;
  if (currentRoundIndex < currentLevelData.length) {
    setTimeout(showRound, 1000);
  } else {
    setTimeout(finishLevel, 800);
  }
}

// Finish the level and show result
function finishLevel() {
  gameScreen.style.display = "none";
  resultMessage.textContent = `🎉 Congratulations! You scored ${score}/10!`;
  resultScreen.style.display = "flex";
}

// Drag and Drop handlers
function handleDragStart(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.textContent);
}

// Dragover on image container
imageContainer.addEventListener('dragover', ev => {
  ev.preventDefault();
});

imageContainer.addEventListener('dragenter', ev => {
  if (ev.dataTransfer) {
    imageContainer.classList.add('drag-over');
  }
});
imageContainer.addEventListener('dragleave', () => {
  imageContainer.classList.remove('drag-over');
});

imageContainer.addEventListener('drop', ev => {
  ev.preventDefault();
  imageContainer.classList.remove('drag-over');
  const droppedText = ev.dataTransfer.getData("text/plain");
  if (!answeredThisRound && droppedText === correctWord) {
    answeredThisRound = true;
    score++;
    showFeedback(true);
    goToNextRound();
  } else if (!answeredThisRound && droppedText !== correctWord) {
    showFeedback(false);
  }
});

// Shuffle utility
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Event listeners for navigation
levelButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const lvl = btn.getAttribute('data-level');
    startLevel(lvl);
  });
});
backButton.addEventListener('click', () => {
  gameScreen.style.display = "none";
  levelSelectionScreen.style.display = "flex";
  resultScreen.style.display = "none";
});
returnBtn.addEventListener('click', () => {
  resultScreen.style.display = "none";
  levelSelectionScreen.style.display = "flex";
});
