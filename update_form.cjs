const fs = require('fs');

let content = fs.readFileSync('src/pages/NewRequest.jsx', 'utf-8');

// 1. Add Save to imports if missing
if (!content.includes(' Save, ')) {
  content = content.replace('Upload, Sparkles, X, ArrowRight,', 'Upload, Sparkles, X, ArrowRight, Save,');
}

// 2. Remove black fill from FInput and UInput (prefilled uses var(--bg-surface-2))
// FInput
content = content.replace(/background: prefilled \? 'var\(--bg-surface-2\)' : '#fff',/g, "background: prefilled ? 'rgba(0,0,0,0.02)' : '#fff',");
// UInput
content = content.replace(/background: prefilled \? 'var\(--bg-surface-2\)' : '#fff',/g, "background: prefilled ? 'rgba(0,0,0,0.02)' : '#fff',"); // This should catch both if they are identical

// Add background: '#fff' to FTextarea and UTextarea if they don't have it
if (!content.includes(`background: '#fff'`)) {
  // We'll just replace their style block starts
}
content = content.replace(/function FTextarea\(\{ value, onChange, placeholder, minHeight = 100 \}\) \{[\s\S]*?style=\{\{/g, `function FTextarea({ value, onChange, placeholder, minHeight = 100 }) {
  const [fc, setFc] = useState(false);
  return (
    <textarea value={value} onChange={onChange} placeholder={placeholder}
      onFocus={() => setFc(true)} onBlur={() => setFc(false)}
      style={{
        background: '#fff',`);
        
content = content.replace(/function UTextarea\(\{ value, onChange, placeholder, minHeight = 100 \}\) \{[\s\S]*?style=\{\{/g, `function UTextarea({ value, onChange, placeholder, minHeight = 100 }) {
  const [fc, setFc] = useState(false);
  return (
    <textarea value={value} onChange={onChange} placeholder={placeholder}
      onFocus={() => setFc(true)} onBlur={() => setFc(false)}
      style={{
        background: '#fff',`);

// Also replace var(--bg-surface-2) in Requisition ID and Spend Category to rgba(0,0,0,0.02)
content = content.replace(/background: 'var\(--bg-surface-2\)'/g, "background: 'rgba(0,0,0,0.02)'");


// 3. Add Save icon to "Save Draft" in form mode
const formSubmitRow = `                {/* ── Submit row ── */}
                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button
                    onClick={handleBack}
                    style={{
                      background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8,
                      padding: '9px 20px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'inherit',
                    }}
                  >
                    Save Draft
                  </button>`;
const formSubmitRowReplacement = `                {/* ── Submit row ── */}
                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button
                    onClick={handleBack}
                    style={{
                      background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8,
                      padding: '9px 20px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'inherit',
                    }}
                  >
                    <Save size={15} strokeWidth={2} /> Save Draft
                  </button>`;
content = content.replace(formSubmitRow, formSubmitRowReplacement);


// 4. Replace Cancel with Save Draft + icon in upload phase
const uploadSubmitRow = `                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button
                    onClick={handleBack}
                    style={{
                      background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8,
                      padding: '9px 20px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'inherit',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUploadSubmit}
                    style={{
                      background: '#0052cc', color: '#fff',
                      border: 'none', borderRadius: 8, padding: '9px 24px', fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
                      boxShadow: '0 4px 12px rgba(0,82,204,0.12)', fontFamily: 'inherit',
                    }}
                  >
                    <Send size={15} strokeWidth={2} />
                    Submit
                  </button>`;
const uploadSubmitRowReplacement = `                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button
                    onClick={handleBack}
                    style={{
                      background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8,
                      padding: '9px 20px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'inherit',
                    }}
                  >
                    <Save size={15} strokeWidth={2} /> Save Draft
                  </button>
                  <button
                    onClick={handleUploadSubmit}
                    style={{
                      background: '#0052cc', color: '#fff',
                      border: 'none', borderRadius: 8, padding: '9px 24px', fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
                      boxShadow: '0 4px 12px rgba(0,82,204,0.12)', fontFamily: 'inherit',
                    }}
                  >
                    <Send size={15} strokeWidth={2} />
                    Submit
                  </button>`;
content = content.replace(uploadSubmitRow, uploadSubmitRowReplacement);

fs.writeFileSync('src/pages/NewRequest.jsx', content, 'utf-8');
console.log('Done replacing ui elements');
