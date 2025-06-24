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

  // Clear feedback and image
  feedback.textContent     = '';
  imageContainer.innerHTML = '';

  // Clear slots
  slots.forEach(slot => slot.textContent = '');

  // Pick a random word from the level
  const words = CVC_LEVELS[level];
  currentWord = words[Math.floor(Math.random() * words.length)];

  // Shuffle its letters
  const shuffled = shuffle(currentWord.split(''));

  // Render draggable letter tiles
  renderTiles(shuffled);
}

/**
 * Render the draggable letter tiles
 */
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

// Set up each drop slot
slots.forEach(slot => {
  slot.addEventListener('dragover', e => e.preventDefault());
  slot.addEventListener('drop', e => {
    e.preventDefault();
    const letter = e.dataTransfer.getData('text/plain');
    e.target.textContent = letter;
  });
});

// “Check Word” logic
checkBtn.addEventListener('click', () => {
  const guess = Array.from(slots).map(s => s.textContent).join('');
  if (guess === currentWord) {
    feedback.textContent = 'Well done!';
    // Display image (WebP); adjust extension or add fallback as needed
    const img = document.createElement('img');
    img.src = `../assets/images/${currentWord}.webp`;
    img.alt = currentWord;
    img.onerror = () => {
      // Optional fallback to PNG if WebP missing
      img.src = `../assets/images/${currentWord}.png`;
    };
    imageContainer.innerHTML = '';
    imageContainer.appendChild(img);
  } else {
    feedback.textContent     = 'Try again!';
    imageContainer.innerHTML = '';
  }
});

// “New Word” logic: reset for another random word
newWordBtn.addEventListener('click', () => {
  if (levelParam && CVC_LEVELS[levelParam]) {
    startGame(levelParam);
  }
});
