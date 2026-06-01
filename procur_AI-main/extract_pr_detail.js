import fs from 'fs';

const lines = fs.readFileSync('/Users/apple/.gemini/antigravity-ide/brain/ed469fb4-65c9-4768-bb1c-ac0a23ec5ae9/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');

for (const line of lines) {
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.tool_calls) {
      // Check tool calls
    }
    if (obj.type === 'VIEW_FILE' || obj.type === 'TOOL_RESPONSE' || obj.type === 'ACTION_RESULT') {
       if (obj.content && obj.content.includes('PRDetail.jsx')) {
          console.log('Found PRDetail.jsx in step:', obj.step_index);
       }
    }
  } catch(e) {}
}
