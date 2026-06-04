import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, Sparkles, User, CheckCircle, Lock, ChevronRight, X, Brain, GitBranch, ShieldCheck, Banknote, Scale, PackageCheck, UserCheck, Zap, Pencil, Calendar, Building, Tag, MapPin, ChevronDown, Upload, Eye, FileText, Send, Mic, Paperclip, Copy, ThumbsUp, ThumbsDown, RotateCcw, Edit2, MoreHorizontal, Pin, PinOff, Share2, Trash2 } from 'lucide-react';

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
        background: prefilled ? '#f5f5f5' : '#ffffff', backgroundColor: '#ffffff',
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

const SL = ({ children }) => <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#bbb', marginBottom: 14 }}>{children}</div>;
const Div = () => <div style={{ borderTop: '1px solid #f0f0f0', margin: '10px 0' }} />;

export function EditModal({ onClose, onSave }) {
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

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}>
      <style>{`
        .edit-modal-input-fix input, .edit-modal-input-fix textarea {
          background-color: #ffffff !important;
          color: #1a1a1a !important;
        }
      `}</style>
      <div className="edit-modal-input-fix" style={{ background: '#fff', borderRadius: 16, width: 720, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
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

export default function PRDetailFresh({ onNavigate, userRole, navState }) {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [selectedNode, setSelectedNode] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [prStatus, setPrStatus] = useState('Submitted');
  const [showEditModal, setShowEditModal] = useState(navState?.openEditPopup || false);
  const [saveToast, setSaveToast] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showApproveToast, setShowApproveToast] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');
  const [showPoEditModal, setShowPoEditModal] = useState(false);
  const [showPoPreview, setShowPoPreview] = useState(false);

  const [chatPaneOpen, setChatPaneOpen] = useState(navState?.openChatPane || false);
  const [chatMenuOpen, setChatMenuOpen] = useState(false);
  const [chatMenuPinned, setChatMenuPinned] = useState(false);
  const chatMenuRef = useRef(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'user', text: 'Summarise the PO for me' },
    { role: 'status' },
    { role: 'ai', text: 'PO-2026-00412 is for AWS Cloud Migration Consulting Services with Accenture Middle East. Total value: ₹45,00,000. Engagement covers 3 senior architects for 6 months across assessment, migration and support phases. Terms: Technology & Consulting. Awaiting approval from Sarah Chen.' }
  ]);
  const chatInputRef = useRef(null);
  const [chatCopiedMsgs, setChatCopiedMsgs] = useState(new Set());
  const [chatLikedMsgs, setChatLikedMsgs] = useState(new Set());
  const [chatDislikedMsgs, setChatDislikedMsgs] = useState(new Set());
  const [chatRegeneratingMsgs, setChatRegeneratingMsgs] = useState(new Set());
  const [chatHoveredUserMsg, setChatHoveredUserMsg] = useState(null);
  const chatScrollRef = useRef(null);
  const [chatLikedTooltipVisible, setChatLikedTooltipVisible] = useState(new Set());
  const [chatDislikedTooltipVisible, setChatDislikedTooltipVisible] = useState(new Set());
  const chatTooltipTimers = useRef(new Set());
  const [chatShowReasoningPanel, setChatShowReasoningPanel] = useState(false);
  const [chatReasoningComplete, setChatReasoningComplete] = useState(true);

  // PO form fields
  // PO form fields
  const [poLogoFile, setPoLogoFile] = useState(null);
  const poLogoInputRef = useRef(null);
  const [poAddress, setPoAddress] = useState('DDAIS Group\nProcurement Division\nDubai Internet City, Building 17\nDubai, UAE');
  const [poSupplierName, setPoSupplierName] = useState('Accenture Middle East');
  const [poSupplierAddress, setPoSupplierAddress] = useState('Accenture Middle East LLC\nAlSalam Tower, 34th Floor\nDubai, UAE');
  const [poSupplierContact, setPoSupplierContact] = useState('+971 4 278 5000');
  const [poBuyerName, setPoBuyerName] = useState('David Kim');
  const [poTermsCategory, setPoTermsCategory] = useState('Technology and Consulting');
  const [poTermsCategoryOpen, setPoTermsCategoryOpen] = useState(false);
  const [poIssueDate, setPoIssueDate] = useState('2026-05-31');
  const [poChangeNo, setPoChangeNo] = useState('0');
  const [poInstructions, setPoInstructions] = useState('Please deliver all services as per the agreed Statement of Work. Engagement to commence on 01 June 2026.');
  const [poNumber, setPoNumber] = useState('PO-2026-00412');
  const [poSpecialInstructions, setPoSpecialInstructions] = useState('• All invoices must reference the PO number.\n• Invoices to be submitted monthly by the 25th.\n• Work may not commence without a signed copy of this PO.\n• Any changes to scope must be approved in writing.');
  const [poTermsConditions, setPoTermsConditions] = useState('• Payment terms: Net 30 days from invoice date.\n• All work must comply with DDAIS Group vendor code of conduct.\n• The supplier shall maintain ISO 27001 certification throughout the engagement.\n• Disputes to be resolved under UAE jurisdiction.\n• This PO is subject to DDAIS Group standard procurement policy v4.2.');

  // PO line items
  const [poLineItems, setPoLineItems] = useState([
    { ln: '1', matCode: 'DDD-NONCOD72415-1 (DDD-C24010)', prTaskNo: 'ADI23000727-2 / E00001-E01', prItem: 'N1', description: 'AWS Cloud Migration Consulting Services — Assessment, architecture design, migration execution and post-migration support as per agreed SOW', uom: 'Resources', quantity: '1', unitPrice: '45,00,000.00', amount: '45,00,000.00', delDate: '15-Jul-2026' },
  ]);

  const poTermsCatRef = useRef(null);

  useEffect(() => {
    function h(e) {
      if (poTermsCatRef.current && !poTermsCatRef.current.contains(e.target)) setPoTermsCategoryOpen(false);
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

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

  useEffect(() => {
    if (!chatMenuOpen) return;
    function handler(e) {
      if (chatMenuRef.current && !chatMenuRef.current.contains(e.target)) setChatMenuOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [chatMenuOpen]);

  const g = (id) => nodes.find(n => n.id === id);
  const handleNodeClick = (nd) => { setSelectedNode(nd); setPanelOpen(true); };
  const statusCfg = STATUS_CONFIG[prStatus] || { bg: '#e8f1fb', color: '#0052cc' };

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes pulseRing { 0%,100%{box-shadow:0 0 0 0 rgba(124,124,255,0.4)} 50%{box-shadow:0 0 0 8px rgba(124,124,255,0)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(-12px) } to { opacity: 1; transform: translateX(-50%) translateY(0) } }
        @keyframes chatSpinOnce { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes chatFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes textShimmer { 0% { opacity: 1 } 50% { opacity: 0.4 } 100% { opacity: 1 } }
      `}</style>

      {showApproveModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowApproveModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 500, maxWidth: '90vw', padding: '40px 36px', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,82,204,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0052cc', marginBottom: 6 }}>
              <CheckCircle size={24} strokeWidth={2} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>Approve Purchase Order?</div>
            <div style={{ fontSize: 13, color: '#666', lineHeight: 1.6, marginBottom: 8 }}>Approving this PO will issue it to the supplier and mark it as active in the system. Make sure all details have been reviewed before proceeding.</div>
            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <button onClick={() => setShowApproveModal(false)} style={{ flex: 1, padding: '11px', border: '1px solid #e0e0e0', borderRadius: 10, background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#4a4a4a', fontFamily: 'inherit' }}>Cancel</button>
              <button
                onClick={() => { setShowApproveModal(false); setShowApproveToast(true); setTimeout(() => setShowApproveToast(false), 4000); }}
                style={{ flex: 1, padding: '11px', border: 'none', borderRadius: 10, background: '#0052cc', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.background = '#0041a3'}
                onMouseLeave={e => e.currentTarget.style.background = '#0052cc'}
              >Approve PO</button>
            </div>
          </div>
        </div>
      )}

      {showApproveToast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: '#f0fdf4', border: '1px solid rgba(34,197,94,0.25)', borderLeft: '4px solid #22c55e', borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 32px rgba(14,15,37,0.1)', minWidth: 340, animation: 'toastIn 0.2s ease forwards' }}>
          <CheckCircle size={20} color="#22c55e" strokeWidth={2} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>Purchase Order Approved</div>
            <div style={{ fontSize: 12, color: '#166534', marginTop: 2 }}>{poNumber} has been approved and issued to the supplier.</div>
          </div>
          <button onClick={() => setShowApproveToast(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(21,128,61,0.5)', display: 'flex' }}><X size={16} /></button>
        </div>
      )}

      {saveToast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: '#f0fdf4', border: '1px solid rgba(34,197,94,0.25)', borderLeft: '4px solid #22c55e', borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 32px rgba(14,15,37,0.1)', minWidth: 340, animation: 'toastIn 0.2s ease forwards' }}>
          <CheckCircle size={20} color="#22c55e" strokeWidth={2} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>{saveToast.title}</div>
            <div style={{ fontSize: 12, color: '#166534', marginTop: 2 }}>{saveToast.subtext}</div>
          </div>
          <button onClick={() => setSaveToast(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(21,128,61,0.5)', display: 'flex', padding: 2, borderRadius: 4 }}>
            <X size={16} />
          </button>
        </div>
      )}

      {showEditModal && <EditModal onClose={() => setShowEditModal(false)} onSave={() => { setShowEditModal(false); setSaveToast({ title: 'Changes saved successfully', subtext: 'Requisition details have been updated.' }); setTimeout(() => setSaveToast(null), 3000); }} />}



      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fff' }}>

        {/* TOP BAR */}
        <div style={{ height: 56, minHeight: 56, flexShrink: 0, background: '#fff', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowLeft size={18} color="#999" style={{ cursor: 'pointer' }} onClick={() => onNavigate('Dashboard')} />
            <span style={{ fontSize: 13, color: '#999', cursor: 'pointer' }} onClick={() => onNavigate('Dashboard')}>Dashboard</span>
            <ChevronRight size={14} color="#ccc" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>PR-2026-011</span>
          </div>
          <button onClick={() => setChatPaneOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'linear-gradient(135deg, #0052cc, #7c7cff)', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 3px 12px rgba(0,82,204,0.3)', transition: 'all 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,82,204,0.45)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,82,204,0.3)'}>
            <Sparkles size={14} strokeWidth={2} /> AI Chat
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
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'po', label: 'Purchase Order' },
            { id: 'invoices', label: 'Invoices' },
            { id: 'activities', label: 'Activities' },
          ].map(tab => (
            <div key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '13px 16px', fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 500, borderBottom: activeTab === tab.id ? '2px solid #7c7cff' : '2px solid transparent', color: activeTab === tab.id ? '#3d3db8' : '#999', cursor: 'pointer', transition: 'all 0.15s ease' }}>
              {tab.label}
            </div>
          ))}
        </div>

        {/* BODY */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

          {activeTab === 'overview' && (
            <>
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
                      Edit PR Details
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
                      ['Justification', 'Required for modernising backend systems'],
                      ['Contract Reference', 'N/A'],
                      ['Pricing Model', 'Time & Materials'],
                      ['Timeline', '6 Months'],
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
                  <div style={{ height: 1, background: '#e5e5e5', margin: '16px 0' }} />
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#999', marginBottom: 12 }}>Attachments</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: 8, background: '#fcfcfc', cursor: 'pointer' }}>
                      <FileText size={16} color="#0052cc" />
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>Q3_Procurement_Requirements.pdf</span>
                    </div>
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
            </>
          )}

          {activeTab === 'po' && (
            <div style={{ flex: 1, overflowY: 'auto', background: '#f5f5f7', padding: 24 }}>

              {/* ACTION BAR */}
              <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Left: PO doc identity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,82,204,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={18} color="#0052cc" strokeWidth={1.8} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>Purchase Order</div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#0052cc', fontWeight: 600 }}>{poNumber}</span>
                      <span>·</span>
                      <span>AI-generated</span>
                      <span>·</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, background: 'rgba(245,158,11,0.1)', color: '#b45309', fontSize: 11, fontWeight: 600 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#b45309' }} />
                        Awaiting Approval
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: CTAs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => setShowPoPreview(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: '1px solid var(--border-default)', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'inherit', transition: 'all 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <Eye size={14} /> Preview
                  </button>
                  <button onClick={() => setShowPoEditModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: '1px solid rgba(0,82,204,0.3)', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#0052cc', fontFamily: 'inherit', transition: 'all 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,82,204,0.04)'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <Pencil size={13} strokeWidth={2} /> Edit
                  </button>
                  {userRole === 'manager' && (
                    <button onClick={() => setShowApproveModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', border: 'none', borderRadius: 8, background: '#0052cc', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'inherit', boxShadow: '0 3px 12px rgba(0,82,204,0.25)', transition: 'all 0.15s ease' }} onMouseEnter={e => { e.currentTarget.style.background = '#003fa3'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,82,204,0.35)'; }} onMouseLeave={e => { e.currentTarget.style.background = '#0052cc'; e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,82,204,0.25)'; }}>
                      <CheckCircle size={14} /> Approve PO
                    </button>
                  )}
                </div>
              </div>

              <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 14, padding: '20px 24px' }}>

                {/* ── BUYER INFO ── */}
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#bbb', marginBottom: 14 }}>BUYER INFORMATION</div>

                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '14px 0', marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#4a4a4a', paddingRight: 16, display: 'flex', alignItems: 'center' }}>Company Logo</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #0d1f3c, #0052cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: '-0.5px' }}>DD</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0d1f3c' }}>DDAIS Group</div>
                        <div style={{ fontSize: 11, color: '#999' }}>Procurement Division</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 500, color: '#4a4a4a', paddingRight: 16 }}>Company Address</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', whiteSpace: 'pre-line', lineHeight: 1.7 }}>{poAddress}</div>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 500, color: '#4a4a4a', paddingRight: 16 }}>Buyer Name</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{poBuyerName}</div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f0f0f0', margin: '4px 0 20px' }} />

                {/* ── SUPPLIER INFO ── */}
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#bbb', marginBottom: 14 }}>SUPPLIER INFORMATION</div>

                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '14px 0', marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#4a4a4a', paddingRight: 16 }}>Supplier Name</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{poSupplierName}</div>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 500, color: '#4a4a4a', paddingRight: 16 }}>Supplier Address</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', whiteSpace: 'pre-line', lineHeight: 1.7 }}>{poSupplierAddress}</div>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 500, color: '#4a4a4a', paddingRight: 16 }}>Supplier Contact No.</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{poSupplierContact}</div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f0f0f0', margin: '4px 0 20px' }} />

                {/* ── PO META ── */}
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#bbb', marginBottom: 14 }}>PO DETAILS</div>

                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '14px 0', marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#4a4a4a', paddingRight: 16 }}>PO Number</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0052cc' }}>{poNumber}</div>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 500, color: '#4a4a4a', paddingRight: 16 }}>Issue Date</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{poIssueDate}</div>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 500, color: '#4a4a4a', paddingRight: 16 }}>Change No.</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{poChangeNo}</div>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 500, color: '#4a4a4a', paddingRight: 16 }}>Terms (Category)</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{poTermsCategory}</div>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 500, color: '#4a4a4a', paddingRight: 16 }}>Instructions</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.7 }}>{poInstructions}</div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f0f0f0', margin: '4px 0 20px' }} />

                {/* ── LINE ITEMS ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#bbb' }}>LINE ITEMS</div>
                </div>

                <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid #e5e5e5', marginBottom: 20 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                    <thead>
                      <tr style={{ background: '#f5f5f7', borderBottom: '1px solid #e5e5e5' }}>
                        {['LN', 'MAT-CODE / COST CODE', 'PR / TASK NO.', 'PR ITEM', 'DESCRIPTION', 'UOM', 'QTY', 'UNIT PRICE', 'AMOUNT', 'DEL. DATE'].map((h, i) => (
                          <th key={i} style={{ padding: '10px 12px', fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'left', whiteSpace: 'nowrap', borderRight: i < 9 ? '1px solid #e5e5e5' : 'none' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {poLineItems.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: idx < poLineItems.length - 1 ? '1px solid #e5e5e5' : 'none' }}>
                          {['ln', 'matCode', 'prTaskNo', 'prItem', 'description', 'uom', 'quantity', 'unitPrice', 'amount', 'delDate'].map((field, fi) => (
                            <td key={fi} style={{ padding: '10px 12px', fontSize: 13, color: '#1a1a1a', borderRight: fi < 9 ? '1px solid #e5e5e5' : 'none', verticalAlign: 'top' }}>
                              <span style={{ fontSize: 12, lineHeight: 1.5 }}>{item[field]}</span>
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr style={{ background: '#f5f5f7', borderTop: '2px solid #d0d0d0' }}>
                        <td colSpan={8} style={{ padding: '10px 12px', fontSize: 12, fontWeight: 700, color: '#1a1a1a', textAlign: 'right', borderRight: '1px solid #e5e5e5' }}>Total :- FORTY FIVE LAKH RUPEES AND ZERO</td>
                        <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700, color: '#0052cc', borderRight: '1px solid #e5e5e5' }}>₹45,00,000.00</td>
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ borderTop: '1px solid #f0f0f0', margin: '4px 0 20px' }} />

                {/* ── SPECIAL INSTRUCTIONS ── */}
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#bbb', marginBottom: 10 }}>SPECIAL INSTRUCTIONS TO SUPPLIER</div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.9, whiteSpace: 'pre-line' }}>{poSpecialInstructions}</div>
                </div>

                <div style={{ borderTop: '1px solid #f0f0f0', margin: '4px 0 20px' }} />

                {/* ── TERMS & CONDITIONS ── */}
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#bbb', marginBottom: 10 }}>TERMS & CONDITIONS</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.9, whiteSpace: 'pre-line' }}>{poTermsConditions}</div>

              </div>

            </div>
          )}

          {activeTab === 'invoices' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12, background: '#f5f5f7' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(109,40,217,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Download size={22} color="#6d28d9" strokeWidth={1.5} /></div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Invoice Tracking</div>
              <div style={{ fontSize: 13, color: '#999', textAlign: 'center', maxWidth: 360, lineHeight: 1.6 }}>Invoices will appear here once the PO is issued and the engagement is active.</div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12, background: '#f5f5f7' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,82,204,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles size={22} color="#0052cc" strokeWidth={1.5} /></div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Activity Log</div>
              <div style={{ fontSize: 13, color: '#999', textAlign: 'center', maxWidth: 360, lineHeight: 1.6 }}>All procurement actions, approvals, and system events for this PR will be tracked here.</div>
            </div>
          )}

        </div>
      </div>

      {showPoPreview && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowPoPreview(false)}>
          <div style={{ background: '#fff', borderRadius: 16, width: '82vw', maxWidth: 920, height: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(0,82,204,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={16} color="#0052cc" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>Purchase Order — {poNumber}</div>
                  <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{poSupplierName} · Issued {poIssueDate}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: '#666', fontFamily: 'inherit' }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <Download size={13} /> Download
                </button>
                <button onClick={() => setShowPoPreview(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999', display: 'flex', padding: 6, borderRadius: 8 }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable document area */}
            <div style={{ flex: 1, overflowY: 'auto', background: '#f0f0f0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 0 40px', gap: 20 }}>

              {/* Page 1 */}
              <div style={{ background: '#fff', width: 700, minHeight: 900, borderRadius: 4, boxShadow: '0 2px 12px rgba(0,0,0,0.12)', padding: '48px 60px', boxSizing: 'border-box', position: 'relative' }}>
                {/* Page header bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0052cc', paddingBottom: 10, marginBottom: 36 }}>
                  <div style={{ fontSize: 11, color: '#999', fontStyle: 'italic' }}>DDAIS Group</div>
                  <div style={{ fontSize: 10, color: '#999' }}>PO {poNumber} &nbsp;|&nbsp; Confidential</div>
                </div>

                {/* PO Title + number */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#0d1f3c', letterSpacing: '-0.5px', marginBottom: 6 }}>PURCHASE ORDER</div>
                    <div style={{ fontSize: 12, color: '#555', whiteSpace: 'pre-line', lineHeight: 1.7 }}>{poAddress}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>PO Number</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#0052cc', marginBottom: 10 }}>{poNumber}</div>
                    <div style={{ fontSize: 11, color: '#666' }}>Issue Date: <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{poIssueDate}</span></div>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Change No.: <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{poChangeNo}</span></div>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Terms: <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{poTermsCategory}</span></div>
                  </div>
                </div>

                {/* Supplier / Buyer grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid #e0e0e0', borderRadius: 6, overflow: 'hidden', marginBottom: 24 }}>
                  <div style={{ padding: '16px 20px', borderRight: '1px solid #e0e0e0' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#999', marginBottom: 8 }}>SUPPLIER</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>{poSupplierName}</div>
                    <div style={{ fontSize: 12, color: '#555', whiteSpace: 'pre-line', lineHeight: 1.6 }}>{poSupplierAddress}</div>
                    <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{poSupplierContact}</div>
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#999', marginBottom: 8 }}>BUYER</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>{poBuyerName}</div>
                    <div style={{ fontSize: 12, color: '#555', whiteSpace: 'pre-line', lineHeight: 1.6 }}>{poAddress}</div>
                  </div>
                </div>

                {/* Instructions banner */}
                {poInstructions && (
                  <div style={{ background: '#f8f9ff', border: '1px solid #e0e7ff', borderRadius: 6, padding: '12px 16px', marginBottom: 24 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#6d6dcc', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>INSTRUCTIONS</div>
                    <div style={{ fontSize: 12, color: '#444', lineHeight: 1.6 }}>{poInstructions}</div>
                  </div>
                )}

                {/* Change Order label */}
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', marginBottom: 10 }}>Change Order Description:</div>

                {/* Line items table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc', marginBottom: 24, fontSize: 11, tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: '4%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '16%' }} />
                    <col style={{ width: '32%' }} />
                    <col style={{ width: '8%' }} />
                    <col style={{ width: '7%' }} />
                    <col style={{ width: '8%' }} />
                    <col style={{ width: '7%' }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: '#0d1f3c' }}>
                      {['LN', 'MAT-CODE / COST CODE', 'PR / TASK NO.', 'DESCRIPTION', 'UOM', 'QTY', 'UNIT PRICE', 'AMOUNT'].map((h, i) => (
                        <th key={i} style={{ padding: '7px 8px', fontSize: 9, fontWeight: 700, color: '#fff', textAlign: 'left', borderRight: i < 7 ? '1px solid rgba(255,255,255,0.15)' : 'none', whiteSpace: 'pre-line', lineHeight: 1.3 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {poLineItems.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e5e5e5', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                        {['ln', 'matCode', 'prTaskNo', 'description', 'uom', 'quantity', 'unitPrice', 'amount'].map((field, fi) => (
                          <td key={fi} style={{ padding: '7px 8px', fontSize: 11, color: '#1a1a1a', borderRight: fi < 7 ? '1px solid #e5e5e5' : 'none', verticalAlign: 'top', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item[field]}</td>
                        ))}
                      </tr>
                    ))}
                    <tr style={{ background: '#f0f4ff', borderTop: '2px solid #0052cc' }}>
                      <td colSpan={6} style={{ padding: '8px', fontSize: 11, fontWeight: 700, color: '#1a1a1a', textAlign: 'right', borderRight: '1px solid #ccc' }}>Total :- FORTY FIVE LAKH RUPEES AND ZERO</td>
                      <td colSpan={2} style={{ padding: '8px', fontSize: 11, fontWeight: 700, color: '#0052cc' }}>₹45,00,000.00 INR</td>
                    </tr>
                  </tbody>
                </table>

                {/* Page footer */}
                <div style={{ position: 'absolute', bottom: 32, left: 60, right: 60, display: 'flex', justifyContent: 'center', borderTop: '1.5px solid #0052cc', paddingTop: 8 }}>
                  <span style={{ fontSize: 10, color: '#999' }}>Page 1 of 2</span>
                </div>
              </div>

              {/* Page 2 */}
              <div style={{ background: '#fff', width: 700, minHeight: 500, borderRadius: 4, boxShadow: '0 2px 12px rgba(0,0,0,0.12)', padding: '48px 60px', boxSizing: 'border-box', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0052cc', paddingBottom: 10, marginBottom: 28 }}>
                  <div style={{ fontSize: 11, color: '#999', fontStyle: 'italic' }}>DDAIS Group</div>
                  <div style={{ fontSize: 10, color: '#999' }}>PO {poNumber} &nbsp;|&nbsp; Confidential</div>
                </div>

                {/* Special Instructions */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#0052cc', marginBottom: 10, borderBottom: '1px solid #e0e7ff', paddingBottom: 6 }}>SPECIAL INSTRUCTIONS TO SUPPLIER</div>
                  <div style={{ fontSize: 12, color: '#444', lineHeight: 1.9, whiteSpace: 'pre-line' }}>{poSpecialInstructions}</div>
                </div>

                {/* Terms */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#0052cc', marginBottom: 10, borderBottom: '1px solid #e0e7ff', paddingBottom: 6 }}>TERMS & CONDITIONS</div>
                  <div style={{ fontSize: 12, color: '#444', lineHeight: 1.9, whiteSpace: 'pre-line' }}>{poTermsConditions}</div>
                </div>

                <div style={{ position: 'absolute', bottom: 32, left: 60, right: 60, display: 'flex', justifyContent: 'center', borderTop: '1.5px solid #0052cc', paddingTop: 8 }}>
                  <span style={{ fontSize: 10, color: '#999' }}>Page 2 of 2</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* AI CHAT PANE */}
      <div style={{ width: chatPaneOpen ? '32vw' : 0, flexShrink: 0, borderLeft: chatPaneOpen ? '1px solid #e5e5e5' : 'none', overflow: 'hidden', transition: 'width 0.25s ease', background: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '32vw', display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Header — matches NewChat top bar style */}
          <div style={{ height: 56, minHeight: 56, background: '#fff', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <X size={18} color="#999" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => setChatPaneOpen(false)} />
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 400 }}>
                Ask about this PR...
              </div>
            </div>
            <div style={{ position: 'relative' }} ref={chatMenuRef}>
              <button
                onClick={() => setChatMenuOpen(!chatMenuOpen)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 8, color: '#666' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f5f5f7'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <MoreHorizontal size={18} />
              </button>
              {chatMenuOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 6, zIndex: 500, minWidth: 180 }}>
                  {[
                    { icon: Edit2, label: 'Rename', action: () => setChatMenuOpen(false) },
                    { icon: chatMenuPinned ? PinOff : Pin, label: chatMenuPinned ? 'Unpin' : 'Pin', action: () => { setChatMenuPinned(p => !p); setChatMenuOpen(false); } },
                    { icon: Share2, label: 'Share', action: () => setChatMenuOpen(false) },
                    { icon: Download, label: 'Download', action: () => setChatMenuOpen(false) },
                  ].map(({ icon: Icon, label, action }) => (
                    <div key={label} onClick={action}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13, color: '#1a1a1a', transition: 'background 0.12s ease' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f5f5f7'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Icon size={14} color="#666" />{label}
                    </div>
                  ))}
                  <div style={{ height: 1, background: '#f0f0f0', margin: '4px 0' }} />
                  <div onClick={() => setChatMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13, color: '#ef4444', transition: 'background 0.12s ease' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Trash2 size={14} color="#ef4444" />Delete
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Messages scroll area */}
          <div ref={chatScrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 8px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {chatMessages.map((msg, i) => {
              if (msg.role === 'status') {
                return (
                  <div key={i} style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: 8, width: '90%', animation: 'chatFadeIn 0.2s ease forwards' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #0052cc, #7c7cff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                        <Sparkles size={12} color="#fff" strokeWidth={2} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(124,124,255,0.04)', border: '1px solid rgba(124,124,255,0.15)', borderRadius: 10, padding: '8px 14px' }}>
                        <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                          {chatReasoningComplete ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>Completed</span>
                          ) : (
                            <span style={{ animation: 'textShimmer 1.2s ease-in-out infinite', display: 'inline-block' }}>Analysing your request...</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return msg.role === 'user' ? (
                /* ── User message ── */
                <div key={i} style={{ position: 'relative', alignSelf: 'flex-end', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, maxWidth: '78%', animation: 'chatFadeIn 0.2s ease forwards' }}
                  onMouseEnter={() => setChatHoveredUserMsg(i)}
                  onMouseLeave={() => setChatHoveredUserMsg(null)}>
                  <div style={{ alignSelf: 'flex-end', background: 'rgba(0,82,204,0.05)', border: '1px solid rgba(0,82,204,0.1)', borderRadius: '14px 14px 4px 14px', padding: '10px 14px', fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </div>
                  {/* Hover actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', height: 26, visibility: chatHoveredUserMsg === i ? 'visible' : 'hidden', opacity: chatHoveredUserMsg === i ? 1 : 0, transition: 'opacity 0.15s ease' }}>
                    <button onClick={() => {
                      setChatCopiedMsgs(prev => new Set(prev).add(i));
                      const t = setTimeout(() => setChatCopiedMsgs(prev => { const n = new Set(prev); n.delete(i); return n; }), 2000);
                      chatTooltipTimers.current.add(t);
                    }}
                      style={{ position: 'relative', width: 26, height: 26, borderRadius: 6, border: 'none', background: chatCopiedMsgs.has(i) ? 'rgba(34,197,94,0.08)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: chatCopiedMsgs.has(i) ? '#22c55e' : 'var(--text-tertiary)', transition: 'all 0.15s ease' }}
                      onMouseEnter={e => { if (!chatCopiedMsgs.has(i)) { e.currentTarget.style.background = 'var(--bg-surface-2)'; } }}
                      onMouseLeave={e => { if (!chatCopiedMsgs.has(i)) { e.currentTarget.style.background = 'transparent'; } }}>
                      {chatCopiedMsgs.has(i) ? <CheckCircle size={13} /> : <Copy size={13} />}
                      {chatCopiedMsgs.has(i) && <div style={{ position: 'absolute', bottom: 'calc(100% + 4px)', left: '50%', transform: 'translateX(-50%)', background: 'rgba(26,26,26,0.9)', color: '#fff', fontSize: 10, fontWeight: 500, borderRadius: 5, padding: '3px 7px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 100 }}>Copied!</div>}
                    </button>
                    <button onClick={() => { /* edit not needed in pane */ }}
                      style={{ position: 'relative', width: 26, height: 26, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', transition: 'all 0.15s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}>
                      <Edit2 size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                /* ── AI message ── */
                <div key={i} style={{ alignSelf: 'flex-start', maxWidth: '82%', display: 'flex', flexDirection: 'column', gap: 6, animation: 'chatFadeIn 0.2s ease forwards' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    {chatMessages[i - 1]?.role !== 'status' ? (
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #0052cc, #7c7cff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                        <Sparkles size={12} color="#fff" strokeWidth={2} />
                      </div>
                    ) : (
                      <div style={{ width: 28, flexShrink: 0 }} />
                    )}
                    <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6, paddingTop: 4 }}>
                      {msg.text}
                    </div>
                  </div>
                  {/* Action row below AI message */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 38 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginRight: 6 }}>Just now</span>

                    {/* Copy */}
                    <button onClick={() => {
                      setChatCopiedMsgs(prev => new Set(prev).add(i));
                      const t = setTimeout(() => setChatCopiedMsgs(prev => { const n = new Set(prev); n.delete(i); return n; }), 2000);
                      chatTooltipTimers.current.add(t);
                    }}
                      style={{ position: 'relative', width: 28, height: 28, borderRadius: 7, border: 'none', background: chatCopiedMsgs.has(i) ? 'rgba(34,197,94,0.08)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: chatCopiedMsgs.has(i) ? '#22c55e' : 'var(--text-tertiary)', transition: 'all 0.15s ease' }}
                      onMouseEnter={e => { if (!chatCopiedMsgs.has(i)) { e.currentTarget.style.background = 'var(--bg-surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                      onMouseLeave={e => { if (!chatCopiedMsgs.has(i)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; } }}>
                      {chatCopiedMsgs.has(i) ? <CheckCircle size={14} /> : <Copy size={14} />}
                      {chatCopiedMsgs.has(i) && <div style={{ position: 'absolute', bottom: 'calc(100% + 4px)', left: '50%', transform: 'translateX(-50%)', background: 'rgba(26,26,26,0.9)', color: '#fff', fontSize: 10, fontWeight: 500, borderRadius: 5, padding: '3px 7px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 100 }}>Copied!</div>}
                    </button>

                    {/* Thumbs up */}
                    <button onClick={() => {
                      setChatLikedMsgs(prev => {
                        const n = new Set(prev);
                        if (n.has(i)) n.delete(i);
                        else {
                          n.add(i);
                          setChatDislikedMsgs(d => { const nd = new Set(d); nd.delete(i); return nd; });
                          setChatLikedTooltipVisible(t => new Set(t).add(i));
                          const timer = setTimeout(() => setChatLikedTooltipVisible(t => { const nt = new Set(t); nt.delete(i); return nt; }), 1500);
                          chatTooltipTimers.current.add(timer);
                        }
                        return n;
                      });
                    }}
                      style={{ position: 'relative', width: 28, height: 28, borderRadius: 7, border: 'none', background: chatLikedMsgs.has(i) ? 'rgba(34,197,94,0.08)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: chatLikedMsgs.has(i) ? '#22c55e' : 'var(--text-tertiary)', transition: 'all 0.15s ease' }}
                      onMouseEnter={e => { if (!chatLikedMsgs.has(i)) { e.currentTarget.style.background = 'var(--bg-surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                      onMouseLeave={e => { if (!chatLikedMsgs.has(i)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; } }}>
                      <ThumbsUp size={14} />
                      {chatLikedTooltipVisible.has(i) && <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: 'rgba(26,26,26,0.9)', color: 'white', fontSize: 10, fontWeight: 500, borderRadius: 5, padding: '4px 8px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 100 }}>Liked</div>}
                    </button>

                    {/* Thumbs down */}
                    <button onClick={() => {
                      setChatDislikedMsgs(prev => {
                        const n = new Set(prev);
                        if (n.has(i)) n.delete(i);
                        else {
                          n.add(i);
                          setChatLikedMsgs(l => { const nl = new Set(l); nl.delete(i); return nl; });
                          setChatDislikedTooltipVisible(t => new Set(t).add(i));
                          const timer = setTimeout(() => setChatDislikedTooltipVisible(t => { const nt = new Set(t); nt.delete(i); return nt; }), 1500);
                          chatTooltipTimers.current.add(timer);
                        }
                        return n;
                      });
                    }}
                      style={{ position: 'relative', width: 28, height: 28, borderRadius: 7, border: 'none', background: chatDislikedMsgs.has(i) ? 'rgba(239,68,68,0.08)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: chatDislikedMsgs.has(i) ? '#ef4444' : 'var(--text-tertiary)', transition: 'all 0.15s ease' }}
                      onMouseEnter={e => { if (!chatDislikedMsgs.has(i)) { e.currentTarget.style.background = 'var(--bg-surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                      onMouseLeave={e => { if (!chatDislikedMsgs.has(i)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; } }}>
                      <ThumbsDown size={14} />
                      {chatDislikedTooltipVisible.has(i) && <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: 'rgba(26,26,26,0.9)', color: 'white', fontSize: 10, fontWeight: 500, borderRadius: 5, padding: '4px 8px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 100 }}>Disliked</div>}
                    </button>

                    {/* Regenerate */}
                    <button onClick={() => {
                      setChatRegeneratingMsgs(prev => new Set([...prev, i]));
                      setTimeout(() => setChatRegeneratingMsgs(prev => { const n = new Set(prev); n.delete(i); return n; }), 1500);
                    }}
                      style={{ position: 'relative', width: 28, height: 28, borderRadius: 7, border: 'none', background: chatRegeneratingMsgs.has(i) ? 'rgba(124,124,255,0.08)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: chatRegeneratingMsgs.has(i) ? '#7c7cff' : 'var(--text-tertiary)', transition: 'all 0.15s ease' }}
                      onMouseEnter={e => { if (!chatRegeneratingMsgs.has(i)) { e.currentTarget.style.background = 'var(--bg-surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                      onMouseLeave={e => { if (!chatRegeneratingMsgs.has(i)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; } }}>
                      <RotateCcw size={14} style={{ animation: chatRegeneratingMsgs.has(i) ? 'chatSpinOnce 0.6s linear infinite' : 'none' }} />
                      {chatRegeneratingMsgs.has(i) && <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: 'rgba(26,26,26,0.9)', color: 'white', fontSize: 10, fontWeight: 500, borderRadius: 5, padding: '4px 8px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 100 }}>Regenerating...</div>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Input bar — matches NewChat exactly ── */}
          <div style={{ flexShrink: 0, padding: '12px 16px 16px', background: '#fff' }}>
            <div style={{ border: `1.5px solid ${chatInput ? '#7c7cff' : 'var(--border-default)'}`, borderRadius: 14, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, boxShadow: chatInput ? '0 0 0 3px rgba(124,124,255,0.09), 0 2px 8px rgba(14,15,37,0.04)' : '0 2px 8px rgba(14,15,37,0.04)', transition: 'border-color 0.15s, box-shadow 0.15s', background: '#fff' }}>

              {/* Textarea */}
              <textarea
                ref={chatInputRef}
                value={chatInput}
                onChange={e => {
                  setChatInput(e.target.value);
                  if (chatInputRef.current) {
                    chatInputRef.current.style.height = 'auto';
                    chatInputRef.current.style.height = Math.min(chatInputRef.current.scrollHeight, 120) + 'px';
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!chatInput.trim()) return;
                    const userMsg = { role: 'user', text: chatInput.trim() };
                    const statusMsg = { role: 'status' };
                    const aiMsg = { role: 'ai', text: 'I\'m reviewing this PR and the related procurement data. Based on the workflow and documents available, here is my analysis for your query.' };
                    setChatMessages(prev => [...prev, userMsg, statusMsg, aiMsg]);
                    setChatInput('');
                    if (chatInputRef.current) chatInputRef.current.style.height = 'auto';
                  }
                }}
                placeholder="Ask about this PR..."
                rows={1}
                style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: 'var(--text-primary)', resize: 'none', minHeight: 24, maxHeight: 120, overflowY: 'auto', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}
              />

              {/* Bottom action row — matches NewChat exactly */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>

                {/* Left: Paperclip */}
                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', transition: 'all 0.15s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,124,255,0.08)'; e.currentTarget.style.color = '#7c7cff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}>
                  <Paperclip size={18} />
                </button>

                {/* Right: char count + mic + send */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, color: chatInput.length > 18000 ? '#ef4444' : 'var(--text-tertiary)' }}>
                    {chatInput.length} / 20000
                  </span>
                  <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', transition: 'all 0.15s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#7c7cff'; e.currentTarget.style.background = 'rgba(124,124,255,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}>
                    <Mic size={18} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => {
                      if (!chatInput.trim()) return;
                      const userMsg = { role: 'user', text: chatInput.trim() };
                      const statusMsg = { role: 'status' };
                      const aiMsg = { role: 'ai', text: 'I\'m reviewing this PR and the related procurement data. Based on the workflow and documents available, here is my analysis for your query.' };
                      setChatMessages(prev => [...prev, userMsg, statusMsg, aiMsg]);
                      setChatInput('');
                      if (chatInputRef.current) chatInputRef.current.style.height = 'auto';
                    }}
                    style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: chatInput.trim() ? 'pointer' : 'not-allowed', background: chatInput.trim() ? 'linear-gradient(135deg, #0052cc, #7c7cff)' : 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: chatInput.trim() ? '0 2px 8px rgba(0,82,204,0.3)' : 'none', transition: 'all 0.15s ease' }}>
                    <Send size={15} color={chatInput.trim() ? '#fff' : 'var(--text-tertiary)'} />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showPoEditModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowPoEditModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 1080, maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Edit Purchase Order</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{poNumber} · AWS Cloud Migration Consulting</div>
              </div>
              <button onClick={() => setShowPoEditModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999', display: 'flex', padding: 6, borderRadius: 8 }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}><X size={18} /></button>
            </div>

            {/* Scrollable form body */}
            <div style={{ overflowY: 'auto', overflowX: 'hidden', padding: '24px', display: 'flex', flexDirection: 'column', gap: 10 }}>

              {/* Section: Buyer Info */}
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#bbb', marginBottom: 6 }}>BUYER INFORMATION</div>

              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>Company Address</div>
                <textarea value={poAddress} onChange={e => setPoAddress(e.target.value)} rows={4} style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6, outline: 'none' }} onFocus={e => { e.target.style.borderColor = '#7c7cff'; e.target.style.boxShadow = '0 0 0 3px rgba(124,124,255,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>Buyer Name</div>
                  <input value={poBuyerName} onChange={e => setPoBuyerName(e.target.value)} style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit', outline: 'none' }} onFocus={e => { e.target.style.borderColor = '#7c7cff'; e.target.style.boxShadow = '0 0 0 3px rgba(124,124,255,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>Company Logo</div>
                  <div
                    onClick={() => poLogoInputRef.current && poLogoInputRef.current.click()}
                    style={{ border: `2px dashed ${poLogoFile ? '#22c55e' : '#e0e0e0'}`, borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', background: poLogoFile ? 'rgba(34,197,94,0.03)' : '#fafafa', transition: 'all 0.15s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = poLogoFile ? '#22c55e' : '#7c7cff'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = poLogoFile ? '#22c55e' : '#e0e0e0'; }}
                  >
                    {poLogoFile ? (
                      <>
                        <CheckCircle size={16} color="#22c55e" strokeWidth={2} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>{poLogoFile.name}</div>
                          <div style={{ fontSize: 11, color: '#999', marginTop: 1 }}>Click to replace</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload size={14} color="#7c7cff" />
                        <span style={{ fontSize: 13, color: '#999' }}>Upload logo (PNG, SVG, JPG)</span>
                      </>
                    )}
                  </div>
                  <input
                    ref={poLogoInputRef}
                    type="file"
                    accept=".png,.svg,.jpg,.jpeg"
                    style={{ display: 'none' }}
                    onChange={e => { if (e.target.files[0]) setPoLogoFile(e.target.files[0]); e.target.value = ''; }}
                  />
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', margin: '6px 0' }} />
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#bbb', marginBottom: 6 }}>SUPPLIER INFORMATION</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>Supplier Name</div>
                  <input value={poSupplierName} onChange={e => setPoSupplierName(e.target.value)} style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit', outline: 'none' }} onFocus={e => { e.target.style.borderColor = '#7c7cff'; e.target.style.boxShadow = '0 0 0 3px rgba(124,124,255,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>Supplier Contact No.</div>
                  <input value={poSupplierContact} onChange={e => setPoSupplierContact(e.target.value)} style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit', outline: 'none' }} onFocus={e => { e.target.style.borderColor = '#7c7cff'; e.target.style.boxShadow = '0 0 0 3px rgba(124,124,255,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>Supplier Address</div>
                <textarea value={poSupplierAddress} onChange={e => setPoSupplierAddress(e.target.value)} rows={3} style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6, outline: 'none' }} onFocus={e => { e.target.style.borderColor = '#7c7cff'; e.target.style.boxShadow = '0 0 0 3px rgba(124,124,255,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }} />
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', margin: '6px 0' }} />
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#bbb', marginBottom: 6 }}>PO DETAILS</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>PO Number</div>
                  <input value={poNumber} onChange={e => setPoNumber(e.target.value)} style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit', outline: 'none' }} onFocus={e => { e.target.style.borderColor = '#7c7cff'; e.target.style.boxShadow = '0 0 0 3px rgba(124,124,255,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>Issue Date</div>
                  <input type="date" value={poIssueDate} onChange={e => setPoIssueDate(e.target.value)} style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit', outline: 'none' }} onFocus={e => { e.target.style.borderColor = '#7c7cff'; e.target.style.boxShadow = '0 0 0 3px rgba(124,124,255,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>Change No.</div>
                  <input value={poChangeNo} onChange={e => setPoChangeNo(e.target.value)} style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit', outline: 'none' }} onFocus={e => { e.target.style.borderColor = '#7c7cff'; e.target.style.boxShadow = '0 0 0 3px rgba(124,124,255,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>Terms (Category)</div>
                  <div ref={poTermsCatRef} style={{ position: 'relative' }}>
                    <button onClick={() => setPoTermsCategoryOpen(!poTermsCategoryOpen)} style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: `1px solid ${poTermsCategoryOpen ? '#7c7cff' : 'var(--border-default)'}`, borderRadius: 8, fontSize: 14, cursor: 'pointer', background: '#fff', fontFamily: 'inherit', outline: 'none', color: '#1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: poTermsCategoryOpen ? '0 0 0 3px rgba(124,124,255,0.1)' : 'none' }}>
                      <span>{poTermsCategory}</span>
                      <ChevronDown size={13} style={{ transform: poTermsCategoryOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s ease' }} />
                    </button>
                    {poTermsCategoryOpen && (
                      <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 400, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: 6 }}>
                        {['Real Estate', 'Technology and Consulting', 'Energy & Utilities', 'Healthcare & Pharma'].map(opt => (
                          <div key={opt} onClick={() => { setPoTermsCategory(opt); setPoTermsCategoryOpen(false); }} style={{ padding: '8px 12px', fontSize: 13, borderRadius: 6, cursor: 'pointer', color: '#1a1a1a' }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>{opt}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>Instructions</div>
                <textarea value={poInstructions} onChange={e => setPoInstructions(e.target.value)} rows={3} style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6, outline: 'none' }} onFocus={e => { e.target.style.borderColor = '#7c7cff'; e.target.style.boxShadow = '0 0 0 3px rgba(124,124,255,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }} />
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', margin: '6px 0' }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#bbb' }}>LINE ITEMS</div>
                <button
                  onClick={() => setPoLineItems(prev => [...prev, { ln: String(prev.length + 1), matCode: '', prTaskNo: '', prItem: '', description: '', uom: '', quantity: '', unitPrice: '', amount: '', delDate: '' }])}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', border: '1px solid rgba(0,82,204,0.3)', borderRadius: 7, background: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: '#0052cc', fontFamily: 'inherit' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,82,204,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >+ Add Row</button>
              </div>

              <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e8e8e8', marginBottom: 6 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820, fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#f5f5f7', borderBottom: '1px solid #e8e8e8' }}>
                      {[
                        { label: 'LN', w: '40px' },
                        { label: 'MAT-CODE / COST CODE', w: '140px' },
                        { label: 'PR / TASK NO.', w: '120px' },
                        { label: 'PR ITEM', w: '70px' },
                        { label: 'DESCRIPTION', w: 'auto' },
                        { label: 'UOM', w: '70px' },
                        { label: 'QTY', w: '60px' },
                        { label: 'UNIT PRICE', w: '90px' },
                        { label: 'AMOUNT', w: '90px' },
                        { label: 'DEL. DATE', w: '90px' },
                      ].map((col, ci) => (
                        <th key={ci} style={{ padding: '9px 10px', fontSize: 10, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'left', whiteSpace: 'nowrap', width: col.w, borderRight: ci < 9 ? '1px solid #e8e8e8' : 'none' }}>
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {poLineItems.length === 0 ? (
                      <tr>
                        <td colSpan={10} style={{ padding: '20px', textAlign: 'center', fontSize: 13, color: '#999' }}>
                          No line items. Click "+ Add Row" to add one.
                        </td>
                      </tr>
                    ) : (
                      poLineItems.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: idx < poLineItems.length - 1 ? '1px solid #e8e8e8' : 'none', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                          {[
                            { field: 'ln', isTextarea: false, minW: 32 },
                            { field: 'matCode', isTextarea: false, minW: 110 },
                            { field: 'prTaskNo', isTextarea: false, minW: 100 },
                            { field: 'prItem', isTextarea: false, minW: 48 },
                            { field: 'description', isTextarea: true, minW: 140 },
                            { field: 'uom', isTextarea: false, minW: 50 },
                            { field: 'quantity', isTextarea: false, minW: 48 },
                            { field: 'unitPrice', isTextarea: false, minW: 72 },
                            { field: 'amount', isTextarea: false, minW: 72 },
                            { field: 'delDate', isTextarea: false, minW: 72 },
                          ].map(({ field, isTextarea, minW }, fi) => (
                            <td key={fi} style={{ padding: '8px 10px', verticalAlign: 'top', borderRight: fi < 9 ? '1px solid #e8e8e8' : 'none' }}>
                              {isTextarea ? (
                                <textarea
                                  value={item[field]}
                                  onChange={e => { const u = poLineItems.map((it, i) => i === idx ? { ...it, [field]: e.target.value } : it); setPoLineItems(u); }}
                                  style={{ width: '100%', minWidth: minW, padding: '4px 6px', border: '1px solid #e8e8e8', borderRadius: 6, fontSize: 12, fontFamily: 'inherit', resize: 'vertical', outline: 'none', minHeight: 52, lineHeight: 1.4 }}
                                  onFocus={e => { e.target.style.borderColor = '#7c7cff'; e.target.style.boxShadow = '0 0 0 2px rgba(124,124,255,0.1)'; }}
                                  onBlur={e => { e.target.style.borderColor = '#e8e8e8'; e.target.style.boxShadow = 'none'; }}
                                />
                              ) : (
                                <input
                                  value={item[field]}
                                  onChange={e => { const u = poLineItems.map((it, i) => i === idx ? { ...it, [field]: e.target.value } : it); setPoLineItems(u); }}
                                  style={{ width: '100%', minWidth: minW, padding: '5px 7px', border: '1px solid #e8e8e8', borderRadius: 6, fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                                  onFocus={e => { e.target.style.borderColor = '#7c7cff'; e.target.style.boxShadow = '0 0 0 2px rgba(124,124,255,0.1)'; }}
                                  onBlur={e => { e.target.style.borderColor = '#e8e8e8'; e.target.style.boxShadow = 'none'; }}
                                />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/*<div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e8e8e8', marginBottom: 6 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820, fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#f5f5f7', borderBottom: '1px solid #e8e8e8' }}>
                      {[
                        { label: 'LN', w: '40px' },
                        { label: 'MAT-CODE / COST CODE', w: '140px' },
                        { label: 'PR / TASK NO.', w: '120px' },
                        { label: 'PR ITEM', w: '70px' },
                        { label: 'DESCRIPTION', w: 'auto' },
                        { label: 'UOM', w: '70px' },
                        { label: 'QTY', w: '60px' },
                        { label: 'UNIT PRICE', w: '90px' },
                        { label: 'AMOUNT', w: '90px' },
                        { label: 'DEL. DATE', w: '90px' },
                      ].map((col, ci) => (
                        <th key={ci} style={{ padding: '9px 10px', fontSize: 10, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'left', whiteSpace: 'nowrap', width: col.w, borderRight: ci < 9 ? '1px solid #e8e8e8' : 'none' }}>
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {poLineItems.length === 0 ? (
                      <tr>
                        <td colSpan={10} style={{ padding: '20px', textAlign: 'center', fontSize: 13, color: '#999' }}>
                          No line items. Click "+ Add Row" to add one.
                        </td>
                      </tr>
                    ) : (
                      poLineItems.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: idx < poLineItems.length - 1 ? '1px solid #e8e8e8' : 'none', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                          {[
                            { field: 'ln', isTextarea: false, minW: 32 },
                            { field: 'matCode', isTextarea: false, minW: 110 },
                            { field: 'prTaskNo', isTextarea: false, minW: 100 },
                            { field: 'prItem', isTextarea: false, minW: 48 },
                            { field: 'description', isTextarea: true, minW: 140 },
                            { field: 'uom', isTextarea: false, minW: 50 },
                            { field: 'quantity', isTextarea: false, minW: 48 },
                            { field: 'unitPrice', isTextarea: false, minW: 72 },
                            { field: 'amount', isTextarea: false, minW: 72 },
                            { field: 'delDate', isTextarea: false, minW: 72 },
                          ].map(({ field, isTextarea, minW }, fi) => (
                            <td key={fi} style={{ padding: '8px 10px', verticalAlign: 'top', borderRight: fi < 9 ? '1px solid #e8e8e8' : 'none' }}>
                              {isTextarea ? (
                                <textarea
                                  value={item[field]}
                                  onChange={e => { const u = poLineItems.map((it, i) => i === idx ? { ...it, [field]: e.target.value } : it); setPoLineItems(u); }}
                                  style={{ width: '100%', minWidth: minW, padding: '4px 6px', border: '1px solid #e8e8e8', borderRadius: 6, fontSize: 12, fontFamily: 'inherit', resize: 'vertical', outline: 'none', minHeight: 52, lineHeight: 1.4 }}
                                  onFocus={e => { e.target.style.borderColor = '#7c7cff'; e.target.style.boxShadow = '0 0 0 2px rgba(124,124,255,0.1)'; }}
                                  onBlur={e => { e.target.style.borderColor = '#e8e8e8'; e.target.style.boxShadow = 'none'; }}
                                />
                              ) : (
                                <input
                                  value={item[field]}
                                  onChange={e => { const u = poLineItems.map((it, i) => i === idx ? { ...it, [field]: e.target.value } : it); setPoLineItems(u); }}
                                  style={{ width: '100%', minWidth: minW, padding: '5px 7px', border: '1px solid #e8e8e8', borderRadius: 6, fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                                  onFocus={e => { e.target.style.borderColor = '#7c7cff'; e.target.style.boxShadow = '0 0 0 2px rgba(124,124,255,0.1)'; }}
                                  onBlur={e => { e.target.style.borderColor = '#e8e8e8'; e.target.style.boxShadow = 'none'; }}
                                />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>*/}
              {/*<div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e8e8e8', marginBottom: 6 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820, fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#f5f5f7', borderBottom: '1px solid #e8e8e8' }}>
                      {[
                        { label: 'LN', w: '40px' },
                        { label: 'MAT-CODE / COST CODE', w: '140px' },
                        { label: 'PR / TASK NO.', w: '120px' },
                        { label: 'PR ITEM', w: '70px' },
                        { label: 'DESCRIPTION', w: 'auto' },
                        { label: 'UOM', w: '70px' },
                        { label: 'QTY', w: '60px' },
                        { label: 'UNIT PRICE', w: '90px' },
                        { label: 'AMOUNT', w: '90px' },
                        { label: 'DEL. DATE', w: '90px' },
                      ].map((col, ci) => (
                        <th key={ci} style={{ padding: '9px 10px', fontSize: 10, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'left', whiteSpace: 'nowrap', width: col.w, borderRight: ci < 9 ? '1px solid #e8e8e8' : 'none' }}>
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {poLineItems.length === 0 ? (
                      <tr>
                        <td colSpan={10} style={{ padding: '20px', textAlign: 'center', fontSize: 13, color: '#999' }}>
                          No line items. Click "+ Add Row" to add one.
                        </td>
                      </tr>
                    ) : (
                      poLineItems.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: idx < poLineItems.length - 1 ? '1px solid #e8e8e8' : 'none', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                          {[
                            { field: 'ln', isTextarea: false, minW: 32 },
                            { field: 'matCode', isTextarea: false, minW: 110 },
                            { field: 'prTaskNo', isTextarea: false, minW: 100 },
                            { field: 'prItem', isTextarea: false, minW: 48 },
                            { field: 'description', isTextarea: true, minW: 140 },
                            { field: 'uom', isTextarea: false, minW: 50 },
                            { field: 'quantity', isTextarea: false, minW: 48 },
                            { field: 'unitPrice', isTextarea: false, minW: 72 },
                            { field: 'amount', isTextarea: false, minW: 72 },
                            { field: 'delDate', isTextarea: false, minW: 72 },
                          ].map(({ field, isTextarea, minW }, fi) => (
                            <td key={fi} style={{ padding: '8px 10px', verticalAlign: 'top', borderRight: fi < 9 ? '1px solid #e8e8e8' : 'none' }}>
                              {isTextarea ? (
                                <textarea
                                  value={item[field]}
                                  onChange={e => { const updated = poLineItems.map((it, i) => i === idx ? { ...it, [field]: e.target.value } : it); setPoLineItems(updated); }}
                                  style={{ width: '100%', minWidth: minW, padding: '4px 6px', border: '1px solid #e8e8e8', borderRadius: 6, fontSize: 12, fontFamily: 'inherit', resize: 'vertical', outline: 'none', minHeight: 52, lineHeight: 1.4 }}
                                  onFocus={e => { e.target.style.borderColor = '#7c7cff'; e.target.style.boxShadow = '0 0 0 2px rgba(124,124,255,0.1)'; }}
                                  onBlur={e => { e.target.style.borderColor = '#e8e8e8'; e.target.style.boxShadow = 'none'; }}
                                />
                              ) : (
                                <input
                                  value={item[field]}
                                  onChange={e => { const updated = poLineItems.map((it, i) => i === idx ? { ...it, [field]: e.target.value } : it); setPoLineItems(updated); }}
                                  style={{ width: '100%', minWidth: minW, padding: '5px 7px', border: '1px solid #e8e8e8', borderRadius: 6, fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                                  onFocus={e => { e.target.style.borderColor = '#7c7cff'; e.target.style.boxShadow = '0 0 0 2px rgba(124,124,255,0.1)'; }}
                                  onBlur={e => { e.target.style.borderColor = '#e8e8e8'; e.target.style.boxShadow = 'none'; }}
                                />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>*/}

              <div style={{ borderTop: '1px solid #f0f0f0', margin: '6px 0' }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>Special Instructions to Supplier</div>
                <textarea value={poSpecialInstructions} onChange={e => setPoSpecialInstructions(e.target.value)} rows={5} style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.8, outline: 'none' }} onFocus={e => { e.target.style.borderColor = '#7c7cff'; e.target.style.boxShadow = '0 0 0 3px rgba(124,124,255,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>Terms & Conditions</div>
                <textarea value={poTermsConditions} onChange={e => setPoTermsConditions(e.target.value)} rows={7} style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.8, outline: 'none' }} onFocus={e => { e.target.style.borderColor = '#7c7cff'; e.target.style.boxShadow = '0 0 0 3px rgba(124,124,255,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }} />
              </div>

            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e8e8e8', display: 'flex', justifyContent: 'flex-end', gap: 10, flexShrink: 0 }}>
              <button onClick={() => setShowPoEditModal(false)} style={{ padding: '9px 20px', border: '1px solid #e0e0e0', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#4a4a4a', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={() => { setShowPoEditModal(false); setSaveToast({ title: 'Changes saved successfully', subtext: 'Purchase Order details have been updated.' }); setTimeout(() => setSaveToast(null), 3000); }} style={{ padding: '9px 24px', border: 'none', borderRadius: 8, background: '#0052cc', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'inherit' }}>Save Changes</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
