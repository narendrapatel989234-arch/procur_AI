const fs = require('fs');
let finalFile = fs.readFileSync('./src/pages/Templates.jsx', 'utf8');

// 1. Fix missing div
finalFile = finalFile.replace(
  "        </div>\n      )}",
  "        </div>\n      </div>\n      )}"
);

// 2. Fix extra brace
finalFile = finalFile.replace(
  "{/* UPLOAD TEMPLATE MODAL */}}",
  "{/* UPLOAD TEMPLATE MODAL */}"
);

// 3. Move TemplateDrop
const dropMatch = finalFile.match(/  const TemplateDrop = \(\{[\s\S]*?\);\n/);
if (dropMatch) {
  finalFile = finalFile.replace(dropMatch[0], '');
  finalFile = finalFile.replace('export default function Templates({', dropMatch[0] + '\nexport default function Templates({');
}

// 4. Disable lint warning
finalFile = finalFile.replace(
  "useEffect(() => {\n    setIsSearching(true);",
  "// eslint-disable-next-line\n  useEffect(() => {\n    setIsSearching(true);"
);

fs.writeFileSync('./src/pages/Templates.jsx', finalFile);
