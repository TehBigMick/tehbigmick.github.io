// scripts/utils.js
// Utility functions for Phonics Web App

/*
 * Get a query parameter value by name
 * @param {string} key
 * @returns {string|null}
 */
export function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

/**
 * Shuffle an array (Fisher–Yates)
 * @param {Array} array
 * @returns {Array} shuffled copy
 */
export function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Load an image and return a Promise<HTMLImageElement>
 * @param {string} src
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Generate and download a certificate as a PNG using Canvas
 * @param {Object} options
 * @param {string} options.name         - Learner's name
 * @param {string} options.level        - Level identifier (e.g. "Level A" or "Pre-Primer")
 * @param {number} options.score        - Score achieved
 * @param {string} options.templatePath - Path to certificate background image
 */
export async function downloadCertificate({ name, level, score, templatePath }) {
  try {
    const template = await loadImage(templatePath);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Match canvas size to template image
    canvas.width = template.width;
    canvas.height = template.height;

    // Draw background
    ctx.drawImage(template, 0, 0);

    // Overlay text
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';

    // Name
    ctx.font = 'bold 36px "KGPrimaryPenmanship", sans-serif';
    ctx.fillText(name, canvas.width / 2, canvas.height * 0.45);

    // Level and score
    ctx.font = '24px "KGPrimaryPenmanship", sans-serif';
    ctx.fillText(`${level} - Score: ${score}/25`, canvas.width / 2, canvas.height * 0.55);

    // Date
    const date = new Date().toLocaleDateString();
    ctx.font = '18px "KGPrimaryPenmanship", sans-serif';
    ctx.fillText(date, canvas.width / 2, canvas.height * 0.65);

    // Trigger download
    canvas.toBlob(blob => {
      const a = document.createElement('a');
      // Sanitize filename parts
      const safeName = name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '');
      const safeLevel = level.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '');
      const filename = `Certificate_${safeName}_${safeLevel}.png`;
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  } catch (err) {
    console.error('Certificate generation failed:', err);
    alert('Unable to generate certificate at this time.');
  }
}
