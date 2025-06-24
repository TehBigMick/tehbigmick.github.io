// learn/scripts/builder.js

import { CVC_LEVELS } from '../../scripts/data.js';
import { getQueryParam, shuffle } from '../../scripts/utils.js';

const levelParam = getQueryParam('level');

const levelPicker      = document.getElementById('level-picker');
const gameContainer    = document.getElementById('game-container');
const builderTitle     = document.getElementById('builder-title');
const slots            = document.querySelectorAll('.slot');
const lettersContainer = document.querySelector('.letters');
const checkBtn         = document.getElementById('check-btn');
const newWordBtn       = document.getElementById('new-word-btn');
const feedback         = document.getElementById('feedback');
const imageContainer   = document.getElementById('image-container');

let currentWord = '';

// Show level picker or game UI based on query param
if (!levelParam || !CVC_LEVELS[levelParam]) {
  levelPicker.style.display   = 'block';
  gameContainer.style.display = 'none';
} else {
  levelPicker.style.display   = 'none';
  gameContainer.style.display = 'block';
  startGame(levelParam);
}

/**
 * Initialise a new round for the chosen level
 */
function startGame(level) {
  // Set title
  builderTitle.textContent = level;

  // Clear feedback
  feedback.textContent     = '';

  // Clear slots
  slots.forEach(slot => slot.textContent = '');

  // Pick a random word from the level
  const words = CVC_LEVELS[level];
  currentWord = words[Math.floor(Math.random() * words.length)];

  // Show prompt image immediately
  showPromptImage(currentWord);

  // Shuffle its letters and render draggable letter tiles
  const shuffled = shuffle(currentWord.split(''));
  renderTiles(shuffled);
}

/**
 * Display the prompt image for the current word
 */
function showPromptImage(word) {
  // Construct path: adjust extension as needed (.webp/.png)
  const img = document.createElement('img');
  img.src = `../assets/images/${word}.webp`;
  img.alt = word;
  // Optional fallback if webp missing:
  img.onerror = () => {
    console.warn(`Prompt image not found: ${img.src}, trying PNG fallback.`);
    img.src = `../assets/images/${word}.png`;
  };
  // Clear and append
  imageContainer.innerHTML = '';
  imageContainer.appendChild(img);
}

function renderTiles(letters) {
  lettersContainer.innerHTML = '';
  letters.forEach(letter => {
    const tile = document.createElement('div');
    tile.className   = 'tile';
    tile.textContent = letter;
    tile.draggable   = true;
    tile.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', letter);
    });
    lettersContainer.appendChild(tile);
  });
}

// Set up drop slots
slots.forEach(slot => {
  slot.addEventListener('dragover', e => e.preventDefault());
  slot.addEventListener('drop', e => {
    e.preventDefault();
    const letter = e.dataTransfer.getData('text/plain');
    e.target.textContent = letter;
  });
});

// “Check Word” logic: we leave the prompt image visible;
// optionally add a border or highlight on correct.
checkBtn.addEventListener('click', () => {
  const guess = Array.from(slots).map(s => s.textContent).join('');
  if (guess === currentWord) {
    feedback.textContent = 'Well done!';
    // Optionally highlight the image or slots:
    // e.g., add a CSS class to imageContainer or slots to indicate success
    // imageContainer.querySelector('img')?.classList.add('correct-highlight');
  } else {
    feedback.textContent = 'Try again!';
  }
});

// “New Word” logic: reset for another random word
newWordBtn.addEventListener('click', () => {
  if (levelParam && CVC_LEVELS[levelParam]) {
    startGame(levelParam);
  }
});
