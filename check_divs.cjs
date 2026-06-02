const fs = require('fs');
let content = fs.readFileSync('src/pages/NewRequest.jsx', 'utf-8');

// extract the block
const start = content.indexOf("{/* ═══ MODE: FORM ═══ */}");
const end = content.indexOf("{/* ═══ MODE: FORM (UPLOAD PHASES) ═══ */}");

const block = content.substring(start, end);

const openDivs = (block.match(/<div/g) || []).length;
const closeDivs = (block.match(/<\/div>/g) || []).length;

console.log(`Open divs: ${openDivs}, Close divs: ${closeDivs}`);
