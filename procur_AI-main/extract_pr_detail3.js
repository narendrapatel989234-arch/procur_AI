import fs from 'fs';

const lines = fs.readFileSync('/Users/apple/.gemini/antigravity-ide/brain/ed469fb4-65c9-4768-bb1c-ac0a23ec5ae9/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');

for (const line of lines) {
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.content && obj.content.includes('export default function PRDetail') && obj.content.includes('import React')) {
      console.log('--- FOUND ---');
      console.log(obj.content.substring(0, 500)); // Print start to verify
      fs.writeFileSync('PRDetail_recovered.jsx', obj.content);
    }
  } catch(e) {}
}
