import React, { useState, useRef, useEffect } from 'react';
import {
  Plus, FileText, Upload, Sparkles, X, ArrowRight, Save,
  Send, Paperclip, CheckCircle, Trash2, ArrowLeft,
  ChevronDown, Calendar, Building, User,
  Tag, AlertCircle, AlertTriangle, LayoutDashboard, Scan, Cpu, FileCheck, MessageSquare,
  ThumbsUp, ThumbsDown, RotateCcw, Copy, Volume2, Edit2, VolumeX,
  MoreHorizontal, Pin, PinOff, Download, Share2, Link, Wand2, Mic, Check
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout.jsx';

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════ */

const CATEGORIES = [
  'IT & Software', 'Hardware & Equipment', 'Professional Services',
  'Office Supplies', 'Facilities', 'Marketing & Events', 'Logistics', 'Other',
];

/* ── Form mode constants ── */
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
const today = new Date().toISOString().split('T')[0];

const STARTER_PROMPTS = [
  { Icon: Plus, iconBg: 'rgba(0,82,204,0.07)', iconColor: '#0052cc', category: 'NEW REQUEST', text: 'I need to procure laptops for new engineering hires joining next month' },
  { Icon: FileText, iconBg: 'rgba(124,124,255,0.07)', iconColor: '#7c7cff', category: 'NEW REQUEST', text: 'Start a procurement request for enterprise software licenses' },
  { Icon: Tag, iconBg: 'rgba(34,197,94,0.07)', iconColor: '#22c55e', category: 'STATUS CHECK', text: 'What is the current status of my active procurement requests?' },
  { Icon: Building, iconBg: 'rgba(245,158,11,0.07)', iconColor: '#f59e0b', category: 'STATUS CHECK', text: 'Show me all requests that are pending approval right now' },
  { Icon: Sparkles, iconBg: 'rgba(79,209,197,0.07)', iconColor: '#4fd1c5', category: 'GUIDANCE', text: 'What is the procurement policy for vendors above ₹10 lakhs?' },
  { Icon: AlertCircle, iconBg: 'rgba(239,68,68,0.07)', iconColor: '#ef4444', category: 'GUIDANCE', text: 'What documents do I need to submit for a complex procurement?' },
];

const AI_RESPONSE = "Thanks David. I've captured your request. Let me fill in what I can — could you also confirm the cost centre and required-by date so I can complete the procurement requisition?";

/* ═══════════════════════════════════════════════════════════
   TYPING INDICATOR
   ═══════════════════════════════════════════════════════════ */

function TypingIndicator() {
  return (
    <div style={{ alignSelf: 'flex-start', maxWidth: '70%', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, #0052cc, #7c7cff)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Sparkles size={13} color="#fff" strokeWidth={2} />
      </div>
      <div style={{
        background: 'transparent', border: 'none',
        padding: '6px 0 0 0', display: 'flex', gap: 4, alignItems: 'center',
      }}>
        {[0, 0.2, 0.4].map((delay, i) => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--text-tertiary)',
            animation: `paiDot 0.6s ${delay}s ease-in-out alternate infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FIELD HELPERS (Form + Upload)
   ═══════════════════════════════════════════════════════════ */

function FieldInput({ value, onChange, placeholder, extracted, type = 'text', style = {} }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '9px 12px', boxSizing: 'border-box',
          paddingRight: extracted ? 32 : 12,
          border: `1px solid ${focused ? '#7c7cff' : 'var(--border-default)'}`,
          borderRadius: 8, fontSize: 14, color: 'var(--text-primary)', outline: 'none',
          fontFamily: 'inherit', background: '#fff',
          boxShadow: focused ? '0 0 0 3px rgba(124,124,255,0.1)' : 'none',
          transition: 'border-color .15s ease, box-shadow .15s ease',
          ...style,
        }}
      />
      {extracted && (
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
          <CheckCircle size={12} color="#22c55e" strokeWidth={2.5} />
        </div>
      )}
    </div>
  );
}

function FieldTextarea({ value, onChange, placeholder, minHeight = 88, extracted }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <textarea
        value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '9px 12px', boxSizing: 'border-box',
          paddingRight: extracted ? 32 : 12,
          border: `1px solid ${focused ? '#7c7cff' : 'var(--border-default)'}`,
          borderRadius: 8, fontSize: 14, color: 'var(--text-primary)', outline: 'none',
          fontFamily: 'inherit', minHeight, resize: 'vertical', lineHeight: 1.5,
          boxShadow: focused ? '0 0 0 3px rgba(124,124,255,0.1)' : 'none',
          transition: 'border-color .15s ease, box-shadow .15s ease',
        }}
      />
      {extracted && (
        <div style={{ position: 'absolute', right: 10, top: 12, display: 'flex' }}>
          <CheckCircle size={12} color="#22c55e" strokeWidth={2.5} />
        </div>
      )}
    </div>
  );
}

function CategoryDropdown({ value, onChange, open, onToggle, ref: dropRef, extracted }) {
  const [focused, setFocused] = useState(false);
  return (
    <div ref={dropRef} style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '9px 12px', boxSizing: 'border-box',
          border: `1px solid ${open || focused ? '#7c7cff' : 'var(--border-default)'}`,
          borderRadius: 8, fontSize: 14, cursor: 'pointer', background: '#fff',
          color: value ? 'var(--text-primary)' : 'var(--text-tertiary)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: 'inherit', outline: 'none',
          boxShadow: open || focused ? '0 0 0 3px rgba(124,124,255,0.1)' : 'none',
          transition: 'all .15s ease',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {value || 'Select category'}
          {extracted && value && <CheckCircle size={12} color="#22c55e" strokeWidth={2.5} />}
        </span>
        <ChevronDown size={14} strokeWidth={2} style={{ transition: 'transform .15s ease', transform: open ? 'rotate(180deg)' : 'rotate(0)', flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 200,
          background: '#fff', border: '1px solid var(--border-default)',
          borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: 6,
        }}>
          {CATEGORIES.map((cat) => (
            <div key={cat}
              onClick={() => { onChange(cat); onToggle(); }}
              style={{ padding: '8px 12px', fontSize: 13, borderRadius: 6, cursor: 'pointer', color: 'var(--text-primary)', transition: 'background .12s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-surface-2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {cat}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children, showWand, wandDisabled, isWanding, onWandClick }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-tertiary)' }}>{children}</div>
      {showWand && (
        <button
          onClick={onWandClick}
          disabled={wandDisabled || isWanding}
          style={{
            background: wandDisabled ? 'transparent' : 'rgba(124,124,255,0.08)',
            border: 'none', cursor: wandDisabled || isWanding ? 'not-allowed' : 'pointer',
            opacity: wandDisabled ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: 6,
            color: wandDisabled ? 'var(--text-tertiary)' : '#7c7cff',
            padding: '6px', borderRadius: 6, transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => { if (!wandDisabled && !isWanding) { e.currentTarget.style.background = 'rgba(124,124,255,0.15)'; e.currentTarget.style.color = '#3d3db8'; } }}
          onMouseLeave={(e) => { if (!wandDisabled && !isWanding) { e.currentTarget.style.background = 'rgba(124,124,255,0.08)'; e.currentTarget.style.color = '#7c7cff'; } }}
        >
          <Wand2 size={16} strokeWidth={2.5} style={{ animation: isWanding ? 'pulse 0.8s infinite' : 'none' }} />
        </button>
      )}
    </div>
  );
}

function AiFilledTag() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
      <CheckCircle size={13} color="#7c7cff" strokeWidth={2.5} />
      <span style={{ fontSize: 12, fontWeight: 700, fontStyle: 'italic', background: 'linear-gradient(135deg, #0052cc, #7c7cff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block', paddingRight: 2, paddingBottom: 1 }}>Filled by AI</span>
    </div>
  );
}

function Divider() {
  return <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '20px 0' }} />;
}

function Label({ children, required }) {
  return (
    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>
      {children}{required && <span style={{ color: '#ef4444' }}> *</span>}
    </label>
  );
}

function LabelWithIcon({ Icon: Ic, children }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>
      <Ic size={13} color="var(--text-tertiary)" strokeWidth={2} />
      {children}
    </label>
  );
}

/* SubmitRow removed — replaced by inline submit bars with modal */

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

/* ── Form sub-components — defined at module level to prevent remount on every render ── */
function FDrop({ refEl, open, onToggle, value, placeholder, options, onChange, renderOption, disabled }) {
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
function FInput({ value, onChange, placeholder, type = 'text', readOnly, prefilled, style: extraStyle }) {
  const [fc, setFc] = useState(false);
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}
      onFocus={() => setFc(true)} onBlur={() => setFc(false)}
      style={{
        width: '100%', padding: '9px 12px', boxSizing: 'border-box',
        border: `1px solid ${fc ? '#7c7cff' : 'var(--border-default)'}`,
        borderRadius: 8, fontSize: 14, color: 'var(--text-primary)', outline: 'none',
        fontFamily: 'inherit',
        background: prefilled ? 'rgba(0,0,0,0.02)' : '#fff',
        boxShadow: fc ? '0 0 0 3px rgba(124,124,255,0.1)' : 'none',
        transition: 'border-color .15s ease, box-shadow .15s ease',
        ...extraStyle,
      }}
    />
  );
}
function FTextarea({ value, onChange, placeholder, minHeight = 100 }) {
  const [fc, setFc] = useState(false);
  return (
    <textarea value={value} onChange={onChange} placeholder={placeholder}
      onFocus={() => setFc(true)} onBlur={() => setFc(false)}
      style={{
        background: '#fff',
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
function FL({ children, required }) {
  return <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>{children}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>;
}

/* -- Upload mode sub-components defined at module level to prevent remount -- */
function UDrop({ refEl, open, onToggle, value, placeholder, options, onChange, renderOption, disabled }) {
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
function UInput({ value, onChange, placeholder, type = 'text', readOnly, prefilled, style: extraStyle }) {
  const [fc, setFc] = useState(false);
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}
      onFocus={() => setFc(true)} onBlur={() => setFc(false)}
      style={{
        width: '100%', padding: '9px 12px', boxSizing: 'border-box',
        border: `1px solid ${fc ? '#7c7cff' : 'var(--border-default)'}`,
        borderRadius: 8, fontSize: 14, color: 'var(--text-primary)', outline: 'none',
        fontFamily: 'inherit',
        background: prefilled ? 'rgba(0,0,0,0.02)' : '#fff',
        boxShadow: fc ? '0 0 0 3px rgba(124,124,255,0.1)' : 'none',
        transition: 'border-color .15s ease, box-shadow .15s ease',
        ...extraStyle,
      }}
    />
  );
}
function UTextarea({ value, onChange, placeholder, minHeight = 100 }) {
  const [fc, setFc] = useState(false);
  return (
    <textarea value={value} onChange={onChange} placeholder={placeholder}
      onFocus={() => setFc(true)} onBlur={() => setFc(false)}
      style={{
        background: '#fff',
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
function UL({ children, required }) {
  return <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>{children}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>;
}

/* ── Success Modal ── */
const SUCCESS_MODAL_STYLE = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(14,15,37,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { background: '#fff', borderRadius: 20, padding: '40px 36px', maxWidth: 420, width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
};

export default function NewRequest({ setCurrentPage, onNavigate, activeNav, userRole }) {
  const [showUploadTooltip, setShowUploadTooltip] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadDone, setDownloadDone] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const handleDownload = () => {
    setMenuOpen(false);
    setShowDownload(true);
    setDownloadProgress(0);
    setDownloadDone(false);
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 18 + 8;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setDownloadDone(true);
        setTimeout(() => setShowDownload(false), 2500);
      }
      setDownloadProgress(Math.min(prog, 100));
    }, 200);
  };

  const [activeMode, setActiveMode] = useState('chat');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const toastTimerRef = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  /* ── chat ── */
  const [messages, setMessages] = useState([]);
  const [copiedMsgs, setCopiedMsgs] = useState(new Set());
  const [likedMsgs, setLikedMsgs] = useState(new Set());
  const [dislikedMsgs, setDislikedMsgs] = useState(new Set());
  const [regeneratingMsgs, setRegeneratingMsgs] = useState(new Set());
  const [speakingMsgs, setSpeakingMsgs] = useState(new Set());
  const [likedTooltipVisible, setLikedTooltipVisible] = useState(new Set());
  const [dislikedTooltipVisible, setDislikedTooltipVisible] = useState(new Set());
  const [hoveredUserMsg, setHoveredUserMsg] = useState(null);
  const [conversationStage, setConversationStage] = useState(0);
  const [showReasoningPanel, setShowReasoningPanel] = useState(false);
  const [reasoningSteps, setReasoningSteps] = useState([]);
  const [reasoningComplete, setReasoningComplete] = useState(false);
  const [editingMsgIndex, setEditingMsgIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [chatTitle, setChatTitle] = useState('New Request');

  const [typedTitles, setTypedTitles] = useState({});

  useEffect(() => {
    const activeIndex = reasoningSteps.findIndex(s => s.status === 'active');
    if (activeIndex === -1) return;
    const fullTitle = reasoningSteps[activeIndex].title;
    setTypedTitles(prev => ({ ...prev, [activeIndex]: 0 }));
    let charCount = 0;
    const interval = setInterval(() => {
      charCount++;
      setTypedTitles(prev => ({ ...prev, [activeIndex]: charCount }));
      if (charCount >= fullTitle.length) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, [reasoningSteps.length]);

  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const followupRef = useRef(0);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const tooltipTimers = useRef(new Set());

  useEffect(() => {
    return () => {
      tooltipTimers.current.forEach(clearTimeout);
      tooltipTimers.current.clear();
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 154) + 'px';
    }
  }, [inputValue]);

  /* ── form ── */
  const [fReqTitle, setFReqTitle] = useState('');
  const [fBizUnit, setFBizUnit] = useState(''); const [fBizUnitOpen, setFBizUnitOpen] = useState(false);
  const [fRequestorName, setFRequestorName] = useState('David Kim');
  const [fRequestDate, setFRequestDate] = useState(today);
  const [fRequiredByDate, setFRequiredByDate] = useState('');
  const [fPriority, setFPriority] = useState(''); const [fPriorityOpen, setFPriorityOpen] = useState(false);
  const [fProcCategory, setFProcCategory] = useState(''); const [fProcCategoryOpen, setFProcCategoryOpen] = useState(false);
  const [fSubcategory, setFSubcategory] = useState(''); const [fSubcategoryOpen, setFSubcategoryOpen] = useState(false);
  const [fProjectName, setFProjectName] = useState('');
  const [fCapexOpex, setFCapexOpex] = useState(''); const [fCapexOpexOpen, setFCapexOpexOpen] = useState(false);
  const [fJustification, setFJustification] = useState('');
  const [fReqDesc, setFReqDesc] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]); const [fFormUploadHover, setFFormUploadHover] = useState(false);
  const formFileInputRef = useRef(null);
  const [fQuantity, setFQuantity] = useState('');
  const [fUnitValue, setFUnitValue] = useState('');
  const [fUom, setFUom] = useState(''); const [fUomOpen, setFUomOpen] = useState(false);
  const [fBudget, setFBudget] = useState('');
  const [fCostBreakdown, setFCostBreakdown] = useState('');
  const [fSuggestedVendor, setFSuggestedVendor] = useState(''); const [fVendorOpen, setFVendorOpen] = useState(false);
  const [fVendorJustification, setFVendorJustification] = useState('');
  const [fContractRef, setFContractRef] = useState('');
  const [fDeliveryLoc, setFDeliveryLoc] = useState(''); const [fDeliveryOpen, setFDeliveryOpen] = useState(false);
  const [fTimeline, setFTimeline] = useState('');

  const [aiFilledFields, setAiFilledFields] = useState(new Set());
  const [wandingSection, setWandingSection] = useState(null);

  const handleWandClick = () => {
    setWandingSection('General Info');
    setTimeout(() => {
      setWandingSection(null);
      setFReqTitle('MacBook Pro Units — Q3 Engineering Batch');
      setFBizUnit('Engineering');
      setFRequiredByDate('2026-07-15');
      setFPriority('Urgent');
      setFProcCategory('Technology and Consulting');
      setFSubcategory('Staff Augmentation & Professional Services');
      setFCapexOpex('OpEx');
      setFReqDesc('Procurement of 25 MacBook Pro 14-inch M3 units for the incoming engineering batch joining Q3 2026. Includes standard accessories — Magic Mouse, USB-C hub, and protective cases.');
      setFQuantity('25');
      setFUom('Units');
      setFBudget('4500000');
      setFSuggestedVendor('Apple Authorised Reseller');
      setFDeliveryLoc('Dubai');
      setAiFilledFields(prev => new Set([...prev, 'fReqTitle', 'fBizUnit', 'fRequiredByDate', 'fPriority', 'fProcCategory', 'fSubcategory', 'fCapexOpex', 'fReqDesc', 'fQuantity', 'fUom', 'fBudget', 'fSuggestedVendor', 'fDeliveryLoc']));
    }, 1200);
  };

  const fBizUnitRef = useRef(null); const fPriorityRef = useRef(null);
  const fProcCatRef = useRef(null); const fSubcatRef = useRef(null);
  const fCapexRef = useRef(null); const fUomRef = useRef(null);
  const fVendorRef = useRef(null); const fDeliveryRef = useRef(null);

  /* ── upload ── */
  const [uploadPhase, setUploadPhase] = useState('empty');
  const [uReqTitle, setUReqTitle] = useState('MacBook Pro Units — Q3 Engineering Batch');
  const [uBizUnit, setUBizUnit] = useState('Engineering'); const [uBizUnitOpen, setUBizUnitOpen] = useState(false);
  const [uRequestorName, setURequestorName] = useState('David Kim');
  const [uRequestDate, setURequestDate] = useState(today);
  const [uRequiredByDate, setURequiredByDate] = useState('2026-07-15');
  const [uPriority, setUPriority] = useState('Urgent'); const [uPriorityOpen, setUPriorityOpen] = useState(false);
  const [uProcCategory, setUProcCategory] = useState('Technology and Consulting'); const [uProcCategoryOpen, setUProcCategoryOpen] = useState(false);
  const [uSubcategory, setUSubcategory] = useState('Staff Augmentation & Professional Services'); const [uSubcategoryOpen, setUSubcategoryOpen] = useState(false);
  const [uProjectName, setUProjectName] = useState('Q3 Engineering Onboarding');
  const [uCapexOpex, setUCapexOpex] = useState(''); const [uCapexOpexOpen, setUCapexOpexOpen] = useState(false);
  const [uJustification, setUJustification] = useState('');
  const [uReqDesc, setUReqDesc] = useState('Procurement of 25 MacBook Pro 14-inch M3 units for the incoming engineering batch joining Q3 2026. Includes standard accessories — Magic Mouse, USB-C hub, and protective cases.');
  const [uQuantity, setUQuantity] = useState('25');
  const [uUnitValue, setUUnitValue] = useState('');
  const [uUom, setUUom] = useState(''); const [uUomOpen, setUUomOpen] = useState(false);
  const [uBudget, setUBudget] = useState('1250000');
  const [uCostBreakdown, setUCostBreakdown] = useState('');
  const [uSuggestedVendor, setUSuggestedVendor] = useState('Apple Authorised Reseller'); const [uVendorOpen, setUVendorOpen] = useState(false);
  const [uVendorJustification, setUVendorJustification] = useState('');
  const [uContractRef, setUContractRef] = useState('');
  const [uDeliveryLoc, setUDeliveryLoc] = useState('Dubai'); const [uDeliveryOpen, setUDeliveryOpen] = useState(false);
  const [uTimeline, setUTimeline] = useState('');
  const [uUploadHover, setUUploadHover] = useState(false);
  const [uploadFormFiles, setUploadFormFiles] = useState([{ name: 'Q3_Procurement_Requirements.pdf', size: '2.4 MB' }]);
  const [uFormUploadHover, setUFormUploadHover] = useState(false);
  const uploadFormFileInputRef = useRef(null);

  const uBizUnitRef = useRef(null); const uPriorityRef = useRef(null);
  const uProcCatRef = useRef(null); const uSubcatRef = useRef(null);
  const uCapexRef = useRef(null); const uUomRef = useRef(null);
  const uVendorRef = useRef(null); const uDeliveryRef = useRef(null);

  /* ── scroll chat to bottom ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /* ── close dropdowns on outside click ── */
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

      if (uBizUnitRef.current && !uBizUnitRef.current.contains(e.target)) setUBizUnitOpen(false);
      if (uPriorityRef.current && !uPriorityRef.current.contains(e.target)) setUPriorityOpen(false);
      if (uProcCatRef.current && !uProcCatRef.current.contains(e.target)) setUProcCategoryOpen(false);
      if (uSubcatRef.current && !uSubcatRef.current.contains(e.target)) setUSubcategoryOpen(false);
      if (uCapexRef.current && !uCapexRef.current.contains(e.target)) setUCapexOpexOpen(false);
      if (uUomRef.current && !uUomRef.current.contains(e.target)) setUUomOpen(false);
      if (uVendorRef.current && !uVendorRef.current.contains(e.target)) setUVendorOpen(false);
      if (uDeliveryRef.current && !uDeliveryRef.current.contains(e.target)) setUDeliveryOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── reasoning flow ── */
  function startReasoning(responseIndex) {
    setShowReasoningPanel(true);
    setReasoningComplete(false);
    setReasoningSteps([]); // start empty — no steps visible yet

    const REASONING_STEPS_FULL = [
      { title: 'Reading procurement request', bullets: [] },
      { title: 'Extracting key requirements', bullets: ['Item type identified: Cloud consulting', 'Duration: 6 months'] },
      { title: 'Identifying missing fields', bullets: ['Cost centre not provided', 'Required-by date needed'] },
      { title: 'Checking procurement policy', bullets: [] },
      { title: 'Querying vendor database', bullets: ['847 vendors scanned', 'Filtered by category: Technology'] },
      { title: 'Applying location filter', bullets: ['Region: Dubai / UAE', '31 vendors matched'] },
      { title: 'Checking past performance scores', bullets: ['Minimum score threshold: 4.0', '12 vendors qualify'] },
      { title: 'Verifying compliance status', bullets: ['Active status check passed', '8 vendors fully compliant'] },
      { title: 'Running AI classification', bullets: ['Value: ₹45,00,000 — exceeds ₹10L threshold', 'Complexity score: 92%'] },
      { title: 'Validating against procurement policy', bullets: ['Policy §4.2: RFP required', 'Compliance check: passed'] },
      { title: 'Ranking shortlisted vendors', bullets: ['Top 5 selected by confidence score'] },
      { title: 'Generating PR draft summary', bullets: [] },
    ];

    const stepSets = [
      REASONING_STEPS_FULL.slice(0, 4),
      REASONING_STEPS_FULL.slice(4, 8),
      REASONING_STEPS_FULL.slice(8, 12),
    ];

    const steps = stepSets[responseIndex] || stepSets[0];
    let delay = 200;

    steps.forEach((step, i) => {
      // Step appears as ACTIVE when it starts
      setTimeout(() => {
        setReasoningSteps(prev => [
          ...prev.map(s => ({ ...s, status: 'complete' })), // mark all existing as complete
          { ...step, status: 'active' } // add new step as active
        ]);
      }, delay);
      delay += 800;
    });

    // Mark last step complete after it finishes
    setTimeout(() => {
      setReasoningSteps(prev => prev.map(s => ({ ...s, status: 'complete' })));
      setReasoningComplete(true);
    }, delay + 100);

    return delay + 500;
  }

  /* ── send chat ── */
  function sendMessage() {
    const text = inputValue.trim();
    if (!text && attachedFiles.length === 0) return;
    const userMessageCount = messages.filter(m => m.role === 'user').length;

    // add user message first
    const newMessages = [...messages, { role: 'user', text, files: attachedFiles }, { role: 'status', id: 'reasoning-status' }];
    setMessages(newMessages);
    setInputValue('');
    setAttachedFiles([]);

    // show typing & start reasoning
    setIsTyping(true);
    const aiDelay = startReasoning(userMessageCount);

    setTimeout(() => {
      setIsTyping(false);
      if (userMessageCount === 0) {
        setChatTitle('Cloud Migration Request');
        setMessages(prev => [...prev, { role: 'ai', text: "Got it. To complete your procurement request, I need a few more details. Could you confirm: what is your cost centre or business unit, and what is the required-by date for this engagement?" }]);
      } else if (userMessageCount === 1) {
        setMessages(prev => [...prev, { role: 'ai', text: "Perfect. And one last thing — do you have a preferred vendor in mind, or should this go out as an open RFP to shortlisted vendors?" }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "I have all the details I need. Here's a summary of your procurement request — please review and confirm to raise the PR.", type: 'summary' }]);
      }
    }, aiDelay);
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    if (attachedFiles.length + files.length > 5) {
      setToastMessage('Upload up to 5 files maximum.');
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3000);
      toastTimerRef.current = timer;
      e.target.value = '';
      return;
    }
    const validFiles = [];
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        setToastMessage('Each file up to 10 MB maximum.');
        setShowToast(true);
        const timer = setTimeout(() => setShowToast(false), 3000);
        toastTimerRef.current = timer;
        e.target.value = '';
        return;
      }
      validFiles.push({ name: file.name, size: (file.size / 1024 / 1024).toFixed(1) + ' MB' });
    }
    setAttachedFiles(prev => [...prev, ...validFiles]);
    e.target.value = '';
  }

  function handleFormFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      setUploadedFiles(prev => [...prev, { name: file.name, size: (file.size / 1024 / 1024).toFixed(1) + ' MB' }]);
    }
    e.target.value = '';
  }

  function handleUploadFormFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      setUploadFormFiles(prev => [...prev, { name: file.name, size: (file.size / 1024 / 1024).toFixed(1) + ' MB' }]);
    }
    e.target.value = '';
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function handlePromptClick(text) {
    setInputValue(text);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  /* ── upload zone click ── */
  function handleUploadClick() {
    if (uploadPhase !== 'empty') return;
    setUploadPhase('uploading');
    setTimeout(() => {
      setUploadPhase('scanning');
      setTimeout(() => setUploadPhase('complete'), 2000);
    }, 1500);
  }

  function triggerConfetti() {
    if (!document.getElementById('confetti-style')) {
      const style = document.createElement('style');
      style.id = 'confetti-style';
      style.innerHTML = `@keyframes confettiFall {
        from { transform: translateY(0) rotate(0deg); opacity: 1; }
        to { transform: translateY(${window.innerHeight + 100}px) rotate(720deg); opacity: 0; }
      }`;
      document.head.appendChild(style);
    }
    const colors = ['#0052cc', '#7c7cff', '#22c55e', '#f59e0b', '#ef4444', '#4fd1c5', '#ffffff'];
    for (let i = 0; i < 80; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '300';
      confetti.style.width = Math.floor(Math.random() * 7 + 6) + 'px';
      confetti.style.height = Math.floor(Math.random() * 9 + 8) + 'px';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      const shape = Math.random();
      confetti.style.borderRadius = shape < 0.33 ? '50%' : shape < 0.66 ? '2px' : '3px';
      confetti.style.left = (20 + Math.random() * 60) + 'vw';
      confetti.style.top = '-20px';
      const duration = Math.random() * 1.4 + 1.8;
      const delay = Math.random() * 0.8;
      confetti.style.animation = `confettiFall ${duration}s ${delay}s ease-in forwards`;
      document.body.appendChild(confetti);
      setTimeout(() => {
        if (confetti.parentNode) confetti.parentNode.removeChild(confetti);
      }, (duration + delay) * 1000 + 100);
    }
  }

  function handleUploadSubmit() {
    triggerConfetti();
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 400);
  }

  function handleFormSubmit() {
    triggerConfetti();
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 400);
  }

  function handleBack() {
    let hasDraft = false;

    if (activeMode === 'chat') {
      hasDraft = messages.length > 0;
    }

    if (activeMode === 'form') {
      hasDraft = (
        fReqTitle.trim() !== '' ||
        fReqDesc.trim() !== '' ||
        fBizUnit !== '' ||
        fProjectName.trim() !== '' ||
        fJustification.trim() !== '' ||
        fQuantity.trim() !== '' ||
        fUnitValue.trim() !== '' ||
        fBudget.trim() !== '' ||
        fCostBreakdown.trim() !== '' ||
        fSuggestedVendor !== '' ||
        fVendorJustification.trim() !== '' ||
        fContractRef.trim() !== '' ||
        fTimeline.trim() !== '' ||
        uploadedFiles.length > 0
      );
    }

    if (activeMode === 'upload') {
      hasDraft = (
        uploadPhase !== 'empty' ||
        uReqTitle.trim() !== '' ||
        uReqDesc.trim() !== '' ||
        uBudget.trim() !== '' ||
        uQuantity.trim() !== '' ||
        uploadFormFiles.length > 0
      );
    }

    if (hasDraft) {
      setToastMessage('Your request has been saved as a draft.');
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        onNavigate('Dashboard');
      }, 2000);
      toastTimerRef.current = timer;
    } else {
      onNavigate('Dashboard');
    }
  }

  const hasMessages = messages.length > 0;
  const charCount = inputValue.length;

  /* ── scoped CSS ── */
  const css = `
    @keyframes textShimmer {
      0% { opacity: 1 }
      50% { opacity: 0.4 }
      100% { opacity: 1 }
    }
    @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(-12px) } to { opacity: 1; transform: translateX(-50%) translateY(0) } }
    @keyframes paiDot { from{opacity:0.25} to{opacity:1} }
    @keyframes paiSpin { to{transform:rotate(360deg)} }

    @keyframes spinOnce { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
    @keyframes uploadProgress { from { width: 0% } to { width: 100% } }
    @keyframes shimmer { 0% { left: -40% } 100% { left: 100% } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
    @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
    @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.6 } }
    @keyframes statusPulse { 0%,100% { opacity:1; transform: scale(1) } 50% { opacity:0.7; transform: scale(0.92) } }
    @keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: translateY(0) } }
    .pai-chip{transition:all .15s ease}
    .pai-chip:hover{border-color:#7c7cff!important;background:rgba(124,124,255,0.02)!important;box-shadow:0 2px 8px rgba(124,124,255,0.08)!important;transform:translateY(-1px)}
    .pai-upload-zone{transition:all .2s ease}
    .pai-upload-zone:hover{border-color:#7c7cff!important;background:rgba(124,124,255,0.015)!important}
    .pai-attach-btn{transition:background .12s ease}
    .pai-attach-btn:hover{background:var(--bg-surface-2)!important}
    .pai-trash:hover{background:rgba(239,68,68,0.08)!important;color:#ef4444!important}
    .pai-modetab{transition:all .15s ease}
  `;

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */
  return (
    <MainLayout userRole={userRole} activeNav={activeNav} onNavigate={onNavigate} titleComponent={null} searchPlaceholder={null}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ═══ TOAST NOTIFICATION ═══ */}
      {showToast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 500, pointerEvents: 'auto',
          background: '#f0fdf4', border: '1px solid rgba(34,197,94,0.25)', borderLeft: '4px solid #22c55e', borderRadius: 12, padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 8px 32px rgba(14,15,37,0.1)',
          minWidth: 360, maxWidth: 500, animation: 'toastIn 0.2s ease forwards'
        }}>
          <CheckCircle size={22} color="#22c55e" style={{ flexShrink: 0 }} strokeWidth={2} />
          <div style={{ fontSize: 14, fontWeight: 600, color: '#15803d', flex: 1, lineHeight: 1.4 }}>{toastMessage}</div>
          <div
            onClick={() => { clearTimeout(toastTimerRef.current); setShowToast(false); if (toastMessage.includes('draft')) onNavigate('Dashboard'); }}
            style={{ padding: 4, borderRadius: 6, cursor: 'pointer', color: 'rgba(21,128,61,0.5)', display: 'flex', flexShrink: 0, transition: 'all 0.15s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#15803d'; e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(21,128,61,0.5)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <X size={18} strokeWidth={2} />
          </div>
        </div>
      )}

      {showDownload && (
        <div style={{
          position: 'fixed', top: 20, right: 24, zIndex: 1000,
          background: '#fff', border: '1px solid var(--border-subtle)',
          borderRadius: 14, padding: '14px 16px', width: 320,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={18} color="#ef4444" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Chat Transcript.pdf</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{downloadDone ? 'Downloaded' : 'Downloading...'}</div>
            </div>
            <button onClick={() => setShowDownload(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 4, display: 'flex' }}>
              <X size={14} />
            </button>
          </div>
          <div style={{ height: 4, background: 'rgba(0,0,0,0.02)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 999,
              background: downloadDone ? '#22c55e' : 'linear-gradient(90deg, #0052cc, #7c7cff)',
              width: `${downloadProgress}%`,
              transition: 'width 0.2s ease, background 0.3s ease',
            }} />
          </div>
        </div>
      )}

      {showShareModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setShowShareModal(false)}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: '28px 28px 24px',
            width: 480, boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Share Conversation</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>Anyone with this link can view this conversation</div>
              </div>
              <button onClick={() => setShowShareModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 4, display: 'flex', marginLeft: 12 }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '16px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                flex: 1, background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)',
                borderRadius: 8, padding: '9px 12px', fontSize: 12,
                color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                https://procurai.app/share/conv-a8f2c91d
              </div>
              <button
                onClick={() => { setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: linkCopied ? '#22c55e' : '#0052cc',
                  color: '#fff', border: 'none', borderRadius: 8,
                  padding: '9px 16px', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
                  transition: 'background 0.2s ease',
                }}
              >
                {linkCopied ? <><CheckCircle size={14} /> Copied!</> : <><Link size={14} /> Copy Link</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TOP BAR ═══ */}
      <div style={{
        height: 56, minHeight: 56, background: '#fff', borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0, position: 'relative',
      }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <div onClick={handleBack} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
            <ArrowLeft size={16} strokeWidth={2} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
            {activeMode === 'chat' && hasMessages ? chatTitle : 'New Request'}
          </span>
        </div>

        {/* Centre — mode toggle */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'inline-flex', background: 'rgba(0,0,0,0.02)', borderRadius: 10, padding: 4, gap: 2 }}>
          {['chat', 'form'].map((m) => (
            <button
              key={m}
              onClick={() => setActiveMode(m)}
              className="pai-modetab"
              style={{
                padding: '7px 20px', borderRadius: 8, fontSize: 13, cursor: 'pointer', border: 'none',
                fontFamily: 'inherit',
                fontWeight: activeMode === m ? 600 : 500,
                background: activeMode === m ? '#fff' : 'transparent',
                color: activeMode === m ? 'var(--colors-blue-500)' : 'var(--text-tertiary)',
                boxShadow: activeMode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, justifyContent: 'flex-end' }}>
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 34, height: 34, borderRadius: 8,
                border: 'none',
                background: menuOpen ? 'var(--bg-surface-1)' : '#fff',
                cursor: 'pointer', color: 'var(--text-tertiary)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-1)'}
              onMouseLeave={(e) => { if (!menuOpen) e.currentTarget.style.background = '#fff'; }}
            >
              <MoreHorizontal size={16} />
            </button>

            {menuOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                background: '#fff', border: '1px solid var(--border-default)',
                borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                padding: 6, zIndex: 200, minWidth: 180,
              }}>
                {[
                  { icon: isPinned ? PinOff : Pin, label: isPinned ? 'Unpin' : 'Pin', action: () => { setIsPinned(p => !p); setMenuOpen(false); setToastMessage(isPinned ? 'Request unpinned' : 'Request pinned to top'); setShowToast(true); clearTimeout(toastTimerRef.current); toastTimerRef.current = setTimeout(() => setShowToast(false), 3000); } },
                  { icon: Edit2, label: 'Rename', action: () => { setMenuOpen(false); setRenameValue('MacBook Pro Upgrade Request'); setShowRenameModal(true); } },
                  { icon: Share2, label: 'Share', action: () => { setMenuOpen(false); setShowShareModal(true); setLinkCopied(false); } },
                  { icon: Download, label: 'Download', action: handleDownload },
                ].map(({ icon: Icon, label, action }) => (
                  <div
                    key={label}
                    onClick={action}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 12px', borderRadius: 7, cursor: 'pointer',
                      fontSize: 13, color: 'var(--text-primary)',
                      transition: 'background 0.12s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Icon size={14} color="var(--text-secondary)" />
                    {label}
                  </div>
                ))}
                <div
                  onClick={() => { setMenuOpen(false); setShowDeleteModal(true); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 12px', borderRadius: 7, cursor: 'pointer',
                    fontSize: 13, color: '#ef4444',
                    transition: 'background 0.12s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Trash2 size={14} color="#ef4444" />
                  Delete
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ MODE: CHAT ═══ */}
      {activeMode === 'chat' && (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100%', overflow: 'hidden', background: 'var(--bg-default)' }}>
          {/* Left: Chat Area */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Messages / empty state */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: hasMessages ? '24px' : '40px 24px 24px', gap: hasMessages ? 16 : 0 }}>
              <div style={{ width: '100%', maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: hasMessages ? 'stretch' : 'stretch', gap: hasMessages ? 16 : 0, flex: hasMessages ? undefined : 1 }}>

                {!hasMessages ? (
                  /* ── Empty state ── */
                  <>
                    {/* Greeting block */}
                    <div style={{ marginBottom: 36, textAlign: 'left' }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Hi {userRole === 'manager' ? 'Sarah' : 'David'} 👋</div>
                      <div style={{ fontSize: 14, color: 'var(--text-tertiary)', marginTop: 6 }}>
                        Your AI assistant for procurement requests.
                      </div>
                    </div>

                    {/* Guidance pointers block */}
                    <div style={{ width: '100%', marginBottom: 32 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 14, textAlign: 'left' }}>
                        To build your request, I'll need a few details —
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                          'What to procure — item, quantity, specs and purpose',
                          'Budget & timeline — estimated cost, deadline, CapEx or OpEx',
                          'Team & location — cost centre, business unit, delivery location',
                          'Category & vendor — procurement type, subcategory, preferred supplier',
                        ].map((t, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <span style={{ fontSize: 14, color: 'var(--text-tertiary)', flexShrink: 0, lineHeight: 1.5 }}>·</span>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{t}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Starter prompts block */}
                    <div style={{ width: '100%', marginBottom: 32 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-tertiary)', marginBottom: 10, textAlign: 'left' }}>
                        Choose how to get started —
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: '1fr', gap: 12, width: '100%', margin: '0 auto', paddingBottom: 28 }}>

                        {/* CARD 1 - Narrative */}
                        <div
                          onClick={() => {
                            setSelectedPrompt(0);
                            handlePromptClick('I need to procure [item/service] for [team/purpose].\nWe need [quantity] with a budget of ₹[amount],\ndelivered at [location] by [date].\nCost centre is [department].\n[Vendor preference or open to sourcing.]');
                          }}
                          onMouseEnter={() => setHoveredCard(0)}
                          onMouseLeave={() => setHoveredCard(null)}
                          style={{
                            position: 'relative', overflow: 'hidden', borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 210, height: '100%', boxSizing: 'border-box',
                            background: hoveredCard === 0 ? 'linear-gradient(145deg, rgba(0,82,204,0.03) 0%, rgba(124,124,255,0.08) 100%)' : 'linear-gradient(145deg, #ffffff 0%, rgba(124,124,255,0.04) 100%)',
                            border: hoveredCard === 0 ? '1px solid #7c7cff' : '1px solid rgba(124,124,255,0.2)',
                            boxShadow: hoveredCard === 0 ? '0 0 0 1px rgba(124,124,255,0.4), 0 8px 24px rgba(124,124,255,0.15)' : 'none',
                            transform: hoveredCard === 0 ? 'translateY(-3px)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'linear-gradient(135deg, rgba(0,82,204,0.1), rgba(124,124,255,0.18))' }}>
                              <MessageSquare size={17} color="#7c7cff" />
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#3d3db8' }}>Describe naturally</div>
                          </div>
                          <div style={{ flex: 1, fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.6, fontFamily: 'JetBrains Mono, monospace', display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginTop: 4 }}>
                            I need to procure [item/service] for [team/purpose]. We need [quantity], budget ₹[amount], by [date]. Cost centre: [dept].
                          </div>
                        </div>

                        {/* CARD 2 - From Document */}
                        <div
                          onClick={() => {
                            setSelectedPrompt(1);
                            setInputValue('I have attached a document / image that has most of the procurement details.\n\nPlease capture what you can from it and let me know if anything is unclear or missing.');
                            setTimeout(() => {
                              textareaRef.current?.focus();
                              fileInputRef.current?.click();
                            }, 0);
                          }}
                          onMouseEnter={() => setHoveredCard(1)}
                          onMouseLeave={() => setHoveredCard(null)}
                          style={{
                            position: 'relative', overflow: 'hidden', borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 210, height: '100%', boxSizing: 'border-box',
                            background: hoveredCard === 1 ? 'linear-gradient(145deg, rgba(0,82,204,0.03) 0%, rgba(124,124,255,0.08) 100%)' : 'linear-gradient(145deg, #ffffff 0%, rgba(124,124,255,0.04) 100%)',
                            border: hoveredCard === 1 ? '1px solid #7c7cff' : '1px solid rgba(124,124,255,0.2)',
                            boxShadow: hoveredCard === 1 ? '0 0 0 1px rgba(124,124,255,0.4), 0 8px 24px rgba(124,124,255,0.15)' : 'none',
                            transform: hoveredCard === 1 ? 'translateY(-3px)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'linear-gradient(135deg, rgba(0,82,204,0.1), rgba(124,124,255,0.18))' }}>
                              <Paperclip size={17} color="#7c7cff" />
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#3d3db8' }}>Share a file or image</div>
                          </div>
                          <div style={{ flex: 1, fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.6, fontFamily: 'JetBrains Mono, monospace', display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginTop: 4 }}>
                            I have attached a document with procurement details. Please extract what you can and ask if anything is unclear.
                          </div>
                        </div>

                        {/* CARD 3 - Fill in Fields */}
                        <div
                          onClick={() => {
                            setSelectedPrompt(2);
                            handlePromptClick('Here are the details I have ready:\n\nTitle:\nCategory:\nQuantity:\nBudget (₹):\nRequired By:\nCost Centre:\nDelivery Location:\nVendor Preference:\nNotes:\n\nLet me know what else you need.');
                          }}
                          onMouseEnter={() => setHoveredCard(2)}
                          onMouseLeave={() => setHoveredCard(null)}
                          style={{
                            position: 'relative', overflow: 'hidden', borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 210, height: '100%', boxSizing: 'border-box',
                            background: hoveredCard === 2 ? 'linear-gradient(145deg, rgba(0,82,204,0.03) 0%, rgba(124,124,255,0.08) 100%)' : 'linear-gradient(145deg, #ffffff 0%, rgba(124,124,255,0.04) 100%)',
                            border: hoveredCard === 2 ? '1px solid #7c7cff' : '1px solid rgba(124,124,255,0.2)',
                            boxShadow: hoveredCard === 2 ? '0 0 0 1px rgba(124,124,255,0.4), 0 8px 24px rgba(124,124,255,0.15)' : 'none',
                            transform: hoveredCard === 2 ? 'translateY(-3px)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'linear-gradient(135deg, rgba(0,82,204,0.1), rgba(124,124,255,0.18))' }}>
                              <FileText size={17} color="#7c7cff" />
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#3d3db8' }}>Fill in the fields</div>
                          </div>
                          <div style={{ flex: 1, fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.6, fontFamily: 'JetBrains Mono, monospace', display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginTop: 4 }}>
                            Here are the details I have ready: Title: Category: Quantity: Budget (₹): Required By: Cost Centre: Delivery Location:
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* ── Messages ── */
                  <>
                    {messages.map((msg, i) => {
                      const isLiked = likedMsgs.has(i);
                      const isDisliked = dislikedMsgs.has(i);

                      if (msg.role === 'status') {
                        return (
                          <div key={i} style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, width: '72%' }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #0052cc, #7c7cff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Sparkles size={13} color="#fff" strokeWidth={2} />
                            </div>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(124,124,255,0.04)', border: '1px solid rgba(124,124,255,0.15)', borderRadius: 10, padding: '10px 16px' }}>
                              <div style={{ flex: 1 }}>
                                {reasoningComplete ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                                    {/*<CheckCircle size={14} color="#22c55e" />*/}
                                    Completed
                                  </div>
                                ) : (
                                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', animation: 'textShimmer 1.2s ease-in-out infinite', display: 'inline-block' }}>
                                    {[...reasoningSteps].reverse().find(s => s.status === 'active')?.title || 'Analysing your request...'}
                                  </div>
                                )}
                              </div>
                              <button onClick={() => setShowReasoningPanel(p => !p)} style={{ fontSize: 12, fontWeight: 500, color: '#7c7cff', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                                {showReasoningPanel ? 'Hide Steps' : 'Show Steps'}
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return msg.role === 'user' ? (
                        editingMsgIndex === i ? (
                          <div key={i} style={{ alignSelf: 'flex-end', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, maxWidth: '72%', width: '100%' }}>
                            <textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              autoFocus
                              style={{
                                width: '100%', minHeight: 60, padding: '10px 14px',
                                border: '1.5px solid #7c7cff', borderRadius: 12,
                                background: '#fff', fontSize: 14, color: 'var(--text-primary)',
                                fontFamily: 'inherit', resize: 'none', outline: 'none',
                                boxShadow: '0 0 0 3px rgba(124,124,255,0.1)',
                              }}
                            />
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                onClick={() => setEditingMsgIndex(null)}
                                style={{ padding: '6px 14px', border: '1px solid var(--border-default)', borderRadius: 7, background: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-secondary)' }}
                              >
                                <Save size={15} strokeWidth={2} /> Save Draft
                              </button>
                              <button
                                onClick={() => {
                                  setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, text: editingText, content: editingText } : m));
                                  setEditingMsgIndex(null);
                                }}
                                style={{ padding: '6px 14px', border: 'none', borderRadius: 7, background: '#0052cc', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                              >Save</button>
                            </div>
                          </div>
                        ) : (
                          <div key={i} style={{ position: 'relative', alignSelf: 'flex-end', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, maxWidth: '72%' }} onMouseEnter={() => setHoveredUserMsg(i)} onMouseLeave={() => setHoveredUserMsg(null)}>
                            <div style={{
                              alignSelf: 'flex-end', maxWidth: '100%', background: 'rgba(0,82,204,0.05)',
                              border: '1px solid rgba(0,82,204,0.1)', borderRadius: '14px 14px 4px 14px',
                              padding: '12px 16px', fontSize: 14, color: 'var(--text-primary)',
                              lineHeight: 1.5, whiteSpace: 'pre-wrap'
                            }}>
                              {msg.attachments && msg.attachments.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                                  {msg.attachments.map((file, fi) => (
                                    <div key={fi} style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: 7, maxWidth: 180 }}>
                                      <FileText size={13} color="#0052cc" strokeWidth={2} style={{ flexShrink: 0 }} />
                                      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100 }}>{file.name}</span>
                                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)', whiteSpace: 'nowrap', flexShrink: 0 }}>{file.size}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {msg.files && msg.files.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                                  {msg.files.map((file, fi) => (
                                    <div key={fi} style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: 7, maxWidth: 180 }}>
                                      <FileText size={13} color="#0052cc" strokeWidth={2} style={{ flexShrink: 0 }} />
                                      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100 }}>{file.name}</span>
                                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)', whiteSpace: 'nowrap', flexShrink: 0 }}>{file.size}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {msg.text}
                            </div>
                            {/* Always reserve space for action row to prevent jank */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', height: 26, visibility: hoveredUserMsg === i ? 'visible' : 'hidden', opacity: hoveredUserMsg === i ? 1 : 0, transition: 'opacity 0.15s ease' }}>
                              <button onClick={() => {
                                setCopiedMsgs(prev => new Set(prev).add(i));
                                const timer = setTimeout(() => setCopiedMsgs(prev => { const n = new Set(prev); n.delete(i); return n; }), 2000);
                                tooltipTimers.current.add(timer);
                              }} style={{ position: 'relative', overflow: 'visible', width: 26, height: 26, borderRadius: 6, border: 'none', background: copiedMsgs.has(i) ? 'rgba(34,197,94,0.08)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: copiedMsgs.has(i) ? '#22c55e' : 'var(--text-tertiary)', transition: 'all 0.15s ease' }} onMouseEnter={e => { if (!copiedMsgs.has(i)) { e.currentTarget.style.background = 'var(--bg-surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; } }} onMouseLeave={e => { if (!copiedMsgs.has(i)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; } }}>
                                {copiedMsgs.has(i) ? <CheckCircle size={13} /> : <Copy size={13} />}
                                {copiedMsgs.has(i) && <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: 'rgba(26,26,26,0.9)', color: 'white', fontSize: 10, fontWeight: 500, borderRadius: 5, padding: '4px 8px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 100 }}>Copied!</div>}
                              </button>
                              <button
                                onClick={() => { setEditingMsgIndex(i); setEditingText(msg.text); }}
                                style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', transition: 'all 0.15s ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}>
                                <Edit2 size={13} />
                              </button>
                            </div>
                          </div>
                        )
                      ) : (
                        <div key={i} style={{ alignSelf: 'flex-start', maxWidth: '72%', display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 40 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                            <div style={{ background: 'transparent', border: 'none', padding: '2px 0 0 0', fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6, maxWidth: '100%' }}>
                              {msg.text}
                              {msg.type === 'summary' && (
                                <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: 0, marginTop: 12, overflow: 'hidden', maxWidth: 520, maxHeight: 420, display: 'flex', flexDirection: 'column' }}>
                                  <div style={{ background: 'linear-gradient(135deg, rgba(0,82,204,0.04), rgba(124,124,255,0.06))', padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <FileText size={16} color="#0052cc" />
                                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>PR Draft Summary</div>
                                    </div>
                                  </div>
                                  <div style={{ overflowY: 'auto', maxHeight: 300, padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                                    {/* Row 1 */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Title</div>
                                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3 }}>AWS Cloud Migration Consulting Services</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Request ID</div>
                                      <div style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-tertiary)', marginTop: 3 }}>Auto-generated on submission</div>
                                    </div>
                                    {/* Row 2 */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Category</div>
                                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3 }}>Technology and Consulting</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Subcategory</div>
                                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3 }}>Cloud & Infrastructure Services</div>
                                    </div>
                                    {/* Row 3 */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Spend Category</div>
                                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3 }}>Indirect Spend</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>CapEx / OpEx</div>
                                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3 }}>OpEx</div>
                                    </div>
                                    {/* Row 4 */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Cost Centre</div>
                                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3 }}>Engineering</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Project Name</div>
                                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3 }}>Infrastructure Modernisation 2026</div>
                                    </div>

                                    {/* Divider for next 4 rows */}
                                    <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border-subtle)', paddingTop: 10, marginTop: 4, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                                      {/* Row 5 */}
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Priority</div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3 }}>
                                          <span style={{ background: 'rgba(245,158,11,0.08)', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 600, color: '#b45309' }}>Urgent</span>
                                        </div>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Required By</div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3 }}>15 July 2026</div>
                                      </div>
                                      {/* Row 6 */}
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Request Date</div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3 }}>29 May 2026</div>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Requestor</div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3 }}>David Kim</div>
                                      </div>
                                      {/* Row 7 */}
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Quantity</div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3 }}>1</div>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Unit of Measure</div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3 }}>Resources</div>
                                      </div>
                                      {/* Row 8 */}
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Budget</div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3 }}>₹45,00,000</div>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Estimated Unit Value</div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3 }}>₹45,00,000</div>
                                      </div>
                                    </div>

                                    {/* Divider for next 4 rows */}
                                    <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border-subtle)', paddingTop: 10, marginTop: 4, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                                      {/* Row 9 */}
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Location</div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3 }}>Dubai</div>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Suggested Vendor</div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3 }}>Open to sourcing</div>
                                      </div>
                                      {/* Row 10 */}
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Vendor Justification</div>
                                        <div style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-tertiary)', marginTop: 3 }}>—</div>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Contract Reference</div>
                                        <div style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-tertiary)', marginTop: 3 }}>—</div>
                                      </div>
                                      {/* Row 11 */}
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, gridColumn: 'span 2' }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Requirement Description</div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3, lineHeight: 1.4 }}>Consulting services for migrating on-premise infrastructure to AWS. Assessment, architecture design, migration execution, and post-migration support. Expected team: 3 senior architects, 6 months.</div>
                                      </div>
                                      {/* Row 12 */}
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Pricing Model</div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3 }}>Time & Materials</div>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--text-tertiary)' }}>Timeline</div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3, lineHeight: 1.4 }}>Phase 1: Assessment (Month 1-2), Phase 2: Migration (Month 3-5), Phase 3: Support (Month 6)</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                                    <button onClick={() => { setShowSuccessModal(true); triggerConfetti(); }} style={{ background: 'linear-gradient(135deg, #0052cc, #7c7cff)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 12px rgba(0,82,204,0.12)' }}>
                                      Raise PR
                                      <ArrowRight size={14} />
                                    </button>
                                    <button style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                                      <Edit2 size={14} />
                                      Refine Details
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 0 }}>
                            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginRight: 8 }}>10:04 AM</span>

                            {/* Copy Button */}
                            <button onClick={() => {
                              setCopiedMsgs(prev => new Set(prev).add(i));
                              const timer = setTimeout(() => setCopiedMsgs(prev => { const n = new Set(prev); n.delete(i); return n; }), 2000);
                              tooltipTimers.current.add(timer);
                            }} style={{ position: 'relative', overflow: 'visible', width: 28, height: 28, borderRadius: 7, border: 'none', background: copiedMsgs.has(i) ? 'rgba(34,197,94,0.08)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: copiedMsgs.has(i) ? '#22c55e' : 'var(--text-tertiary)', transition: 'all 0.15s ease' }} onMouseEnter={e => { if (!copiedMsgs.has(i)) { e.currentTarget.style.background = 'var(--bg-surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; } }} onMouseLeave={e => { if (!copiedMsgs.has(i)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; } }}>
                              {copiedMsgs.has(i) ? <CheckCircle size={14} /> : <Copy size={14} />}
                              {copiedMsgs.has(i) && <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: 'rgba(26,26,26,0.9)', color: 'white', fontSize: 10, fontWeight: 500, borderRadius: 5, padding: '4px 8px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 100 }}>Copied!</div>}
                            </button>

                            {/* ThumbsUp Button */}
                            <button onClick={() => {
                              setLikedMsgs(prev => {
                                const n = new Set(prev);
                                if (n.has(i)) n.delete(i);
                                else {
                                  n.add(i);
                                  setDislikedMsgs(d => { const nd = new Set(d); nd.delete(i); return nd; });
                                  setLikedTooltipVisible(t => new Set(t).add(i));
                                  const timer = setTimeout(() => setLikedTooltipVisible(t => { const nt = new Set(t); nt.delete(i); return nt; }), 1500);
                                  tooltipTimers.current.add(timer);
                                }
                                return n;
                              });
                            }} style={{ position: 'relative', overflow: 'visible', width: 28, height: 28, borderRadius: 7, border: 'none', background: isLiked ? 'rgba(34,197,94,0.08)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isLiked ? '#22c55e' : 'var(--text-tertiary)', transition: 'all 0.15s ease' }} onMouseEnter={e => { if (!isLiked) { e.currentTarget.style.background = 'var(--bg-surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; } }} onMouseLeave={e => { if (!isLiked) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; } }}>
                              <ThumbsUp size={14} />
                              {likedTooltipVisible.has(i) && <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: 'rgba(26,26,26,0.9)', color: 'white', fontSize: 10, fontWeight: 500, borderRadius: 5, padding: '4px 8px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 100 }}>Liked</div>}
                            </button>

                            {/* ThumbsDown Button */}
                            <button onClick={() => {
                              setDislikedMsgs(prev => {
                                const n = new Set(prev);
                                if (n.has(i)) n.delete(i);
                                else {
                                  n.add(i);
                                  setLikedMsgs(l => { const nl = new Set(l); nl.delete(i); return nl; });
                                  setDislikedTooltipVisible(t => new Set(t).add(i));
                                  const timer = setTimeout(() => setDislikedTooltipVisible(t => { const nt = new Set(t); nt.delete(i); return nt; }), 1500);
                                  tooltipTimers.current.add(timer);
                                }
                                return n;
                              });
                            }} style={{ position: 'relative', overflow: 'visible', width: 28, height: 28, borderRadius: 7, border: 'none', background: isDisliked ? 'rgba(239,68,68,0.08)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDisliked ? '#ef4444' : 'var(--text-tertiary)', transition: 'all 0.15s ease' }} onMouseEnter={e => { if (!isDisliked) { e.currentTarget.style.background = 'var(--bg-surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; } }} onMouseLeave={e => { if (!isDisliked) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; } }}>
                              <ThumbsDown size={14} />
                              {dislikedTooltipVisible.has(i) && <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: 'rgba(26,26,26,0.9)', color: 'white', fontSize: 10, fontWeight: 500, borderRadius: 5, padding: '4px 8px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 100 }}>Disliked</div>}
                            </button>

                            {/* Regenerate Button */}
                            <button onClick={() => {
                              setRegeneratingMsgs(prev => new Set([...prev, i]));
                              setTimeout(() => {
                                setRegeneratingMsgs(prev => { const next = new Set(prev); next.delete(i); return next; });
                              }, 1500);
                            }} style={{ position: 'relative', overflow: 'visible', width: 28, height: 28, borderRadius: 7, border: 'none', background: regeneratingMsgs.has(i) ? 'rgba(124,124,255,0.08)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: regeneratingMsgs.has(i) ? '#7c7cff' : 'var(--text-tertiary)', transition: 'all 0.15s ease' }} onMouseEnter={e => { if (!regeneratingMsgs.has(i)) { e.currentTarget.style.background = 'var(--bg-surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; } }} onMouseLeave={e => { if (!regeneratingMsgs.has(i)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; } }}>
                              <RotateCcw size={14} style={{ animation: regeneratingMsgs.has(i) ? 'spinOnce 0.6s linear infinite' : 'none' }} />
                              {regeneratingMsgs.has(i) && <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: 'rgba(26,26,26,0.9)', color: 'white', fontSize: 10, fontWeight: 500, borderRadius: 5, padding: '4px 8px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 100 }}>Regenerating...</div>}
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </div>

            {/* ── Chat input bar ── */}
            <div style={{ flexShrink: 0, padding: '16px 24px 20px', background: '#fff', boxShadow: 'none', borderTop: 'none' }}>
              <div style={{ width: '100%', maxWidth: 760, margin: '0 auto' }}>
                <div style={{
                  background: '#fff',
                  border: `1.5px solid ${inputFocused ? '#7c7cff' : 'var(--border-default)'}`,
                  borderRadius: 14, padding: '12px 14px',
                  display: 'flex', flexDirection: 'column', gap: 8,
                  boxShadow: inputFocused ? '0 0 0 3px rgba(124,124,255,0.09), 0 2px 8px rgba(14,15,37,0.06)' : '0 2px 8px rgba(14,15,37,0.06)',
                  transition: 'border-color .15s ease, box-shadow .15s ease',
                }}>
                  {isRecording ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
                      <button disabled style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'not-allowed', flexShrink: 0, opacity: 0.4 }}>
                        <Paperclip size={18} strokeWidth={2} />
                      </button>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', height: 24, padding: '0 12px' }}>
                        {[...Array(150)].map((_, i) => (
                          <div key={i} style={{
                            width: 3,
                            height: [6, 10, 14, 18, 12, 8, 22, 16, 8, 12, 20, 14, 10, 14, 8][i % 15],
                            background: 'var(--text-tertiary)',
                            borderRadius: 2,
                            animation: `paiVoiceBar ${0.5 + (i % 4)*0.15}s ease-in-out infinite alternate`,
                            flexShrink: 0
                          }} />
                        ))}
                        <style>{`
                          @keyframes paiVoiceBar {
                            0% { transform: scaleY(0.3); opacity: 0.3; }
                            100% { transform: scaleY(1); opacity: 0.8; }
                          }
                        `}</style>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <button 
                          onClick={() => setIsRecording(false)} 
                          onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, borderRadius: 6, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }}>
                          <X size={20} strokeWidth={2} />
                        </button>
                        <button 
                          onClick={() => {
                            setIsRecording(false);
                            setInputValue("I need to procure laptops for new engineering hires joining next month");
                          }} 
                          onMouseEnter={e => { e.currentTarget.style.color = '#22c55e'; e.currentTarget.style.background = 'rgba(34,197,94,0.08)'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, borderRadius: 6, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }}>
                          <Check size={20} strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Attachment pill row */}
                  {attachedFiles.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)', marginBottom: 4 }}>
                      {attachedFiles.map((file, i) => (
                        <div key={i} style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: 7, maxWidth: 180 }}>
                          <FileText size={13} color="#0052cc" strokeWidth={2} style={{ flexShrink: 0 }} />
                          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100 }}>{file.name}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', whiteSpace: 'nowrap', flexShrink: 0 }}>{file.size}</span>
                          <div
                            onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#ef4444';
                              e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = 'var(--text-tertiary)';
                              e.currentTarget.style.background = 'transparent';
                            }}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: 2, padding: 2, borderRadius: 4, flexShrink: 0, color: 'var(--text-tertiary)', transition: 'all 0.15s ease' }}
                          >
                            <X size={12} strokeWidth={2} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    onKeyDown={handleKeyDown}
                    onInput={(e) => {
                      if (textareaRef.current) {
                        textareaRef.current.style.height = 'auto';
                        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 154) + 'px';
                      }
                    }}
                    placeholder={activeMode === 'chat' ? 'Describe your procurement need or choose a starter prompt' : 'Describe your procurement need or choose a template above...'}
                    rows={1}
                    style={{
                      width: '100%', border: 'none', outline: 'none', background: 'transparent',
                      fontSize: 14, color: 'var(--text-primary)', resize: 'none',
                      minHeight: 24, maxHeight: 154, overflowY: 'auto',
                      fontFamily: 'Inter, sans-serif', lineHeight: 1.5,
                    }}
                  />

                  {/* Bottom action row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                    {/* Left side — Attach button */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="pai-attach-icon-btn"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: 4, border: 'none', background: 'transparent', borderRadius: 6,
                          cursor: 'pointer', color: 'var(--text-tertiary)', transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#7c7cff';
                          e.currentTarget.style.background = 'rgba(124,124,255,0.08)';
                          setShowUploadTooltip(true);
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-tertiary)';
                          e.currentTarget.style.background = 'transparent';
                          setShowUploadTooltip(false);
                        }}
                      >
                        <Paperclip size={18} strokeWidth={2} />
                      </button>
                      {showUploadTooltip && (
                        <div style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 8px)',
                          left: '0%',
                          background: '#fff',
                          border: '1px solid var(--border-default)',
                          borderRadius: 8,
                          padding: '10px 14px',
                          fontSize: 12,
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                          zIndex: 100,
                          pointerEvents: 'none'
                        }}>
                          Upload one PDF, DOCX, or PPT file (up to 25 MB)
                        </div>
                      )}
                      <input type="file" multiple accept=".pdf,.docx,.ppt,.pptx" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileSelect} />
                    </div>

                    {/* Right side — Count + Send */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 11, color: charCount > 18000 ? '#ef4444' : 'var(--text-tertiary)' }}>{charCount} / 20000</span>
                      <button onClick={() => setIsRecording(true)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', transition: 'all 0.15s ease' }} onMouseEnter={e => { e.currentTarget.style.color = '#7c7cff'; e.currentTarget.style.background = 'rgba(124,124,255,0.08)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}>
                        <Mic size={18} strokeWidth={2} />
                      </button>

                      <button
                        onClick={sendMessage}
                        disabled={!inputValue.trim()}
                        style={{
                          width: 34, height: 34, borderRadius: '50%', border: 'none',
                          background: inputValue.trim() ? 'linear-gradient(135deg, #0052cc, #7c7cff)' : 'var(--bg-surface-3)',
                          boxShadow: inputValue.trim() ? '0 2px 8px rgba(0,82,204,0.3)' : 'none',
                          cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, transition: 'all .15s ease',
                        }}
                      >
                        <Send size={15} color={inputValue.trim() ? '#fff' : 'var(--text-tertiary)'} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                  </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Reasoning Panel */}
          <div style={{
            maxWidth: showReasoningPanel ? 300 : 0, width: '100%', flexShrink: 0,
            borderLeft: showReasoningPanel ? '1px solid var(--border-subtle)' : 'none',
            background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden',
            transition: 'max-width 0.25s ease'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: 300 }}>
              {/* Panel Header */}
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Agent Reasoning</div>
                <button onClick={() => setShowReasoningPanel(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, borderRadius: 6, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <X size={16} />
                </button>
              </div>
              {/* Thinking Steps label */}
              <div style={{ padding: '12px 20px 8px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={12} color="#7c7cff" />
                Thinking Steps
              </div>
              {/* Steps list */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px', display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: 28,
                  top: 18,
                  bottom: 18,
                  width: 1,
                  background: 'var(--border-subtle)',
                  zIndex: 0,
                }} />
                {reasoningSteps.map((step, i) => (
                  <div key={i} style={{
                    display: 'flex', flexDirection: 'column',
                    background: step.status === 'active' ? 'rgba(124,124,255,0.06)' : 'var(--bg-surface-1)',
                    border: step.status === 'active' ? '1px solid rgba(124,124,255,0.15)' : '1px solid var(--border-subtle)',
                    borderRadius: 8, padding: '10px 12px', marginBottom: 8,
                    position: 'relative', zIndex: 1,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%', marginTop: 4, flexShrink: 0,
                        background: step.status === 'active' ? '#7c7cff' : '#1a1a1a',
                        animation: step.status === 'active' ? 'pulse 1.4s ease-in-out infinite' : 'none',
                        position: 'relative', zIndex: 2,
                      }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: step.status === 'active' ? '#3d3db8' : '#4a4a4a' }}>
                          {step.status === 'active' ? (
                            <span>
                              {step.title.substring(0, typedTitles[i] ?? 0)}
                              {(typedTitles[i] ?? 0) < step.title.length && (
                                <span style={{ display: 'inline-block', width: 1.5, height: '0.9em', background: '#7c7cff', marginLeft: 2, verticalAlign: 'middle', animation: 'blink 0.7s step-end infinite' }} />
                              )}
                            </span>
                          ) : (
                            step.title
                          )}
                        </div>
                        {step.status === 'complete' && step.bullets && step.bullets.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                            {step.bullets.map((b, bi) => (
                              <div key={bi} style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                                <span style={{ flexShrink: 0 }}>·</span>
                                <span>{b}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODE: FORM ═══ */}
      {activeMode === 'form' && uploadPhase === 'empty' && (() => {
        const subcatOptions = fProcCategory ? (SUBCATEGORY_MAP[fProcCategory] || []) : [];
        const spendCategory = SPEND_CATEGORY_MAP[fProcCategory] || '';
        const isAnyFieldFilled = Boolean(fReqTitle || fBizUnit || fRequiredByDate || fPriority || fProcCategory || fSubcategory || fProjectName || fCapexOpex || fJustification || fReqDesc || fQuantity || fUnitValue || fUom || fBudget || fCostBreakdown || fSuggestedVendor || fVendorJustification || fContractRef || fDeliveryLoc || fTimeline || uploadedFiles.length > 0);
        const specificNote = <div style={{ display: 'block', fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic', marginTop: 4 }}>Applicable for specific categories</div>;
        return (
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px', background: 'var(--bg-default)' }}>
            <div style={{ maxWidth: 680, margin: '0 auto', width: '100%', marginBottom: 40 }}>
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
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>Supports PDF, DOCX and PPT · Max 25MB</div>
              </div>
            </div>

            {/* OR Divider */}
            <div style={{ maxWidth: 680, margin: '0 auto 40px auto', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>OR</div>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            </div>

            <div style={{ maxWidth: 680, margin: '0 auto' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Create Procurement Request</div>
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4, marginBottom: 24 }}>Fill in the details to generate a new requisition</div>

              <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 28, boxShadow: '0 1px 4px rgba(14,15,37,0.04)' }}>

                {/* ── SECTION 1: GENERAL INFO ── */}
                <SectionLabel
                  showWand
                  wandDisabled={!isAnyFieldFilled}
                  isWanding={wandingSection === 'General Info'}
                  onWandClick={handleWandClick}
                >General Info</SectionLabel>

                {/* Requisition ID — read only */}
                <div style={{ marginBottom: 16 }}>
                  <FL>Requisition ID</FL>
                  <div style={{
                    padding: '9px 12px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-subtle)',
                    borderRadius: 8, fontSize: 12, color: 'var(--text-tertiary)', fontStyle: 'italic', fontWeight: 400,
                  }}>Will be auto-generated on submission</div>
                </div>

                {/* Request Title */}
                <div style={{ marginBottom: 16 }}>
                  <FL required>Request Title</FL>
                  <FInput value={fReqTitle} onChange={(e) => setFReqTitle(e.target.value)} placeholder="Short title in 2-3 words" />
                  {aiFilledFields.has('fReqTitle') && <AiFilledTag />}
                </div>

                {/* Row: Cost Centre + Requestor Name */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <FL required>Cost Centre</FL>
                    <FDrop refEl={fBizUnitRef} open={fBizUnitOpen} onToggle={() => setFBizUnitOpen(!fBizUnitOpen)}
                      value={fBizUnit} placeholder="Select"
                      options={BIZ_UNITS} onChange={(v) => setFBizUnit(v)} />
                    {aiFilledFields.has('fBizUnit') && <AiFilledTag />}
                  </div>
                  <div>
                    <FL required>Requestor Name</FL>
                    <FInput value={fRequestorName} onChange={(e) => setFRequestorName(e.target.value)} placeholder="Auto-filled from your profile" prefilled />
                  </div>
                </div>

                {/* Row: Request Date + Required By Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <FL required>Request Date</FL>
                    <FInput type="date" value={fRequestDate} onChange={(e) => setFRequestDate(e.target.value)} />
                  </div>
                  <div>
                    <FL required>Required By Date</FL>
                    <FInput type="date" value={fRequiredByDate} onChange={(e) => setFRequiredByDate(e.target.value)}
                      style={{ color: fRequiredByDate ? 'var(--text-primary)' : 'var(--text-tertiary)' }} />
                    {aiFilledFields.has('fRequiredByDate') && <AiFilledTag />}
                  </div>
                </div>

                {/* Priority */}
                <div style={{ marginBottom: 16 }}>
                  <FL required>Priority</FL>
                  <FDrop refEl={fPriorityRef} open={fPriorityOpen} onToggle={() => setFPriorityOpen(!fPriorityOpen)}
                    value={fPriority} placeholder="Select priority"
                    options={PRIORITIES} onChange={(v) => setFPriority(v)}
                    renderOption={(val, isSelected) => val ? (
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: PRIORITY_DOT[val] || '#ccc', marginRight: 8, flexShrink: 0 }} />
                        {isSelected ? val : val}
                      </span>
                    ) : (isSelected ? 'Select priority' : val)}
                  />
                  {aiFilledFields.has('fPriority') && <AiFilledTag />}
                </div>

                <Divider />

                {/* ── SECTION 2: CATEGORY INFO ── */}
                <SectionLabel>Category Info</SectionLabel>

                {/* Procurement Category */}
                <div style={{ marginBottom: 16 }}>
                  <FL required>Procurement Category</FL>
                  <FDrop refEl={fProcCatRef} open={fProcCategoryOpen} onToggle={() => setFProcCategoryOpen(!fProcCategoryOpen)}
                    value={fProcCategory} placeholder="Select"
                    options={PROC_CATEGORIES} onChange={(v) => { setFProcCategory(v); setFSubcategory(''); }} />
                  {aiFilledFields.has('fProcCategory') && <AiFilledTag />}
                </div>

                {/* Spend Category — auto-derived */}
                <div style={{ marginBottom: 16 }}>
                  <FL required>Spend Category</FL>
                  <div style={{
                    padding: '9px 12px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-subtle)',
                    borderRadius: 8, fontSize: 14, color: 'var(--text-secondary)',
                  }}>{spendCategory || '—'}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>Auto-selected based on category</div>
                </div>

                {/* Subcategory */}
                <div style={{ marginBottom: 16 }}>
                  <FL required>Subcategory</FL>
                  <FDrop refEl={fSubcatRef} open={fSubcategoryOpen} onToggle={() => { if (fProcCategory) setFSubcategoryOpen(!fSubcategoryOpen); }}
                    value={fSubcategory} placeholder={fProcCategory ? 'Select subcategory' : 'Select procurement category first'}
                    options={subcatOptions} onChange={(v) => setFSubcategory(v)}
                    disabled={!fProcCategory} />
                  {aiFilledFields.has('fSubcategory') && <AiFilledTag />}
                </div>

                {/* Row: Project Name + CapEx/OpEx */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <FL>Project Name</FL>
                    <FInput value={fProjectName} onChange={(e) => setFProjectName(e.target.value)} placeholder="Linked project name (if applicable)" />
                    {aiFilledFields.has('fProjectName') && <AiFilledTag />}
                  </div>
                  <div>
                    <FL required>CapEx / OpEx</FL>
                    <FDrop refEl={fCapexRef} open={fCapexOpexOpen} onToggle={() => setFCapexOpexOpen(!fCapexOpexOpen)}
                      value={fCapexOpex} placeholder="Select expense type"
                      options={CAPEX_OPEX_OPTS} onChange={(v) => setFCapexOpex(v)} />
                    {aiFilledFields.has('fCapexOpex') && <AiFilledTag />}
                  </div>
                </div>

                {/* Justification */}
                <div style={{ marginBottom: 16 }}>
                  <FL>Justification</FL>
                  <FTextarea value={fJustification} onChange={(e) => setFJustification(e.target.value)} placeholder="Provide justification for CapEx/OpEx selection if needed" minHeight={100} />
                  {aiFilledFields.has('fJustification') && <AiFilledTag />}
                </div>

                <Divider />

                {/* ── SECTION 3: SCOPE DETAILS ── */}
                <SectionLabel>Scope Details</SectionLabel>

                <div style={{ marginBottom: 16 }}>
                  <FL required>Requirement Description</FL>
                  <FTextarea value={fReqDesc} onChange={(e) => setFReqDesc(e.target.value)}
                    placeholder="Describe the full requirement scope"
                    minHeight={120} />
                  {aiFilledFields.has('fReqDesc') && <AiFilledTag />}
                </div>

                {/* Attachments */}
                <div style={{ marginBottom: 16 }}>
                  <FL>Attachments</FL>
                  {uploadedFiles.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                      {uploadedFiles.map((file, i) => (
                        <div key={i} style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 32, height: 32, background: 'rgba(0,82,204,0.07)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FileText size={16} color="#0052cc" strokeWidth={2} />
                          </div>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                              {file.name}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                              {file.size}
                            </div>
                          </div>
                          <div
                            onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#ef4444';
                              e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                            }}
                            style={{ cursor: 'pointer', padding: 6, borderRadius: 6, flexShrink: 0, color: '#ef4444', transition: 'all 0.15s ease' }}
                          >
                            <Trash2 size={14} strokeWidth={2} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {uploadedFiles.length === 0 && (
                    <div
                      onClick={() => formFileInputRef.current?.click()}
                      onMouseEnter={() => setFFormUploadHover(true)}
                      onMouseLeave={() => setFFormUploadHover(false)}
                      style={{
                        border: `2px dashed ${fFormUploadHover ? '#7c7cff' : 'var(--border-default)'}`,
                        borderRadius: 10, padding: 20, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', gap: 8, cursor: 'pointer',
                        background: 'var(--bg-surface-1)', transition: 'border-color .15s ease',
                      }}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(124,124,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Upload size={18} color="#7c7cff" strokeWidth={2} />
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Drop files or click to upload</div>
                      <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>PDF, DOCX and PPT · Max 25MB</div>
                    </div>
                  )}
                  <input type="file" accept=".pdf,.docx,.ppt,.pptx" style={{ display: 'none' }} ref={formFileInputRef} onChange={handleFormFileSelect} />
                </div>

                <Divider />

                {/* ── SECTION 4: COMMERCIALS ── */}
                <SectionLabel>Commercials</SectionLabel>

                {/* Row: Quantity + Estimated Unit Value */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <FL required>Quantity</FL>
                    <FInput type="number" value={fQuantity} onChange={(e) => setFQuantity(e.target.value)} placeholder="Enter" />
                    {aiFilledFields.has('fQuantity') && <AiFilledTag />}
                    {specificNote}
                  </div>
                  <div>
                    <FL>Estimated Unit Value</FL>
                    <FInput value={fUnitValue} onChange={(e) => setFUnitValue(e.target.value)} placeholder="e.g. ₹45,000 per unit" />
                    {aiFilledFields.has('fUnitValue') && <AiFilledTag />}
                    {specificNote}
                  </div>
                </div>

                {/* Unit of Measure */}
                <div style={{ marginBottom: 16 }}>
                  <FL required>Unit of Measure</FL>
                  <FDrop refEl={fUomRef} open={fUomOpen} onToggle={() => setFUomOpen(!fUomOpen)}
                    value={fUom} placeholder="Select Unit"
                    options={UOM_OPTS} onChange={(v) => setFUom(v)} />
                  {aiFilledFields.has('fUom') && <AiFilledTag />}
                  {specificNote}
                </div>

                {/* Estimated Budget */}
                <div style={{ marginBottom: 16 }}>
                  <FL required>Estimated Budget</FL>
                  <div style={{ display: 'flex', border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' }}>
                    <span style={{ padding: '9px 12px', background: 'rgba(0,0,0,0.02)', fontSize: 14, color: 'var(--text-tertiary)', borderRight: '1px solid var(--border-default)', whiteSpace: 'nowrap' }}>₹</span>
                    <input type="text" value={fBudget} onChange={(e) => setFBudget(e.target.value)} placeholder="0.00"
                      style={{ flex: 1, padding: '9px 12px', border: 'none', outline: 'none', fontSize: 14, color: 'var(--text-primary)', fontFamily: 'inherit', background: '#fff' }}
                    />
                  </div>
                  {aiFilledFields.has('fBudget') && <AiFilledTag />}
                </div>

                {/* Cost Breakdown */}
                <div style={{ marginBottom: 16 }}>
                  <FL>Pricing Model</FL>
                  <FTextarea value={fCostBreakdown} onChange={(e) => setFCostBreakdown(e.target.value)}
                    placeholder="Describe pricing model — Fixed / T&M / Milestone" />
                  {aiFilledFields.has('fCostBreakdown') && <AiFilledTag />}
                </div>

                <Divider />

                {/* ── SECTION 5: VENDOR INFO ── */}
                <SectionLabel>Vendor Info</SectionLabel>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <FL>Suggested Vendor</FL>
                    <FDrop refEl={fVendorRef} open={fVendorOpen} onToggle={() => setFVendorOpen(!fVendorOpen)}
                      value={fSuggestedVendor} placeholder="Select"
                      options={VENDOR_OPTS} onChange={(v) => setFSuggestedVendor(v)} />
                    {aiFilledFields.has('fSuggestedVendor') && <AiFilledTag />}
                  </div>
                  <div>
                    <FL>Contract Reference</FL>
                    <FInput value={fContractRef} onChange={(e) => setFContractRef(e.target.value)} placeholder="Existing Contract Number" />
                    {aiFilledFields.has('fContractRef') && <AiFilledTag />}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <FL>Vendor Justification</FL>
                  <FTextarea value={fVendorJustification} onChange={(e) => setFVendorJustification(e.target.value)}
                    placeholder="Reason for preferring this vendor" minHeight={80} />
                  {aiFilledFields.has('fVendorJustification') && <AiFilledTag />}
                </div>

                <Divider />

                {/* ── SECTION 6: EXECUTION DETAILS ── */}
                <SectionLabel>Execution Details</SectionLabel>

                <div style={{ marginBottom: 16 }}>
                  <FL required>Delivery Location</FL>
                  <FDrop refEl={fDeliveryRef} open={fDeliveryOpen} onToggle={() => setFDeliveryOpen(!fDeliveryOpen)}
                    value={fDeliveryLoc} placeholder="Select"
                    options={DELIVERY_LOCS} onChange={(v) => setFDeliveryLoc(v)} />
                  {aiFilledFields.has('fDeliveryLoc') && <AiFilledTag />}
                  {specificNote}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <FL>Timeline</FL>
                  <FTextarea value={fTimeline} onChange={(e) => setFTimeline(e.target.value)} placeholder="Describe delivery timeline and milestones" minHeight={100} />
                  {aiFilledFields.has('fTimeline') && <AiFilledTag />}
                </div>
                {/* ── Submit row ── */}
                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button
                    onClick={handleBack}
                    style={{
                      background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8,
                      padding: '9px 20px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'inherit',
                    }}
                  >
                    <Save size={15} strokeWidth={2} /> Save Draft
                  </button>
                  <button
                    onClick={handleFormSubmit}
                    style={{
                      background: '#0052cc', color: '#fff',
                      border: 'none', borderRadius: 8, padding: '9px 24px', fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
                      boxShadow: '0 4px 12px rgba(0,82,204,0.12)', fontFamily: 'inherit',
                    }}
                  >
                    <Send size={15} strokeWidth={2} />
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══ MODE: FORM (UPLOAD PHASES) ═══ */}
      {activeMode === 'form' && uploadPhase !== 'empty' && (() => {
        function UDrop({ refEl, open, onToggle, value, placeholder, options, onChange, renderOption, disabled }) {
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
        function UInput({ value, onChange, placeholder, type = 'text', readOnly, prefilled }) {
          const [fc, setFc] = useState(false);
          return (
            <input type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}
              onFocus={() => setFc(true)} onBlur={() => setFc(false)}
              style={{
                width: '100%', padding: '9px 12px', boxSizing: 'border-box',
                border: `1px solid ${fc ? '#7c7cff' : 'var(--border-default)'}`,
                borderRadius: 8, fontSize: 14, color: 'var(--text-primary)', outline: 'none',
                fontFamily: 'inherit',
                background: prefilled ? 'rgba(0,0,0,0.02)' : '#fff',
                boxShadow: fc ? '0 0 0 3px rgba(124,124,255,0.1)' : 'none',
                transition: 'border-color .15s ease, box-shadow .15s ease',
              }}
            />
          );
        }
        function UTextarea({ value, onChange, placeholder, minHeight = 100 }) {
          const [fc, setFc] = useState(false);
          return (
            <textarea value={value} onChange={onChange} placeholder={placeholder}
              onFocus={() => setFc(true)} onBlur={() => setFc(false)}
              style={{
                background: '#fff',
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
        function UL({ children, required }) {
          return <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>{children}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>;
        }

        const isExtracted = (fieldName) => ['Request Title', 'Cost Centre', 'Requestor Name', 'Request Date', 'Required By Date', 'Priority', 'Procurement Category', 'Subcategory', 'Requirement Description', 'Quantity', 'Estimated Budget', 'Suggested Vendor', 'Delivery Location', 'Project Name'].includes(fieldName);

        const renderExtracted = (fieldName) => isExtracted(fieldName) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#15803d', fontStyle: 'italic', marginTop: 4 }}>
            <CheckCircle size={11} color="#15803d" strokeWidth={2.5} />
            Extracted by AI
          </div>
        );

        const specificNote = <div style={{ display: 'block', fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic', marginTop: 4 }}>Applicable for specific categories</div>;
        const subcatOptions = uProcCategory ? (SUBCATEGORY_MAP[uProcCategory] || []) : [];
        const spendCategory = SPEND_CATEGORY_MAP[uProcCategory] || '';

        return (
          <div style={{ flex: 1, overflowY: 'auto', padding: uploadPhase === 'empty' || uploadPhase === 'complete' ? '32px 24px' : 40, background: 'var(--bg-default)', display: uploadPhase === 'empty' || uploadPhase === 'complete' ? 'block' : 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

            {uploadPhase === 'empty' && (
              <div style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>
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
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>Supports PDF, DOCX and PPT · Max 25MB</div>
                </div>
              </div>
            )}

            {uploadPhase === 'uploading' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 20, width: '100%' }}>
                <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, maxWidth: 420, width: '100%', boxShadow: '0 2px 8px rgba(14,15,37,0.06)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,82,204,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={22} color="#0052cc" strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Q3_Procurement_Requirements.pdf</div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>2.4 MB · PDF</div>
                  </div>
                </div>
                <div style={{ maxWidth: 420, width: '100%' }}>
                  <div style={{ height: 4, background: 'rgba(0,0,0,0.02)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'linear-gradient(90deg, #0052cc, #7c7cff)', borderRadius: 99, animation: 'uploadProgress 1.4s ease-out forwards' }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 4 }}>Uploading document...</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Please wait while we upload your file</div>
                </div>
              </div>
            )}

            {uploadPhase === 'scanning' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 20, width: '100%' }}>
                <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, maxWidth: 420, width: '100%', boxShadow: '0 2px 8px rgba(14,15,37,0.06)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,82,204,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={22} color="#0052cc" strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Q3_Procurement_Requirements.pdf</div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>2.4 MB · PDF</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, maxWidth: 420, width: '100%' }}>
                      <div style={{ flex: 1, height: 4, background: 'rgba(0,0,0,0.02)', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
                        <div style={{ position: 'absolute', height: '100%', width: '40%', background: 'linear-gradient(90deg, transparent, #7c7cff, transparent)', borderRadius: 99, animation: 'shimmer 1.2s linear infinite' }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(124,124,255,0.08)', border: '1px solid rgba(124,124,255,0.2)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600, color: '#7c7cff' }}>
                        <Cpu size={12} strokeWidth={2} />
                        AI Extracting
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Scanning document...</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', maxWidth: 320 }}>AI is reading and extracting procurement fields from your document</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320, width: '100%', marginTop: 8 }}>
                    {['Reading document structure', 'Identifying procurement fields', 'Extracting dates and values', 'Mapping to PR template'].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--text-secondary)', opacity: 0, animation: `fadeInUp 0.4s ${[0.3, 0.8, 1.3, 1.7][idx]}s forwards ease-out` }}>
                        <CheckCircle size={14} color="#22c55e" strokeWidth={2} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {uploadPhase === 'complete' && (
              <div style={{ maxWidth: 720, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Uploaded file card */}
                <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 3px rgba(14,15,37,0.04)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,82,204,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={22} color="#0052cc" strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Q3_Procurement_Requirements.pdf</div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>2.4 MB · PDF</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(34,197,94,0.08)', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 600, color: '#15803d', marginTop: 4 }}>
                      <FileCheck size={11} strokeWidth={2.5} />
                      AI extraction complete — 14 fields populated
                    </div>
                  </div>
                  <div
                    className="pai-trash"
                    onClick={() => setUploadPhase('empty')}
                    style={{ padding: 8, borderRadius: 8, cursor: 'pointer', color: '#ef4444', transition: 'all .12s ease' }}
                  >
                    <Trash2 size={16} strokeWidth={2} color="#ef4444" />
                  </div>
                </div>

                {/* Extracted fields card */}
                <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 28, boxShadow: '0 1px 4px rgba(14,15,37,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Review Extracted Fields</div>
                    <div style={{ background: 'rgba(124,124,255,0.08)', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600, color: '#7c7cff' }}>14 / 21 fields extracted</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 24, lineHeight: 1.5 }}>Fields highlighted with a green indicator were populated by AI. Review all fields and fill in any missing information before submitting.</div>

                  {/* ── SECTION 1: GENERAL INFO ── */}
                  <SectionLabel>General Info</SectionLabel>
                  <div style={{ marginBottom: 16 }}>
                    <UL>Requisition ID</UL>
                    <div style={{ padding: '9px 12px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 8, fontSize: 12, color: 'var(--text-tertiary)', fontStyle: 'italic', fontWeight: 400 }}>Will be auto-generated on submission</div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <UL required>Request Title</UL>
                    <UInput value={uReqTitle} onChange={(e) => setUReqTitle(e.target.value)} placeholder="Short description of what you are requesting" />
                    {renderExtracted('Request Title')}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <UL required>Cost Centre</UL>
                      <UDrop refEl={uBizUnitRef} open={uBizUnitOpen} onToggle={() => setUBizUnitOpen(!uBizUnitOpen)} value={uBizUnit} placeholder="Select business unit" options={BIZ_UNITS} onChange={(v) => setUBizUnit(v)} />
                      {renderExtracted('Cost Centre')}
                    </div>
                    <div>
                      <UL required>Requestor Name</UL>
                      <UInput value={uRequestorName} onChange={(e) => setURequestorName(e.target.value)} placeholder="Auto-filled from your profile" prefilled />
                      {renderExtracted('Requestor Name')}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <UL required>Request Date</UL>
                      <UInput type="date" value={uRequestDate} onChange={(e) => setURequestDate(e.target.value)} />
                      {renderExtracted('Request Date')}
                    </div>
                    <div>
                      <UL required>Required By Date</UL>
                      <UInput type="date" value={uRequiredByDate} onChange={(e) => setURequiredByDate(e.target.value)} style={{ color: uRequiredByDate ? 'var(--text-primary)' : 'var(--text-tertiary)' }} />
                      {renderExtracted('Required By Date')}
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <UL required>Priority</UL>
                    <UDrop refEl={uPriorityRef} open={uPriorityOpen} onToggle={() => setUPriorityOpen(!uPriorityOpen)} value={uPriority} placeholder="Select priority" options={PRIORITIES} onChange={(v) => setUPriority(v)} renderOption={(val) => val ? (<span style={{ display: 'flex', alignItems: 'center' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: PRIORITY_DOT[val] || '#ccc', marginRight: 8, flexShrink: 0 }} />{val}</span>) : val} />
                    {renderExtracted('Priority')}
                  </div>
                  <Divider />

                  {/* ── SECTION 2: CATEGORY INFO ── */}
                  <SectionLabel>Category Info</SectionLabel>
                  <div style={{ marginBottom: 16 }}>
                    <UL required>Procurement Category</UL>
                    <UDrop refEl={uProcCatRef} open={uProcCategoryOpen} onToggle={() => setUProcCategoryOpen(!uProcCategoryOpen)} value={uProcCategory} placeholder="Select procurement category" options={PROC_CATEGORIES} onChange={(v) => { setUProcCategory(v); setUSubcategory(''); }} />
                    {renderExtracted('Procurement Category')}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <UL required>Spend Category</UL>
                    <div style={{ padding: '9px 12px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 8, fontSize: 14, color: 'var(--text-secondary)' }}>{spendCategory || '—'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>Auto-selected based on category</div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <UL required>Subcategory</UL>
                    <UDrop refEl={uSubcatRef} open={uSubcategoryOpen} onToggle={() => { if (uProcCategory) setUSubcategoryOpen(!uSubcategoryOpen); }} value={uSubcategory} placeholder={uProcCategory ? 'Select subcategory' : 'Select procurement category first'} options={subcatOptions} onChange={(v) => setUSubcategory(v)} disabled={!uProcCategory} />
                    {renderExtracted('Subcategory')}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <UL>Project Name</UL>
                      <UInput value={uProjectName} onChange={(e) => setUProjectName(e.target.value)} placeholder="Linked project name (if applicable)" />
                      {renderExtracted('Project Name')}
                    </div>
                    <div>
                      <UL required>CapEx / OpEx</UL>
                      <UDrop refEl={uCapexRef} open={uCapexOpexOpen} onToggle={() => setUCapexOpexOpen(!uCapexOpexOpen)} value={uCapexOpex} placeholder="Select expense type" options={CAPEX_OPEX_OPTS} onChange={(v) => setUCapexOpex(v)} />
                      {renderExtracted('CapEx / OpEx')}
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <UL>Justification</UL>
                    <UTextarea value={uJustification} onChange={(e) => setUJustification(e.target.value)} placeholder="Provide justification for CapEx/OpEx selection if needed" minHeight={100} />
                    {renderExtracted('Justification')}
                  </div>
                  <Divider />

                  {/* ── SECTION 3: SCOPE DETAILS ── */}
                  <SectionLabel>Scope Details</SectionLabel>
                  <div style={{ marginBottom: 16 }}>
                    <UL required>Requirement Description</UL>
                    <UTextarea value={uReqDesc} onChange={(e) => setUReqDesc(e.target.value)} placeholder="Describe the full scope..." minHeight={100} />
                    {renderExtracted('Requirement Description')}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <UL>Attachments</UL>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                      {uploadFormFiles.map((file, i) => (
                        <div key={i} style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 32, height: 32, background: 'rgba(0,82,204,0.07)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FileText size={16} color="#0052cc" strokeWidth={2} />
                          </div>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{file.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{file.size}</div>
                          </div>
                          <div
                            onClick={() => setUploadFormFiles(prev => prev.filter((_, idx) => idx !== i))}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                            style={{ cursor: 'pointer', padding: 6, borderRadius: 6, flexShrink: 0, color: '#ef4444', transition: 'all 0.15s ease' }}
                          >
                            <Trash2 size={14} strokeWidth={2} />
                          </div>
                        </div>
                      ))}
                    </div>
                    {uploadFormFiles.length === 0 && (
                      <div
                        onClick={() => uploadFormFileInputRef.current?.click()}
                        onMouseEnter={() => setUFormUploadHover(true)}
                        onMouseLeave={() => setUFormUploadHover(false)}
                        style={{
                          border: `2px dashed ${uFormUploadHover ? '#7c7cff' : 'var(--border-default)'}`,
                          borderRadius: 10, padding: 20, display: 'flex', flexDirection: 'column',
                          alignItems: 'center', gap: 8, cursor: 'pointer',
                          background: 'var(--bg-surface-1)', transition: 'border-color .15s ease',
                        }}
                      >
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(124,124,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Upload size={18} color="#7c7cff" strokeWidth={2} />
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Drop files or click to upload</div>
                        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>PDF, DOCX and PPT · Max 25MB</div>
                      </div>
                    )}
                    <input type="file" accept=".pdf,.docx,.ppt,.pptx" style={{ display: 'none' }} ref={uploadFormFileInputRef} onChange={handleUploadFormFileSelect} />
                    <div style={{ display: 'block', fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic', marginTop: 6 }}>Additional supporting documents. The extracted document above is already attached.</div>
                  </div>
                  <Divider />

                  {/* ── SECTION 4: COMMERCIALS ── */}
                  <SectionLabel>Commercials</SectionLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <UL required>Quantity</UL>
                      <UInput type="number" value={uQuantity} onChange={(e) => setUQuantity(e.target.value)} placeholder="Enter quantity required" />
                      {specificNote}
                      {renderExtracted('Quantity')}
                    </div>
                    <div>
                      <UL>Estimated Unit Value</UL>
                      <UInput value={uUnitValue} onChange={(e) => setUUnitValue(e.target.value)} placeholder="e.g. ₹45,000 per unit" />
                      {specificNote}
                      {renderExtracted('Estimated Unit Value')}
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <UL required>Unit of Measure</UL>
                    <UDrop refEl={uUomRef} open={uUomOpen} onToggle={() => setUUomOpen(!uUomOpen)} value={uUom} placeholder="Select unit" options={UOM_OPTS} onChange={(v) => setUUom(v)} />
                    {specificNote}
                    {renderExtracted('Unit of Measure')}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <UL required>Estimated Budget</UL>
                    <div style={{ display: 'flex', border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' }}>
                      <span style={{ padding: '9px 12px', background: 'rgba(0,0,0,0.02)', fontSize: 14, color: 'var(--text-tertiary)', borderRight: '1px solid var(--border-default)', whiteSpace: 'nowrap' }}>₹</span>
                      <input type="text" value={uBudget} onChange={(e) => setUBudget(e.target.value)} placeholder="0.00" style={{ flex: 1, padding: '9px 12px', border: 'none', outline: 'none', fontSize: 14, color: 'var(--text-primary)', fontFamily: 'inherit', background: '#fff' }} />
                    </div>
                    {renderExtracted('Estimated Budget')}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <UL>Pricing Model</UL>
                    <UTextarea value={uCostBreakdown} onChange={(e) => setUCostBreakdown(e.target.value)} placeholder="Describe pricing model..." minHeight={100} />
                    {renderExtracted('Pricing Model')}
                  </div>
                  <Divider />

                  {/* ── SECTION 5: VENDOR INFO ── */}
                  <SectionLabel>Vendor Info</SectionLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <UL>Suggested Vendor</UL>
                      <UDrop refEl={uVendorRef} open={uVendorOpen} onToggle={() => setUVendorOpen(!uVendorOpen)} value={uSuggestedVendor} placeholder="Select preferred vendor" options={VENDOR_OPTS} onChange={(v) => setUSuggestedVendor(v)} />
                      {renderExtracted('Suggested Vendor')}
                    </div>
                    <div>
                      <UL>Contract Reference</UL>
                      <UInput value={uContractRef} onChange={(e) => setUContractRef(e.target.value)} placeholder="Existing contract or renewal reference number" />
                      {renderExtracted('Contract Reference')}
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <UL>Vendor Justification</UL>
                    <UTextarea value={uVendorJustification} onChange={(e) => setUVendorJustification(e.target.value)} placeholder="Reason for preferring this vendor" minHeight={80} />
                    {renderExtracted('Vendor Justification')}
                  </div>
                  <Divider />

                  {/* ── SECTION 6: EXECUTION DETAILS ── */}
                  <SectionLabel>Execution Details</SectionLabel>
                  <div style={{ marginBottom: 16 }}>
                    <UL required>Delivery Location</UL>
                    <UDrop refEl={uDeliveryRef} open={uDeliveryOpen} onToggle={() => setUDeliveryOpen(!uDeliveryOpen)} value={uDeliveryLoc} placeholder="Select delivery location" options={DELIVERY_LOCS} onChange={(v) => setUDeliveryLoc(v)} />
                    {specificNote}
                    {renderExtracted('Delivery Location')}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <UL>Timeline</UL>
                    <UTextarea value={uTimeline} onChange={(e) => setUTimeline(e.target.value)} placeholder="Describe phased delivery plan and key milestones" minHeight={100} />
                    {specificNote}
                    {renderExtracted('Timeline')}
                  </div>

                  {/* ── Submit row ── */}
                  <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <button
                      onClick={() => onNavigate('Dashboard')}
                      style={{
                        background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8,
                        padding: '9px 20px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'inherit',
                      }}
                    >
                      <Save size={15} strokeWidth={2} /> Save Draft
                    </button>
                    <button
                      onClick={handleUploadSubmit}
                      style={{
                        background: '#0052cc', color: '#fff',
                        border: 'none', borderRadius: 8, padding: '9px 24px', fontSize: 13, fontWeight: 600,
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
                        boxShadow: '0 4px 12px rgba(0,82,204,0.12)', fontFamily: 'inherit',
                      }}
                    >
                      <Send size={15} strokeWidth={2} />
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}
      {/* ═══ SUCCESS MODAL ═══ */}
      {showSuccessModal && (
        <div style={SUCCESS_MODAL_STYLE.backdrop}>
          <div style={SUCCESS_MODAL_STYLE.card}>
            {/* Icon */}
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.15))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckCircle size={32} color="#22c55e" strokeWidth={2} />
            </div>

            {/* Title */}
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Request Submitted!</div>

            {/* PR ID */}
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
              Your PR ID is{' '}
              <span style={{ fontWeight: 700, color: 'var(--colors-blue-500)' }}>PR-2026-011</span>
            </div>

            {/* Description */}
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 4 }}>
              Your procurement request has been submitted successfully. The AI is now classifying your request and initiating the approval workflow.
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 8 }}>
              <button
                onClick={() => { setShowSuccessModal(false); onNavigate('PR Detail Fresh'); }}
                style={{
                  background: 'linear-gradient(135deg, #0052cc, #7c7cff)', color: '#fff',
                  border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 8, boxShadow: '0 4px 12px rgba(0,82,204,0.2)', fontFamily: 'inherit',
                }}
              >
                Go to PR Details
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => { setShowSuccessModal(false); onNavigate('Dashboard'); }}
                style={{
                  background: '#fff', border: '1px solid var(--border-default)', borderRadius: 10,
                  padding: '12px 24px', fontSize: 14, fontWeight: 500, color: 'var(--text-primary)',
                  cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 8, fontFamily: 'inherit',
                }}
              >
                <LayoutDashboard size={16} color="var(--text-secondary)" strokeWidth={2} />
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {showRenameModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowRenameModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px', width: 440, boxShadow: '0 16px 48px rgba(0,0,0,0.15)' }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Rename this chat</div>
              <X size={20} color="var(--text-tertiary)" style={{ cursor: 'pointer' }} onClick={() => setShowRenameModal(false)} />
            </div>
            <input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter' && renameValue.trim()) setShowRenameModal(false); if (e.key === 'Escape') setShowRenameModal(false); }}
              style={{ background: '#fff', width: '100%', padding: '12px 16px', border: '1.5px solid #7c7cff', borderRadius: 10, fontSize: 14, color: 'var(--text-primary)', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', boxShadow: '0 0 0 3px rgba(124,124,255,0.1)', marginBottom: 20 }}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowRenameModal(false)} style={{ padding: '10px 20px', border: '1px solid var(--border-default)', borderRadius: 10, background: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-primary)' }}>
                Cancel
              </button>
              <button onClick={() => { if (renameValue.trim()) setShowRenameModal(false); }} style={{ padding: '10px 20px', border: 'none', borderRadius: 10, background: renameValue.trim() ? '#0052cc' : 'var(--bg-surface-2)', fontSize: 14, fontWeight: 600, cursor: renameValue.trim() ? 'pointer' : 'default', fontFamily: 'inherit', color: renameValue.trim() ? '#fff' : 'var(--text-tertiary)', transition: 'all 0.15s ease' }}>Rename</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowDeleteModal(false)}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '36px 28px 28px', width: 460, boxShadow: '0 16px 48px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <AlertTriangle size={32} color="#ef4444" strokeWidth={2} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Are you sure you want to delete?</div>
            <div style={{ fontSize: 14, color: 'var(--text-tertiary)', marginBottom: 28, lineHeight: 1.5 }}>This action is permanent and cannot be undone.</div>
            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, padding: '13px', border: '1px solid var(--border-default)', borderRadius: 12, background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-primary)' }}>
                Cancel
              </button>
              <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, padding: '13px', border: 'none', borderRadius: 12, background: '#ef4444', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

    </MainLayout>
  );
}
