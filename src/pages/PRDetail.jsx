import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import {
  ArrowLeft, Download, Sparkles, User, CheckCircle, Clock, Lock,
  ChevronRight, ChevronDown, X, FileText, FileCheck, MessageSquare,
  ExternalLink, Building, Calendar, Tag, Pencil, Upload,
  Activity, TrendingUp, Package, Layers
} from 'lucide-react';

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
  'Submitted': { bg: '#e8f1fb', color: '#0052cc' },
  'In Review': { bg: '#fff3e0', color: '#e65100' },
  'Classifying': { bg: '#ede9fe', color: '#6d28d9' },
  'RFP in Progress': { bg: '#fdf4ff', color: '#a21caf' },
  'Pending RFP Approval': { bg: '#fff3e0', color: '#e65100' },
  'RFP Published': { bg: '#ede9fe', color: '#6d28d9' },
  'Proposals Received': { bg: '#fdf4ff', color: '#a21caf' },
  'Under Evaluation': { bg: '#fff1f2', color: '#be123c' },
  'Negotiation': { bg: '#fff7ed', color: '#b45309' },
  'Pending Award Approval': { bg: '#fff3e0', color: '#e65100' },
  'SoW in Progress': { bg: '#ecfdf5', color: '#065f46' },
  'Contract Active': { bg: '#ecfdf5', color: '#065f46' },
};

const TABS = [
  { id: 'overview', label: 'Overview', locked: false },
  { id: 'sourcing', label: 'Sourcing', locked: false, Icon: TrendingUp },
  { id: 'proposals', label: 'Proposals', locked: true, Icon: Package },
  { id: 'evaluation', label: 'Evaluation', locked: true, Icon: Layers },
  { id: 'sow', label: 'SoW & Contract', locked: true, Icon: FileCheck },
  { id: 'purchaseorder', label: 'Purchase Order', locked: true, Icon: FileText },
  { id: 'audit', label: 'Activity & Audit', locked: false }
];

const AUDIT_ENTRIES = [
  { id: 1, type: 'ai', title: 'Vendor Shortlist Generated', desc: 'AI identified 5 qualified vendors for RFP distribution based on category match and past performance', actor: 'AI Agent', time: 'Just now' },
  { id: 2, type: 'system', title: 'Sourcing Stage Initiated', desc: 'PR moved to In Sourcing stage after manager approval. RFP workflow triggered.', actor: 'System', time: '2 hours ago' },
  { id: 3, type: 'approval', title: 'Manager Approval Granted', desc: 'Sarah Chen approved the procurement request. Comment: Proceed with RFP, ensure 3 vendor minimum.', actor: 'Sarah Chen', time: '10 May 2026 · 14:32' },
  { id: 4, type: 'user', title: 'PR Submitted for Approval', desc: 'David Kim submitted PR-2026-004 for manager review after confirming all details.', actor: 'David Kim', time: '10 May 2026 · 11:15' },
  { id: 5, type: 'ai', title: 'AI Classification Complete', desc: 'Request classified as Complex (92% confidence). Factors: value >₹10L, multi-phase engagement, technical complexity.', actor: 'AI Agent', time: '10 May 2026 · 11:14' },
  { id: 6, type: 'ai', title: 'Duplicate Check Passed', desc: 'No duplicate PRs found. Checked against 47 active and 230 historical requests.', actor: 'AI Agent', time: '10 May 2026 · 11:13' },
  { id: 7, type: 'ai', title: 'Data Extraction Complete', desc: 'All 21 form fields populated from uploaded document. 14 fields auto-extracted, 7 manually filled.', actor: 'AI Agent', time: '08 May 2026 · 16:45' },
  { id: 8, type: 'document', title: 'Document Uploaded', desc: 'AWS_Migration_Requirements.pdf (2.4 MB) uploaded by David Kim.', actor: 'David Kim', time: '08 May 2026 · 16:40' },
  { id: 9, type: 'system', title: 'Initial Review Passed', desc: 'PR passed automated initial review. Completeness score: 94%. Compliance pre-check: passed.', actor: 'System', time: '08 May 2026 · 16:46' },
  { id: 10, type: 'user', title: 'PR Created', desc: 'New procurement request PR-2026-004 created via document upload.', actor: 'David Kim', time: '08 May 2026 · 16:38' },
];

