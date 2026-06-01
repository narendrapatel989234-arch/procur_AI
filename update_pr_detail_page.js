import fs from 'fs';

let content = fs.readFileSync('src/pages/PRDetail.jsx', 'utf8');

// 1. ADD IMPORTS
if (!content.includes('Upload')) content = content.replace('Pencil', 'Pencil, Upload, Send, BarChart2');
if (!content.includes('useRef')) content = content.replace('import React, { useState } from \'react\';', 'import React, { useState, useRef, useEffect } from \'react\';');
if (!content.includes('ChevronDown')) content = content.replace('Pencil', 'Pencil, ChevronDown');

// 2. ADD CONSTANTS
const CONSTANTS = `
const BIZ_UNITS = ['DDAIS', 'Finance', 'Engineering', 'Operations', 'Marketing', 'HR', 'Legal', 'Procurement', 'IT', 'Other'];
const PRIORITIES = ['Standard', 'Urgent', 'Critical'];
const PRIORITY_DOT = { Standard: '#22c55e', Urgent: '#f59e0b', Critical: '#ef4444' };
const PROC_CATEGORIES = ['Real Estate', 'Technology and Consulting', 'Energy & Utilities', 'Healthcare & Pharma'];
const SPEND_CATEGORY_MAP = { 'Real Estate': 'Direct Spend', 'Technology and Consulting': 'Indirect Spend', 'Energy & Utilities': 'Direct Spend', 'Healthcare & Pharma': 'Direct Spend' };
const SUBCATEGORY_MAP = {
  'Real Estate': ['Land & Development', 'Construction & Infrastructure', 'Facilities Management', 'Property Management'],
  'Technology and Consulting': ['IT Consulting & Advisory', 'Application Development & Maintenance', 'Enterprise Systems & Platforms', 'Cloud & Infrastructure Services', 'Data AI & Analytics', 'IT Operations & Managed Services', 'Staff Augmentation & Professional Services'],
  'Energy & Utilities': ['Oil & Gas', 'Renewable', 'Power', 'Utilities'],
  'Healthcare & Pharma': ['Clinical & Medical Equipment', 'Pharmaceuticals & Drugs', 'Facilities & Hospital Operations', 'IT & Digital Health Systems'],
};
const CAPEX_OPEX_OPTS = ['CapEx', 'OpEx'];
const UOM_OPTS = ['Units', 'Sq.ft.', 'MW', 'Trips', 'Resources', 'Licenses', 'Months', 'Hours', 'Other'];
const VENDOR_OPTS = ['No Preference', 'Apple Authorised Reseller', 'Microsoft', 'SAP', 'Oracle', 'Accenture', 'Deloitte', 'TCS', 'Infosys', 'Other'];
const DELIVERY_LOCS = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Remote / Virtual'];

const STATUS_CONFIG = {
  'Submitted':          { bg: '#e8f1fb', color: '#0052cc' },
  'In Review':          { bg: '#fff3e0', color: '#e65100' },
  'Classifying':        { bg: '#ede9fe', color: '#6d28d9' },
  'RFP in Progress':    { bg: '#fdf4ff', color: '#a21caf' },
  'Pending RFP Approval': { bg: '#fff3e0', color: '#e65100' },
  'RFP Published':      { bg: '#ede9fe', color: '#6d28d9' },
  'Proposals Received': { bg: '#fdf4ff', color: '#a21caf' },
  'Under Evaluation':   { bg: '#fff1f2', color: '#be123c' },
  'Negotiation':        { bg: '#fff7ed', color: '#b45309' },
  'Pending Award Approval': { bg: '#fff3e0', color: '#e65100' },
  'SoW in Progress':    { bg: '#ecfdf5', color: '#065f46' },
  'Contract Active':    { bg: '#ecfdf5', color: '#065f46' },
};

function EDrop({ refEl, open, onToggle, value, placeholder, options, onChange, renderOption, disabled }) {
  return (
    <div ref={refEl} style={{ position: 'relative' }}>
      <button onClick={!disabled ? onToggle : undefined} style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: \`1px solid \${open ? '#7c7cff' : 'var(--border-default)'}\`, borderRadius: 8, fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer', background: '#fff', fontFamily: 'inherit', outline: 'none', color: value ? 'var(--text-primary)' : 'var(--text-tertiary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: open ? '0 0 0 3px rgba(124,124,255,0.1)' : 'none', opacity: disabled ? 0.5 : 1, transition: 'all .15s ease' }}>
        <span style={{ display: 'flex', alignItems: 'center' }}>{renderOption ? renderOption(value, true) : (value || placeholder)}</span>
        <ChevronDown size={14} strokeWidth={2} style={{ flexShrink: 0, transition: 'transform .15s ease', transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 300, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: 6 }}>
          {options.map((opt) => (
            <div key={opt} onClick={() => { onChange(opt); onToggle(); }} style={{ padding: '8px 12px', fontSize: 13, borderRadius: 6, cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', transition: 'background .12s ease' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-surface-2)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
              {renderOption ? renderOption(opt, false) : opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function EInput({ value, onChange, placeholder, type = 'text', readOnly, prefilled, style: extraStyle }) {
  const [fc, setFc] = React.useState(false);
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly} onFocus={() => setFc(true)} onBlur={() => setFc(false)} style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: \`1px solid \${fc ? '#7c7cff' : 'var(--border-default)'}\`, borderRadius: 8, fontSize: 14, color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', background: prefilled ? 'var(--bg-surface-2)' : '#fff', boxShadow: fc ? '0 0 0 3px rgba(124,124,255,0.1)' : 'none', transition: 'border-color .15s ease, box-shadow .15s ease', ...extraStyle }} />;
}
function ETextarea({ value, onChange, placeholder, minHeight = 100 }) {
  const [fc, setFc] = React.useState(false);
  return <textarea value={value} onChange={onChange} placeholder={placeholder} onFocus={() => setFc(true)} onBlur={() => setFc(false)} style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: \`1px solid \${fc ? '#7c7cff' : 'var(--border-default)'}\`, borderRadius: 8, fontSize: 14, color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', minHeight, resize: 'vertical', lineHeight: 1.5, boxShadow: fc ? '0 0 0 3px rgba(124,124,255,0.1)' : 'none', transition: 'border-color .15s ease, box-shadow .15s ease' }} />;
}
function EL({ children, required }) {
  return <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>{children}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>;
}

function EditModal({ onClose, onSave }) {
  const [fReqTitle, setFReqTitle] = React.useState('AWS Cloud Migration Consulting Services');
  const [fBizUnit, setFBizUnit] = React.useState('Engineering'); const [fBizUnitOpen, setFBizUnitOpen] = React.useState(false);
  const [fRequestorName] = React.useState('David Kim');
  const [fRequestDate, setFRequestDate] = React.useState('2026-05-08');
  const [fRequiredByDate, setFRequiredByDate] = React.useState('2026-07-15');
  const [fPriority, setFPriority] = React.useState('Urgent'); const [fPriorityOpen, setFPriorityOpen] = React.useState(false);
  const [fProcCategory, setFProcCategory] = React.useState('Technology and Consulting'); const [fProcCategoryOpen, setFProcCategoryOpen] = React.useState(false);
  const [fSubcategory, setFSubcategory] = React.useState('Cloud & Infrastructure Services'); const [fSubcategoryOpen, setFSubcategoryOpen] = React.useState(false);
  const [fProjectName, setFProjectName] = React.useState('Infrastructure Modernisation 2026');
  const [fCapexOpex, setFCapexOpex] = React.useState('OpEx'); const [fCapexOpexOpen, setFCapexOpexOpen] = React.useState(false);
  const [fJustification, setFJustification] = React.useState('');
  const [fReqDesc, setFReqDesc] = React.useState('Consulting services for migrating on-premise infrastructure to AWS. Assessment, architecture design, migration execution, and post-migration support. Expected team: 3 senior architects, 6 months.');
  const [fQuantity, setFQuantity] = React.useState('1');
  const [fUnitValue, setFUnitValue] = React.useState('45,00,000');
  const [fUom, setFUom] = React.useState('Resources'); const [fUomOpen, setFUomOpen] = React.useState(false);
  const [fBudget, setFBudget] = React.useState('45,00,000');
  const [fCostBreakdown, setFCostBreakdown] = React.useState('Time & Materials');
  const [fSuggestedVendor, setFSuggestedVendor] = React.useState('No Preference'); const [fVendorOpen, setFVendorOpen] = React.useState(false);
  const [fVendorJustification, setFVendorJustification] = React.useState('');
  const [fContractRef, setFContractRef] = React.useState('');
  const [fDeliveryLoc, setFDeliveryLoc] = React.useState('Dubai'); const [fDeliveryOpen, setFDeliveryOpen] = React.useState(false);
  const [fTimeline, setFTimeline] = React.useState('Phase 1: Assessment (Month 1-2), Phase 2: Migration (Month 3-5), Phase 3: Support (Month 6)');

  const fBizUnitRef = React.useRef(null); const fPriorityRef = React.useRef(null);
  const fProcCatRef = React.useRef(null); const fSubcatRef = React.useRef(null);
  const fCapexRef = React.useRef(null); const fUomRef = React.useRef(null);
  const fVendorRef = React.useRef(null); const fDeliveryRef = React.useRef(null);

  React.useEffect(() => {
    function handler(e) {
      if (fBizUnitRef.current && !fBizUnitRef.current.contains(e.target)) setFBizUnitOpen(false);
      if (fPriorityRef.current && !fPriorityRef.current.contains(e.target)) setFPriorityOpen(false);
      if (fProcCatRef.current && !fProcCatRef.current.contains(e.target)) setFProcCategoryOpen(false);
      if (fSubcatRef.current && !fSubcatRef.current.contains(e.target)) setFSubcategoryOpen(false);
      if (fCapexRef.current && !fCapexRef.current.contains(e.target)) setFCapexOpexOpen(false);
      if (fUomRef.current && !fUomRef.current.contains(e.target)) setFUomOpen(false);
      if (fVendorRef.current && !fVendorRef.current.contains(e.target)) setFVendorOpen(false);
      if (fDeliveryRef.current && !fDeliveryRef.current.contains(e.target)) setFDeliveryOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const subcatOptions = fProcCategory ? (SUBCATEGORY_MAP[fProcCategory] || []) : [];
  const spendCategory = SPEND_CATEGORY_MAP[fProcCategory] || '';
  const specificNote = <div style={{ fontSize: 11, color: '#999', fontStyle: 'italic', marginTop: 4 }}>Applicable for specific categories</div>;
  const SL = ({ children }) => <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#bbb', marginBottom: 10 }}>{children}</div>;
  const Dv = () => <div style={{ borderTop: '1px solid #f0f0f0', margin: '10px 0' }} />;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, width: 720, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Edit Requisition Details</div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>PR-2026-004 · AWS Cloud Migration Consulting</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999', display: 'flex', padding: 6, borderRadius: 8 }}><X size={18} /></button>
        </div>
        <div style={{ overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SL>General Info</SL>
          <div><EL>Requisition ID</EL><div style={{ padding: '9px 12px', background: '#f5f5f5', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 12, color: '#999', fontStyle: 'italic' }}>PR-2026-004</div></div>
          <div><EL required>Request Title</EL><EInput value={fReqTitle} onChange={e => setFReqTitle(e.target.value)} placeholder="Short description" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><EL required>Cost Centre</EL><EDrop refEl={fBizUnitRef} open={fBizUnitOpen} onToggle={() => setFBizUnitOpen(!fBizUnitOpen)} value={fBizUnit} placeholder="Select business unit" options={BIZ_UNITS} onChange={v => setFBizUnit(v)} /></div>
            <div><EL required>Requestor Name</EL><EInput value={fRequestorName} readOnly prefilled /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><EL required>Request Date</EL><EInput type="date" value={fRequestDate} onChange={e => setFRequestDate(e.target.value)} /></div>
            <div><EL required>Required By Date</EL><EInput type="date" value={fRequiredByDate} onChange={e => setFRequiredByDate(e.target.value)} /></div>
          </div>
          <div><EL required>Priority</EL><EDrop refEl={fPriorityRef} open={fPriorityOpen} onToggle={() => setFPriorityOpen(!fPriorityOpen)} value={fPriority} placeholder="Select priority" options={PRIORITIES} onChange={v => setFPriority(v)} renderOption={(val) => val ? <span style={{ display: 'flex', alignItems: 'center' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: PRIORITY_DOT[val] || '#ccc', marginRight: 8, flexShrink: 0 }} />{val}</span> : val} /></div>
          <Dv /><SL>Category Info</SL>
          <div><EL required>Procurement Category</EL><EDrop refEl={fProcCatRef} open={fProcCategoryOpen} onToggle={() => setFProcCategoryOpen(!fProcCategoryOpen)} value={fProcCategory} placeholder="Select category" options={PROC_CATEGORIES} onChange={v => { setFProcCategory(v); setFSubcategory(''); }} /></div>
          <div><EL required>Spend Category</EL><div style={{ padding: '9px 12px', background: '#f5f5f5', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 14, color: '#666' }}>{spendCategory || '—'}</div><div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Auto-selected based on category</div></div>
          <div><EL required>Subcategory</EL><EDrop refEl={fSubcatRef} open={fSubcategoryOpen} onToggle={() => { if (fProcCategory) setFSubcategoryOpen(!fSubcategoryOpen); }} value={fSubcategory} placeholder={fProcCategory ? 'Select subcategory' : 'Select category first'} options={subcatOptions} onChange={v => setFSubcategory(v)} disabled={!fProcCategory} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><EL>Project Name</EL><EInput value={fProjectName} onChange={e => setFProjectName(e.target.value)} placeholder="Linked project name" /></div>
            <div><EL required>CapEx / OpEx</EL><EDrop refEl={fCapexRef} open={fCapexOpexOpen} onToggle={() => setFCapexOpexOpen(!fCapexOpexOpen)} value={fCapexOpex} placeholder="Select expense type" options={CAPEX_OPEX_OPTS} onChange={v => setFCapexOpex(v)} /></div>
          </div>
          <div><EL>Justification</EL><ETextarea value={fJustification} onChange={e => setFJustification(e.target.value)} placeholder="Justification for CapEx/OpEx" minHeight={70} /></div>
          <Dv /><SL>Scope Details</SL>
          <div><EL required>Requirement Description</EL><ETextarea value={fReqDesc} onChange={e => setFReqDesc(e.target.value)} placeholder="Describe the full scope..." minHeight={90} /></div>
          <div>
            <EL>Attachments</EL>
            <div style={{ border: '2px dashed #e0e0e0', borderRadius: 10, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', background: '#fafafa' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#7c7cff'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e0e0e0'}
              onClick={() => document.getElementById('edit-modal-file-input-detail').click()}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(124,124,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Upload size={15} color="#7c7cff" strokeWidth={2} /></div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>Drop files or click to upload</div>
              <div style={{ fontSize: 12, color: '#999' }}>PDF, DOCX, XLSX · Max 25MB</div>
            </div>
            <input id="edit-modal-file-input-detail" type="file" accept=".pdf,.docx,.xlsx" style={{ display: 'none' }} />
          </div>
          <Dv /><SL>Commercials</SL>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><EL required>Quantity</EL><EInput type="number" value={fQuantity} onChange={e => setFQuantity(e.target.value)} placeholder="Enter quantity" />{specificNote}</div>
            <div><EL>Estimated Unit Value</EL><EInput value={fUnitValue} onChange={e => setFUnitValue(e.target.value)} placeholder="e.g. 45,000 per unit" />{specificNote}</div>
          </div>
          <div><EL required>Unit of Measure</EL><EDrop refEl={fUomRef} open={fUomOpen} onToggle={() => setFUomOpen(!fUomOpen)} value={fUom} placeholder="Select unit" options={UOM_OPTS} onChange={v => setFUom(v)} />{specificNote}</div>
          <div><EL required>Estimated Budget</EL>
            <div style={{ display: 'flex', border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
              <span style={{ padding: '9px 12px', background: '#f5f5f5', fontSize: 14, color: '#999', borderRight: '1px solid #e0e0e0' }}>Rs</span>
              <input type="text" value={fBudget} onChange={e => setFBudget(e.target.value)} style={{ flex: 1, padding: '9px 12px', border: 'none', outline: 'none', fontSize: 14, fontFamily: 'inherit', background: '#fff', color: '#1a1a1a' }} />
            </div>
          </div>
          <div><EL>Pricing Model</EL><ETextarea value={fCostBreakdown} onChange={e => setFCostBreakdown(e.target.value)} placeholder="Fixed / T&M / Milestone" minHeight={60} /></div>
          <Dv /><SL>Vendor Info</SL>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><EL>Suggested Vendor</EL><EDrop refEl={fVendorRef} open={fVendorOpen} onToggle={() => setFVendorOpen(!fVendorOpen)} value={fSuggestedVendor} placeholder="Select preferred vendor" options={VENDOR_OPTS} onChange={v => setFSuggestedVendor(v)} /></div>
            <div><EL>Contract Reference</EL><EInput value={fContractRef} onChange={e => setFContractRef(e.target.value)} placeholder="Contract or renewal ref" /></div>
          </div>
          <div><EL>Vendor Justification</EL><ETextarea value={fVendorJustification} onChange={e => setFVendorJustification(e.target.value)} placeholder="Reason for preferring this vendor" minHeight={60} /></div>
          <Dv /><SL>Execution Details</SL>
          <div><EL required>Delivery Location</EL><EDrop refEl={fDeliveryRef} open={fDeliveryOpen} onToggle={() => setFDeliveryOpen(!fDeliveryOpen)} value={fDeliveryLoc} placeholder="Select delivery location" options={DELIVERY_LOCS} onChange={v => setFDeliveryLoc(v)} />{specificNote}</div>
          <div><EL>Timeline</EL><ETextarea value={fTimeline} onChange={e => setFTimeline(e.target.value)} placeholder="Phased delivery plan and key milestones" minHeight={70} />{specificNote}</div>
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e8e8e8', display: 'flex', justifyContent: 'flex-end', gap: 10, flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: '9px 20px', border: '1px solid #e0e0e0', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#4a4a4a', fontFamily: 'inherit' }}>Cancel</button>
          <button onClick={onSave} style={{ padding: '9px 24px', border: 'none', borderRadius: 8, background: '#0052cc', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'inherit' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
`;

