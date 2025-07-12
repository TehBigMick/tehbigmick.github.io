// Data for levels (as defined earlier, potentially imported or in the same file)
const levels = {
  A: [
    { word: "cat", image: "cat.webp" },
    { word: "dog", image: "dog.webp" },
    { word: "zip", image: "zip.webp" },
    { word: "sun", image: "sun.webp" },
    { word: "bag", image: "bag.webp" },
    { word: "pen", image: "pen.webp" },
    { word: "pig", image: "pig.webp" },
    { word: "cup", image: "cup.webp" },
    { word: "hat", image: "hat.webp" },
    { word: "fox", image: "fox.webp" }
  ],
  B: [
    { word: "pan", image: "pan.webp" },
    { word: "bun", image: "bun.webp" },
    { word: "cap", image: "cap.webp" },
    { word: "bed", image: "bed.webp" },
    { word: "jet", image: "jet.webp" },
    { word: "map", image: "map.webp" },
    { word: "log", image: "log.webp" },
    { word: "man", image: "man.webp" },
    { word: "mud", image: "mud.webp" },
    { word: "web", image: "web.webp" }
  ],
  C: [
    { word: "den", image: "den.webp" },
    { word: "fan", image: "fan.webp" },
    { word: "lid", image: "lid.webp" },
    { word: "lit", image: "lit.webp" },
    { word: "mop", image: "mop.webp" },
    { word: "pot", image: "pot.webp" },
    { word: "ram", image: "ram.webp" },
    { word: "vet", image: "vet.webp" },
    { word: "six", image: "six.webp" },
    { word: "wax", image: "wax.webp" }
  ],
  D: [
    { word: "bib", image: "bib.webp" },
    { word: "fig", image: "fig.webp" },
    { word: "kid", image: "kid.webp" },
    { word: "leg", image: "leg.webp" },
    { word: "mix", image: "mix.webp" },
    { word: "nod", image: "nod.webp" },
    { word: "pod", image: "pod.webp" },
    { word: "rob", image: "rob.webp" },
    { word: "sad", image: "sad.webp" },
    { word: "yam", image: "yam.webp" }
  ]
};

// Get references to DOM elements
const levelButtons = document.querySelectorAll('.level-btn');
const levelSelectionScreen = document.getElementById('level-selection');
const gameScreen = document.getElementById('game-screen');
const backButton = document.getElementById('back-btn');
const imageContainer = document.getElementById('image-container');
const wordImage = document.getElementById('word-image');
const optionsContainer = document.getElementById('options-container');
const feedbackIcon = document.getElementById('feedback-icon');

let currentLevel = null;
let currentRoundIndex = 0;
let currentLevelData = [];
let correctWord = "";

// Function to start a level
function startLevel(level) {
  currentLevel = level;
  currentLevelData = [...levels[level]];  // clone the array to manipulate if needed
  currentRoundIndex = 0;
  // Optionally shuffle the level array so rounds come in random order
  shuffleArray(currentLevelData);
  // Switch to game screen
  levelSelectionScreen.style.display = "none";
  gameScreen.style.display = "block";
  showRound();
}

// Function to display the current round (image and options)
function showRound() {
  // Reset any feedback/icon from previous round
  imageContainer.classList.remove('correct', 'incorrect');
  feedbackIcon.style.display = "none";
  // Get the current item (word & image) for this round
  const item = currentLevelData[currentRoundIndex];
  correctWord = item.word;
  // Update the image
  wordImage.src = item.image;
  wordImage.alt = item.word;
  // Prepare options (correct + 2 random wrong)
  const options = generateOptions(item.word);
  // Render option buttons
  optionsContainer.innerHTML = "";  // clear previous options
  options.forEach(word => {
    const btn = document.createElement('button');
    btn.textContent = word;
    btn.className = "option-btn";
    // Make it draggable
    btn.setAttribute('draggable', true);
    // Attach event handlers
    btn.addEventListener('click', () => handleOptionSelect(word));
    btn.addEventListener('dragstart', handleDragStart);
    // Append to the options container
    optionsContainer.appendChild(btn);
  });
}

