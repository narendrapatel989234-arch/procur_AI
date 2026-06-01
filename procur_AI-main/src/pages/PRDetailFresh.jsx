import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../layouts/Sidebar.jsx';
import { ArrowLeft, Download, Sparkles, User, CheckCircle, Lock, ChevronRight, X, Brain, GitBranch, ShieldCheck, Banknote, Scale, PackageCheck, UserCheck, Zap, Pencil, Calendar, Building, Tag, MapPin, ChevronDown, Upload } from 'lucide-react';

const ICONS = { User, Sparkles, GitBranch, Banknote, Scale, Zap, ShieldCheck, PackageCheck, UserCheck, CheckCircle };

const REASONING_MAP = {
  1: ['Reading uploaded PR document', 'Extracting 21 procurement fields', '14 fields auto-extracted with high confidence', 'Creating document folder in SharePoint', 'Linking PR metadata to folder'],
  2: ['Analysing spend value: Rs 45,00,000', 'Threshold check: exceeds Rs 10L complex limit', 'Multi-phase engagement detected', 'Decision: Complex procurement'],
  3: ['Budget nature: ongoing operational spend', 'No capital asset creation involved', 'Decision: OpEx'],
  4: ['Category: Technology and Consulting', 'Not directly linked to production output', 'Decision: Indirect Spend'],
  5: ['PR classified as Complex', 'Value above threshold - manager approval required', 'Routing to: Sarah Chen (L2 approver)', 'SLA target: 15 July 2026'],
  6: ['Queried vendor database: 847 vendors', 'Filtered by category: Technology Consulting', 'Applied location filter: Dubai / UAE', '5 vendors shortlisted by confidence score'],
  7: ['Approved budget for Engineering: Rs 60,00,000', 'PR value: Rs 45,00,000', 'Remaining headroom: Rs 15,00,000', 'Budget check: PASSED'],
  8: ['Cost centre ENG-402 validated', 'CapEx/OpEx classification confirmed: OpEx', 'Finance policy check: PASSED'],
  9: ['Vendor compliance status: all 5 vendors active', 'Policy 4.2 check: RFP required for complex', 'No regulatory flags found', 'Compliance check: PASSED'],
  10: ['Vendor finalized: TechDirect India', 'PO line items generated from PR fields', 'PO value: Rs 45,00,000', 'ERP sync: queued'],
};

const INITIAL_NODES = [
  { id: 0, type: 'user', status: 'complete', title: 'PR Submitted', actor: 'David Kim', timestamp: 'Just now', icon: 'User' },
  { id: 1, type: 'ai', status: 'waiting', title: 'AI Extraction & Folder Creation', actor: 'AI Agent', timestamp: null, icon: 'Sparkles' },
  { id: 2, type: 'ai', status: 'waiting', title: 'Routine / Complex', actor: 'AI Agent', timestamp: null, icon: 'GitBranch' },
  { id: 3, type: 'ai', status: 'waiting', title: 'CapEx / OpEx', actor: 'AI Agent', timestamp: null, icon: 'Banknote' },
  { id: 4, type: 'ai', status: 'waiting', title: 'Direct / Indirect', actor: 'AI Agent', timestamp: null, icon: 'Scale' },
  { id: 5, type: 'ai', status: 'waiting', title: 'Routing Decision', actor: 'AI Agent', timestamp: null, icon: 'GitBranch' },
  { id: 6, type: 'ai', status: 'waiting', title: 'Vendor Identification', actor: 'AI Agent', timestamp: null, icon: 'Sparkles' },
  { id: 7, type: 'ai', status: 'waiting', title: 'Budget Check', actor: 'AI Agent', timestamp: null, icon: 'Banknote' },
  { id: 8, type: 'ai', status: 'waiting', title: 'Finance Validation', actor: 'AI Agent', timestamp: null, icon: 'Zap' },
  { id: 9, type: 'ai', status: 'waiting', title: 'Compliance Check', actor: 'AI Agent', timestamp: null, icon: 'ShieldCheck' },
  { id: 10, type: 'ai', status: 'waiting', title: 'PO Generated', actor: 'AI Agent', timestamp: null, icon: 'PackageCheck' },
  { id: 11, type: 'pending_user', status: 'waiting', title: 'Manager Approval', actor: 'Sarah Chen', timestamp: null, icon: 'UserCheck' },
  { id: 12, type: 'system', status: 'waiting', title: 'PO Issued', actor: 'System', timestamp: null, icon: 'CheckCircle' },
];