const insertConstsIndex = content.indexOf('const STAGES = ');
content = content.substring(0, insertConstsIndex) + CONSTANTS + '\n\n' + content.substring(insertConstsIndex);

// Add state to PRDetail Component
const stateInsertIndex = content.indexOf('const [activeTab, setActiveTab] = useState(\'overview\');');
const stateStr = `const [showEditModal, setShowEditModal] = React.useState(false);
  const [showSaveToast, setShowSaveToast] = React.useState(false);
  const [prStatus, setPrStatus] = React.useState('RFP in Progress');\n  `;
content = content.substring(0, stateInsertIndex) + stateStr + content.substring(stateInsertIndex);

// Add NodeCard and Arrow helper components, and ICONS
const nodeHelpers = `
const ICONS = { User, Sparkles, GitBranch, Banknote, ShieldCheck, FileText, UserCheck, Send, BarChart2, CheckCircle, Upload };

function NodeCard({ node }) {
  const isPending = node.status === 'waiting' || node.status === 'pending_user';
  const IconComponent = ICONS[node.icon] || User;

  return (
    <div style={{
      width: 180, background: isPending ? '#f9f9f9' : '#fff',
      border: isPending ? '1.5px dashed rgba(200,200,200,0.8)' : '1px solid var(--border-default)',
      borderRadius: 12, padding: '14px', position: 'relative',
      opacity: node.status === 'waiting' ? 0.7 : 1,
      boxShadow: isPending ? 'none' : '0 2px 8px rgba(0,0,0,0.03)',
      transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', zIndex: 10,
    }}>
      <div style={{ position: 'absolute', top: -8, right: -8 }}>
        {node.status === 'complete' && <div style={{ background: '#22c55e', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 10, border: '2px solid #fff' }}>DONE</div>}
        {node.status === 'pending_user' && <div style={{ background: '#f59e0b', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 10, border: '2px solid #fff' }}>PENDING</div>}
        {node.status === 'waiting' && <div style={{ background: '#999', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 10, border: '2px solid #fff' }}>LOCKED</div>}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          background: node.status === 'complete' ? (node.type === 'ai' ? 'linear-gradient(135deg, #7c7cff, #0052cc)' : '#0052cc') : (node.status === 'pending_user' ? '#f59e0b' : '#e0e0e0'),
        }}>
          <IconComponent size={16} color={isPending && node.status !== 'pending_user' ? '#999' : '#fff'} />
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: isPending && node.status !== 'pending_user' ? '#999' : '#1a1a1a', lineHeight: 1.3 }}>{node.title}</div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#666', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}><User size={10} /> {node.actor}</div>
        {node.timestamp ? (
          <div style={{ fontSize: 10, color: '#999', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} /> {node.timestamp}</div>
        ) : (
          <div style={{ fontSize: 10, color: '#bbb', display: 'flex', alignItems: 'center', gap: 4 }}><Lock size={10} /> Awaiting previous step</div>
        )}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div style={{ width: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
      <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
        <line x1="0" y1="6" x2="32" y2="6" stroke="#d0d0d0" strokeWidth="1.5" strokeLinecap="round"/>
        <polyline points="26,2 34,6 26,10" stroke="#d0d0d0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    </div>
  );
}
`;

