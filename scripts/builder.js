// learn/scripts/builder.js

import { CVC_LEVELS } from '../../scripts/data.js';
import { getQueryParam, shuffle } from '../../scripts/utils.js';

const levelParam = getQueryParam('level');

const levelPicker      = document.getElementById('level-picker');
const gameContainer    = document.getElementById('game-container');
const builderTitle     = document.getElementById('builder-title');
const imageContainer   = document.getElementById('image-container');
const slots            = document.querySelectorAll('.slot');
const lettersContainer = document.querySelector('.letters');
const checkBtn         = document.getElementById('check-btn');
const newWordBtn       = document.getElementById('new-word-btn');
const feedback         = document.getElementById('feedback');

let currentWord = '';

// On load: decide whether to show level picker or start game
if (!levelParam || !CVC_LEVELS[levelParam]) {
  // Show level picker
  levelPicker.style.display   = 'block';
  gameContainer.style.display = 'none';
} else {
  // Start game for chosen level
  levelPicker.style.display   = 'none';
  gameContainer.style.display = 'block';
  startGame(levelParam);
}

/**
 * Initialise a new round for the chosen level.
 * Picks a random word, shows its image prompt, shuffles letters and renders tiles.
 */
function startGame(level) {
  // Display level title
  builderTitle.textContent = level;

  // Clear feedback
  feedback.textContent = '';

  // Clear any existing slot letters
  slots.forEach(slot => slot.textContent = '');

  // Pick a random word from the level's 25-word list
  const words = CVC_LEVELS[level];
  currentWord = words[Math.floor(Math.random() * words.length)];

  // Show prompt image immediately
  showPromptImage(currentWord);

  // Shuffle its letters and render draggable tiles
  const shuffledLetters = shuffle(currentWord.split(''));
  renderTiles(shuffledLetters);
}

/**
 * Display the prompt image for the given word.
 * Attempts WebP first, falls back to PNG if WebP not found.
 */
function showPromptImage(word) {
  // Clear previous image
  imageContainer.innerHTML = '';

  const img = document.createElement('img');
  img.src = `../assets/images/${word}.webp`;
  img.alt = word;
  img.onload = () => {
    // Image loaded successfully; nothing else needed
  };
  img.onerror = () => {
    // Fallback to PNG if WebP missing
    console.warn(`Prompt image not found at ${img.src}, trying PNG fallback.`);
    img.src = `../assets/images/${word}.png`;
  };
  // Append to container
  imageContainer.appendChild(img);
}

/**
 * Render draggable letter tiles given an array of letters.
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

// Set up drop behaviour for each slot
slots.forEach(slot => {
  slot.addEventListener('dragover', e => e.preventDefault());
  slot.addEventListener('drop', e => {
    e.preventDefault();
    const letter = e.dataTransfer.getData('text/plain');
    e.target.textContent = letter;
  });
});

// “Check Word” logic: compare assembled letters to currentWord
checkBtn.addEventListener('click', () => {
  const guess = Array.from(slots).map(s => s.textContent).join('');
  if (guess === currentWord) {
    feedback.textContent = 'Well done!';
    // Optionally, you can highlight slots or image to indicate success
  } else {
    feedback.textContent = 'Try again!';
  }
});

// “New Word” logic: start a new round with a different random word in the same level
newWordBtn.addEventListener('click', () => {
  if (levelParam && CVC_LEVELS[levelParam]) {
    startGame(levelParam);
  }
});
