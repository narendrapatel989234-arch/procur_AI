const fs = require('fs');
let content = fs.readFileSync('src/pages/PRDetailFresh.jsx', 'utf8');

// 1. Add ChevronDown to lucide-react
if (!content.includes('ChevronDown')) {
  content = content.replace('from \'lucide-react\';', 'ChevronDown } from \'lucide-react\';');
}

// 2. Add useRef to React
if (!content.includes('useRef')) {
  content = content.replace('import React, { useState, useEffect }', 'import React, { useState, useEffect, useRef }');
}

// 3. Constants and Components
const consts = `
const BIZ_UNITS = ['DDAIS', 'Finance', 'Engineering', 'Operations', 'Marketing', 'HR', 'Legal', 'Procurement', 'IT', 'Other'];
const PRIORITIES = ['Standard', 'Urgent', 'Critical'];
const PRIORITY_DOT = { Standard: '#22c55e', Urgent: '#f59e0b', Critical: '#ef4444' };
const PROC_CATEGORIES = ['Real Estate', 'Technology and Consulting', 'Energy & Utilities', 'Healthcare & Pharma'];
const SPEND_CATEGORY_MAP = {
  'Real Estate': 'Direct Spend',
  'Technology and Consulting': 'Indirect Spend',
  'Energy & Utilities': 'Direct Spend',
  'Healthcare & Pharma': 'Direct Spend',
};
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

function EDrop({ refEl, open, onToggle, value, placeholder, options, onChange, renderOption, disabled }) {
  return (
    <div ref={refEl} style={{ position: 'relative' }}>
      <button
        onClick={!disabled ? onToggle : undefined}
        style={{
          width: '100%', padding: '9px 12px', boxSizing: 'border-box',
          border: \`1px solid \${open ? '#7c7cff' : 'var(--border-default)'}\`,
          borderRadius: 8, fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer',
          background: '#fff', fontFamily: 'inherit', outline: 'none',
          color: value ? 'var(--text-primary)' : 'var(--text-tertiary)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: open ? '0 0 0 3px rgba(124,124,255,0.1)' : 'none',
          opacity: disabled ? 0.5 : 1,
          transition: 'all .15s ease',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {renderOption ? renderOption(value, true) : (value || placeholder)}
        </span>
        <ChevronDown size={14} strokeWidth={2} style={{ flexShrink: 0, transition: 'transform .15s ease', transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 300, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: 6 }}>
          {options.map((opt) => (
            <div key={opt} onClick={() => { onChange(opt); onToggle(); }}
              style={{ padding: '8px 12px', fontSize: 13, borderRadius: 6, cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', transition: 'background .12s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-surface-2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {renderOption ? renderOption(opt, false) : opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EInput({ value, onChange, placeholder, type = 'text', readOnly, prefilled, style: extraStyle }) {
  const [fc, setFc] = useState(false);
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}
      onFocus={() => setFc(true)} onBlur={() => setFc(false)}
      style={{
        width: '100%', padding: '9px 12px', boxSizing: 'border-box',
        border: \`1px solid \${fc ? '#7c7cff' : 'var(--border-default)'}\`,
        borderRadius: 8, fontSize: 14, color: 'var(--text-primary)', outline: 'none',
        fontFamily: 'inherit',
        background: prefilled ? 'var(--bg-surface-2)' : '#fff',
        boxShadow: fc ? '0 0 0 3px rgba(124,124,255,0.1)' : 'none',
        transition: 'border-color .15s ease, box-shadow .15s ease',
        ...extraStyle,
      }}
    />
  );
}

function ETextarea({ value, onChange, placeholder, minHeight = 100 }) {
  const [fc, setFc] = useState(false);
  return (
    <textarea value={value} onChange={onChange} placeholder={placeholder}
      onFocus={() => setFc(true)} onBlur={() => setFc(false)}
      style={{
        width: '100%', padding: '9px 12px', boxSizing: 'border-box',
        border: \`1px solid \${fc ? '#7c7cff' : 'var(--border-default)'}\`,
        borderRadius: 8, fontSize: 14, color: 'var(--text-primary)', outline: 'none',
        fontFamily: 'inherit', minHeight, resize: 'vertical', lineHeight: 1.5,
        boxShadow: fc ? '0 0 0 3px rgba(124,124,255,0.1)' : 'none',
        transition: 'border-color .15s ease, box-shadow .15s ease',
      }}
    />
  );
}

function EL({ children, required }) {
  return <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>{children}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>;
}
`;