const exportIndex = content.indexOf('export default function PRDetail({ onNavigate }) {');
content = content.substring(0, exportIndex) + nodeHelpers + '\n\n' + content.substring(exportIndex);

// Replace nodes array and rendering
const nodesStart = content.indexOf('const nodes = [');
const nodesEnd = content.indexOf('];', nodesStart) + 2;

const COMPLEX_NODES = `const COMPLEX_NODES = [
  { id: 0, type: 'user', status: 'complete', title: 'PR Submitted', actor: 'David Kim', timestamp: '08 May · 16:38', icon: 'User' },
  { id: 1, type: 'ai', status: 'complete', title: 'AI Extraction & Folder Creation', actor: 'AI Agent', timestamp: '08 May · 16:45', icon: 'Sparkles' },
  { id: 2, type: 'ai', status: 'complete', title: 'Routine / Complex', actor: 'AI Agent', timestamp: '08 May · 16:46', icon: 'GitBranch' },
  { id: 3, type: 'ai', status: 'complete', title: 'Budget Check', actor: 'AI Agent', timestamp: '08 May · 16:46', icon: 'Banknote' },
  { id: 4, type: 'ai', status: 'complete', title: 'Compliance Validation', actor: 'AI Agent', timestamp: '08 May · 16:47', icon: 'ShieldCheck' },
  { id: 5, type: 'ai', status: 'complete', title: 'RFP Management', actor: 'AI Agent', timestamp: '10 May · 11:14', icon: 'FileText' },
  { id: 6, type: 'pending_user', status: 'pending_user', title: 'Manager Approval (RFP)', actor: 'Sarah Chen', timestamp: null, icon: 'UserCheck' },
  { id: 7, type: 'user', status: 'waiting', title: 'RFP Published', actor: 'Procurement Analyst', timestamp: null, icon: 'Send' },
  { id: 8, type: 'user', status: 'waiting', title: 'Proposal Upload & Extraction', actor: 'Procurement Analyst', timestamp: null, icon: 'Upload' },
  { id: 9, type: 'ai', status: 'waiting', title: 'RFP Evaluation', actor: 'AI Agent', timestamp: null, icon: 'BarChart2' },
  { id: 10, type: 'ai', status: 'waiting', title: 'Negotiation Intelligence', actor: 'AI Agent', timestamp: null, icon: 'Sparkles' },
  { id: 11, type: 'pending_user', status: 'waiting', title: 'Manager Approval (Award)', actor: 'Sarah Chen', timestamp: null, icon: 'UserCheck' },
  { id: 12, type: 'user', status: 'waiting', title: 'Award', actor: 'Procurement Analyst', timestamp: null, icon: 'CheckCircle' },
  { id: 13, type: 'ai', status: 'waiting', title: 'SoW Initiation', actor: 'AI Agent', timestamp: null, icon: 'FileText' },
  { id: 14, type: 'ai', status: 'waiting', title: 'Contract Compliance', actor: 'AI Agent', timestamp: null, icon: 'ShieldCheck' },
];`;

