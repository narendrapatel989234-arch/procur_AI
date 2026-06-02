const fs = require('fs');

let lines = fs.readFileSync('src/pages/NewRequest.jsx', 'utf-8').split('\n');

// Delete lines 1805 to 1830 (indexes 1804 to 1829)
lines.splice(1804, 26);

fs.writeFileSync('src/pages/NewRequest.jsx', lines.join('\n'), 'utf-8');
console.log('Deleted duplicate block');
