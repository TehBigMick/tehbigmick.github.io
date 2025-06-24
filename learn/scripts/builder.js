// learn/scripts/builder.js

const validWords = [
  { word: 'cat', image: '../assets/images/cat.png' },
  { word: 'dog', image: '../assets/images/dog.png' },
  { word: 'bat', image: '../assets/images/bat.png' },
  { word: 'hat', image: '../assets/images/hat.png' }
];
let currentWord, shuffledLetters;

// 1. Pick a random word and shuffle its letters
function pickWord() {
  const choice = validWords[Math.floor(Math.random() * validWords.length)];
  currentWord = choice.word;
  shuffledLetters = choice.word.split('').sort(() => 0.5 - Math.random());
  return choice;
}

// 2. Render the draggable letter tiles
function setupTiles() {
  const container = document.querySelector('.letters');
  container.innerHTML = '';
  shuffledLetters.forEach(letter => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.draggable = true;
    tile.textContent = letter;
    tile.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', letter);
    });
    container.appendChild(tile);
  });
}

// 3. Setup drop slots
function initSlots() {
  document.querySelectorAll('.slot').forEach(slot => {
    slot.addEventListener('dragover', e => e.preventDefault());
    slot.addEventListener('drop', e => {
      e.preventDefault();
      const letter = e.dataTransfer.getData('text/plain');
      e.target.textContent = letter;
    });
  });
}

// 4. Check answer
function checkWord() {
  const guess = [...document.querySelectorAll('.slot')]
    .map(s => s.textContent).join('');
  const feedback = document.getElementById('feedback');
  const imageEl = document.getElementById('image-container');
  const match = validWords.find(w => w.word === guess);

  if (match) {
    feedback.textContent = 'Well done!';
    imageEl.innerHTML = `<img src="${match.image}" alt="${match.word}">`;
  } else {
    feedback.textContent = 'Try again!';
    imageEl.innerHTML = '';
  }
}

// 5. Initialise on load
const wordData = pickWord();
setupTiles();
initSlots();
document.getElementById('check-btn')
  .addEventListener('click', checkWord);
