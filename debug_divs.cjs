const fs = require('fs');
let content = fs.readFileSync('src/pages/NewRequest.jsx', 'utf-8');

const start = content.indexOf("{/* ═══ MODE: FORM ═══ */}");
const end = content.indexOf("{/* ═══ MODE: FORM (UPLOAD PHASES) ═══ */}");

const block = content.substring(start, end);

let indent = 0;
const lines = block.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const opens = (line.match(/<div/g) || []).length;
  // Account for self-closing divs if any: <div ... />
  const selfClosing = (line.match(/<div[^>]*\/>/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  
  const netOpens = opens - selfClosing;
  
  indent += netOpens - closes;
  if (netOpens > 0 || closes > 0) {
    console.log(`L${i}: ${indent} (opens: ${netOpens}, closes: ${closes}) ${line.trim()}`);
  }
}
