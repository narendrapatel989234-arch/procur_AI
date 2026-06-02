const fs = require('fs');
let content = fs.readFileSync('src/pages/NewRequest.jsx', 'utf-8');

const target = `                <div style={{ marginBottom: 16 }}>
                  <FL>Timeline</FL>
                  <FTextarea value={fTimeline} onChange={(e) => setFTimeline(e.target.value)} placeholder="Describe phased delivery plan and key milestones" minHeight={100} />
                  {aiFilledFields.has('fTimeline') && <AiFilledTag />}
                {/* ── Submit row ── */}
                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button
                    onClick={handleBack}`;

const replacement = `                <div style={{ marginBottom: 16 }}>
                  <FL>Timeline</FL>
                  <FTextarea value={fTimeline} onChange={(e) => setFTimeline(e.target.value)} placeholder="Describe phased delivery plan and key milestones" minHeight={100} />
                  {aiFilledFields.has('fTimeline') && <AiFilledTag />}
                  {specificNote}
                </div>

                {/* ── Submit row ── */}
                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button
                    onClick={handleBack}`;

content = content.replace(target, replacement);

fs.writeFileSync('src/pages/NewRequest.jsx', content, 'utf-8');
console.log('Fixed missing lines');