// Generate an array of three options (1 correct, 2 wrong) shuffled
function generateOptions(correctWord) {
  let words = levels[currentLevel].map(obj => obj.word);
  // Remove the correct word from the pool
  words = words.filter(w => w !== correctWord);
  // Randomly pick two wrong words
  shuffleArray(words);
  const wrongWords = words.slice(0, 2);
  // Combine correct with wrong and shuffle the trio
  const trio = [correctWord, ...wrongWords];
  shuffleArray(trio);
  return trio;
}

// Handle a click/tap selection
function handleOptionSelect(selectedWord) {
  if (selectedWord === correctWord) {
    // Correct answer
    showFeedback(true);
    goToNextRound();
  } else {
    // Wrong answer
    showFeedback(false);
    // (Keep the round active for another try; maybe disable the wrong option)
  }
}

// Provide visual feedback for correct/incorrect
function showFeedback(isCorrect) {
  if (isCorrect) {
    imageContainer.classList.add('correct');
    feedbackIcon.textContent = "✓";
    feedbackIcon.style.display = "block";
  } else {
    // Flash incorrect (we can briefly show a cross)
    imageContainer.classList.add('incorrect');
    feedbackIcon.textContent = "✕";
    feedbackIcon.style.display = "block";
    // Remove the 'incorrect' class after a short delay so it doesn't stick
    setTimeout(() => {
      imageContainer.classList.remove('incorrect');
      feedbackIcon.style.display = "none";
    }, 500);
  }
}

// Proceed to the next round after a delay (to allow the user to see the feedback)
function goToNextRound() {
  currentRoundIndex++;
  if (currentRoundIndex < currentLevelData.length) {
    // There is a next round
    setTimeout(showRound, 1000);  // show next round after 1 second
  } else {
    // Level completed
    setTimeout(finishLevel, 800);
  }
}

// Finish the level (show a completion message or go back to menu)
function finishLevel() {
  alert(`Well done! You completed Level ${currentLevel}.`);  // simple alert or could be a nice modal
  // Return to level selection:
  gameScreen.style.display = "none";
  levelSelectionScreen.style.display = "block";
}

// Drag and Drop event handlers:
function handleDragStart(ev) {
  // Set the dragged data to the text of the button (the word)
  ev.dataTransfer.setData("text/plain", ev.target.textContent);
  // (We could also add a drag class for styling if needed)
}

// Dragover on image container must prevent default to allow drop
imageContainer.addEventListener('dragover', ev => {
  ev.preventDefault();
});

// Highlight on dragenter
imageContainer.addEventListener('dragenter', ev => {
  // If a draggable item is entering, add highlight
  if (ev.dataTransfer) {
    imageContainer.classList.add('drag-over');
  }
});
imageContainer.addEventListener('dragleave', () => {
  imageContainer.classList.remove('drag-over');
});

// Handle drop on image container
imageContainer.addEventListener('drop', ev => {
  ev.preventDefault();
  imageContainer.classList.remove('drag-over');
  const droppedText = ev.dataTransfer.getData("text/plain");
  if (droppedText) {
    if (droppedText === correctWord) {
      // If correct word was dropped
      showFeedback(true);
      goToNextRound();
    } else {
      // Wrong word dropped
      showFeedback(false);
      // (Wrong word remains available for another try)
    }
  }
});

// Utility: Fisher-Yates shuffle for an array (to randomize order)
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Event listeners for level buttons and back button
levelButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const lvl = btn.getAttribute('data-level');
    startLevel(lvl);
  });
});
backButton.addEventListener('click', () => {
  // Stop current game and go back to menu
  gameScreen.style.display = "none";
  levelSelectionScreen.style.display = "block";
});
