import fs from 'fs';

const lines = fs.readFileSync('/Users/apple/.gemini/antigravity-ide/brain/ed469fb4-65c9-4768-bb1c-ac0a23ec5ae9/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');

let latestContent = null;
for (const line of lines) {
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.content && obj.content.includes('import React') && obj.content.includes('PRDetail') && obj.content.includes('MainLayout') && obj.content.length > 5000) {
      latestContent = obj.content;
    }
  } catch(e) {}
}

if (latestContent) {
  fs.writeFileSync('PRDetail_backup.jsx', latestContent);
  console.log('Saved to PRDetail_backup.jsx');
} else {
  console.log('Not found');
}
