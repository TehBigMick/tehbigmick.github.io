// scripts/cvc-app.js
// Handles CVC Phonics quiz logic with question counter and per-level certificates

import { getQueryParam, shuffle, downloadCertificate } from './utils.js';
import { CVC_LEVELS }                   from './data.js';

// 1. Determine selected level from URL:
//    e.g. cvc/test.html?level=Level%20A
const level    = getQueryParam('level') || 'Level A';
const wordList = CVC_LEVELS[level];

// 2. Redirect to home if level is invalid
if (!wordList) {
  window.location.href = '../index.html';
}

// 3. Shuffle words for testing
const words = shuffle(wordList);
let index = 0;
let score = 0;

// 4. Certificate template mapping for each level
const certTemplateMap = {
  'Level A': '../assets/cert-cvc-Level A.png',
  'Level B': '../assets/cert-cvc-Level B.png',
  'Level C': '../assets/cert-cvc-Level C.png',
  'Level D': '../assets/cert-cvc-Level D.png'
};

// 5. Cache DOM elements
const levelTitleEl    = document.getElementById('level-title');
const wordEl          = document.getElementById('word');
const counterEl       = document.getElementById('counter');
const yesBtn          = document.getElementById('yes-btn');
const noBtn           = document.getElementById('no-btn');
const quizContainer   = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');

// 6. Initialise page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Display the level title
  levelTitleEl.textContent = level;
  // Show the first word and counter
  showWord();
});

// 7. Display the current word and update question counter
function showWord() {
  wordEl.textContent    = words[index];
  counterEl.textContent = `Question ${index + 1} of ${words.length}`;
}

// 8. Advance to next word or finish quiz
function next() {
  index++;
  if (index < words.length) {
    showWord();
  } else {
    showResult();
  }
}

// 9. Handle Yes/No button clicks
yesBtn.addEventListener('click', () => {
  score++;
  next();
});
noBtn.addEventListener('click', () => {
  next();
});

// 10. Show result screen, optionally allow certificate download
function showResult() {
  // Hide quiz area
  quizContainer.style.display = 'none';
  counterEl.style.display     = 'none';

  // Display score
  resultContainer.innerHTML    = `<h2>Your score: ${score} / ${words.length}</h2>`;

  // If passing threshold (23 or more), show certificate button
  if (score >= 23) {
    const certBtn = document.createElement('button');
    certBtn.textContent = 'Download Certificate';
    certBtn.className   = 'btn';
    certBtn.addEventListener('click', () => {
      const name = prompt('Enter your name for the certificate:');
      if (!name) return;

      const templatePath = certTemplateMap[level];
      if (!templatePath) {
        alert('Certificate template not found for this level.');
        return;
      }

      downloadCertificate({ name, level, score, templatePath });
    });
    resultContainer.appendChild(certBtn);
  }

  // Always provide a Back to Home link
  const homeLink = document.createElement('a');
  homeLink.textContent     = 'Back to Home';
  homeLink.href            = '../index.html';
  homeLink.className       = 'btn';
  homeLink.style.marginLeft = '1rem';
  resultContainer.appendChild(homeLink);
}
