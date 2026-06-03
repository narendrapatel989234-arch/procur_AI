const fs = require('fs');

// 1. MainLayout.jsx
let ml = fs.readFileSync('src/layouts/MainLayout.jsx', 'utf-8');
ml = ml.replace(
  'export default function MainLayout({ activeNav, onNavigate, titleComponent, searchPlaceholder, children }) {',
  'export default function MainLayout({ activeNav, onNavigate, titleComponent, searchPlaceholder, children, userRole }) {'
);
ml = ml.replace(
  '<Sidebar activeNav={activeNav} onNavigate={onNavigate} />',
  '<Sidebar activeNav={activeNav} onNavigate={onNavigate} userRole={userRole} />'
);
fs.writeFileSync('src/layouts/MainLayout.jsx', ml, 'utf-8');

// 2. Sidebar.jsx
let sb = fs.readFileSync('src/layouts/Sidebar.jsx', 'utf-8');
sb = sb.replace(
  "import { LayoutDashboard, MessageSquare, Receipt, Plus, Zap, PanelLeftClose, PanelLeft, Settings, HelpCircle, LogOut, ChevronDown, Layers, Bot } from 'lucide-react';",
  "import { LayoutDashboard, MessageSquare, Receipt, Plus, Zap, PanelLeftClose, PanelLeft, Settings, HelpCircle, LogOut, ChevronDown, Layers, Bot, Cpu } from 'lucide-react';"
);
sb = sb.replace(
  "{ name: 'Agent Management', Icon: Bot },",
  "{ name: 'Agent Management', Icon: Cpu },"
);
sb = sb.replace(
  'export default function Sidebar({ activeNav, onNavigate }) {',
  'export default function Sidebar({ activeNav, onNavigate, userRole }) {'
);
sb = sb.replace(
  "<div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #0052cc, #7c7cff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>DK</div>",
  "<div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #0052cc, #7c7cff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{userRole === 'manager' ? 'SC' : 'DK'}</div>"
);
sb = sb.replace(
  "{!isCollapsed && (<div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}><span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>David Kim</span><span style={{ fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>Procurement Analyst</span></div>)}",
  "{!isCollapsed && (<div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}><span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userRole === 'manager' ? 'Sarah Chen' : 'David Kim'}</span><span style={{ fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{userRole === 'manager' ? 'Procurement Manager' : 'Procurement Analyst'}</span></div>)}"
);
fs.writeFileSync('src/layouts/Sidebar.jsx', sb, 'utf-8');

// 3. Update all pages
const pagesDir = 'src/pages/';
const files = fs.readdirSync(pagesDir);
files.forEach(file => {
  if (!file.endsWith('.jsx')) return;
  if (file === 'Login.jsx') return;

  let content = fs.readFileSync(pagesDir + file, 'utf-8');
  
  if (file === 'Templates.jsx') {
    if (!content.includes('userRole={')) {
      content = content.replace(/<MainLayout/, '<MainLayout userRole={pageProps.userRole}');
    }
  } else {
    content = content.replace(/export default function ([A-Za-z]+)\(\{([^}]+)\}\)/, (match, name, propsStr) => {
      if (!propsStr.includes('userRole')) {
        return `export default function ${name}({${propsStr}, userRole})`;
      }
      return match;
    });
    if (!content.includes('userRole={')) {
      content = content.replace(/<MainLayout/, '<MainLayout userRole={userRole}');
    }
  }

  content = content.replace(/Hi David 👋/g, "Hi {userRole === 'manager' ? 'Sarah' : 'David'} 👋");

  fs.writeFileSync(pagesDir + file, content, 'utf-8');
});

console.log('Update complete!');
