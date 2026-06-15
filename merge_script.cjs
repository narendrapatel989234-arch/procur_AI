const fs = require('fs');

const templatesContent = fs.readFileSync('./src/pages/Templates.jsx', 'utf8');
const detailContent = fs.readFileSync('./src/pages/TemplateDetail.jsx', 'utf8');

// Extract imports from detailContent
const tiptapImports = detailContent.match(/import \{ useEditor, EditorContent \}[\s\S]*?from '@tiptap\/extension-task-list';/)[0];

// Update Templates.jsx imports
let newTemplates = templatesContent.replace(
  /} from 'lucide-react';/,
  `, Undo, Redo, Bold, Italic, Strikethrough, Underline as UnderlineIcon, Eraser,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Minus, LineChart,
  Save, CheckSquare
} from 'lucide-react';
${tiptapImports}
`
);

// Extract state and editor setup from TemplateDetail
const detailSetupMatch = detailContent.match(/const \[zoom, setZoom\] = useState\(100\);[\s\S]*?const isListActive = activeState\.bulletList \|\| activeState\.orderedList \|\| activeState\.taskList;/);
const detailSetup = detailSetupMatch[0];

// Extract View/Edit UI
const breadcrumbMatch = detailContent.match(/const breadcrumb = \([\s\S]*?\);/);
let breadcrumb = breadcrumbMatch[0];
// replace breadcrumb onNavigate
breadcrumb = breadcrumb.replace(/onNavigate\('Templates'\)/g, "setMode('list')");
// Update breadcrumb for View mode -> no Save button, instead an Edit button
const breadcrumbEdit = breadcrumb.replace(
  /<button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0052cc', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>\s*<Save size={14} \/> Save Template\s*<\/button>/,
  `<button onClick={() => { setShowToast(true); setTimeout(() => setShowToast(false), 3000); setMode('view'); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0052cc', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.background = '#0041a3'} onMouseLeave={e => e.currentTarget.style.background = '#0052cc'}>
        <Save size={14} /> Save Template
      </button>`
);

const breadcrumbView = breadcrumb.replace(
  /<button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0052cc', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>\s*<Save size={14} \/> Save Template\s*<\/button>/,
  `<button onClick={() => setMode('edit')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', color: '#0052cc', border: '1px solid #0052cc', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease' }} onMouseEnter={e => { e.currentTarget.style.background = '#f0f5ff'; }} onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}>
        <Pencil size={14} /> Edit Template
      </button>`
);


const detailUIMatch = detailContent.match(/<div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/);
const detailUI = detailUIMatch[0];
const viewUI = `
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div style={{ flex: 1, background: '#f3f4f6', overflowY: 'auto', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            background: '#fff', 
            width: '100%', 
            maxWidth: 850, 
            minHeight: 1000, 
            borderRadius: 8, 
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)', 
            padding: '60px 70px', 
            display: 'flex', 
            flexDirection: 'column', 
          }}>
            <div style={{ borderBottom: '2px solid #0052cc', paddingBottom: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', fontFamily: 'inherit' }}>Standard RFP Template - Technology</div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 8 }}>Template ID: TMP-2026-04 • Last modified by David Kim</div>
            </div>
            <div className="unified-tiptap view-mode" style={{ fontSize: 15, color: '#334155', lineHeight: 1.7, fontFamily: 'inherit' }}>
              <EditorContent editor={editor} disabled />
            </div>
          </div>
        </div>
      </div>
`;

// Also need the tiptap css
const detailCSSMatch = detailContent.match(/<style dangerouslySetInnerHTML={{__html: `[\s\S]*?`}} \/>/);
let detailCSS = detailCSSMatch[0];
// Add a .view-mode to not have borders/outlines
detailCSS = detailCSS.replace('`}} />', `.unified-tiptap.view-mode .ProseMirror { min-height: auto; }\`}} />`);

// Update Templates.jsx state
newTemplates = newTemplates.replace(
  /const \[tableSearch, setTableSearch\] = useState\(''\);/,
  `const [mode, setMode] = useState('list');
  const [showToast, setShowToast] = useState(false);
  ${detailSetup}
  
  // Custom breadcrumbs
  ${breadcrumbEdit.replace('const breadcrumb =', 'const breadcrumbEdit =')}
  ${breadcrumbView.replace('const breadcrumb =', 'const breadcrumbView =')}

  const [tableSearch, setTableSearch] = useState('');`
);

// update row onClick
newTemplates = newTemplates.replace(
  /onClick=\{\(\) => onNavigate\('templatedetail'\)\}/g,
  `onClick={() => setMode('view')}`
);

// Update return statement
const returnRegex = /return \(\s*<MainLayout[\s\S]*?>\s*<style dangerouslySetInnerHTML={{ __html: css }} \/>\s*(<div style={{ padding: 24[\s\S]*?){\/\* UPLOAD TEMPLATE MODAL \*\//;
const returnMatch = newTemplates.match(returnRegex);
const originalListUI = returnMatch[1];

const newReturn = `
  const activeBreadcrumb = mode === 'list' ? <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Templates</span> : (mode === 'edit' ? breadcrumbEdit : breadcrumbView);

  return (
    <MainLayout
      activeNav={activeNav}
      onNavigate={onNavigate}
      userRole={userRole}
      titleComponent={activeBreadcrumb}
      searchPlaceholder={null}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />
      ${detailCSS}

      {showToast && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, background: '#10b981', color: '#fff', padding: '12px 20px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 500, boxShadow: '0 8px 24px rgba(16,185,129,0.25)', zIndex: 9999, animation: 'toast-slide 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <CheckCircle size={18} color="#fff" />
          Saved changes to the document
        </div>
      )}

      {mode === 'list' && (
        ${originalListUI}
      )}

      {mode === 'view' && (
        ${viewUI}
      )}

      {mode === 'edit' && (
        ${detailUI}
      )}

      {/* UPLOAD TEMPLATE MODAL */}`;

newTemplates = newTemplates.replace(returnRegex, newReturn);
// add toast css to existing css string
newTemplates = newTemplates.replace(
  /const css = `/,
  `const css = \`
    @keyframes toast-slide {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
`
);

fs.writeFileSync('./src/pages/Templates.jsx', newTemplates);
console.log("SUCCESS");
