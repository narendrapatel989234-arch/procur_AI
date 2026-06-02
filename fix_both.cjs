const fs = require('fs');
let content = fs.readFileSync('src/pages/NewRequest.jsx', 'utf-8');

// Fix 1
const target1 = `                  <div>
                    <FL>Contract Reference</FL>
                    <FInput value={fContractRef} onChange={(e) => setFContractRef(e.target.value)} placeholder="Existing contract or renewal reference number" />
                    {aiFilledFields.has('fContractRef') && <AiFilledTag />}
                <div style={{ marginBottom: 16 }}>
                  <FL>Vendor Justification</FL>`;

const replacement1 = `                  <div>
                    <FL>Contract Reference</FL>
                    <FInput value={fContractRef} onChange={(e) => setFContractRef(e.target.value)} placeholder="Existing contract or renewal reference number" />
                    {aiFilledFields.has('fContractRef') && <AiFilledTag />}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <FL>Vendor Justification</FL>`;

content = content.replace(target1, replacement1);

// Fix 2
const target2 = `                <div style={{ marginBottom: 16 }}>
                  <FL>Timeline</FL>
                  <FTextarea value={fTimeline} onChange={(e) => setFTimeline(e.target.value)} placeholder="Describe phased delivery plan and key milestones" minHeight={100} />
                  {aiFilledFields.has('fTimeline') && <AiFilledTag />}
                {/* ── Submit row ── */}
                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button`;

const replacement2 = `                <div style={{ marginBottom: 16 }}>
                  <FL>Timeline</FL>
                  <FTextarea value={fTimeline} onChange={(e) => setFTimeline(e.target.value)} placeholder="Describe phased delivery plan and key milestones" minHeight={100} />
                  {aiFilledFields.has('fTimeline') && <AiFilledTag />}
                  {specificNote}
                </div>

                {/* ── Submit row ── */}
                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button`;

content = content.replace(target2, replacement2);

fs.writeFileSync('src/pages/NewRequest.jsx', content, 'utf-8');
console.log('Fixed missing tags');