const modalStr = `function EditModal({ onClose }) {
  const [fReqTitle, setFReqTitle] = useState('AWS Cloud Migration Consulting Services');
  const [fBizUnit, setFBizUnit] = useState('Engineering'); const [fBizUnitOpen, setFBizUnitOpen] = useState(false);
  const [fRequestorName, setFRequestorName] = useState('David Kim');
  const [fRequestDate, setFRequestDate] = useState('2026-05-31');
  const [fRequiredByDate, setFRequiredByDate] = useState('2026-07-15');
  const [fPriority, setFPriority] = useState('Urgent'); const [fPriorityOpen, setFPriorityOpen] = useState(false);
  const [fProcCategory, setFProcCategory] = useState('Technology and Consulting'); const [fProcCategoryOpen, setFProcCategoryOpen] = useState(false);
  const [fSubcategory, setFSubcategory] = useState('Cloud & Infrastructure Services'); const [fSubcategoryOpen, setFSubcategoryOpen] = useState(false);
  const [fProjectName, setFProjectName] = useState('Infrastructure Modernisation 2026');
  const [fCapexOpex, setFCapexOpex] = useState('OpEx'); const [fCapexOpexOpen, setFCapexOpexOpen] = useState(false);
  const [fJustification, setFJustification] = useState('');
  const [fReqDesc, setFReqDesc] = useState('We require consulting services for migrating our existing on-premise infrastructure to AWS. The engagement should cover assessment, architecture design, migration execution, and post-migration support. Expected team size: 3 senior architects for 6 months.');
  const [fQuantity, setFQuantity] = useState('1');
  const [fUnitValue, setFUnitValue] = useState('45,00,000');
  const [fUom, setFUom] = useState('Resources'); const [fUomOpen, setFUomOpen] = useState(false);
  const [fBudget, setFBudget] = useState('45,00,000');
  const [fCostBreakdown, setFCostBreakdown] = useState('Time & Materials');
  const [fSuggestedVendor, setFSuggestedVendor] = useState('No Preference'); const [fVendorOpen, setFVendorOpen] = useState(false);
  const [fVendorJustification, setFVendorJustification] = useState('');
  const [fContractRef, setFContractRef] = useState('');
  const [fDeliveryLoc, setFDeliveryLoc] = useState('Dubai'); const [fDeliveryOpen, setFDeliveryOpen] = useState(false);
  const [fTimeline, setFTimeline] = useState('Phase 1: Assessment (Month 1-2), Phase 2: Migration (Month 3-5), Phase 3: Support (Month 6)');

  const fBizUnitRef = useRef(null); const fPriorityRef = useRef(null);
  const fProcCatRef = useRef(null); const fSubcatRef = useRef(null);
  const fCapexRef = useRef(null); const fUomRef = useRef(null);
  const fVendorRef = useRef(null); const fDeliveryRef = useRef(null);

  useEffect(() => {
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

  const SL = ({ children }) => <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#bbb', marginBottom: 14, marginTop: 4 }}>{children}</div>;
  const Div = () => <div style={{ borderTop: '1px solid #f0f0f0', margin: '18px 0' }} />;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, width: 720, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={e => e.stopPropagation()}>

        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Edit Requisition Details</div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>PR-2026-011 · AWS Cloud Migration Consulting</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999', display: 'flex', padding: 6, borderRadius: 8 }}><X size={18} /></button>
        </div>

        <div style={{ overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          <SL>General Info</SL>
          <div style={{ marginBottom: 2 }}>
            <EL>Requisition ID</EL>
            <div style={{ padding: '9px 12px', background: '#f5f5f5', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 12, color: '#999', fontStyle: 'italic' }}>Will be auto-generated on submission</div>
          </div>
          <div>
            <EL required>Request Title</EL>
            <EInput value={fReqTitle} onChange={e => setFReqTitle(e.target.value)} placeholder="Short description of what you are requesting" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <EL required>Cost Centre</EL>
              <EDrop refEl={fBizUnitRef} open={fBizUnitOpen} onToggle={() => setFBizUnitOpen(!fBizUnitOpen)} value={fBizUnit} placeholder="Select business unit" options={BIZ_UNITS} onChange={v => setFBizUnit(v)} />
            </div>
            <div>
              <EL required>Requestor Name</EL>
              <EInput value={fRequestorName} onChange={e => setFRequestorName(e.target.value)} prefilled readOnly />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <EL required>Request Date</EL>
              <EInput type="date" value={fRequestDate} onChange={e => setFRequestDate(e.target.value)} />
            </div>
            <div>
              <EL required>Required By Date</EL>
              <EInput type="date" value={fRequiredByDate} onChange={e => setFRequiredByDate(e.target.value)} />
            </div>
          </div>
          <div>
            <EL required>Priority</EL>
            <EDrop refEl={fPriorityRef} open={fPriorityOpen} onToggle={() => setFPriorityOpen(!fPriorityOpen)} value={fPriority} placeholder="Select priority" options={PRIORITIES} onChange={v => setFPriority(v)}
              renderOption={(val) => val ? <span style={{ display: 'flex', alignItems: 'center' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: PRIORITY_DOT[val] || '#ccc', marginRight: 8, flexShrink: 0 }} />{val}</span> : val} />
          </div>

          <Div />
          <SL>Category Info</SL>
          <div>
            <EL required>Procurement Category</EL>
            <EDrop refEl={fProcCatRef} open={fProcCategoryOpen} onToggle={() => setFProcCategoryOpen(!fProcCategoryOpen)} value={fProcCategory} placeholder="Select procurement category" options={PROC_CATEGORIES} onChange={v => { setFProcCategory(v); setFSubcategory(''); }} />
          </div>
          <div>
            <EL required>Spend Category</EL>
            <div style={{ padding: '9px 12px', background: '#f5f5f5', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 14, color: '#666' }}>{spendCategory || '—'}</div>
            <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Auto-selected based on category</div>
          </div>
          <div>
            <EL required>Subcategory</EL>
            <EDrop refEl={fSubcatRef} open={fSubcategoryOpen} onToggle={() => { if (fProcCategory) setFSubcategoryOpen(!fSubcategoryOpen); }} value={fSubcategory} placeholder={fProcCategory ? 'Select subcategory' : 'Select procurement category first'} options={subcatOptions} onChange={v => setFSubcategory(v)} disabled={!fProcCategory} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <EL>Project Name</EL>
              <EInput value={fProjectName} onChange={e => setFProjectName(e.target.value)} placeholder="Linked project name (if applicable)" />
            </div>
            <div>
              <EL required>CapEx / OpEx</EL>
              <EDrop refEl={fCapexRef} open={fCapexOpexOpen} onToggle={() => setFCapexOpexOpen(!fCapexOpexOpen)} value={fCapexOpex} placeholder="Select expense type" options={CAPEX_OPEX_OPTS} onChange={v => setFCapexOpex(v)} />
            </div>
          </div>
          <div>
            <EL>Justification</EL>
            <ETextarea value={fJustification} onChange={e => setFJustification(e.target.value)} placeholder="Provide justification for CapEx/OpEx selection if needed" minHeight={80} />
          </div>

          <Div />
          <SL>Scope Details</SL>
          <div>
            <EL required>Requirement Description</EL>
            <ETextarea value={fReqDesc} onChange={e => setFReqDesc(e.target.value)} placeholder="Describe the full scope..." minHeight={100} />
          </div>

          <Div />
          <SL>Commercials</SL>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <EL required>Quantity</EL>
              <EInput type="number" value={fQuantity} onChange={e => setFQuantity(e.target.value)} placeholder="Enter quantity required" />
              {specificNote}
            </div>
            <div>
              <EL>Estimated Unit Value</EL>
              <EInput value={fUnitValue} onChange={e => setFUnitValue(e.target.value)} placeholder="e.g. 45,000 per unit" />
              {specificNote}
            </div>
          </div>
          <div>
            <EL required>Unit of Measure</EL>
            <EDrop refEl={fUomRef} open={fUomOpen} onToggle={() => setFUomOpen(!fUomOpen)} value={fUom} placeholder="Select unit" options={UOM_OPTS} onChange={v => setFUom(v)} />
            {specificNote}
          </div>
          <div>
            <EL required>Estimated Budget</EL>
            <div style={{ display: 'flex', border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
              <span style={{ padding: '9px 12px', background: '#f5f5f5', fontSize: 14, color: '#999', borderRight: '1px solid #e0e0e0' }}>Rs</span>
              <input type="text" value={fBudget} onChange={e => setFBudget(e.target.value)} placeholder="0.00" style={{ flex: 1, padding: '9px 12px', border: 'none', outline: 'none', fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit', background: '#fff' }} />
            </div>
          </div>
          <div>
            <EL>Pricing Model</EL>
            <ETextarea value={fCostBreakdown} onChange={e => setFCostBreakdown(e.target.value)} placeholder="Describe pricing model — Fixed / T&M / Milestone" minHeight={70} />
          </div>

          <Div />
          <SL>Vendor Info</SL>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <EL>Suggested Vendor</EL>
              <EDrop refEl={fVendorRef} open={fVendorOpen} onToggle={() => setFVendorOpen(!fVendorOpen)} value={fSuggestedVendor} placeholder="Select preferred vendor" options={VENDOR_OPTS} onChange={v => setFSuggestedVendor(v)} />
            </div>
            <div>
              <EL>Contract Reference</EL>
              <EInput value={fContractRef} onChange={e => setFContractRef(e.target.value)} placeholder="Existing contract or renewal reference number" />
            </div>
          </div>
          <div>
            <EL>Vendor Justification</EL>
            <ETextarea value={fVendorJustification} onChange={e => setFVendorJustification(e.target.value)} placeholder="Reason for preferring this vendor" minHeight={70} />
          </div>

          <Div />
          <SL>Execution Details</SL>
          <div>
            <EL required>Delivery Location</EL>
            <EDrop refEl={fDeliveryRef} open={fDeliveryOpen} onToggle={() => setFDeliveryOpen(!fDeliveryOpen)} value={fDeliveryLoc} placeholder="Select delivery location" options={DELIVERY_LOCS} onChange={v => setFDeliveryLoc(v)} />
            {specificNote}
          </div>
          <div>
            <EL>Timeline</EL>
            <ETextarea value={fTimeline} onChange={e => setFTimeline(e.target.value)} placeholder="Describe phased delivery plan and key milestones" minHeight={80} />
            {specificNote}
          </div>

        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #e8e8e8', display: 'flex', justifyContent: 'flex-end', gap: 10, flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: '9px 20px', border: '1px solid #e0e0e0', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#4a4a4a', fontFamily: 'inherit' }}>Cancel</button>
          <button onClick={onClose} style={{ padding: '9px 24px', border: 'none', borderRadius: 8, background: '#0052cc', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'inherit' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}`;

// Find EditModal
const startIndex = content.indexOf('// Edit Details Modal');
const endIndex = content.indexOf('export default function PRDetailFresh');

if (startIndex > -1 && endIndex > -1) {
  content = content.substring(0, startIndex) + consts + '\n' + modalStr + '\n\n' + content.substring(endIndex);
} else {
  console.log('Could not find EditModal or PRDetailFresh export.');
}

fs.writeFileSync('src/pages/PRDetailFresh.jsx', content);