const workflowNodes = [
  { id: 0, type: 'user', status: 'complete', title: 'PR Created', actor: 'David Kim', timestamp: '08 May 2026 · 16:38', description: 'Procurement request created via document upload', reasoning: null },
  { id: 1, type: 'ai', status: 'complete', title: 'Data Extraction Complete', actor: 'AI Agent', timestamp: '08 May 2026 · 16:45', description: '14 of 21 fields auto-extracted from uploaded document', reasoning: ['Scanned Q3_Procurement_Requirements.pdf (2.4 MB)', 'Identified 21 procurement fields from template', 'Successfully extracted 14 fields with high confidence', 'Flagged 7 fields requiring manual completion', 'Extraction confidence score: 94%'] },
  { id: 2, type: 'ai', status: 'complete', title: 'Initial Review Passed', actor: 'AI Agent', timestamp: '08 May 2026 · 16:46', description: 'Completeness score 94% · Compliance pre-check passed · No duplicates found', reasoning: ['Completeness check: 94% — above 80% threshold', 'Duplicate check: scanned 277 active and historical PRs — no match found', 'Policy pre-check: category and budget within auto-approve thresholds for initial review', 'SLA target calculated: 15 July 2026 based on Urgent priority + Technology category'] },
  { id: 3, type: 'ai', status: 'complete', title: 'AI Classification: Complex', actor: 'AI Agent', timestamp: '08 May 2026 · 11:14', description: 'Classified as Complex · 92% confidence · RFP workflow triggered', reasoning: ['Estimated value ₹45,00,000 — exceeds ₹10L complex threshold', 'Engagement duration 6 months — multi-phase project detected', 'Category: Technology Consulting — requires vendor evaluation per policy §4.2', 'No existing preferred vendor on approved list', 'Decision: Complex procurement — RFP process required'] },
  { id: 4, type: 'user', status: 'complete', title: 'PR Submitted for Approval', actor: 'David Kim', timestamp: '10 May 2026 · 11:15', description: 'Reviewed AI draft and submitted for manager approval', reasoning: null },
  { id: 5, type: 'approval', status: 'complete', title: 'Manager Approval Granted', actor: 'Sarah Chen', timestamp: '10 May 2026 · 14:32', description: 'Approved · Comment: Proceed with RFP, ensure 3 vendor minimum', reasoning: null },
  { id: 6, type: 'ai', status: 'complete', title: 'Sourcing Stage Initiated', actor: 'AI Agent', timestamp: '10 May 2026 · 14:33', description: 'PR moved to In Sourcing · RFP workflow triggered automatically', reasoning: ['Manager approval confirmed — triggering sourcing workflow', 'PR lifecycle updated: Approved → In Sourcing', 'RFP template selected: Technology Consulting Standard v2.1', 'Initiating vendor shortlist generation'] },
  { id: 7, type: 'ai', status: 'complete', title: 'Vendor Shortlist Generated', actor: 'AI Agent', timestamp: 'Just now', description: '5 vendors identified · Filtered by category match, location, past performance', reasoning: ['Queried vendor database: 847 registered vendors', 'Filter 1 — Category match (Cloud & Infrastructure): 124 vendors', 'Filter 2 — Location: Dubai / UAE operations: 31 vendors', 'Filter 3 — Past performance score ≥ 4.0: 12 vendors', 'Filter 4 — Compliance status: Active: 8 vendors', 'Top 5 selected by AI confidence score for RFP distribution'] },
  { id: 8, type: 'pending', status: 'pending', title: 'RFP Creation & Approval', actor: 'David Kim', timestamp: 'Awaiting action', description: 'Awaiting vendor selection and RFP draft submission', reasoning: null },
  { id: 9, type: 'locked', status: 'locked', title: 'Proposal Collection', actor: '—', timestamp: 'Locked', description: 'Unlocks after RFP approved and sent to vendors', reasoning: null },
  { id: 10, type: 'locked', status: 'locked', title: 'AI Evaluation & Vendor Selection', actor: '—', timestamp: 'Locked', description: 'Unlocks after minimum 1 proposal extracted', reasoning: null },
  { id: 11, type: 'locked', status: 'locked', title: 'SoW & Contract Finalization', actor: '—', timestamp: 'Locked', description: 'Unlocks after vendor finalized', reasoning: null },
  { id: 12, type: 'locked', status: 'locked', title: 'PO Generation & Closure', actor: '—', timestamp: 'Locked', description: 'Unlocks after signed SoW uploaded', reasoning: null },
];

