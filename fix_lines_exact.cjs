const fs = require('fs');

let lines = fs.readFileSync('src/pages/NewRequest.jsx', 'utf-8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("{aiFilledFields.has('fContractRef') && <AiFilledTag />}")) {
    if (!lines[i+1].includes("</div>")) {
      lines.splice(i+1, 0, "                  </div>", "                </div>", "");
      console.log('Fixed fContractRef at line', i);
    }
  }

  if (lines[i].includes("{aiFilledFields.has('fTimeline') && <AiFilledTag />}")) {
    if (!lines[i+1].includes("</div>")) {
      lines.splice(i+1, 0, "                </div>");
      console.log('Fixed fTimeline at line', i);
    }
  }
}

fs.writeFileSync('src/pages/NewRequest.jsx', lines.join('\n'), 'utf-8');
console.log('Done!');
