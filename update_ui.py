import re

with open('src/pages/NewRequest.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the top bar mode toggle
content = content.replace("['chat', 'form', 'upload'].map((m) =>", "['chat', 'form'].map((m) =>")

# 2. Update activeMode === 'form' to be activeMode === 'form' && uploadPhase === 'empty'
content = content.replace("{activeMode === 'form' && (() => {", "{activeMode === 'form' && uploadPhase === 'empty' && (() => {")

# 3. Add Section 1 above Section 2 in activeMode === 'form' && uploadPhase === 'empty'
section_1 = """<div style={{ maxWidth: 720, margin: '0 auto', width: '100%', marginBottom: 40 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Upload Procurement Document</div>
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4, marginBottom: 24 }}>Upload a requirements document, SOW, or specifications file. Our AI will extract all procurement fields automatically.</div>

              <div
                onClick={handleUploadClick}
                className="pai-upload-zone"
                onMouseEnter={() => setUUploadHover(true)}
                onMouseLeave={() => setUUploadHover(false)}
                style={{
                  background: uUploadHover ? 'rgba(124,124,255,0.015)' : '#fff',
                  border: `2px dashed ${uUploadHover ? '#7c7cff' : 'var(--border-default)'}`,
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

            <div style={{ maxWidth: 680, margin: '0 auto' }}>"""
content = content.replace("<div style={{ maxWidth: 680, margin: '0 auto' }}>\n              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Create Procurement Request</div>", section_1 + "\n              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Create Procurement Request</div>")

# 4. Change Cancel button to Save Draft in activeMode === 'form' && uploadPhase === 'empty'
content = content.replace("""onClick={() => onNavigate('Dashboard')}
                      style={{
                        background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8,
                        padding: '9px 20px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'inherit',
                      }}
                    >
                      <X size={14} strokeWidth={2} />
                      Cancel""",
"""onClick={handleBack}
                      style={{
                        background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8,
                        padding: '9px 20px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'inherit',
                      }}
                    >
                      Save Draft""")

# 5. Update activeMode === 'upload' to be activeMode === 'form' && uploadPhase !== 'empty'
content = content.replace("{/* ═══ MODE: UPLOAD ═══ */}\n      {activeMode === 'upload' && (() => {", "{/* ═══ MODE: FORM (UPLOAD PHASES) ═══ */}\n      {activeMode === 'form' && uploadPhase !== 'empty' && (() => {")

# 6. Remove the uploadPhase === 'empty' rendering from the newly renamed activeMode === 'form' (upload phases block)
content = re.sub(r"\{uploadPhase === 'empty' && \(\n.*?\}\)\}\n\n            \{uploadPhase === 'uploading' && \(", "{uploadPhase === 'uploading' && (", content, flags=re.DOTALL)

# 7. Change Cancel button to Save Draft in the activeMode === 'form' (upload phases block)
# The button in that block uses onNavigate('Dashboard') as well
content = content.replace("""onClick={() => onNavigate('Dashboard')}
                        style={{
                          background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8,
                          padding: '9px 20px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
                          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'inherit',
                        }}
                      >
                        <X size={14} strokeWidth={2} />
                        Cancel""",
"""onClick={handleBack}
                        style={{
                          background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8,
                          padding: '9px 20px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
                          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'inherit',
                        }}
                      >
                        Save Draft""")

with open('src/pages/NewRequest.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')
