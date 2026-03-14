const { marked } = require('./marked.umd.js');

if (!marked || typeof marked.parse !== 'function') {
  throw new Error('Local marked.umd.js does not export marked.parse');
}

function markdownToHtml(markdown) {
  return marked.parse(String(markdown || ''));
}

module.exports = {
  markdownToHtml
};