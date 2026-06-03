const fs = require('fs');

const micStr = `<Mic size={18} color="var(--text-tertiary)" style={{ cursor: 'pointer', transition: 'color 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#0052cc'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'} />`;

function addMicTo(file, buttonPatterns) {
    let content = fs.readFileSync(file, 'utf-8');
    
    // add Mic to imports if missing
    if (!content.includes('Mic,')) {
        content = content.replace(/import \{([^}]+)\} from 'lucide-react';/, (match, p1) => {
            if (!p1.includes('Mic')) {
                return `import {${p1}, Mic} from 'lucide-react';`;
            }
            return match;
        });
    }

    buttonPatterns.forEach(pat => {
        const regex = new RegExp(`(<button[^>]*?onClick=\\{${pat}\\}[^>]*?>)`, 'g');
        content = content.replace(regex, (match) => {
            // Ensure we don't add multiple times
            if (content.includes('style={{ cursor: \'pointer\', transition: \'color 0.15s ease\' }}')) {
                return match;
            }
            return micStr + '\n                      ' + match;
        });
    });

    fs.writeFileSync(file, content, 'utf-8');
}

addMicTo('src/pages/ChatDetail.jsx', ['handleSend']);
addMicTo('src/pages/NewChat.jsx', ['handleSend']);
addMicTo('src/pages/NewRequest.jsx', ['sendMessage']);

console.log("Mic added successfully!");
