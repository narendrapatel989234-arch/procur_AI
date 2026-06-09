const fs = require('fs');

const fresh = fs.readFileSync('src/pages/PRDetailFresh.jsx', 'utf8');
const rfp = fs.readFileSync('src/pages/PRDetailRFP.jsx', 'utf8');

// 1. Extract PO states from PRDetailFresh
const poStatesStart = fresh.indexOf('// PO form fields');
const poStatesEnd = fresh.indexOf('const upd = (ids, status) => {');
const poStates = fresh.slice(poStatesStart, poStatesEnd);

// 2. Extract PO Tab from PRDetailFresh
const poTabStart = fresh.indexOf("{activeTab === 'po' && (");
const poTabEnd = fresh.indexOf("{activeTab === 'invoices' && (");
const poTab = fresh.slice(poTabStart, poTabEnd).trim();

// 3. Extract Approve Modals from PRDetailFresh
const appModalStart = fresh.indexOf('{showApproveModal && (');
const appModalEnd = fresh.indexOf('{saveToast && (');
const appModals = fresh.slice(appModalStart, appModalEnd).trim();

// 4. Extract PO Preview Modal from PRDetailFresh
const poPrevStart = fresh.indexOf('{showPoPreview && (');
const poPrevEnd = fresh.indexOf('return (', poPrevStart); // wait, it is at the end of the file.
let actualPoPrevEnd = fresh.indexOf('export default PRDetailFresh');
let poPrev = fresh.slice(poPrevStart, actualPoPrevEnd).trim();
// removing last 2 closing tags?
const poPrevSplit = poPrev.split('\n');
while(poPrevSplit.length > 0 && ['</div>', '<>', '</>', '  );'].includes(poPrevSplit[poPrevSplit.length - 1].trim())) {
  poPrevSplit.pop();
}
poPrev = poPrevSplit.join('\n');

// 5. Update PRDetailRFP

let newRfp = rfp;

// Add states
newRfp = newRfp.replace('const [saveToast, setSaveToast] = useState(null);', `const [saveToast, setSaveToast] = useState(null);\n  const [showPoPreview, setShowPoPreview] = useState(false);\n  const [showApproveModal, setShowApproveModal] = useState(false);\n  const [showApproveToast, setShowApproveToast] = useState(false);\n  const [showPoEditModal, setShowPoEditModal] = useState(false);\n\n  ${poStates}`);

// Update Accept button
newRfp = newRfp.replace(
  `<button style={btnBlue}\n                            onMouseEnter={e => e.currentTarget.style.background = '#0041a3'} onMouseLeave={e => e.currentTarget.style.background = '#0052cc'}>\n                            <Check size={13} /> Accept\n                          </button>`,
  `<button style={btnBlue}\n                            onClick={() => { setActiveTab('po'); }}\n                            onMouseEnter={e => e.currentTarget.style.background = '#0041a3'} onMouseLeave={e => e.currentTarget.style.background = '#0052cc'}>\n                            <Check size={13} /> Accept\n                          </button>`
);

// Replace empty PO tab
newRfp = newRfp.replace(
  `{((['po', 'invoices'].includes(activeTab)) || (activeTab === 'sow' && !selectedAwardVendor) || (activeTab === 'negot' && !proposals.some(p => p.status === 'Completed'))) && (() => {`,
  `${poTab}\n\n              {((['invoices'].includes(activeTab)) || (activeTab === 'po' && false) || (activeTab === 'sow' && !selectedAwardVendor) || (activeTab === 'negot' && !proposals.some(p => p.status === 'Completed'))) && (() => {`
);

// Append Modals
newRfp = newRfp.replace(
  `{showEditModal && <EditModal onClose={() => setShowEditModal(false)} onSave={() => { setShowEditModal(false); setSaveToast({ title: 'Changes saved successfully', subtext: 'Requisition details have been updated.' }); setTimeout(() => setSaveToast(null), 3000); }} />}`,
  `{showEditModal && <EditModal onClose={() => setShowEditModal(false)} onSave={() => { setShowEditModal(false); setSaveToast({ title: 'Changes saved successfully', subtext: 'Requisition details have been updated.' }); setTimeout(() => setSaveToast(null), 3000); }} />}\n      ${appModals}\n      ${poPrev}`
);

fs.writeFileSync('src/pages/PRDetailRFP.jsx', newRfp);
console.log('Successfully ported PO tab and modals.');
