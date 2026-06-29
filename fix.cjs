const fs = require('fs');
let code = fs.readFileSync('src/pages/PRDetailRFP.jsx', 'utf8');

const startMarker = '{/* CONTEXT MENU */}';
const endMarker = '<style>{`';

const mangledStart = code.indexOf(startMarker);
const mangledEnd = code.indexOf(endMarker, mangledStart);

const danglingStartStr = '{/* SOW AI PANE (converted from fixed rightPane) */}';
const danglingStart = code.indexOf(danglingStartStr);

if (danglingStart !== -1) {
  const beforeDangling = code.substring(0, danglingStart);
  let endOfDangling = code.lastIndexOf('</div>', code.indexOf('</MainLayout>', danglingStart));
  const afterDangling = code.substring(endOfDangling);
  code = beforeDangling + afterDangling;
}

const fixedBlock = `{/* CONTEXT MENU */}
      {contextMenu.visible && (
        <div ref={contextMenuRef} style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 12, boxShadow: '0 12px 40px rgba(0,0,0,0.12)', width: 260, zIndex: 10000, padding: '8px 0', overflow: 'hidden' }}
          onMouseLeave={() => setContextMenu({ visible: false, x: 0, y: 0 })}>

          {aiDropdownOptions.map(opt => {
            const isEnabled = hasSelection || opt.alwaysEnabled;
            return (
              <div key={opt.id}
                onClick={() => {
                  if (!isEnabled) return;
                  const selText = editor && !editor.state.selection.empty ? editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to, ' ') : '';
                  setContextMenu({ visible: false, x: 0, y: 0 });
                  setRightPane({ visible: true, action: opt.id, title: opt.label, selectedText: selText });
                }}
                style={{ padding: '10px 16px', fontSize: 13, color: isEnabled ? 'var(--text-primary)' : '#94a3b8', cursor: isEnabled ? 'pointer' : 'not-allowed', display: 'flex', flexDirection: 'column', gap: 4, transition: 'background 0.15s' }}
                onMouseEnter={e => { if (isEnabled) e.currentTarget.style.background = '#f8fafc' }}
                onMouseLeave={e => { if (isEnabled) e.currentTarget.style.background = 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <opt.icon size={15} color={isEnabled ? '#7c7cff' : '#cbd5e1'} />
                  <span style={{ fontWeight: 500 }}>{opt.label}</span>
                </div>
                {!isEnabled && opt.id !== 'generate_section' && (
                  <div style={{ fontSize: 11, color: '#94a3b8', paddingLeft: 27, lineHeight: 1.3 }}>
                    Please select the respective text or section to proceed with AI actions
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* RIGHT PANE INLINE */}
    </div>
    {rightPane.visible && (
      <div style={{ width: '32vw', borderLeft: '1px solid var(--border-subtle)', background: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 10 }}>
        <div style={{ height: 56, minHeight: 56, background: '#fff', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', padding: '0 20px', flexShrink: 0, gap: 16 }}>
          <X size={18} color="var(--text-tertiary)" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={closeRightPane} />
          <div style={{ position: 'relative', flex: 1 }}>
            <select
              value={rightPane.action}
              onChange={(e) => {
                const opt = aiDropdownOptions.find(o => o.id === e.target.value);
                if (opt) {
                  setRightPane(prev => ({ ...prev, action: opt.id, title: opt.label }));
                }
              }}
              style={{ appearance: 'none', background: 'transparent', border: 'none', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', outline: 'none', width: '100%', paddingRight: 20 }}
            >
              {aiDropdownOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={14} color="var(--text-secondary)" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: 24 }}>
          {(rpState === 'generating' || rpState === 'regenerating' || rpState === 'generated') && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Generated Section</div>
              {(rpState === 'generating' || rpState === 'regenerating') ? (
                <div style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-default)', borderRadius: 12, height: 280, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  <RefreshCw size={28} color="var(--text-secondary)" className="spin-animation" />
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {rpState === 'regenerating' ? 'Regenerating section...' : 'Generating section...'}
                  </div>
                </div>
              ) : (
                <div style={{ background: rpIsEditing ? '#fff' : 'var(--bg-surface-1)', border: \`1px solid \${rpIsEditing ? '#7c7cff' : 'var(--border-default)'}\`, borderRadius: 12, minHeight: 280, width: '100%', padding: rpIsEditing ? 0 : 20, display: 'flex', flexDirection: 'column', transition: 'all 0.2s' }}>
                  {rpIsEditing ? (
                    <textarea
                      value={rpGeneratedText}
                      onChange={e => setRpGeneratedText(e.target.value)}
                      style={{ flex: 1, width: '100%', padding: 20, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6, border: 'none', outline: 'none', background: 'transparent', resize: 'none', fontFamily: 'inherit' }}
                    />
                  ) : (
                    <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{rpGeneratedText}</div>
                  )}
                </div>
              )}
              {rpState === 'generated' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
                  <button onClick={() => {
                    editor?.chain().focus().insertContent(\`<p>\${rpGeneratedText}</p>\`).run();
                    closeRightPane();
                    setSowBanner({ visible: true, type: 'success', message: 'Section accepted and added to document.' });
                    setTimeout(() => setSowBanner({ visible: false, type: '', message: '' }), 4000);
                  }} style={{ flex: 1, padding: '0 12px', height: 38, background: '#0052cc', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'box-shadow 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,82,204,0.3)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>Accept</button>
                  <button onClick={() => {
                    closeRightPane();
                    setSowBanner({ visible: true, type: 'error', message: 'Generated section was rejected.' });
                    setTimeout(() => setSowBanner({ visible: false, type: '', message: '' }), 4000);
                  }} style={{ flex: 1, padding: '0 12px', height: 38, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--colors-red-500)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                  <button onClick={() => setRpIsEditing(!rpIsEditing)} style={{ flex: 1, padding: '0 12px', height: 38, background: rpIsEditing ? '#f1f5f9' : '#fff', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{rpIsEditing ? 'Done' : 'Edit'}</button>
                  <button onClick={() => {
                    setRpIsEditing(false);
                    setRpState('regenerating');
                    setTimeout(() => { setRpState('generated'); }, 2000);
                  }} style={{ flex: 1, padding: '0 12px', height: 38, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Regen</button>
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{ flexShrink: 0, padding: '12px 16px 16px', background: '#fff' }}>
          <div style={{ border: \`1.5px solid \${rpPrompt ? '#7c7cff' : 'var(--border-default)'}\`, borderRadius: 14, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, boxShadow: rpPrompt ? '0 0 0 3px rgba(124,124,255,0.09), 0 2px 8px rgba(14,15,37,0.04)' : '0 2px 8px rgba(14,15,37,0.04)', transition: 'border-color 0.15s, box-shadow 0.15s', background: '#fff' }}>
            <textarea
              placeholder="Describe your requirement through a prompt"
              value={rpPrompt}
              onChange={(e) => setRpPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (rpPrompt.trim()) {
                    setRpIsEditing(false);
                    setRpState('generating');
                    setTimeout(() => {
                      setRpGeneratedText("The selected text has been rewritten to align with the chosen tone and provide clearer, more direct instructions. The Contractor is required to comply with all stated deliverables and timelines as explicitly outlined in the revised project scope.");
                      setRpState('generated');
                    }, 2500);
                  }
                }
              }}
              rows={1}
              style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: 'var(--text-primary)', resize: 'none', minHeight: 24, maxHeight: 120, overflowY: 'auto', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', transition: 'all 0.15s ease' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,124,255,0.08)'; e.currentTarget.style.color = '#7c7cff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}>
                <Paperclip size={18} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, color: rpPrompt.length > 18000 ? '#ef4444' : 'var(--text-tertiary)' }}>
                  {rpPrompt.length} / 20000
                </span>
                <div ref={toneMenuRef} style={{ position: 'relative' }}>
                  {rightPane.action === 'rewrite_content' && (
                    <>
                      <button
                        onClick={() => setShowToneMenu(!showToneMenu)}
                        style={{ background: 'transparent', border: 'none', padding: '6px 12px', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer', outline: 'none', display: 'flex', alignItems: 'center', gap: 6, borderRadius: 6, transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {selectedTone || 'Select Tone'}
                        <ChevronDown size={14} />
                      </button>
                      {showToneMenu && (
                        <div style={{ position: 'absolute', bottom: '100%', right: 0, marginBottom: 8, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 12, boxShadow: '0 12px 40px rgba(0,0,0,0.12)', width: 200, display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 100 }}>
                          <div style={{ padding: '10px 16px', fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-subtle)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Select Tone</div>
                          {[
                            { id: 'simplify', label: 'Simplify' },
                            { id: 'formalize', label: 'Formalize' },
                            { id: 'assertive', label: 'Make More Assertive' },
                            { id: 'legal', label: 'Align With Legal Tone' }
                          ].map(tone => (
                            <button
                              key={tone.id}
                              onClick={() => { setSelectedTone(tone.label); setShowToneMenu(false); }}
                              style={{ padding: '8px 16px', background: selectedTone === tone.label ? '#f8fafc' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', color: selectedTone === tone.label ? '#0052cc' : 'var(--text-primary)', fontSize: 13, transition: 'background 0.15s' }}
                              onMouseEnter={e => { if (selectedTone !== tone.label) e.currentTarget.style.background = '#f1f5f9' }}
                              onMouseLeave={e => { if (selectedTone !== tone.label) e.currentTarget.style.background = 'transparent' }}
                            >
                              {tone.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', transition: 'all 0.15s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#7c7cff'; e.currentTarget.style.background = 'rgba(124,124,255,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}>
                  <Mic size={18} strokeWidth={2} />
                </button>
                <button
                  onClick={() => {
                    if (!rpPrompt.trim()) return;
                    setRpIsEditing(false);
                    setRpState('generating');
                    setTimeout(() => {
                      setRpGeneratedText("The selected text has been rewritten to align with the chosen tone and provide clearer, more direct instructions. The Contractor is required to comply with all stated deliverables and timelines as explicitly outlined in the revised project scope.");
                      setRpState('generated');
                    }, 2500);
                  }}
                  style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: rpPrompt.trim() ? 'pointer' : 'not-allowed', background: rpPrompt.trim() ? 'linear-gradient(135deg, #0052cc, #7c7cff)' : 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: rpPrompt.trim() ? '0 2px 8px rgba(0,82,204,0.3)' : 'none', transition: 'all 0.15s ease' }}>
                  <Send size={15} color={rpPrompt.trim() ? '#fff' : 'var(--text-tertiary)'} style={{ marginLeft: -1 }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  `;

code = code.substring(0, mangledStart) + fixedBlock + '\n      <style>{`' + code.substring(mangledEnd + endMarker.length);
fs.writeFileSync('src/pages/PRDetailRFP.jsx', code);
console.log('Fixed file');
