const fs = require('fs');
const path = require('path');

// Paths to the token files
const primitivesPath = path.join(__dirname, 'AGUI_Primitives_tokens.json');
const semanticsPath = path.join(__dirname, 'AGUI_Semantics_tokens.json');
const cssOutputPath = path.join(__dirname, 'tokens.css');
const jsOutputPath = path.join(__dirname, 'tailwind-theme.js');

// Load token JSONs
const primitivesJson = JSON.parse(fs.readFileSync(primitivesPath, 'utf8'));
const semanticsJson = JSON.parse(fs.readFileSync(semanticsPath, 'utf8'));

// Registry to store all crawled tokens
const registry = {};

// Helper to check if an object is a leaf token
function isToken(obj) {
  return obj && typeof obj === 'object' && obj.type !== undefined;
}

// Helper to convert token path to CSS variable name
function getCssVarName(pathArray) {
  // Strip the root prefix (e.g. "AGUI | Primitives" or "AGUI | Semantics")
  const parts = pathArray.slice(1);
  return '--' + parts
    .map(p => p.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    .filter(Boolean)
    .join('-');
}

// Crawl function to recursively find all tokens
function crawl(obj, currentPath) {
  if (isToken(obj)) {
    const fullPathStr = currentPath.join('.');
    const cssVar = getCssVarName(currentPath);
    registry[fullPathStr] = {
      path: currentPath,
      cssVar: cssVar,
      type: obj.type,
      value: obj.value,
      modes: obj.$extensions && obj.$extensions.mode ? obj.$extensions.mode : null,
      description: obj.description || ''
    };
    return;
  }

  if (obj && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      if (key === '$extensions') continue;
      crawl(value, [...currentPath, key]);
    }
  }
}

// Crawl both files starting directly from their inner object
crawl(primitivesJson['AGUI | Primitives'], ['AGUI | Primitives']);
crawl(semanticsJson['AGUI | Semantics'], ['AGUI | Semantics']);

console.log(`Successfully crawled ${Object.keys(registry).length} tokens.`);

// Helper to resolve ref string to var(css-var)
function resolveRefs(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/\{([^{}]+)\}/g, (match, refPath) => {
    const trimmedRef = refPath.trim();
    const refToken = registry[trimmedRef];
    if (refToken) {
      return `var(${refToken.cssVar})`;
    }
    return match;
  });
}

// Formatter for CSS variable value based on token type
function formatCssValue(token, mode = null) {
  let rawValue = token.value;
  if (mode && token.modes && token.modes[mode] !== undefined) {
    rawValue = token.modes[mode];
  }

  if (token.type === 'shadow') {
    if (Array.isArray(rawValue)) {
      return rawValue.map(sh => {
        const inset = sh.inset ? 'inset ' : '';
        const offsetX = resolveRefs(sh.offsetX);
        const offsetY = resolveRefs(sh.offsetY);
        const blur = resolveRefs(sh.blur);
        const spread = resolveRefs(sh.spread);
        const color = resolveRefs(sh.color);
        return `${inset}${offsetX} ${offsetY} ${blur} ${spread} ${color}`.trim();
      }).join(', ');
    }
  }

  if (token.type === 'typography') {
    if (typeof rawValue === 'object') {
      const resolved = {};
      for (const [k, v] of Object.entries(rawValue)) {
        resolved[k] = resolveRefs(v);
      }
      return resolved;
    }
  }

  return resolveRefs(rawValue);
}

// Generate CSS declarations
const rootDeclarations = [];
const darkModeDeclarations = [];

for (const [pathStr, token] of Object.entries(registry)) {
  const isSemantic = token.path[0] === 'AGUI | Semantics';

  if (token.type === 'typography') {
    // Generate individual sub-variables for typography properties
    const defaultVal = formatCssValue(token);
    if (typeof defaultVal === 'object') {
      for (const [prop, val] of Object.entries(defaultVal)) {
        rootDeclarations.push(`  ${token.cssVar}-${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${val};`);
      }
    }

    if (isSemantic && token.modes) {
      const lightVal = formatCssValue(token, 'Light Mode');
      const darkVal = formatCssValue(token, 'Dark Mode');

      if (typeof lightVal === 'object') {
        // Light overrides (usually redundant with default, but good for completeness)
        for (const [prop, val] of Object.entries(lightVal)) {
          // Already in root as default, no need unless different
        }
      }

      if (typeof darkVal === 'object') {
        for (const [prop, val] of Object.entries(darkVal)) {
          darkModeDeclarations.push(`  ${token.cssVar}-${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${val};`);
        }
      }
    }
  } else {
    // Standard variables
    const defaultVal = formatCssValue(token);
    rootDeclarations.push(`  ${token.cssVar}: ${defaultVal}; /* ${token.description || token.type} */`);

    if (isSemantic && token.modes) {
      const darkVal = formatCssValue(token, 'Dark Mode');
      if (darkVal !== defaultVal) {
        darkModeDeclarations.push(`  ${token.cssVar}: ${darkVal};`);
      }
    }
  }
}