content = content.substring(0, nodesStart) + COMPLEX_NODES + content.substring(nodesEnd);

// Workflow Rendering
const workflowStart = content.indexOf('{/* Workflow Canvas */}');
const workflowEnd = content.indexOf('{/* Main Content Area */}');

const workflowRendering = `{/* Workflow Canvas */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border-default)', padding: '24px', marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={12} color="#7c7cff" /> Procurement Workflow (Complex)
              </div>
              <div style={{ width: '100%', overflowX: 'auto', paddingBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', minWidth: 'max-content', padding: '10px 10px 10px 4px' }}>
                  <NodeCard node={COMPLEX_NODES[0]} /><Arrow />
                  <NodeCard node={COMPLEX_NODES[1]} /><Arrow />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
                    <NodeCard node={COMPLEX_NODES[2]} />
                    <NodeCard node={COMPLEX_NODES[3]} />
                    <NodeCard node={COMPLEX_NODES[4]} />
                  </div>
                  
                  <Arrow /><NodeCard node={COMPLEX_NODES[5]} /><Arrow />
                  <NodeCard node={COMPLEX_NODES[6]} /><Arrow />
                  <NodeCard node={COMPLEX_NODES[7]} /><Arrow />
                  <NodeCard node={COMPLEX_NODES[8]} /><Arrow />
                  <NodeCard node={COMPLEX_NODES[9]} /><Arrow />
                  <NodeCard node={COMPLEX_NODES[10]} /><Arrow />
                  <NodeCard node={COMPLEX_NODES[11]} /><Arrow />
                  <NodeCard node={COMPLEX_NODES[12]} /><Arrow />
                  <NodeCard node={COMPLEX_NODES[13]} /><Arrow />
                  <NodeCard node={COMPLEX_NODES[14]} />
                </div>
              </div>
            </div>
            `;
