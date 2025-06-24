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
let selectedTile = null;

// Detect touch capability
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Initialise: show picker or game
if (!levelParam || !CVC_LEVELS[levelParam]) {
  levelPicker.style.display   = 'block';
  gameContainer.style.display = 'none';
} else {
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

  // Clear any selected tile
  if (selectedTile) {
    selectedTile.classList.remove('selected');
    selectedTile = null;
  }

  // Clear any existing slot letters, and return letters back to bank if needed
  slots.forEach(slot => {
    if (slot.textContent) {
      // Return letter to bank if needed
      addTileBack(slot.textContent);
    }
    slot.textContent = '';
  });

  // Pick a random word from the level's list
  const words = CVC_LEVELS[level];
  currentWord = words[Math.floor(Math.random() * words.length)];

  // Show prompt image immediately
  showPromptImage(currentWord);

  // Shuffle its letters and render draggable/tappable tiles
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
    // Successfully loaded
  };
  img.onerror = () => {
    // Fallback to PNG if WebP missing
    console.warn(`Prompt image not found at ${img.src}, trying PNG fallback.`);
    img.src = `../assets/images/${word}.png`;
  };
  imageContainer.appendChild(img);
}

/**
 * Render draggable/tappable letter tiles given an array of letters.
 */
function renderTiles(letters) {
  lettersContainer.innerHTML = '';
  letters.forEach(letter => {
    const tile = document.createElement('div');
    tile.className   = 'tile';
    tile.textContent = letter;
    // Desktop drag: enable draggable if not touch device
    tile.draggable   = !isTouchDevice;
    // Dragstart for desktop
    tile.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', letter);
    });
    // Tap-to-select for touch
    tile.addEventListener('click', e => {
      if (!isTouchDevice) return;
      handleTileSelect(tile);
    });
    lettersContainer.appendChild(tile);
  });
}

/**
 * Handle selecting/deselecting a tile on touch devices.
 */
function handleTileSelect(tile) {
  if (selectedTile === tile) {
    // Deselect
    tile.classList.remove('selected');
    selectedTile = null;
  } else {
    // Deselect previous
    if (selectedTile) {
      selectedTile.classList.remove('selected');
    }
    // Select this
    selectedTile = tile;
    tile.classList.add('selected');
  }
}

/**
 * Remove the first tile matching the given letter from the bank.
 */
function removeTile(letter) {
  const tiles = Array.from(lettersContainer.querySelectorAll('.tile'));
  for (const tile of tiles) {
    if (tile.textContent === letter) {
      if (tile === selectedTile) {
        selectedTile.classList.remove('selected');
        selectedTile = null;
      }
      tile.remove();
      break;
    }
  }
}

/**
 * Add a tile back into the bank for the given letter.
 */
function addTileBack(letter) {
  // Avoid adding if the current bank already has enough tiles for this letter?
  // For simplicity, we re-create one tile.
  const tile = document.createElement('div');
  tile.className   = 'tile';
  tile.textContent = letter;
  tile.draggable   = !isTouchDevice;
  tile.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', letter);
  });
  tile.addEventListener('click', e => {
    if (!isTouchDevice) return;
    handleTileSelect(tile);
  });
  lettersContainer.appendChild(tile);
}

// Set up drop and tap behaviour for each slot
slots.forEach(slot => {
  // Desktop drag/drop
  slot.addEventListener('dragover', e => e.preventDefault());
  slot.addEventListener('drop', e => {
    e.preventDefault();
    const letter = e.dataTransfer.getData('text/plain');
    if (letter) {
      // Place the letter
      slot.textContent = letter;
      // Remove the tile from bank
      removeTile(letter);
    }
  });

  // Touch: tap to place or clear
  slot.addEventListener('click', e => {
    if (!isTouchDevice) return;
    if (selectedTile) {
      // Place selected tile into this slot
      const letter = selectedTile.textContent;
      slot.textContent = letter;
      // Remove the tile from bank
      selectedTile.remove();
      selectedTile = null;
    } else {
      // No tile selected: if slot has letter, clear it and return tile to bank
      if (slot.textContent) {
        const letter = slot.textContent;
        slot.textContent = '';
        addTileBack(letter);
      }
    }
  });
});

// “Check Word” logic: compare assembled letters to currentWord
checkBtn.addEventListener('click', () => {
  const guess = Array.from(slots).map(s => s.textContent).join('');
  if (guess === currentWord) {
    feedback.textContent = 'Well done!';
    // Optionally add highlight: e.g. slots or image
  } else {
    feedback.textContent = 'Try again!';
  }
  // After checking, clear any selected tile
  if (selectedTile) {
    selectedTile.classList.remove('selected');
    selectedTile = null;
  }
});

// “New Word” logic: start a new round with a different random word in the same level
newWordBtn.addEventListener('click', () => {
  if (levelParam && CVC_LEVELS[levelParam]) {
    startGame(levelParam);
  }
});
