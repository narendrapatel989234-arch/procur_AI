const fs = require('fs');

let content = fs.readFileSync('src/pages/NewRequest.jsx', 'utf-8');

// 3. Add Section 1 above Section 2 in activeMode === 'form' && uploadPhase === 'empty'
const section_1 = `<div style={{ maxWidth: 720, margin: '0 auto', width: '100%', marginBottom: 40 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Upload Procurement Document</div>
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4, marginBottom: 24 }}>Upload a requirements document, SOW, or specifications file. Our AI will extract all procurement fields automatically.</div>

              <div
                onClick={handleUploadClick}
                className="pai-upload-zone"
                onMouseEnter={() => setUUploadHover(true)}
                onMouseLeave={() => setUUploadHover(false)}
                style={{
                  background: uUploadHover ? 'rgba(124,124,255,0.015)' : '#fff',
                  border: \`2px dashed \${uUploadHover ? '#7c7cff' : 'var(--border-default)'}\`,
                  borderRadius: 16, padding: '64px 32px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(0,82,204,0.07), rgba(124,124,255,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Upload size={30} color="#7c7cff" strokeWidth={2} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginTop: 8 }}>Drop your document here</div>
                <div style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>or click to browse files</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>Supports PDF, DOCX, XLSX · Max 25MB</div>
              </div>
            </div>

            <div style={{ maxWidth: 680, margin: '0 auto' }}>`;

const target_string = `<div style={{ maxWidth: 680, margin: '0 auto' }}>\r
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Create Procurement Request</div>`;
const target_string_2 = `<div style={{ maxWidth: 680, margin: '0 auto' }}>\n              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Create Procurement Request</div>`;

content = content.replace(target_string, section_1 + "\n              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Create Procurement Request</div>");
content = content.replace(target_string_2, section_1 + "\n              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Create Procurement Request</div>");

fs.writeFileSync('src/pages/NewRequest.jsx', content, 'utf-8');
console.log('Done');
