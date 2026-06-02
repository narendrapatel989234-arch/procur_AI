const fs = require('fs');

let content = fs.readFileSync('src/pages/NewRequest.jsx', 'utf-8');

// The original button string in Form mode:
// >\s*Save Draft\s*<\/button>
content = content.replace(
  />\s*Save Draft\s*<\/button>/g,
  `>\n                    <Save size={15} strokeWidth={2} /> Save Draft\n                  </button>`
);

// The original Cancel button in Upload mode:
// onClick={handleBack}\n                    style={{...}}\n                  >\n                    Cancel\n                  <\/button>
// Let's replace 'Cancel' with Save Draft specifically where it is near handleBack.
content = content.replace(
  />\s*Cancel\s*<\/button>/g,
  `>\n                    <Save size={15} strokeWidth={2} /> Save Draft\n                  </button>`
);

fs.writeFileSync('src/pages/NewRequest.jsx', content, 'utf-8');
console.log('Done replacing buttons');