// Status badge config
const STATUS_CONFIG = {
  'Submitted': { bg: '#e8f1fb', color: '#0052cc' },
  'In Review': { bg: '#fff3e0', color: '#e65100' },
  'Classifying': { bg: '#ede9fe', color: '#6d28d9' },
  'Routing': { bg: '#fdf4ff', color: '#a21caf' },
  'In Validation': { bg: '#fff3e0', color: '#e65100' },
  'Compliance Check': { bg: '#fdf4ff', color: '#a21caf' },
  'PO Generated': { bg: '#ecfdf5', color: '#065f46' },
  'Approval Pending': { bg: '#fff7ed', color: '#b45309' },
};

function NodeCard({ node, onNodeClick }) {
  if (!node) return null;
  const isAI = node.type === 'ai';
  const isClickable = isAI && (node.status === 'complete' || node.status === 'active');

  let bg = '#f0f0f3', border = '1px dashed #d5d5d5', borderTop = 'none', shadow = 'none', opacity = 0.6;
  let iconBg = 'rgba(124,124,255,0.07)', iconColor = '#aaa', iconAnim = 'none';
  let badgeBg = '#e8e8eb', badgeColor = '#999', badgeText = 'QUEUED', timeText = null;

  if (node.status === 'active') {
    bg = '#fff'; border = '1.5px solid #7c7cff'; borderTop = '1.5px solid #7c7cff';
    shadow = '0 0 0 3px rgba(124,124,255,0.1)'; opacity = 1;
    iconBg = 'linear-gradient(135deg, rgba(0,82,204,0.15), rgba(124,124,255,0.2))';
    iconColor = '#7c7cff'; iconAnim = 'pulseRing 1.5s ease-in-out infinite';
    badgeBg = 'rgba(124,124,255,0.1)'; badgeColor = '#5b5bd6'; badgeText = 'RUNNING'; timeText = 'Processing...';
  } else if (node.status === 'complete') {
    bg = '#fff'; opacity = 1; shadow = '0 1px 4px rgba(14,15,37,0.06)';
    if (isAI) { border = '1px solid rgba(124,124,255,0.2)'; borderTop = '3px solid #7c7cff'; iconBg = 'linear-gradient(135deg, #0052cc, #7c7cff)'; iconColor = '#fff'; }
    else if (node.type === 'user') { border = '1px solid rgba(34,197,94,0.2)'; borderTop = '3px solid #22c55e'; iconBg = 'linear-gradient(135deg, #22c55e, #16a34a)'; iconColor = '#fff'; }
    else { border = '1px solid rgba(34,197,94,0.2)'; borderTop = '3px solid #22c55e'; iconBg = '#22c55e'; iconColor = '#fff'; }
    badgeBg = 'rgba(34,197,94,0.08)'; badgeColor = '#15803d'; badgeText = 'DONE'; timeText = node.timestamp || 'Just now';
  } else if (node.status === 'pending_user') {
    bg = '#fffbf0'; border = '1.5px solid #f59e0b'; borderTop = '3px solid #f59e0b'; opacity = 1;
    shadow = '0 2px 12px rgba(245,158,11,0.15)';
    iconBg = 'linear-gradient(135deg, #f59e0b, #d97706)'; iconColor = '#fff';
    badgeBg = 'rgba(245,158,11,0.15)'; badgeColor = '#b45309'; badgeText = 'AWAITING'; timeText = 'Awaiting action';
  }

  const Ic = ICONS[node.icon] || User;
  return (
    <div onClick={() => isClickable && onNodeClick && onNodeClick(node)} style={{
      width: 158, minHeight: 160, borderRadius: 12, padding: '14px 12px 12px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0,
      background: bg, border, borderTop, boxShadow: shadow, opacity,
      transition: 'all 0.35s ease', cursor: isClickable ? 'pointer' : 'default',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: iconAnim }}>
          <Ic size={16} color={iconColor} strokeWidth={2} />
        </div>
        {isClickable && <ChevronRight size={11} color="#bbb" />}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: node.status === 'waiting' ? '#bbb' : '#1a1a1a', lineHeight: 1.35, marginTop: 4 }}>{node.title}</div>
      <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 10, color: node.status === 'pending_user' ? '#92400e' : '#999' }}>{node.actor}</div>
        {timeText && <div style={{ fontSize: 10, color: node.status === 'pending_user' ? '#b45309' : '#999' }}>{timeText}</div>}
        <div style={{ background: badgeBg, color: badgeColor, borderRadius: 20, padding: '3px 8px', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', display: 'inline-flex', alignSelf: 'flex-start', marginTop: 6 }}>{badgeText}</div>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div style={{ width: 48, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', position: 'relative' }}>
      <div style={{ width: 36, height: 2, background: 'linear-gradient(90deg, #c8c8d8, #a8a8be)', borderRadius: 2 }} />
      <div style={{ position: 'absolute', right: 2, width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #a8a8be' }} />
    </div>
  );
}


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
          border: `1px solid ${open ? '#7c7cff' : 'var(--border-default)'}`,
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
        border: `1px solid ${fc ? '#7c7cff' : 'var(--border-default)'}`,
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
        border: `1px solid ${fc ? '#7c7cff' : 'var(--border-default)'}`,
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