content = content.substring(0, workflowStart) + workflowRendering + content.substring(workflowEnd);


// Header Badge Replace
const badgeStartStr = '<div style={{ background: \'#fff3e0\', color: \'#e65100\', borderRadius: 20, padding: \'3px 12px\', fontSize: 11, fontWeight: 600 }}>In Sourcing</div>';
const dynamicBadge = '<div style={{ background: STATUS_CONFIG[prStatus]?.bg || \'#e8f1fb\', color: STATUS_CONFIG[prStatus]?.color || \'#0052cc\', borderRadius: 20, padding: \'3px 12px\', fontSize: 11, fontWeight: 600, transition: \'all 0.4s ease\' }}>{prStatus}</div>';
content = content.replace(badgeStartStr, dynamicBadge);

// Edit Details Button
const editBtnHtml = `<button onClick={() => setShowEditModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid rgba(0,82,204,0.3)', borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 500, color: '#0052cc', cursor: 'pointer', fontFamily: 'inherit' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,82,204,0.04)'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}><Pencil size={12} strokeWidth={2} /> Edit Details</button>`;

const reqDetailsHeader = '<div style={{ fontSize: 16, fontWeight: 600, color: \'#1a1a1a\' }}>Requisition Details</div>';
const reqDetailsNew = `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}><div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>Requisition Details</div>${editBtnHtml}</div>`;
if(content.includes('<div style={{ fontSize: 16, fontWeight: 600, color: \'#1a1a1a\', marginBottom: 16 }}>Requisition Details</div>')) {
  content = content.replace('<div style={{ fontSize: 16, fontWeight: 600, color: \'#1a1a1a\', marginBottom: 16 }}>Requisition Details</div>', reqDetailsNew);
} else {
  content = content.replace(reqDetailsHeader, reqDetailsNew);
}

// Add Toast and Modal Rendering
const renderModals = `{showEditModal && <EditModal onClose={() => setShowEditModal(false)} onSave={() => { setShowEditModal(false); setShowSaveToast(true); setTimeout(() => setShowSaveToast(false), 3000); }} />}
{showSaveToast && (
  <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: '#f0fdf4', border: '1px solid rgba(34,197,94,0.25)', borderLeft: '4px solid #22c55e', borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 32px rgba(14,15,37,0.1)', minWidth: 340 }}>
    <CheckCircle size={20} color="#22c55e" strokeWidth={2} style={{ flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>Changes saved successfully</div>
      <div style={{ fontSize: 12, color: '#166534', marginTop: 2 }}>Requisition details have been updated.</div>
    </div>
    <button onClick={() => setShowSaveToast(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(21,128,61,0.5)', display: 'flex', padding: 2, borderRadius: 4 }}><X size={16} /></button>
  </div>
)}`;

const layoutStart = content.indexOf('<MainLayout');
content = content.substring(0, layoutStart) + renderModals + '\n      ' + content.substring(layoutStart);

fs.writeFileSync('src/pages/PRDetail.jsx', content);

