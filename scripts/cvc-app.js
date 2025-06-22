// scripts/cvc-app.js
// Handles CVC Phonics quiz logic with question counter and blank-certificate download

import { getQueryParam, shuffle, downloadCertificate } from './utils.js';
import { CVC_LEVELS } from './data.js';

// 1. Determine level from URL (default Level A)
const level = getQueryParam('level') || 'Level A';
const wordList = CVC_LEVELS[level];
if (!wordList) {
  window.location.href = '../index.html';
}

// 2. Quiz state
const words = shuffle(wordList);
let index = 0;
let score = 0;

// 3. Certificate template mapping
const certTemplateMap = {
  'Level A': '../assets/cert-cvc-Level A.png',
  'Level B': '../assets/cert-cvc-Level B.png',
  'Level C': '../assets/cert-cvc-Level C.png',
  'Level D': '../assets/cert-cvc-Level D.png'
};

// 4. Cache DOM
const levelTitleEl    = document.getElementById('level-title');
const wordEl          = document.getElementById('word');
const counterEl       = document.getElementById('counter');
const yesBtn          = document.getElementById('yes-btn');
const noBtn           = document.getElementById('no-btn');
const quizContainer   = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');

// 5. Initialise
document.addEventListener('DOMContentLoaded', () => {
  levelTitleEl.textContent = level;
  showWord();
});

function showWord() {
  wordEl.textContent    = words[index];
  counterEl.textContent = `Question ${index + 1} of ${words.length}`;
}

function next() {
  index++;
  if (index < words.length) {
    showWord();
  } else {
    showResult();
  }
}

// 6. Button events
yesBtn.addEventListener('click', () => { score++; next(); });
noBtn.addEventListener('click', () => { next(); });

function showResult() {
  quizContainer.style.display = 'none';
  counterEl.style.display     = 'none';

  resultContainer.innerHTML = `<h2>Your score: ${score} / ${words.length}</h2>`;

  if (score >= 23) {
    const certBtn = document.createElement('button');
    certBtn.textContent = 'Download Certificate';
    certBtn.className   = 'btn';
    certBtn.addEventListener('click', () => {
      const templatePath = certTemplateMap[level];
      if (!templatePath) {
        alert('Certificate template not found for this level.');
        return;
      }
      const safeLevel = level.replace(/\s+/g, '_');
      downloadCertificate({
        templatePath,
        filename: `Certificate_${safeLevel}.png`
      });
    });
    resultContainer.appendChild(certBtn);
  }

  const homeLink = document.createElement('a');
  homeLink.textContent = 'Back to Home';
  homeLink.href        = '../index.html';
  homeLink.className   = 'btn';
  resultContainer.appendChild(homeLink);
}
