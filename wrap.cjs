const fs = require('fs');
let script = fs.readFileSync('build_templates.cjs', 'utf8');
script = script.replace("{mode === 'edit' && (\n        ${detailUI}\n      )}", "{mode === 'edit' && (\n        <>\n          ${detailUI}\n        </>\n      )}");
fs.writeFileSync('build_templates.cjs', script);
console.log('Updated script');