function EDrop({ refEl, open, onToggle, value, placeholder, options, onChange, renderOption, disabled }) {
  return (
    <div ref={refEl} style={{ position: 'relative' }}>
      <button onClick={!disabled ? onToggle : undefined} style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: `1px solid ${open ? '#7c7cff' : 'var(--border-default)'}`, borderRadius: 8, fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer', background: '#fff', fontFamily: 'inherit', outline: 'none', color: value ? 'var(--text-primary)' : 'var(--text-tertiary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: open ? '0 0 0 3px rgba(124,124,255,0.1)' : 'none', opacity: disabled ? 0.5 : 1, transition: 'all .15s ease' }}>
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

function EInput({ value, onChange, placeholder, type = 'text', readOnly, prefilled }) {
  const [fc, setFc] = React.useState(false);
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly} onFocus={() => setFc(true)} onBlur={() => setFc(false)} style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: `1px solid ${fc ? '#7c7cff' : 'var(--border-default)'}`, borderRadius: 8, fontSize: 14, color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', background: prefilled ? 'var(--bg-surface-2)' : '#fff', boxShadow: fc ? '0 0 0 3px rgba(124,124,255,0.1)' : 'none', transition: 'border-color .15s ease, box-shadow .15s ease' }} />;
}

function ETextarea({ value, onChange, placeholder, minHeight = 100 }) {
  const [fc, setFc] = React.useState(false);
  return <textarea value={value} onChange={onChange} placeholder={placeholder} onFocus={() => setFc(true)} onBlur={() => setFc(false)} style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: `1px solid ${fc ? '#7c7cff' : 'var(--border-default)'}`, borderRadius: 8, fontSize: 14, color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', minHeight, resize: 'vertical', lineHeight: 1.5, boxShadow: fc ? '0 0 0 3px rgba(124,124,255,0.1)' : 'none', transition: 'border-color .15s ease, box-shadow .15s ease' }} />;
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

export default function PRDetail({ setCurrentPage, onNavigate, activeNav }) {
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showSaveToast, setShowSaveToast] = React.useState(false);
  const [prStatus] = React.useState('RFP in Progress');
  const [activeTab, setActiveTab] = useState('overview');
  const [auditFilter, setAuditFilter] = useState('all');
  const [selectedNode, setSelectedNode] = useState(null);

  const selectedNodeData = selectedNode !== null ? workflowNodes.find(n => n.id === selectedNode) : null;

  const filteredAudit = AUDIT_ENTRIES.filter(e => {
    if (auditFilter === 'ai') return e.type === 'ai';
    if (auditFilter === 'approvals') return e.type === 'approval';
    return true;
  });

  const css = `
    @keyframes pendingPulse { 0%,100% { border-color: rgba(245,158,11,0.4) } 50% { border-color: rgba(245,158,11,0.8) } }
    @keyframes fadeIn { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform: translateY(0) } }
    @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(-12px) } to { opacity: 1; transform: translateX(-50%) translateY(0) } }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {showEditModal && <EditModal onClose={() => setShowEditModal(false)} onSave={() => { setShowEditModal(false); setShowSaveToast(true); setTimeout(() => setShowSaveToast(false), 3000); }} />}

      {showSaveToast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: '#f0fdf4', border: '1px solid rgba(34,197,94,0.25)', borderLeft: '4px solid #22c55e', borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 32px rgba(14,15,37,0.1)', minWidth: 340, animation: 'toastIn 0.2s ease forwards' }}>
          <CheckCircle size={20} color="#22c55e" strokeWidth={2} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>Changes saved successfully</div>
            <div style={{ fontSize: 12, color: '#166534', marginTop: 2 }}>Requisition details have been updated.</div>
          </div>
          <button onClick={() => setShowSaveToast(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(21,128,61,0.5)', display: 'flex', padding: 2, borderRadius: 4 }}><X size={16} /></button>
        </div>
      )}

      <MainLayout activeNav={activeNav} onNavigate={onNavigate} titleComponent={null} searchPlaceholder={null}>

        {/* TOP BAR */}
        <div style={{ height: 56, background: '#fff', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12, flexShrink: 0 }}>
          <ArrowLeft size={18} color="var(--text-tertiary)" style={{ cursor: 'pointer' }} onClick={() => onNavigate('Dashboard')} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 13, color: 'var(--text-tertiary)', cursor: 'pointer' }} onClick={() => onNavigate('Requests')}>Requests</span>
            <ChevronRight size={14} color="var(--text-tertiary)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>PR-2026-004</span>
          </div>
          <div style={{ flex: 1 }} />
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, fontFamily: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-2)'} onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}>
            <Download size={14} /> Export
          </button>
        </div>

        {/* PR HEADER */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--border-subtle)', padding: '20px 24px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>AWS Cloud Migration Consulting</div>
            <div style={{ background: 'rgba(124,124,255,0.08)', border: '1px solid rgba(124,124,255,0.2)', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600, color: '#7c7cff', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Sparkles size={11} /> Complex
            </div>
            <div style={{ background: STATUS_CONFIG[prStatus]?.bg || '#e8f1fb', color: STATUS_CONFIG[prStatus]?.color || '#0052cc', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>
              {prStatus}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><User size={13} color="var(--text-tertiary)" /><span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>David Kim</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} color="var(--text-tertiary)" /><span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Created 08 May 2026</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Building size={13} color="var(--text-tertiary)" /><span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Engineering</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Tag size={13} color="var(--text-tertiary)" /><span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Technology and Consulting</span></div>
          </div>
        </div>

        {/* TABS */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--border-subtle)', padding: '0 24px', display: 'flex', gap: 0, flexShrink: 0 }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => { if (!tab.locked) setActiveTab(tab.id); }} style={{ padding: '14px 16px', fontSize: 13, fontWeight: isActive ? 600 : 500, borderBottom: `2px solid ${isActive ? '#7c7cff' : 'transparent'}`, cursor: tab.locked ? 'not-allowed' : 'pointer', background: 'transparent', border: 'none', borderBottom: `2px solid ${isActive ? '#7c7cff' : 'transparent'}`, display: 'flex', alignItems: 'center', gap: 6, color: isActive ? 'var(--colors-violet-700)' : tab.locked ? 'var(--text-tertiary)' : 'var(--text-secondary)', fontFamily: 'inherit' }}>
                {tab.label}
                {tab.locked && <Lock size={12} />}
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflow: 'hidden', background: 'var(--bg-surface-2)', display: 'flex', flexDirection: 'column' }}>

          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'row', height: '100%', overflow: 'hidden' }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  {/* WORKFLOW */}
                  <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)' }}>PROCUREMENT WORKFLOW</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: 'var(--text-tertiary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, background: 'rgba(124,124,255,0.15)', borderRadius: '50%' }} /> AI Action</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, background: 'rgba(0,82,204,0.12)', borderRadius: '50%' }} /> User Action</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, background: 'rgba(245,158,11,0.12)', borderRadius: '50%' }} /> Pending</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: '50%' }} /> Upcoming</div>
                      </div>
                    </div>
                    <div style={{ background: '#f8f8fc', backgroundImage: 'radial-gradient(circle, #d0d0e0 1px, transparent 1px)', backgroundSize: '24px 24px', padding: '32px 40px', overflowX: 'auto', overflowY: 'hidden', minHeight: 200 }}>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0, width: 'max-content', minWidth: '100%' }}>
                        {workflowNodes.map((node, i) => {
                          const isLocked = node.type === 'locked';
                          let cardBg = 'white', cardBorder = '1px solid transparent', cardBorderTop = '3px solid transparent';
                          let cardShadow = '0 1px 4px rgba(14,15,37,0.06)', cardOpacity = 1, cardCursor = node.reasoning ? 'pointer' : 'default';
                          let iconBg = 'transparent', IconComp = Sparkles, iconColor = '#000', ActorIcon = User;
                          let badgeBg = 'transparent', badgeColor = '#000', badgeText = '', titleColor = 'var(--text-primary)';
                          let animation = 'none';

                          if (node.type === 'ai' && node.status === 'complete') {
                            cardBorder = '1px solid rgba(124,124,255,0.25)'; cardBorderTop = '3px solid #7c7cff';
                            iconBg = 'linear-gradient(135deg, #7c7cff, #0052cc)'; IconComp = Sparkles; ActorIcon = Sparkles; iconColor = '#fff';
                            badgeBg = 'rgba(34,197,94,0.08)'; badgeColor = '#15803d'; badgeText = 'Done';
                          } else if (node.type === 'user' && node.status === 'complete') {
                            cardBorder = '1px solid rgba(0,82,204,0.2)'; cardBorderTop = '3px solid #0052cc';
                            iconBg = '#0052cc'; IconComp = User; ActorIcon = User; iconColor = '#fff';
                            badgeBg = 'rgba(34,197,94,0.08)'; badgeColor = '#15803d'; badgeText = 'Done';
                          } else if (node.type === 'approval' && node.status === 'complete') {
                            cardBorder = '1px solid rgba(34,197,94,0.2)'; cardBorderTop = '3px solid #22c55e';
                            iconBg = '#22c55e'; IconComp = CheckCircle; ActorIcon = User; iconColor = '#fff';
                            badgeBg = 'rgba(34,197,94,0.08)'; badgeColor = '#15803d'; badgeText = 'Done';
                          } else if (node.type === 'pending') {
                            cardBg = '#f9f9f9'; cardBorder = '1.5px dashed rgba(200,200,200,0.8)'; cardBorderTop = '3px solid #f59e0b';
                            animation = 'pendingPulse 2s ease-in-out infinite';
                            iconBg = 'rgba(245,158,11,0.12)'; IconComp = Clock; ActorIcon = User; iconColor = '#f59e0b';
                            badgeBg = 'rgba(245,158,11,0.08)'; badgeColor = '#b45309'; badgeText = 'Pending';
                          } else if (isLocked) {
                            cardBg = 'var(--bg-surface-1)'; cardBorder = '1px dashed var(--border-subtle)'; cardBorderTop = '3px solid var(--border-default)';
                            cardOpacity = 0.7; cardCursor = 'default'; cardShadow = 'none';
                            iconBg = 'var(--bg-surface-2)'; IconComp = Lock; iconColor = 'var(--text-tertiary)';
                            badgeBg = 'var(--bg-surface-2)'; badgeColor = 'var(--text-tertiary)'; badgeText = 'Locked'; titleColor = 'var(--text-tertiary)';
                          }

                          const isSelected = selectedNode === node.id;
                          if (isSelected && node.type === 'ai') { cardShadow = '0 6px 20px rgba(124,124,255,0.2)'; cardBorder = '1px solid #7c7cff'; }

                          return (
                            <React.Fragment key={node.id}>
                              {i !== 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', width: 48, flexShrink: 0 }}>
                                  {isLocked ? <div style={{ flex: 1, height: 0, borderTop: '1.5px dashed var(--border-default)' }} /> : <div style={{ flex: 1, height: 1.5, background: 'var(--border-default)' }} />}
                                  <ChevronRight size={14} color="var(--text-tertiary)" style={{ flexShrink: 0, marginLeft: -2 }} />
                                </div>
                              )}
                              <div onClick={() => { if (node.reasoning) { setSelectedNode(node.id); } }} style={{ width: 180, minHeight: 160, height: 160, background: cardBg, border: cardBorder, borderTop: cardBorderTop, borderRadius: 12, padding: 14, cursor: cardCursor, opacity: cardOpacity, boxSizing: 'border-box', transition: 'all 0.15s ease', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 8, flexShrink: 0, boxShadow: cardShadow, animation }}
                                onMouseEnter={(e) => { if (isLocked) return; if (node.type === 'ai' && !isSelected) e.currentTarget.style.transform = 'translateY(-2px)'; else if (node.type !== 'locked') e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={(e) => { if (isLocked) return; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconComp size={16} color={iconColor} /></div>
                                    {node.reasoning && node.type === 'ai' && <ChevronRight size={12} color="var(--text-tertiary)" />}
                                  </div>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: titleColor, lineHeight: 1.3, marginTop: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{node.title}</div>
                                </div>
                                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--text-secondary)' }}><ActorIcon size={10} />{node.actor}</div>
                                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{node.timestamp}</div>
                                  <div style={{ background: badgeBg, color: badgeColor, borderRadius: 20, padding: '2px 7px', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', display: 'inline-flex', alignSelf: 'flex-start', marginTop: 'auto' }}>{badgeText}</div>
                                </div>
                              </div>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* REQUISITION DETAILS */}
                  <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)' }}>REQUISITION DETAILS</div>
                        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Submitted 08 May 2026</div>
                      </div>
                      <button onClick={() => setShowEditModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid rgba(0,82,204,0.3)', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#0052cc', fontFamily: 'inherit' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,82,204,0.04)'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                        <Pencil size={13} /> Edit Details
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '10px 0px' }}>
                      {[
                        ['Request Title', 'AWS Cloud Migration Consulting Services'],
                        ['Procurement Category', 'Technology and Consulting'],
                        ['Subcategory', 'Cloud & Infrastructure Services'],
                        ['Spend Category', 'Indirect Spend'],
                        ['Cost Centre', 'Engineering'],
                        ['CapEx / OpEx', 'OpEx'],
                        ['Estimated Budget', '₹45,00,000'],
                        ['Quantity', '1'],
                        ['Unit of Measure', 'Resources'],
                        ['Required By Date', '15 July 2026'],
                        ['Delivery Location', 'Dubai'],
                        ['Suggested Vendor', 'Open to sourcing'],
                        ['Project Name', 'Infrastructure Modernisation 2026'],
                      ].map(([label, value]) => (
                        <React.Fragment key={label}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', paddingRight: 16, width: 200 }}>{label}</div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{value}</div>
                        </React.Fragment>
                      ))}
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', paddingRight: 16 }}>Priority</div>
                      <div><span style={{ background: 'rgba(245,158,11,0.1)', color: '#b45309', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>Urgent</span></div>
                    </div>
                    <div style={{ height: 1, background: 'var(--border-subtle)', margin: '16px 0' }} />
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', marginBottom: 6 }}>Requirement Description</div>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>We require consulting services for migrating our existing on-premise infrastructure to AWS. The engagement should cover assessment, architecture design, migration execution, and post-migration support. Expected team size: 3 senior architects for 6 months.</div>
                  </div>

                  {/* LINKED DOCUMENTS */}
                  <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '20px 24px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)', marginBottom: 14 }}>LINKED DOCUMENTS</div>
                    {[{ name: 'AWS_Migration_Requirements.pdf', size: '2.4 MB' }, { name: 'Infrastructure_Specs_v2.docx', size: '1.1 MB' }].map((doc, idx, arr) => (
                      <div key={doc.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: idx < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                        <div style={{ width: 32, height: 32, background: 'rgba(0,82,204,0.07)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={16} color="#0052cc" /></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{doc.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{doc.size} · Uploaded 08 May 2026</div>
                        </div>
                        <Download size={15} color="var(--text-tertiary)" style={{ cursor: 'pointer' }} />
                      </div>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 12, marginTop: 4, borderTop: '1px solid var(--border-subtle)' }}>
                      <MessageSquare size={15} color="#7c7cff" />
                      <div style={{ fontSize: 13, color: '#7c7cff', fontWeight: 500, cursor: 'pointer' }}>Linked conversation: AWS Cloud Migration Consulting RFP</div>
                      <ExternalLink size={13} color="#7c7cff" />
                    </div>
                  </div>

                </div>
              </div>

              {/* REASONING PANE */}
              <div style={{ width: selectedNode !== null ? 300 : 0, flexShrink: 0, borderLeft: selectedNode !== null ? '1px solid var(--border-subtle)' : 'none', overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.25s ease', background: '#fff' }}>
                <div style={{ width: 300 }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}><Sparkles size={16} color="#7c7cff" /> AI Reasoning</div>
                    <button onClick={() => setSelectedNode(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, borderRadius: 6, color: 'var(--text-tertiary)', transition: 'background 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}><X size={16} /></button>
                  </div>
                  {selectedNodeData && (
                    <>
                      <div style={{ padding: '12px 20px', background: 'var(--bg-surface-1)', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{selectedNodeData.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{selectedNodeData.timestamp}</div>
                      </div>
                      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)', marginBottom: 4 }}>REASONING STEPS</div>
                        {selectedNodeData.reasoning && selectedNodeData.reasoning.map((step, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, animation: 'fadeIn 0.3s ease forwards', animationDelay: `${idx * 0.08}s`, opacity: 0 }}>
                            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(124,124,255,0.1)', fontSize: 10, fontWeight: 700, color: '#7c7cff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{idx + 1}</div>
                            <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{step}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
              <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Activity & Audit Log</div>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'inherit' }}><Download size={14} /> Export</button>
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  {['all', 'ai', 'approvals'].map(f => {
                    const isF = auditFilter === f;
                    const label = f === 'all' ? 'All Activity' : f === 'ai' ? 'AI Actions' : 'Approvals';
                    return <button key={f} onClick={() => setAuditFilter(f)} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', background: isF ? 'rgba(124,124,255,0.1)' : '#fff', color: isF ? 'var(--colors-violet-700)' : 'var(--text-secondary)', border: `1px solid ${isF ? 'rgba(124,124,255,0.3)' : 'var(--border-default)'}` }}>{label}</button>;
                  })}
                </div>
                <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, overflow: 'hidden' }}>
                  {filteredAudit.map((e, i) => {
                    let Icon, bg, color;
                    if (e.type === 'ai') { Icon = Sparkles; bg = 'rgba(124,124,255,0.08)'; color = '#7c7cff'; }
                    else if (e.type === 'user') { Icon = User; bg = 'rgba(0,82,204,0.08)'; color = '#0052cc'; }
                    else if (e.type === 'approval') { Icon = CheckCircle; bg = 'rgba(34,197,94,0.08)'; color = '#22c55e'; }
                    else if (e.type === 'system') { Icon = Activity; bg = 'var(--bg-surface-2)'; color = 'var(--text-tertiary)'; }
                    else { Icon = FileCheck; bg = 'rgba(0,82,204,0.08)'; color = '#0052cc'; }
                    return (
                      <div key={e.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 20px', borderBottom: i < filteredAudit.length - 1 ? '1px solid var(--border-subtle)' : 'none', transition: 'background 0.15s' }} onMouseEnter={ev => ev.currentTarget.style.background = 'var(--bg-surface-1)'} onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon size={16} color={color} /></div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{e.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{e.desc}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{e.actor}</div>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{e.time}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && activeTab !== 'audit' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', gap: 12, textAlign: 'center' }}>
              {(() => {
                const tabDef = TABS.find(t => t.id === activeTab);
                const PlaceholderIcon = tabDef?.Icon || Layers;
                return (
                  <>
                    <div style={{ width: 48, height: 48, background: 'var(--bg-surface-2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PlaceholderIcon size={24} color="var(--text-tertiary)" /></div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{tabDef?.label} coming soon</div>
                      <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>This tab will be built in the next phase.</div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

        </div>
      </MainLayout>
    </>
  );
}