// Output CSS content
const cssContent = `/**
 * ProcurAI Theme CSS Variables
 * Generated automatically from Figma token exports.
 */

:root {
  color-scheme: light dark;
  
  /* ==========================================================================
     Primitive & Semantic Design Tokens
     ========================================================================== */
${rootDeclarations.join('\n')}
}

/* Dark Mode Overrides */
.dark, [data-theme="dark"] {
${darkModeDeclarations.join('\n')}
}
`;

fs.writeFileSync(cssOutputPath, cssContent, 'utf8');
console.log('Successfully wrote tokens.css');

// Generate Tailwind Theme Extension config
const tailwindTheme = {
  colors: {},
  spacing: {},
  borderRadius: {},
  borderWidth: {},
  boxShadow: {},
  opacity: {},
  fontSize: {},
  fontWeight: {},
  lineHeight: {},
  letterSpacing: {}
};

// Map crawled tokens to Tailwind-compatible object structure
for (const [pathStr, token] of Object.entries(registry)) {
  const parts = token.path.slice(1);
  const category = parts[0]; // e.g. "colors", "spacing", "radius", "bg", "text"

  if (category === 'colors') {
    // e.g. colors.blue.25 -> tailwindTheme.colors.blue[25] = var(--colors-blue-25)
    const colorGroup = parts[1];
    const shade = parts[2];
    if (colorGroup && shade) {
      if (!tailwindTheme.colors[colorGroup]) {
        tailwindTheme.colors[colorGroup] = {};
      }
      tailwindTheme.colors[colorGroup][shade] = `var(${token.cssVar})`;
    }
  } else if (category === 'spacing') {
    const name = parts[1];
    if (name) {
      tailwindTheme.spacing[name] = `var(${token.cssVar})`;
    }
  } else if (category === 'radius') {
    const name = parts[1];
    if (name) {
      tailwindTheme.borderRadius[name] = `var(${token.cssVar})`;
    }
  } else if (category === 'border-width') {
    const name = parts[1];
    if (name) {
      tailwindTheme.borderWidth[name] = `var(${token.cssVar})`;
    }
  } else if (category === 'shadow') {
    const name = parts[1];
    if (name) {
      tailwindTheme.boxShadow[name] = `var(${token.cssVar})`;
    }
  } else if (category === 'opacity') {
    const name = parts[1];
    if (name) {
      tailwindTheme.opacity[name] = `var(${token.cssVar})`;
    }
  } else if (['bg', 'text', 'icon', 'border', 'action', 'status', 'accent', 'ai'].includes(category)) {
    // Semantic colors -> map under colors.semantics.[category].[sub...]
    // E.g. bg.default -> colors.bg.default = var(--bg-default)
    const subParts = parts.slice(1);
    let current = tailwindTheme.colors;
    
    // Create nested object for semantic color mapping
    for (let i = 0; i < parts.length; i++) {
      const partName = parts[i].toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (i === parts.length - 1) {
        current[partName] = `var(${token.cssVar})`;
      } else {
        if (!current[partName]) {
          current[partName] = {};
        }
        current = current[partName];
      }
    }
  } else if (category === 'typography' && parts[1] === 'font-size') {
    const name = parts[2];
    if (name) {
      tailwindTheme.fontSize[name] = `var(${token.cssVar})`;
    }
  } else if (category === 'typography' && parts[1] === 'font-weight') {
    const name = parts[2];
    if (name) {
      tailwindTheme.fontWeight[name] = `var(${token.cssVar})`;
    }
  } else if (category === 'typography' && parts[1] === 'line-height') {
    const name = parts[2];
    if (name) {
      tailwindTheme.lineHeight[name] = `var(${token.cssVar})`;
    }
  } else if (category === 'typography' && parts[1] === 'letter-spacing') {
    const name = parts[2];
    if (name) {
      tailwindTheme.letterSpacing[name] = `var(${token.cssVar})`;
    }
  }
}

// Convert Tailwind theme mapping into a pretty exported ES module file
const jsContent = `/**
 * Tailwind CSS Theme Configuration Extension
 * Generated automatically from Figma token exports.
 * Spread this inside tailwind.config.js theme.extend.
 */
module.exports = ${JSON.stringify(tailwindTheme, null, 2)};
`;

fs.writeFileSync(jsOutputPath, jsContent, 'utf8');
console.log('Successfully wrote tailwind-theme.js');