function EditModal({ onClose, onSave }) {
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

  const SL = ({ children }) => <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#bbb', marginBottom: 14 }}>{children}</div>;
  const Div = () => <div style={{ borderTop: '1px solid #f0f0f0', margin: '10px 0' }} />;

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

        <div style={{ overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 10 }}>

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
          <div>
            <EL>Attachments</EL>
            <div style={{
              border: '2px dashed #e0e0e0', borderRadius: 10, padding: '16px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              cursor: 'pointer', background: '#fafafa', transition: 'border-color 0.15s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#7c7cff'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e0e0e0'}
              onClick={() => document.getElementById('edit-modal-file-input').click()}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(124,124,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload size={16} color="#7c7cff" strokeWidth={2} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>Drop files or click to upload</div>
              <div style={{ fontSize: 12, color: '#999' }}>PDF, DOCX, XLSX · Max 25MB</div>
            </div>
            <input id="edit-modal-file-input" type="file" accept=".pdf,.docx,.xlsx" style={{ display: 'none' }} />
            <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Existing attachment: Q3_Procurement_Requirements.pdf</div>
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
          <button onClick={onSave} style={{ padding: '9px 24px', border: 'none', borderRadius: 8, background: '#0052cc', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'inherit' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default function PRDetailFresh({ onNavigate }) {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [selectedNode, setSelectedNode] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [prStatus, setPrStatus] = useState('Submitted');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const upd = (ids, status) => {
    setNodes(prev => prev.map(n => ids.includes(n.id) ? { ...n, status, timestamp: 'Just now' } : n));
  };

  useEffect(() => {
    const T = [
      setTimeout(() => { upd([1], 'active'); setPrStatus('In Review'); }, 1500),
      setTimeout(() => upd([1], 'complete'), 4000),
      setTimeout(() => { upd([2, 3, 4], 'active'); setPrStatus('Classifying'); }, 4500),
      setTimeout(() => upd([2, 3, 4], 'complete'), 7500),
      setTimeout(() => { upd([5], 'active'); setPrStatus('Routing'); }, 8000),
      setTimeout(() => upd([5], 'complete'), 10500),
      setTimeout(() => { upd([6, 7, 8], 'active'); setPrStatus('In Validation'); }, 11000),
      setTimeout(() => upd([6, 7, 8], 'complete'), 15000),
      setTimeout(() => { upd([9], 'active'); setPrStatus('Compliance Check'); }, 15500),
      setTimeout(() => upd([9], 'complete'), 18000),
      setTimeout(() => { upd([10], 'active'); setPrStatus('PO Generated'); }, 18500),
      setTimeout(() => upd([10], 'complete'), 21000),
      setTimeout(() => { upd([11], 'pending_user'); setPrStatus('Approval Pending'); }, 21500),
    ];
    return () => T.forEach(clearTimeout);
  }, []);

  const g = (id) => nodes.find(n => n.id === id);
  const handleNodeClick = (nd) => { setSelectedNode(nd); setPanelOpen(true); };
  const statusCfg = STATUS_CONFIG[prStatus] || { bg: '#e8f1fb', color: '#0052cc' };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes pulseRing { 0%,100%{box-shadow:0 0 0 0 rgba(124,124,255,0.4)} 50%{box-shadow:0 0 0 8px rgba(124,124,255,0)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(-12px) } to { opacity: 1; transform: translateX(-50%) translateY(0) } }
      `}</style>

      {showSaveToast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          zIndex: 1000, background: '#f0fdf4',
          border: '1px solid rgba(34,197,94,0.25)',
          borderLeft: '4px solid #22c55e',
          borderRadius: 12, padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 8px 32px rgba(14,15,37,0.1)',
          minWidth: 340, animation: 'toastIn 0.2s ease forwards',
        }}>
          <CheckCircle size={20} color="#22c55e" strokeWidth={2} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>Changes saved successfully</div>
            <div style={{ fontSize: 12, color: '#166534', marginTop: 2 }}>Requisition details have been updated.</div>
          </div>
          <button onClick={() => setShowSaveToast(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(21,128,61,0.5)', display: 'flex', padding: 2, borderRadius: 4 }}>
            <X size={16} />
          </button>
        </div>
      )}

      {showEditModal && <EditModal onClose={() => setShowEditModal(false)} onSave={() => { setShowEditModal(false); setShowSaveToast(true); setTimeout(() => setShowSaveToast(false), 3000); }} />}

      <Sidebar activeNav="Requests" onNavigate={onNavigate} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fff' }}>

        {/* TOP BAR */}
        <div style={{ height: 56, minHeight: 56, flexShrink: 0, background: '#fff', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowLeft size={18} color="#999" style={{ cursor: 'pointer' }} onClick={() => onNavigate('Requests')} />
            <span style={{ fontSize: 13, color: '#999', cursor: 'pointer' }} onClick={() => onNavigate('Requests')}>Requests</span>
            <ChevronRight size={14} color="#ccc" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>PR-2026-011</span>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: '7px 14px', fontSize: 13, color: '#1a1a1a', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            <Download size={14} /> Export
          </button>
        </div>

        {/* HEADER */}
        <div style={{ padding: '16px 24px 0', background: '#fff', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>AWS Cloud Migration Consulting</div>
            <div style={{ background: statusCfg.bg, color: statusCfg.color, borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 600, transition: 'all 0.4s ease' }}>{prStatus}</div>
          </div>
          <div style={{ fontSize: 13, color: '#999', display: 'flex', gap: 8 }}>
            <span>David Kim</span><span>·</span><span>Created Today</span><span>·</span><span>Engineering</span><span>·</span><span>Technology and Consulting</span>
          </div>
        </div>

        {/* TABS */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 24px', display: 'flex', flexShrink: 0, marginTop: 12 }}>
          {['Overview', 'Sourcing', 'Proposals', 'Evaluation', 'SoW & Contract', 'Purchase Order'].map((tab, i) => (
            <div key={tab} style={{ padding: '13px 16px', fontSize: 13, fontWeight: i === 0 ? 600 : 500, borderBottom: i === 0 ? '2px solid #7c7cff' : 'none', color: i === 0 ? '#3d3db8' : '#aaa', cursor: i === 0 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 5 }}>
              {tab}{i > 0 && <Lock size={11} />}
            </div>
          ))}
        </div>

        {/* BODY */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

          {/* MAIN */}
          <div style={{ flex: 1, overflowY: 'auto', background: '#f5f5f7', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* WORKFLOW */}
            <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 14, flexShrink: 0 }}>
              <div style={{ padding: '13px 20px', borderBottom: '1px solid #e5e5e5', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#999' }}>
                PROCUREMENT WORKFLOW
              </div>
              <div style={{ padding: '28px 32px', overflowX: 'auto', background: '#f8f8fc', backgroundImage: 'radial-gradient(circle, #d0d0e0 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: 'max-content', minHeight: 180 }}>
                  <NodeCard node={g(0)} onNodeClick={handleNodeClick} />
                  <Arrow />
                  <NodeCard node={g(1)} onNodeClick={handleNodeClick} />
                  <Arrow />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignSelf: 'center' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#bbb', paddingLeft: 2 }}>PARALLEL</div>
                    <NodeCard node={g(2)} onNodeClick={handleNodeClick} />
                    <NodeCard node={g(3)} onNodeClick={handleNodeClick} />
                    <NodeCard node={g(4)} onNodeClick={handleNodeClick} />
                  </div>
                  <Arrow />
                  <NodeCard node={g(5)} onNodeClick={handleNodeClick} />
                  <Arrow />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignSelf: 'center' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#bbb', paddingLeft: 2 }}>PARALLEL</div>
                    <NodeCard node={g(6)} onNodeClick={handleNodeClick} />
                    <NodeCard node={g(7)} onNodeClick={handleNodeClick} />
                    <NodeCard node={g(8)} onNodeClick={handleNodeClick} />
                  </div>
                  <Arrow />
                  <NodeCard node={g(9)} onNodeClick={handleNodeClick} />
                  <Arrow />
                  <NodeCard node={g(10)} onNodeClick={handleNodeClick} />
                  <Arrow />
                  <NodeCard node={g(11)} onNodeClick={handleNodeClick} />
                  <Arrow />
                  <NodeCard node={g(12)} onNodeClick={handleNodeClick} />
                </div>
              </div>
            </div>

            {/* REQUISITION DETAILS */}
            <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 14, padding: '20px 24px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#999' }}>REQUISITION DETAILS</div>
                  <div style={{ fontSize: 12, color: '#999' }}>Submitted Just now</div>
                </div>
                <button
                  onClick={() => setShowEditModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid rgba(0,82,204,0.3)', borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 500, color: '#0052cc', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,82,204,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  <Pencil size={12} strokeWidth={2} />
                  Edit Details
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px 0' }}>
                {[
                  ['Request Title', 'AWS Cloud Migration Consulting Services'],
                  ['Procurement Category', 'Technology and Consulting'],
                  ['Subcategory', 'Cloud & Infrastructure Services'],
                  ['Spend Category', 'Indirect Spend'],
                  ['Cost Centre', 'Engineering'],
                  ['CapEx / OpEx', 'OpEx'],
                  ['Estimated Budget', 'Rs 45,00,000'],
                  ['Quantity', '1'],
                  ['Unit of Measure', 'Resources'],
                  ['Required By Date', '15 July 2026'],
                  ['Delivery Location', 'Dubai'],
                  ['Suggested Vendor', 'Open to sourcing'],
                  ['Project Name', 'Infrastructure Modernisation 2026'],
                ].map(([label, value]) => (
                  <React.Fragment key={label}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#4a4a4a', paddingRight: 16 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{value}</div>
                  </React.Fragment>
                ))}
                <div style={{ fontSize: 13, fontWeight: 500, color: '#4a4a4a', paddingRight: 16 }}>Priority</div>
                <div><span style={{ background: 'rgba(245,158,11,0.1)', color: '#b45309', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>Urgent</span></div>
              </div>
              <div style={{ height: 1, background: '#e5e5e5', margin: '16px 0' }} />
              <div style={{ fontSize: 12, fontWeight: 600, color: '#999', marginBottom: 6 }}>Requirement Description</div>
              <div style={{ fontSize: 13, color: '#1a1a1a', lineHeight: 1.6 }}>
                We require consulting services for migrating our existing on-premise infrastructure to AWS. The engagement should cover assessment, architecture design, migration execution, and post-migration support. Expected team size: 3 senior architects for 6 months.
              </div>
            </div>
          </div>

          {/* REASONING PANEL */}
          <div style={{ width: panelOpen ? 300 : 0, flexShrink: 0, borderLeft: panelOpen ? '1px solid #e5e5e5' : 'none', overflow: 'hidden', transition: 'width 0.25s ease', background: '#fff', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 300, display: 'flex', flexDirection: 'column', height: '100%' }}>

              {/* Header — NO borderBottom */}
              <div style={{ padding: '16px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Brain size={16} color="#7c7cff" />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>AI Reasoning</span>
                </div>
                <button onClick={() => { setPanelOpen(false); setSelectedNode(null); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999', display: 'flex', padding: 4, borderRadius: 6 }}>
                  <X size={16} />
                </button>
              </div>

              {/* Node info — no border, no divider */}
              {selectedNode && (
                <div style={{ padding: '0 20px 10px', flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{selectedNode.title}</div>
                  <div style={{ fontSize: 11, color: '#999', marginTop: 3 }}>{selectedNode.timestamp || 'Processing...'}</div>
                </div>
              )}

              {/* Steps label — NO divider above it */}
              <div style={{ padding: '0 20px 10px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#bbb' }}>REASONING STEPS</div>

              {/* Steps */}
              <div key={selectedNode?.id} style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(REASONING_MAP[selectedNode?.id] || []).map((step, i) => (
                  <div key={i} style={{ background: '#fafafa', border: '1px solid #ebebeb', borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 8, animation: 'fadeInUp 0.3s ease forwards', animationDelay: `${i * 0.07}s`, opacity: 0 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#7c7cff', flexShrink: 0, marginTop: 5 }} />
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#4a4a4a', lineHeight: 1.5 }}>{step}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}