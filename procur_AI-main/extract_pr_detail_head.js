import fs from 'fs';

const lines = fs.readFileSync('/Users/apple/.gemini/antigravity-ide/brain/ed469fb4-65c9-4768-bb1c-ac0a23ec5ae9/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');

for (const line of lines) {
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.content && obj.content.includes('CURRENT_STAGE_INDEX = 4')) {
      console.log('--- FOUND ---');
      console.log(obj.content);
    }
  } catch(e) {}
}
