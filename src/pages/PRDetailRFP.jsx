import React, { useState, useRef, useEffect, useCallback } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import {
  ArrowLeft, Download, Sparkles, User, CheckCircle,
  ChevronRight, X, FileText, FileCheck, Building,
  Calendar, Tag, Upload, Send, Eye,
  History, DollarSign, Users,
  Shield, Target, Plus, Rocket,
  RefreshCw, Award, Package, Receipt,
  BarChart2, Zap, GitBranch, Banknote, Scale, PackageCheck,
  UserCheck, MapPin, Brain,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Indent, Outdent, Link, Image, Printer,
  Undo2, Redo2, Code, RemoveFormatting, Pencil, Save, ChevronDown,
  Palette, Table, Type, MoreVertical, File, AlertTriangle, Trash2,
  Mic, Paperclip, RotateCcw, ThumbsUp, ThumbsDown, Copy, Edit2, Share2, Pin, PinOff, MoreHorizontal, Check, BookOpen, Layers, Briefcase, Globe, MessageSquare, TrendingUp, AlertCircle, HelpCircle
} from 'lucide-react';

const STATUS_CONFIG = {
  'Pending RFP Approval': { bg: '#fff7ed', color: '#b45309', border: 'rgba(180,83,9,0.2)' },
  'RFP Published': { bg: '#ede9fe', color: '#6d28d9', border: 'rgba(109,40,217,0.2)' },
  'In Sourcing': { bg: '#fdf4ff', color: '#a21caf', border: 'rgba(162,28,175,0.2)' },
};

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'rfp', label: 'RFP' },
  { id: 'proposals', label: 'Proposals' },
  { id: 'negot', label: 'Negotiations' },
  { id: 'sow', label: 'SoW' },
  { id: 'po', label: 'PO' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'activities', label: 'Activities' },
];

const EMPTY_TABS = {
  proposals: { icon: Package, color: '#7c7cff', title: 'No Proposals Yet', desc: 'Proposals will appear here once the RFP is published and vendors submit their bids.' },
  negot: { icon: Brain, color: '#0052cc', title: 'Negotiations', desc: 'AI-powered negotiation insights will be available once a vendor is shortlisted.' },
  sow: { icon: FileCheck, color: '#22c55e', title: 'SoW Not Started', desc: 'The Statement of Work drafting process begins after a vendor is awarded.' },
  po: { icon: Receipt, color: '#f59e0b', title: 'Purchase Order Pending', desc: 'A Purchase Order will be generated here once the SoW is finalized and signed.' },
  invoices: { icon: DollarSign, color: '#6d28d9', title: 'Invoice Tracking', desc: 'Invoice management will be available once the engagement is active.' },
};

const WORKFLOW_GROUPS = [
  { id: 'g0', type: 'single', node: { id: 0, status: 'complete', type: 'user', title: 'PR Submitted', actor: 'David Kim', time: '08 May · 09:12', icon: User } },
  { id: 'g1', type: 'single', node: { id: 1, status: 'complete', type: 'ai', title: 'AI Extraction & Folder Creation', actor: 'AI Agent', time: '08 May · 09:14', icon: Sparkles } },
  {
    id: 'g2', type: 'parallel', label: 'PARALLEL', nodes: [
      { id: 2, status: 'complete', type: 'ai', title: 'Routine / Complex', actor: 'AI Agent', time: '08 May · 09:15', icon: GitBranch },
      { id: 3, status: 'complete', type: 'ai', title: 'CapEx / OpEx', actor: 'AI Agent', time: '08 May · 09:15', icon: Banknote },
      { id: 4, status: 'complete', type: 'ai', title: 'Direct / Indirect', actor: 'AI Agent', time: '08 May · 09:15', icon: Scale },
    ]
  },
  { id: 'g3', type: 'single', node: { id: 5, status: 'complete', type: 'ai', title: 'Routing Decision', actor: 'AI Agent', time: '08 May · 09:16', icon: GitBranch } },
  {
    id: 'g4', type: 'parallel', label: 'PARALLEL', nodes: [
      { id: 6, status: 'complete', type: 'ai', title: 'Budget Check', actor: 'AI Agent', time: '08 May · 09:17', icon: Banknote },
      { id: 7, status: 'complete', type: 'ai', title: 'Compliance Validation', actor: 'AI Agent', time: '08 May · 09:17', icon: Shield },
    ]
  },
  {
    id: 'g5', type: 'parallel', label: 'PARALLEL', nodes: [
      { id: 8, status: 'complete', type: 'ai', title: 'RFQ Template Select', actor: 'AI Agent', time: '09 May · 11:00', icon: FileText },
      { id: 9, status: 'complete', type: 'ai', title: 'Supplier Research', actor: 'AI Agent', time: '09 May · 11:02', icon: Users },
    ]
  },
  {
    id: 'g6', type: 'parallel', label: 'PARALLEL', nodes: [
      { id: 10, status: 'complete', type: 'ai', title: 'Generate RFP', actor: 'AI Agent', time: '10 May · 14:30', icon: Sparkles },
      { id: 11, status: 'complete', type: 'ai', title: 'Scoring Config', actor: 'AI Agent', time: '10 May · 14:31', icon: Target },
      { id: 12, status: 'complete', type: 'ai', title: 'Cost Estimation', actor: 'AI Agent', time: '10 May · 14:32', icon: DollarSign },
    ]
  },
  { id: 'g7', type: 'single', node: { id: 13, status: 'pending_user', type: 'user', title: 'RFP Approval', actor: 'David Kim', time: 'Awaiting action', icon: UserCheck } },
  {
    id: 'g8', type: 'parallel', label: 'PARALLEL', nodes: [
      { id: 14, status: 'waiting', type: 'ai', title: 'RFP Publish', actor: 'AI Agent', time: null, icon: Send },
      { id: 15, status: 'waiting', type: 'ai', title: 'Suggest Vendors', actor: 'AI Agent', time: null, icon: Users },
    ]
  },
  { id: 'g9', type: 'single', node: { id: 16, status: 'waiting', type: 'user', title: 'Proposal Upload & Bid Evaluation', actor: 'Procurement', time: null, icon: Upload } },
  { id: 'g10', type: 'single', node: { id: 17, status: 'waiting', type: 'ai', title: 'Negotiation', actor: 'AI Agent', time: null, icon: BarChart2 } },
  { id: 'g11', type: 'single', node: { id: 18, status: 'waiting', type: 'user', title: 'PR Award', actor: 'Procurement', time: null, icon: Award } },
  { id: 'g12', type: 'single', node: { id: 19, status: 'waiting', type: 'ai', title: 'SoW', actor: 'AI Agent', time: null, icon: FileCheck } },
  { id: 'g13', type: 'single', node: { id: 20, status: 'waiting', type: 'ai', title: 'PO Generation', actor: 'AI Agent', time: null, icon: PackageCheck } },
  { id: 'g14', type: 'single', node: { id: 21, status: 'waiting', type: 'user', title: 'Manager Approval', actor: 'Sarah Chen', time: null, icon: UserCheck } },
  { id: 'g15', type: 'single', node: { id: 22, status: 'waiting', type: 'ai', title: 'PO Issued', actor: 'System', time: null, icon: Zap } },
];

function NodeCard({ node, compact = false, onNodeClick }) {
  const isClickable = node.type === 'ai' && node.status === 'complete';
  const { status, type, title, actor, time, icon: Icon } = node;
  const w = compact ? 140 : 160;
  let bg = '#f4f4f7', border = '1px dashed #d5d5dd', borderTop = '3px solid #d5d5dd';
  let iconBg = 'rgba(180,180,200,0.15)', iconColor = '#bbb';
  let badgeBg = '#ebebf0', badgeColor = '#999', badgeText = 'QUEUED';
  let titleColor = '#bbb', opacity = 0.7, shadow = 'none';
  if (status === 'complete') {
    opacity = 1; shadow = '0 1px 4px rgba(14,15,37,0.06)'; titleColor = '#1a1a1a'; bg = '#fff';
    if (type === 'ai') { border = '1px solid rgba(124,124,255,0.2)'; borderTop = '3px solid #7c7cff'; iconBg = 'linear-gradient(135deg,#0052cc,#7c7cff)'; iconColor = '#fff'; }
    else { border = '1px solid rgba(0,82,204,0.2)'; borderTop = '3px solid #0052cc'; iconBg = '#0052cc'; iconColor = '#fff'; }
    badgeBg = 'rgba(34,197,94,0.08)'; badgeColor = '#15803d'; badgeText = 'DONE';
  } else if (status === 'pending_user') {
    opacity = 1; bg = '#fffbf0'; titleColor = '#1a1a1a';
    border = '1.5px solid #f59e0b'; borderTop = '3px solid #f59e0b'; shadow = '0 2px 16px rgba(245,158,11,0.18)';
    iconBg = 'linear-gradient(135deg,#f59e0b,#d97706)'; iconColor = '#fff';
    badgeBg = 'rgba(245,158,11,0.12)'; badgeColor = '#b45309'; badgeText = 'AWAITING';
  }
  return (
    <div style={{ width: w, minHeight: compact ? 130 : 152, borderRadius: 12, padding: compact ? '12px 10px 10px' : '13px 12px 11px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0, background: bg, border, borderTop, boxShadow: shadow, opacity, cursor: isClickable ? 'pointer' : 'default', transition: 'all 0.2s ease' }} onClick={() => isClickable && onNodeClick && onNodeClick(node)}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: compact ? 28 : 32, height: compact ? 28 : 32, borderRadius: 9, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={compact ? 13 : 15} color={iconColor} strokeWidth={2} />
        </div>
        {status === 'pending_user' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', animation: 'rfpPulse 1.6s ease-in-out infinite' }} />}
        {isClickable && <ChevronRight size={14} color="#ccc" style={{ flexShrink: 0 }} />}
      </div>
      <div style={{ fontSize: compact ? 10.5 : 11.5, fontWeight: 700, color: titleColor, lineHeight: 1.3, marginTop: 3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</div>
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 9.5, color: status === 'pending_user' ? '#92400e' : '#999' }}>{actor}</div>
        {time && <div style={{ fontSize: 9.5, color: status === 'pending_user' ? '#b45309' : '#aaa' }}>{time}</div>}
        <div style={{ background: badgeBg, color: badgeColor, borderRadius: 20, padding: '2px 7px', fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase', display: 'inline-flex', alignSelf: 'flex-start', marginTop: 4 }}>{badgeText}</div>
      </div>
    </div>
  );
}

function Arrow({ dashed = false }) {
  return (
    <div style={{ width: 36, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', position: 'relative' }}>
      {dashed ? <div style={{ width: 26, height: 0, borderTop: '1.5px dashed #ccc' }} /> : <div style={{ width: 26, height: 2, background: 'linear-gradient(90deg,#c8c8d8,#a8a8be)', borderRadius: 2 }} />}
      <div style={{ position: 'absolute', right: 1, width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: `6px solid ${dashed ? '#ccc' : '#a8a8be'}` }} />
    </div>
  );
}

/* ════════════════════════════════════════
   WYSIWYG EDITOR
════════════════════════════════════════ */
const INITIAL_HTML = `<h2>1. Introduction &amp; Background</h2>
<p>DDAIS Group invites qualified technology consulting firms to submit proposals for the provision of AWS Cloud Migration Consulting Services. This Request for Proposal (RFP) outlines the scope of work, evaluation criteria, and submission requirements.</p>
<p>DDAIS Group is undertaking a strategic initiative to migrate its existing on-premise infrastructure to Amazon Web Services (AWS). The engagement requires a team of senior cloud architects with demonstrable experience in large-scale enterprise migrations, security hardening, and post-migration optimisation.</p>
<h2>2. Scope of Work</h2>
<p>The selected vendor will be required to deliver the following:</p>
<p><strong>Phase 1 — Assessment &amp; Architecture Design (Months 1–2)</strong></p>
<ul><li>Comprehensive assessment of existing on-premise infrastructure</li><li>AWS architecture design and migration strategy documentation</li><li>Risk assessment and mitigation plan</li><li>Stakeholder alignment workshops (minimum 3 sessions)</li></ul>
<p><strong>Phase 2 — Migration Execution (Months 3–5)</strong></p>
<ul><li>Phased migration of workloads to AWS (non-production → production)</li><li>Data migration with zero-downtime requirements</li><li>Security configuration and IAM policy implementation</li><li>Network topology redesign (VPC, subnets, security groups)</li></ul>
<p><strong>Phase 3 — Stabilisation &amp; Handover (Month 6)</strong></p>
<ul><li>Post-migration performance optimisation</li><li>Knowledge transfer sessions for internal IT team</li><li>Final documentation and runbook delivery</li><li>30-day hypercare support</li></ul>
<h2>3. Vendor Eligibility Requirements</h2>
<p>Vendors must meet <strong>ALL</strong> of the following criteria to be considered:</p>
<ul><li>Minimum 5 years of experience in cloud consulting engagements</li><li>AWS Premier or Advanced Partner status (mandatory)</li><li>At least 3 completed enterprise migration projects of similar scale (&gt;500 VMs)</li><li>Presence or operations capability in UAE / Dubai</li><li>ISO 27001 certified or equivalent information security certification</li><li>Minimum team: 3 Senior Cloud Architects + 2 Security Engineers + 1 Project Manager</li></ul>
<h2>4. Commercial Terms</h2>
<p><strong>Pricing Model:</strong> Time &amp; Materials (T&amp;M)<br/><strong>Estimated Budget:</strong> ₹45,00,000 / AED 2,000,000<br/><strong>Payment:</strong> Monthly invoicing against verified milestones<br/><strong>Currency:</strong> AED (preferred) or USD</p>
<ul><li>Daily rates per resource level (Junior / Senior / Principal)</li><li>Estimated total resource days per phase</li><li>Travel and expenses policy (if applicable)</li><li>Any licensing or tooling costs separate from professional services</li></ul>
<h2>5. Evaluation Criteria</h2>
<p>Proposals will be scored across the following dimensions:</p>
<ul><li>Technical Competency — <strong>30 points</strong></li><li>Relevant Experience — <strong>25 points</strong></li><li>Team Composition &amp; CVs — <strong>20 points</strong></li><li>Commercial Proposal — <strong>15 points</strong></li><li>Approach &amp; Methodology — <strong>10 points</strong></li></ul>
<p>Vendors scoring below 60 points will not be considered. DDAIS Group reserves the right to negotiate with the top 2 vendors.</p>
<h2>6. Submission Requirements &amp; Deadline</h2>
<p><strong>Deadline:</strong> 15 June 2026, 17:00 GST &nbsp;|&nbsp; <strong>Validity:</strong> 90 days from submission</p>
<ul><li>Technical Proposal (max 40 pages, PDF)</li><li>Commercial Proposal (separate sealed document)</li><li>Company Profile &amp; Credentials</li><li>CVs of proposed team members</li><li>Reference letters from at least 2 comparable projects</li><li>Valid trade licence and ISO certification copies</li></ul>`;

function WYSIWYGEditor({ isEditing, htmlContent, setHtmlContent }) {
  const editorRef = useRef(null);
  const [fmt, setFmt] = useState({});
  const [showFmtMenu, setShowFmtMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(null); // 'text' | 'bg' | null
  const [textColor, setTextColor] = useState('#1a1a1a');
  const [bgColor, setBgColor] = useState('#ffff00');

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = htmlContent;
  }, []);

  const updateFmt = useCallback(() => {
    try {
      setFmt({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        ul: document.queryCommandState('insertUnorderedList'),
        ol: document.queryCommandState('insertOrderedList'),
        alignL: document.queryCommandState('justifyLeft'),
        alignC: document.queryCommandState('justifyCenter'),
        alignR: document.queryCommandState('justifyRight'),
        alignJ: document.queryCommandState('justifyFull'),
        block: document.queryCommandValue('formatBlock'),
      });
    } catch (e) { }
  }, []);

  const exec = useCallback((cmd, val = null) => {
    editorRef.current.focus();
    document.execCommand(cmd, false, val);
    updateFmt();
    setHtmlContent(editorRef.current.innerHTML);
  }, [updateFmt, setHtmlContent]);

  const COLORS = ['#1a1a1a', '#ef4444', '#f59e0b', '#22c55e', '#0052cc', '#7c7cff', '#ec4899', '#8b5cf6', '#06b6d4', '#84cc16', '#ffffff', '#f5f5f5', '#e5e5e5', '#aaaaaa', '#555555', '#000000'];

  const ToolBtn = ({ icon: Icon, label, cmd, val, activeKey, title, isActive: forceActive }) => {
    const active = forceActive !== undefined ? forceActive : (activeKey ? fmt[activeKey] : false);
    return (
      <button
        onMouseDown={e => { e.preventDefault(); exec(cmd, val || null); }}
        title={title || label}
        style={{ minWidth: 28, height: 26, padding: '0 5px', borderRadius: 5, border: 'none', cursor: 'pointer', background: active ? 'rgba(124,124,255,0.15)' : 'transparent', color: active ? '#7c7cff' : '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', fontSize: 11, fontWeight: 600, gap: 2, transition: 'all 0.1s' }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
      >
        {Icon ? <Icon size={13} strokeWidth={2.2} /> : label}
      </button>
    );
  };

  const Sep = () => <div style={{ width: 1, height: 18, background: '#e0e0e0', margin: '0 3px', flexShrink: 0 }} />;

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 6px rgba(14,15,37,0.05)' }}>

      {/* DOC HEADER — Edit button lives here */}
      <div style={{ background: 'linear-gradient(135deg,rgba(0,82,204,0.03),rgba(124,124,255,0.05))', padding: '28px 52px 22px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#7c7cff', marginBottom: 10 }}>Request for Proposal</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.25, marginBottom: 6 }}>AWS Cloud Migration Consulting Services</div>
            <div style={{ fontSize: 13, color: '#888' }}>DDAIS Group · Procurement Division · RFP-2026-004</div>
          </div>
          {/* Edit / Save / Discard — RIGHT SIDE of header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, marginLeft: 32, flexShrink: 0 }}>
            {!isEditing ? (
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => setHtmlContent('__EDIT__')}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: '1.5px solid rgba(124,124,255,0.35)', background: 'rgba(124,124,255,0.06)', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#7c7cff', fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,124,255,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,124,255,0.06)'}
              >
                <Pencil size={13} strokeWidth={2.2} /> Edit Document
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setHtmlContent('__DISCARD__')} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: '#666', fontFamily: 'inherit' }}>Discard</button>
                <button onClick={() => setHtmlContent('__SAVE__')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, border: 'none', background: '#0052cc', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'inherit' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#0041a3'} onMouseLeave={e => e.currentTarget.style.background = '#0052cc'}>
                  <CheckCircle size={13} /> Save
                </button>
              </div>
            )}
            {isEditing && (
              <div style={{ fontSize: 11, color: '#aaa', display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'rfpPulse 2s infinite' }} />
                Editing mode
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          {['Technology & Consulting', 'Cloud & Infrastructure', 'OpEx', 'UAE / Dubai', 'T&M Pricing'].map(tag => (
            <span key={tag} style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 500, color: '#555' }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* WYSIWYG TOOLBAR — appears below header when editing */}
      {isEditing && (
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, padding: '6px 12px', borderBottom: '1px solid var(--border-subtle)', background: '#fafafa', position: 'sticky', top: 145, zIndex: 20 }}>

          {/* Undo / Redo */}
          <ToolBtn icon={Undo2} cmd="undo" title="Undo (Ctrl+Z)" />
          <ToolBtn icon={Redo2} cmd="redo" title="Redo (Ctrl+Y)" />
          <Sep />

          {/* Source / Clear */}
          <ToolBtn icon={Code} cmd="removeFormat" title="Source code (view only)" />
          <button onMouseDown={e => e.preventDefault()} onClick={() => exec('removeFormat')} title="Clear formatting"
            style={{ minWidth: 28, height: 26, padding: '0 5px', borderRadius: 5, border: 'none', cursor: 'pointer', background: 'transparent', color: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <RemoveFormatting size={13} strokeWidth={2.2} />
          </button>
          <Sep />

          {/* Formats dropdown */}
          <div style={{ position: 'relative' }}>
            <button onMouseDown={e => e.preventDefault()} onClick={() => setShowFmtMenu(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 4, height: 26, padding: '0 8px', borderRadius: 5, border: '1px solid #e0e0e0', background: '#fff', fontSize: 11, fontWeight: 500, cursor: 'pointer', color: '#333', fontFamily: 'inherit' }}>
              <Type size={12} />
              {fmt.block === 'h2' ? 'Heading 1' : fmt.block === 'h3' ? 'Heading 2' : fmt.block === 'h4' ? 'Heading 3' : 'Normal text'}
              <ChevronDown size={11} />
            </button>
            {showFmtMenu && (
              <div style={{ position: 'absolute', top: 30, left: 0, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, minWidth: 160, padding: 4 }}>
                {[['Normal text', 'p'], ['Heading 1', 'h2'], ['Heading 2', 'h3'], ['Heading 3', 'h4'], ['Blockquote', 'blockquote']].map(([label, val]) => (
                  <button key={val} onMouseDown={e => e.preventDefault()} onClick={() => { exec('formatBlock', val); setShowFmtMenu(false); }}
                    style={{ display: 'block', width: '100%', padding: '7px 12px', border: 'none', background: 'transparent', textAlign: 'left', fontSize: val === 'h2' ? 15 : val === 'h3' ? 13 : val === 'h4' ? 12 : 12, fontWeight: val.startsWith('h') ? 700 : 400, cursor: 'pointer', color: '#1a1a1a', borderRadius: 7, fontFamily: 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,124,255,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Sep />

          {/* Bold / Italic / Underline */}
          <ToolBtn icon={Bold} cmd="bold" activeKey="bold" title="Bold (Ctrl+B)" />
          <ToolBtn icon={Italic} cmd="italic" activeKey="italic" title="Italic (Ctrl+I)" />
          <ToolBtn icon={Underline} cmd="underline" activeKey="underline" title="Underline (Ctrl+U)" />
          <Sep />

          {/* Alignment */}
          <ToolBtn icon={AlignLeft} cmd="justifyLeft" activeKey="alignL" title="Align left" />
          <ToolBtn icon={AlignCenter} cmd="justifyCenter" activeKey="alignC" title="Align center" />
          <ToolBtn icon={AlignRight} cmd="justifyRight" activeKey="alignR" title="Align right" />
          <ToolBtn icon={AlignJustify} cmd="justifyFull" activeKey="alignJ" title="Justify" />
          <Sep />

          {/* Lists + Indent */}
          <ToolBtn icon={List} cmd="insertUnorderedList" activeKey="ul" title="Bullet list" />
          <ToolBtn icon={ListOrdered} cmd="insertOrderedList" activeKey="ol" title="Numbered list" />
          <ToolBtn icon={Outdent} cmd="outdent" title="Decrease indent" />
          <ToolBtn icon={Indent} cmd="indent" title="Increase indent" />
          <Sep />

          {/* Link */}
          <button onMouseDown={e => e.preventDefault()} onClick={() => { const url = prompt('Enter URL:'); if (url) exec('createLink', url); }} title="Insert link"
            style={{ minWidth: 28, height: 26, padding: '0 5px', borderRadius: 5, border: 'none', cursor: 'pointer', background: 'transparent', color: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Link size={13} strokeWidth={2.2} />
          </button>
          <button onMouseDown={e => e.preventDefault()} onClick={() => { const src = prompt('Image URL:'); if (src) exec('insertImage', src); }} title="Insert image"
            style={{ minWidth: 28, height: 26, padding: '0 5px', borderRadius: 5, border: 'none', cursor: 'pointer', background: 'transparent', color: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Image size={13} strokeWidth={2.2} />
          </button>
          <Sep />

          {/* Print */}
          <button onMouseDown={e => e.preventDefault()} onClick={() => window.print()} title="Print"
            style={{ minWidth: 28, height: 26, padding: '0 5px', borderRadius: 5, border: 'none', cursor: 'pointer', background: 'transparent', color: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Printer size={13} strokeWidth={2.2} />
          </button>
          <Sep />

          {/* Text color */}
          <div style={{ position: 'relative' }}>
            <button onMouseDown={e => e.preventDefault()} onClick={() => setShowColorPicker(v => v === 'text' ? null : 'text')} title="Text color"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 28, height: 26, padding: '0 4px', borderRadius: 5, border: 'none', cursor: 'pointer', background: 'transparent', gap: 1 }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Type size={12} color="#444" strokeWidth={2.2} />
              <div style={{ width: 18, height: 3, borderRadius: 2, background: textColor }} />
            </button>
            {showColorPicker === 'text' && (
              <div style={{ position: 'absolute', top: 32, left: 0, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 5, width: 108 }}>
                {COLORS.map(c => (
                  <button key={c} onMouseDown={e => e.preventDefault()} onClick={() => { exec('foreColor', c); setTextColor(c); setShowColorPicker(null); }}
                    style={{ width: 20, height: 20, borderRadius: 4, background: c, border: c === '#ffffff' ? '1px solid #e0e0e0' : 'none', cursor: 'pointer' }} />
                ))}
              </div>
            )}
          </div>

          {/* Background color */}
          <div style={{ position: 'relative' }}>
            <button onMouseDown={e => e.preventDefault()} onClick={() => setShowColorPicker(v => v === 'bg' ? null : 'bg')} title="Background color"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 28, height: 26, padding: '0 4px', borderRadius: 5, border: 'none', cursor: 'pointer', background: 'transparent', gap: 1 }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Palette size={12} color="#444" strokeWidth={2.2} />
              <div style={{ width: 18, height: 3, borderRadius: 2, background: bgColor }} />
            </button>
            {showColorPicker === 'bg' && (
              <div style={{ position: 'absolute', top: 32, left: 0, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 5, width: 108 }}>
                {COLORS.map(c => (
                  <button key={c} onMouseDown={e => e.preventDefault()} onClick={() => { exec('hiliteColor', c); setBgColor(c); setShowColorPicker(null); }}
                    style={{ width: 20, height: 20, borderRadius: 4, background: c, border: c === '#ffffff' ? '1px solid #e0e0e0' : 'none', cursor: 'pointer' }} />
                ))}
              </div>
            )}
          </div>
          <Sep />

          {/* Table */}
          <button onMouseDown={e => e.preventDefault()} onClick={() => exec('insertHTML', '<table style="border-collapse:collapse;width:100%"><tr><td style="border:1px solid #ddd;padding:8px">Cell 1</td><td style="border:1px solid #ddd;padding:8px">Cell 2</td></tr><tr><td style="border:1px solid #ddd;padding:8px">Cell 3</td><td style="border:1px solid #ddd;padding:8px">Cell 4</td></tr></table><p></p>')} title="Insert table"
            style={{ minWidth: 28, height: 26, padding: '0 5px', borderRadius: 5, border: 'none', cursor: 'pointer', background: 'transparent', color: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Table size={13} strokeWidth={2.2} />
          </button>

        </div>
      )}

      {/* EDITABLE BODY */}
      <div
        ref={editorRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onInput={e => { updateFmt(); setHtmlContent(e.currentTarget.innerHTML); }}
        onKeyUp={updateFmt}
        onMouseUp={updateFmt}
        onClick={() => { updateFmt(); setShowFmtMenu(false); setShowColorPicker(null); }}
        style={{
          padding: '32px 52px 52px',
          minHeight: 400,
          outline: 'none',
          background: '#fff',
          cursor: isEditing ? 'text' : 'default',
          fontFamily: 'inherit',
          fontSize: 13,
          lineHeight: 1.8,
          color: '#333',
        }}
      />

      <style>{`
        [contenteditable] h2 { font-size:16px; font-weight:700; color:#1a1a1a; margin:28px 0 10px; padding-bottom:8px; border-bottom:1px solid #efefef; }
        [contenteditable] h3 { font-size:14px; font-weight:700; color:#1a1a1a; margin:20px 0 8px; }
        [contenteditable] h4 { font-size:13px; font-weight:700; color:#1a1a1a; margin:16px 0 6px; }
        [contenteditable] p  { margin:0 0 12px; }
        [contenteditable] ul, [contenteditable] ol { padding-left:22px; margin:6px 0 14px; }
        [contenteditable] li { margin-bottom:4px; }
        [contenteditable] strong { font-weight:700; color:#1a1a1a; }
        [contenteditable] em { font-style:italic; }
        [contenteditable] blockquote { border-left:3px solid #7c7cff; margin:12px 0; padding:8px 16px; background:rgba(124,124,255,0.04); border-radius:0 8px 8px 0; font-style:italic; color:#555; }
        [contenteditable] table { border-collapse:collapse; width:100%; margin:12px 0; }
        [contenteditable] td, [contenteditable] th { border:1px solid #e0e0e0; padding:8px 12px; font-size:13px; }
        [contenteditable][contenteditable="false"] h2 { font-size:16px; font-weight:700; color:#1a1a1a; margin:28px 0 10px; padding-bottom:8px; border-bottom:1px solid #efefef; }
        [contenteditable][contenteditable="false"] h3 { font-size:14px; font-weight:700; color:#1a1a1a; margin:20px 0 8px; }
        [contenteditable][contenteditable="false"] p  { margin:0 0 12px; }
        [contenteditable][contenteditable="false"] ul, [contenteditable][contenteditable="false"] ol { padding-left:22px; margin:6px 0 14px; }
        [contenteditable][contenteditable="false"] li { margin-bottom:4px; }
        [contenteditable][contenteditable="false"] strong { font-weight:700; color:#1a1a1a; }
        [contenteditable]:focus { outline:none; }
        .editable-cell { border: 1px solid #e0e0e0 !important; border-radius: 8px !important; background: #fff !important; transition: all 0.15s ease; padding: 10px 14px !important; outline: none !important; width: 100%; box-sizing: border-box; }
        .editable-cell:hover { border-color: #d1d5db !important; }
        .editable-cell:focus { border-color: #7c7cff !important; box-shadow: 0 0 0 3px rgba(124,124,255,0.1) !important; }
        @keyframes rfpPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    @keyframes toastIn  { from{opacity:0;transform:translateX(-50%) translateY(-10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .tab-btn:hover { color:var(--text-primary) !important; }
      `}</style>
    </div>
  );
}

const VENDORS = [
  { id: 1, name: 'Accenture Middle East', location: 'Dubai, UAE', score: 94, rationale: ['Extensive cloud migration experience', 'Strong regional presence in UAE', 'High technical competency'] },
  { id: 2, name: 'Deloitte Technology', location: 'Abu Dhabi, UAE', score: 88, rationale: ['Deep industry domain expertise', 'Proven track record in digital transformation', 'Excellent team composition'] },
  { id: 3, name: 'TCS Digital', location: 'Dubai, UAE', score: 85, rationale: ['Cost-effective delivery model', 'Robust global delivery network', 'Strong relevant experience'] },
  { id: 4, name: 'Infosys Cloud Services', location: 'Dubai, UAE', score: 79, rationale: ['Solid approach and methodology', 'Competitive commercial proposal', 'Good technical capabilities'] },
  { id: 5, name: 'Wipro Cloud Practice', location: 'Remote / UAE Ops', score: 76, rationale: ['Flexible engagement model', 'Adequate relevant experience', 'Acceptable technical score'] },
];
const SCORING_CRITERIA = [
  { label: 'Technical Competency', weight: 30, color: '#7c7cff' },
  { label: 'Relevant Experience', weight: 25, color: '#0052cc' },
  { label: 'Team Composition & CVs', weight: 20, color: '#22c55e' },
  { label: 'Commercial Proposal', weight: 15, color: '#f59e0b' },
  { label: 'Approach & Methodology', weight: 10, color: '#ef4444' },
];
const DUMMY_VENDORS = [
  { id: 'dv1', name: 'Acme Corp', location: 'Dubai, UAE', rationale: ['Solid IT consulting background', 'Extensive experience in enterprise projects'] },
  { id: 'dv2', name: 'TechFlow Inc', location: 'Abu Dhabi, UAE', rationale: ['Competitive pricing structure', 'Good regional delivery capabilities'] },
  { id: 'dv3', name: 'Global Sourcing Ltd', location: 'Dubai, UAE', rationale: ['Global reputation and scale', 'High technical capabilities in AI and Cloud'] },
  { id: 'dv4', name: 'Nexus IT Solutions', location: 'Riyadh, KSA', rationale: ['Strong local presence', 'Proven track record in government projects'] },
  { id: 'dv5', name: 'CloudPeak Systems', location: 'Dubai, UAE', rationale: ['AWS Premier Partner', 'Excellent cloud migration capabilities'] },
  { id: 'dv6', name: 'DataEdge Consulting', location: 'Doha, Qatar', rationale: ['Specialized in big data analytics', 'Cost-effective offshore teams'] },
  { id: 'dv7', name: 'Pioneer Tech', location: 'Abu Dhabi, UAE', rationale: ['Deep industry expertise', 'Comprehensive support models'] },
  { id: 'dv8', name: 'Visionary Dynamics', location: 'Dubai, UAE', rationale: ['Innovative AI solutions', 'Agile delivery methodologies'] }
];

const NEGOTIATION_DATA = {
  'Accenture Middle East v1': {
    stats: {
      vendor: 'Accenture Middle East v1',
      sentiment: { rating: 'Positive', score: 8.2 },
      risks: { high: 0, medium: 2, low: 3, count: 5 },
      gaps: 4,
      commercial: { gap: 'Medium', detail: '+12% over budget target' },
      batna: 'Strong - 2 Viable Alternatives',
      overall: 82
    },
    marketSignals: {
      financial: { title: 'Financial Signals', icon: TrendingUp, desc: 'Q3 revenue up 8% YoY. Operating margins improved to 15.2%. No red flags in recent 10-K filings. Strong cash position suggests low pricing desperation.' },
      market: { title: 'Market Position', icon: BarChart2, desc: 'Maintained leader status in Gartner Magic Quadrant for Cloud Services. High customer concentration in MEA public sector. Recently lost a major banking contract in UAE.' },
      operational: { title: 'Operational & Capacity', icon: Briefcase, desc: 'Aggressive hiring in UAE delivery centers (+15% headcount in last quarter). Bench strength is healthy. No flagged project backlogs.' },
      news: { title: 'News & Sentiment', icon: Globe, desc: 'Positive sentiment around recent AWS Premier Tier partner renewal. No significant litigation or ESG incidents reported in the last 12 months.' }
    },
    technicalGaps: [
      { type: 'gap', title: 'Data Migration Strategy', desc: 'The proposal lacks detailed rollback procedures during the cutover phase.' },
      { type: 'strength', title: 'Security Architecture', desc: 'Exceptionally strong Zero Trust architecture design that exceeds RFP requirements.' },
      { type: 'clarification', title: 'Support SLA', desc: 'Clarify if L3 support covers 24/7 or only standard UAE business hours.' },
      { type: 'risk', title: 'Resource Allocation', desc: 'Key cloud architects are only allocated at 50% capacity during month 2.' },
      { type: 'benchmark', title: 'Methodology', desc: 'Their migration automation tools benchmark 20% faster than average bidders.' }
    ],
    commercialPointers: [
      'Rate card for Senior Architects is 10% above market average for UAE.',
      'Software licensing costs are bundled; request a line-item breakdown.',
      'Payment terms proposed are Net 30; our standard is Net 45. Push for Net 45.',
      'Travel & Expenses (T&E) are uncapped. Negotiate a hard cap at 5% of total engagement value.'
    ],
    strategyBrief: {
      opening: 'Acknowledge strong technical fit but emphasize that commercials are currently uncompetitive compared to alternative bids.',
      target: '₹42,00,000',
      walkAway: '₹45,00,000',
      concessions: [
        'Offer flexibility on start date in exchange for lower rate card.',
        'Concede Net 30 only if T&E is fully absorbed by vendor.'
      ],
      batna: 'Award contract to Deloitte Technology (scored 88, priced at ₹40,50,000). Their technical score is slightly lower, but commercials are fully aligned with budget.'
    },
    clarificationQuestions: [
      {
        question: "Does the L3 support SLA cover 24/7 or only standard UAE business hours?",
        context: "The proposal mentions 'Comprehensive L3 Support' but omits specific operational hours, which is critical for estimating off-hours risk."
      },
      {
        question: "Can you provide a line-item breakdown of the bundled software licensing costs?",
        context: "Commercial proposal bundles licensing with services, obscuring the true margins and preventing direct comparison with competitors."
      },
      {
        question: "What are the specific rollback procedures planned during the cutover phase?",
        context: "The Data Migration Strategy outlines forward progress but vaguely references 'contingency measures' without detailing rollback timelines."
      }
    ]
  }
};

const COST_ITEMS = [
  { phase: 'Phase 1 — Assessment', duration: '2 months', resources: '3 Architects', estimate: '₹10,00,000 - ₹14,00,000' },
  { phase: 'Phase 2 — Migration', duration: '3 months', resources: '3 Architects + 2 Engineers', estimate: '₹20,00,000 - ₹30,00,000' },
  { phase: 'Phase 3 — Stabilisation', duration: '1 month', resources: '2 Architects', estimate: '₹6,00,000 - ₹10,00,000' },
  { phase: 'PM & Coordination', duration: '6 months', resources: '1 Project Manager', estimate: '₹2,00,000 - ₹4,00,000' },
];
const VERSION_HISTORY = [
  { version: 'v1.2', date: '10 May 2026 · 14:32', author: 'AI Agent', note: 'Scoring criteria updated, cost estimation refined', active: true },
  { version: 'v1.1', date: '09 May 2026 · 16:10', author: 'AI Agent', note: 'Supplier research findings incorporated', active: false },
  { version: 'v1.0', date: '09 May 2026 · 11:00', author: 'AI Agent', note: 'Initial RFP generated from PR fields', active: false },
];
const AUDIT_ENTRIES = [
  { type: 'ai', title: 'RFP Generated (v1.2)', desc: 'AI updated RFP with refined scoring config and cost estimation.', actor: 'AI Agent', time: '10 May · 14:32' },
  { type: 'ai', title: 'Scoring Config Finalised', desc: 'Evaluation criteria weights set: Technical 30%, Experience 25%, etc.', actor: 'AI Agent', time: '10 May · 14:31' },
  { type: 'ai', title: 'Cost Estimation Complete', desc: 'AI estimated ₹45,00,000 based on T&M rates in UAE market.', actor: 'AI Agent', time: '10 May · 14:30' },
  { type: 'ai', title: 'Supplier Research Complete', desc: '5 vendors shortlisted from 847 by AWS partner status and UAE presence.', actor: 'AI Agent', time: '09 May · 11:02' },
  { type: 'ai', title: 'RFQ Template Selected', desc: 'Technology Consulting Standard v2.1 selected by AI.', actor: 'AI Agent', time: '09 May · 11:00' },
  { type: 'ai', title: 'Compliance Validation Passed', desc: 'Policy §4.2 check passed. RFP mandatory for complex engagements >₹10L.', actor: 'AI Agent', time: '08 May · 09:17' },
  { type: 'ai', title: 'Budget Check Passed', desc: 'Engineering cost centre budget headroom: ₹15,00,000.', actor: 'AI Agent', time: '08 May · 09:17' },
  { type: 'ai', title: 'AI Classification: Complex', desc: 'Classified Complex (92% confidence). ₹45L exceeds ₹10L threshold.', actor: 'AI Agent', time: '08 May · 09:16' },
  { type: 'user', title: 'PR Created', desc: 'PR-2026-004 created via document upload by David Kim.', actor: 'David Kim', time: '08 May · 09:12' },
];

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
  const [fSourcingMethod, setFSourcingMethod] = useState('Competitive tender'); const [fSourcingMethodOpen, setFSourcingMethodOpen] = useState(false);
  const [fTimeline, setFTimeline] = useState('Phase 1: Assessment (Month 1-2), Phase 2: Migration (Month 3-5), Phase 3: Support (Month 6)');

  const fBizUnitRef = useRef(null); const fPriorityRef = useRef(null);
  const fProcCatRef = useRef(null); const fSubcatRef = useRef(null);
  const fCapexRef = useRef(null); const fUomRef = useRef(null);
  const fVendorRef = useRef(null); const fDeliveryRef = useRef(null); const fSourcingMethodRef = useRef(null);

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
      if (fSourcingMethodRef.current && !fSourcingMethodRef.current.contains(e.target)) setFSourcingMethodOpen(false);
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
          <div>
            <EL>Sourcing Method <span style={{ fontSize: 11, color: '#999', fontWeight: 400, textTransform: 'none', letterSpacing: 'normal' }}>(Optional - helps in classification)</span></EL>
            <EDrop refEl={fSourcingMethodRef} open={fSourcingMethodOpen} onToggle={() => setFSourcingMethodOpen(!fSourcingMethodOpen)} value={fSourcingMethod} placeholder="Select sourcing method" options={['Single source', 'Competitive tender']} onChange={v => setFSourcingMethod(v)} />
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

const REASONING_MAP = {
  1: ['Reading uploaded PR document', 'Extracting 21 procurement fields', '14 fields auto-extracted with high confidence', 'Creating document folder in SharePoint', 'Linking PR metadata to folder'],
  2: ['Analysing spend value: ₹45,00,000', 'Threshold check: exceeds ₹10L complex limit', 'Multi-phase engagement detected', 'Decision: Complex procurement'],
  3: ['Budget nature: ongoing operational spend', 'No capital asset creation involved', 'Decision: OpEx'],
  4: ['Category: Technology and Consulting', 'Not directly linked to production output', 'Decision: Indirect Spend'],
  5: ['PR classified as Complex', 'Value above threshold - manager approval required', 'Routing to: Sarah Chen (L2 approver)', 'SLA target: 15 July 2026'],
  6: ['Approved budget for Engineering: ₹60,00,000', 'PR value: ₹45,00,000', 'Remaining headroom: ₹15,00,000', 'Budget check: PASSED'],
  7: ['Cost centre ENG-402 validated', 'CapEx/OpEx classification confirmed: OpEx', 'Finance policy check: PASSED'],
  8: ['Vendor compliance status: all 5 vendors active', 'Policy 4.2 check: RFP required for complex', 'Compliance check: PASSED'],
  9: ['Queried vendor database: 847 vendors', 'Applied AWS partner filter + UAE location', '5 vendors shortlisted by confidence score'],
  10: ['RFP template selected: Technology Consulting Standard v2.1', 'Scoring config generated: 5 criteria', 'Cost estimation complete: ₹45,00,000'],
};

export default function PRDetailRFP({ onNavigate, activeNav, userRole, navState }) {
  const [showEditModal, setShowEditModal] = useState(navState?.openEditPopup || false);
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
  const [chatReasoningComplete, setChatReasoningComplete] = useState(true);

  useEffect(() => {
    if (!chatMenuOpen) return;
    function handler(e) {
      if (chatMenuRef.current && !chatMenuRef.current.contains(e.target)) setChatMenuOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [chatMenuOpen]);
  const [saveToast, setSaveToast] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('rfp');
  const [versionPaneOpen, setVersionPaneOpen] = useState(false);
  const [showNewVersionModal, setShowNewVersionModal] = useState(false);
  const [newVersionNote, setNewVersionNote] = useState('');
  const [newVersionGenerating, setNewVersionGenerating] = useState(false);
  const [auditFilter, setAuditFilter] = useState('all');
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [published, setPublished] = useState(false);
  const [showRegenToast, setShowRegenToast] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rfpHtml, setRfpHtml] = useState(INITIAL_HTML);
  const [savedHtml, setSavedHtml] = useState(INITIAL_HTML);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [selectedAwardVendor, setSelectedAwardVendor] = useState('');
  const [showAwardSuccessToast, setShowAwardSuccessToast] = useState(false);

  const [proposals, setProposals] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForms, setUploadForms] = useState([{ id: Date.now(), vendorName: '', file: null, supporting: [] }]);
  const [uploadForm, setUploadForm] = useState({ vendorName: '', file: null, supporting: [] });
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [selectedNegotVendorId, setSelectedNegotVendorId] = useState(null);

  const [suggestedVendors, setSuggestedVendors] = useState(VENDORS);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [showScoringConfigModal, setShowScoringConfigModal] = useState(false);
  const [scoringConfigData, setScoringConfigData] = useState([
    { sr: 1, cat: 'Technical Solution', crit: 'Technical Competency', w: 30 },
    { sr: 2, cat: 'Technical Solution', crit: 'Approach & Methodology', w: 10 },
    { sr: 3, cat: 'Vendor Assessment', crit: 'Relevant Experience', w: 25 },
    { sr: 4, cat: 'Vendor Assessment', crit: 'Team Composition & CVs', w: 20 },
    { sr: 5, cat: 'Compliance & Requirements', crit: 'Commercial Proposal', w: 15 },
  ]);
  const [showCostConfigModal, setShowCostConfigModal] = useState(false);
  const [costCurrencyOpen, setCostCurrencyOpen] = useState(false);
  const [costCurrency, setCostCurrency] = useState('AED');
  const costCurrencyRef = useRef(null);

  const [negotVendorOpen, setNegotVendorOpen] = useState(false);
  const negotVendorRef = useRef(null);

  useEffect(() => {
    const handleDocClick = (e) => {
      if (costCurrencyRef.current && !costCurrencyRef.current.contains(e.target)) setCostCurrencyOpen(false);
      if (negotVendorRef.current && !negotVendorRef.current.contains(e.target)) setNegotVendorOpen(false);
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, []);

  const getCurrencySymbol = (cur) => {
    switch (cur) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'INR': return '₹';
      case 'AED': default: return 'AED ';
    }
  };

  useEffect(() => {
    const sym = getCurrencySymbol(costCurrency);
    const locale = costCurrency === 'INR' ? 'en-IN' : 'en-US';
    setCostConfigData(prev => prev.map(row => {
      const numMin = (row.cmin || '').replace(/[^\d]/g, '');
      const numMax = (row.cmax || '').replace(/[^\d]/g, '');

      const formatNum = (num) => {
        if (!num) return '';
        const n = parseInt(num, 10);
        return n.toLocaleString(locale);
      };

      return {
        ...row,
        cmin: numMin ? formatNum(numMin) : row.cmin,
        cmax: numMax ? formatNum(numMax) : row.cmax,
      };
    }));
  }, [costCurrency]);
  const [costConfigData, setCostConfigData] = useState([
    { p: 'Phase 1', m: 'Assessment', t: '2 months', r: '3 Architects', cmin: '10,00,000', cmax: '14,00,000' },
    { p: 'Phase 2', m: 'Implementation', t: '3 months', r: '5 Engineers', cmin: '20,00,000', cmax: '30,00,000' },
    { p: 'Phase 3', m: 'Support', t: '1 month', r: '2 Support Eng.', cmin: '6,00,000', cmax: '10,00,000' },
    { p: 'PM & Coordination', m: 'Project Mgmt', t: '6 months', r: '1 Project Manager', cmin: '2,00,000', cmax: '4,00,000' },
  ]);
  const [selectedDummyVendors, setSelectedDummyVendors] = useState([]);
  const [isVendorDropdownOpen, setIsVendorDropdownOpen] = useState(false);
  const [vendorToast, setVendorToast] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(null);
  const [showReuploadModal, setShowReuploadModal] = useState(null);
  const [showSupportingDocModal, setShowSupportingDocModal] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(null);
  const [reupFileDrag, setReupFileDrag] = useState(false);
  const [reupSuppDrag, setReupSuppDrag] = useState(false);
  const [suppDocDrag, setSuppDocDrag] = useState(false);
  const [propFileDrag, setPropFileDrag] = useState(null);
  const [suppFileDrag, setSuppFileDrag] = useState(null);

  const prStatus = published ? 'RFP Published' : 'Pending RFP Approval';
  const statusCfg = STATUS_CONFIG[prStatus];
  const handlePublish = () => { setShowPublishConfirm(false); setPublished(true); setActiveTab('proposals'); };

  const handleProposalUpload = () => {
    const validForms = uploadForms.filter(f => f.vendorName && f.file);
    if (validForms.length === 0) return;
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateStr = `${String(now.getDate()).padStart(2, '0')}-${months[now.getMonth()]}-${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newProps = validForms.map((form, idx) => ({
      id: Date.now() + idx,
      vendorName: form.vendorName,
      uploadDate: dateStr,
      status: 'Processing',
      fileName: form.file.name,
      version: 'v1.0',
      techScore: 'Pending',
      commercial: 'Pending',
      risks: [],
      criteriaScores: {},
      state: null
    }));

    setProposals([...proposals, ...newProps]);
    setShowUploadModal(false); setPropFileDrag(null); setSuppFileDrag(null);
    setUploadForms([{ id: Date.now(), vendorName: '', file: null, supporting: [] }]);

    setTimeout(() => {
      setProposals(prev => prev.map(p => {
        if (newProps.some(np => np.id === p.id)) {
          const s1 = Math.floor(Math.random() * 5 + 23); // tech (30)
          const s2 = Math.floor(Math.random() * 5 + 18); // exp (25)
          const s3 = Math.floor(Math.random() * 5 + 13); // team (20)
          const s4 = Math.floor(Math.random() * 4 + 10); // comm (15)
          const s5 = Math.floor(Math.random() * 3 + 6); // approach (10)
          const total = s1 + s2 + s3 + s4 + s5;
          const commVal = Math.floor(Math.random() * 40 + 120); // 120k to 160k
          const risksPool = ['High implementation risk due to offshore team', 'Minor SLA compliance gaps', 'Aggressive timeline assumption', 'Resource availability risk', 'Strong compliance but slow delivery potential', 'None identified'];
          return {
            ...p,
            status: 'Completed',
            state: total >= 70 ? 'pass' : 'fail',
            techScore: `${total}/100`,
            commercial: `$${commVal},000`,
            criteriaScores: {
              'Technical Competency': `${s1}/30`,
              'Relevant Experience': `${s2}/25`,
              'Team Composition & CVs': `${s3}/20`,
              'Commercial Proposal': `${s4}/15`,
              'Approach & Methodology': `${s5}/10`
            },
            risks: [risksPool[Math.floor(Math.random() * risksPool.length)], risksPool[Math.floor(Math.random() * risksPool.length)]].filter((v, i, a) => a.indexOf(v) === i)
          };
        }
        return p;
      }));
    }, 3000);
  };

  const handleReupload = () => {
    if (!uploadForm.file) return;
    setProposals(prev => prev.map(p => {
      if (p.id === showReuploadModal) {
        const currentV = parseInt(p.version.replace('v', '').split('.')[0]);
        return {
          ...p,
          fileName: uploadForm.file.name,
          version: `v${currentV + 1}.0`,
          status: 'Processing',
          state: null,
          techScore: 'Pending',
          commercial: 'Pending',
          risks: [],
          criteriaScores: {}
        };
      }
      return p;
    }));
    const targetId = showReuploadModal;
    setShowReuploadModal(null);
    setUploadForm({ vendorName: '', file: null, supporting: [] });
    setTimeout(() => {
      setProposals(prev => prev.map(p => {
        if (p.id === targetId) {
          const s1 = Math.floor(Math.random() * 5 + 24);
          const s2 = Math.floor(Math.random() * 5 + 19);
          const s3 = Math.floor(Math.random() * 5 + 14);
          const s4 = Math.floor(Math.random() * 4 + 11);
          const s5 = Math.floor(Math.random() * 3 + 7);
          const total = s1 + s2 + s3 + s4 + s5;
          const commVal = Math.floor(Math.random() * 30 + 110);
          return {
            ...p,
            status: 'Completed',
            techScore: `${total}/100`,
            commercial: `$${commVal},000`,
            criteriaScores: {
              'Technical Competency': `${s1}/30`,
              'Relevant Experience': `${s2}/25`,
              'Team Composition & CVs': `${s3}/20`,
              'Commercial Proposal': `${s4}/15`,
              'Approach & Methodology': `${s5}/10`
            },
            risks: ['Revised timeline reduces risk', 'Commercials aligned with budget']
          };
        }
        return p;
      }));
    }, 3000);
  };

  // Handle special signals from WYSIWYGEditor
  const handleHtmlChange = (val) => {
    if (val === '__EDIT__') { setIsEditing(true); return; }
    if (val === '__SAVE__') { setSavedHtml(rfpHtml); setIsEditing(false); return; }
    if (val === '__DISCARD__') { setRfpHtml(savedHtml); setIsEditing(false); return; }
    setRfpHtml(val);
  };

  const btnGhost = { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'inherit' };
  const btnBlue = { display: 'flex', alignItems: 'center', gap: 7, padding: '8px 20px', borderRadius: 8, border: 'none', background: '#0052cc', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'inherit', boxShadow: '0 3px 12px rgba(0,82,204,0.25)' };

  return (
    <>
      {saveToast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: '#f0fdf4', border: '1px solid rgba(34,197,94,0.25)', borderLeft: '4px solid #22c55e', borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 32px rgba(14,15,37,0.1)', minWidth: 340, animation: 'toastIn 0.2s ease forwards' }}>
          <CheckCircle size={20} color="#22c55e" strokeWidth={2} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>{saveToast.title}</div>
            <div style={{ fontSize: 12, color: '#166534', marginTop: 2 }}>{saveToast.subtext}</div>
          </div>
          <button onClick={() => setSaveToast(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(21,128,61,0.5)', display: 'flex' }}><X size={16} /></button>
        </div>
      )}
      {showEditModal && <EditModal onClose={() => setShowEditModal(false)} onSave={() => { setShowEditModal(false); setSaveToast({ title: 'Changes saved successfully', subtext: 'Requisition details have been updated.' }); setTimeout(() => setSaveToast(null), 3000); }} />}
      {showRegenToast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: '#f0f4ff', border: '1px solid rgba(124,124,255,0.25)', borderLeft: '4px solid #7c7cff', borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 32px rgba(14,15,37,0.1)', minWidth: 340, animation: 'toastIn 0.2s ease forwards' }}>
          <RefreshCw size={18} color="#7c7cff" style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }} />
          <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: '#3d3db8' }}>RFP Regeneration Started</div><div style={{ fontSize: 12, color: '#6d6dcc', marginTop: 2 }}>AI is regenerating the RFP. ~60 seconds.</div></div>
          <button onClick={() => setShowRegenToast(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#aaa' }}><X size={15} /></button>
        </div>
      )}
      {vendorToast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: '#f0fdf4', border: '1px solid rgba(34,197,94,0.25)', borderLeft: '4px solid #22c55e', borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 32px rgba(14,15,37,0.1)', minWidth: 340, animation: 'toastIn 0.2s ease forwards' }}>
          <CheckCircle size={18} color="#22c55e" strokeWidth={2} style={{ flexShrink: 0 }} />
          <div style={{ fontSize: 13, fontWeight: 500, color: '#15803d', flex: 1 }}>{vendorToast}</div>
          <button onClick={() => setVendorToast(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(21,128,61,0.5)', display: 'flex' }}><X size={16} /></button>
        </div>
      )}

      {showNewVersionModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { if (!newVersionGenerating) setShowNewVersionModal(false); }}>
          <div style={{ background: '#fff', borderRadius: 16, width: 480, padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: 16 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div><div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Generate New Version</div><div style={{ fontSize: 12, color: '#999', marginTop: 3 }}>Describe what should change</div></div>
              <button onClick={() => setShowNewVersionModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999' }}><X size={18} /></button>
            </div>
            <textarea value={newVersionNote} onChange={e => setNewVersionNote(e.target.value)} placeholder="e.g. Update evaluation criteria weights..." autoFocus
              style={{ width: '100%', minHeight: 120, padding: '10px 12px', boxSizing: 'border-box', border: '1.5px solid #7c7cff', borderRadius: 10, fontSize: 13, color: '#1a1a1a', fontFamily: 'inherit', lineHeight: 1.6, outline: 'none', resize: 'vertical', boxShadow: '0 0 0 3px rgba(124,124,255,0.1)' }} />
            <div style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px', display: 'flex', gap: 10 }}>
              <Sparkles size={14} color="#7c7cff" style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>AI will regenerate the RFP incorporating your changes. v1.2 remains accessible.</div>
            </div>
            {newVersionGenerating && <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(124,124,255,0.06)', border: '1px solid rgba(124,124,255,0.15)', borderRadius: 10 }}>
              <RefreshCw size={14} color="#7c7cff" style={{ animation: 'spin 1s linear infinite' }} />
              <div style={{ fontSize: 13, fontWeight: 500, color: '#3d3db8' }}>Generating...</div>
            </div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowNewVersionModal(false)} style={{ flex: 1, padding: '10px 0', border: '1px solid #e0e0e0', borderRadius: 10, background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#4a4a4a', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={() => { if (!newVersionNote.trim()) return; setNewVersionGenerating(true); setTimeout(() => { setNewVersionGenerating(false); setShowNewVersionModal(false); setShowRegenToast(true); setTimeout(() => setShowRegenToast(false), 3000); }, 2200); }}
                disabled={!newVersionNote.trim() || newVersionGenerating}
                style={{ flex: 1, padding: '10px 0', border: 'none', borderRadius: 10, background: newVersionNote.trim() && !newVersionGenerating ? '#0052cc' : 'var(--bg-surface-2)', fontSize: 13, fontWeight: 600, cursor: newVersionNote.trim() && !newVersionGenerating ? 'pointer' : 'not-allowed', color: newVersionNote.trim() && !newVersionGenerating ? '#fff' : 'var(--text-tertiary)', fontFamily: 'inherit' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}><Sparkles size={13} /> Generate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showPublishConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowPublishConfirm(false)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 500, maxWidth: '90vw', padding: '40px 36px', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,82,204,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0052cc', marginBottom: 6 }}>
              <Rocket size={24} strokeWidth={2} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>Approve & Publish RFP?</div>
            <div style={{ fontSize: 13, color: '#666', lineHeight: 1.6, marginBottom: 8 }}>Publishing the RFP will mark it as active in the system and enable proposal uploads for this PR. Make sure all sections are reviewed.</div>
            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <button onClick={() => setShowPublishConfirm(false)} style={{ flex: 1, padding: '11px', border: '1px solid #e0e0e0', borderRadius: 10, background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#4a4a4a', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={handlePublish} style={{ flex: 1, padding: '11px', border: 'none', borderRadius: 10, background: '#0052cc', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.background = '#0041a3'} onMouseLeave={e => e.currentTarget.style.background = '#0052cc'}>Publish</button>
            </div>
          </div>
        </div>
      )}

      {showScoringConfigModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }} onClick={() => setShowScoringConfigModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 800, padding: '0 32px 32px', maxHeight: '100%', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: 24 }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 10, padding: '32px 0 24px', marginBottom: -24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Edit Score Config</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>This score indicates the minimum requirement for proposals to be considered successful.</div>
              </div>
              <button onClick={() => setShowScoringConfigModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999' }}><X size={18} /></button>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#4a4a4a', marginBottom: 6 }}>Threshold Score</div>
              <input type="text" defaultValue="60" style={{ width: 140, padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit', background: '#fff', outline: 'none' }} />
            </div>

            <div>
              <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(14,15,37,0.04)', marginTop: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px', width: '80px' }}>Sr No.</th>
                      <th style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Category</th>
                      <th style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Criteria</th>
                      <th style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'center', width: '120px' }}>Weightage</th>
                      <th style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'center', width: '80px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoringConfigData.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)', background: '#fff' }}>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{row.sr}</td>
                        <td style={{ padding: '4px 8px' }}>
                          <input
                            className="editable-cell"
                            value={row.cat}
                            onChange={e => {
                              const newData = [...scoringConfigData];
                              newData[i].cat = e.target.value;
                              setScoringConfigData(newData);
                            }}
                            style={{ width: '100%', padding: '10px 8px', background: 'transparent', fontSize: 13, color: 'var(--text-secondary)', outline: 'none', fontFamily: 'inherit', fontWeight: 500 }}
                          />
                        </td>
                        <td style={{ padding: '4px 8px' }}>
                          <input
                            className="editable-cell"
                            value={row.crit}
                            onChange={e => {
                              const newData = [...scoringConfigData];
                              newData[i].crit = e.target.value;
                              setScoringConfigData(newData);
                            }}
                            style={{ width: '100%', padding: '10px 8px', background: 'transparent', fontSize: 13, color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontWeight: 500 }}
                          />
                        </td>
                        <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                          <input
                            className="editable-cell"
                            type="number"
                            value={row.w}
                            onChange={e => {
                              const newData = [...scoringConfigData];
                              newData[i].w = parseInt(e.target.value) || 0;
                              setScoringConfigData(newData);
                            }}
                            style={{ width: '100%', padding: '10px 8px', background: 'transparent', fontSize: 13, color: 'var(--text-primary)', textAlign: 'center', outline: 'none', fontFamily: 'inherit', fontWeight: 500 }}
                          />
                        </td>
                        <td style={{ padding: '0 16px', textAlign: 'center' }}>
                          <button
                            onClick={() => setScoringConfigData(prev => prev.filter((_, idx) => idx !== i).map((r, idx) => ({ ...r, sr: idx + 1 })))}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'inline-flex', color: '#ef4444' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: 'var(--bg-surface-2)', borderTop: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Total</td>
                      <td colSpan={2} style={{ padding: '12px 16px' }}></td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center' }}>{scoringConfigData.reduce((acc, curr) => acc + curr.w, 0)}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 12 }}>
                <button
                  onClick={() => setScoringConfigData(prev => [...prev, { sr: prev.length + 1, cat: '', crit: '', w: 0, isNew: true }])}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: '#0052cc', fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: 0 }}
                >
                  <Plus size={16} strokeWidth={2.5} /> Add Row
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowScoringConfigModal(false)} style={{ padding: '10px 24px', border: '1px solid #e0e0e0', borderRadius: 10, background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#4a4a4a', fontFamily: 'inherit' }}>Cancel</button>
              <button
                onClick={() => {
                  setShowScoringConfigModal(false);
                  setSaveToast({ title: 'Changes saved successfully', subtext: 'Scoring config has been updated.' });
                  setTimeout(() => setSaveToast(null), 3000);
                }}
                style={{ padding: '10px 24px', border: 'none', borderRadius: 10, background: '#0052cc', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'inherit' }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showCostConfigModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowCostConfigModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 850, padding: '32px', maxHeight: '85vh', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: 24 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Edit Cost Estimation</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 6, marginBottom: 16 }}>Review and adjust the cost estimation parameters below.</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#4a4a4a', marginBottom: 6 }}>Currency</div>
                  <div ref={costCurrencyRef} style={{ position: 'relative' }}>
                    <button type="button" onClick={() => setCostCurrencyOpen(!costCurrencyOpen)} style={{ width: 140, padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit', background: '#fff', outline: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box' }}>
                      {costCurrency} <ChevronDown size={14} style={{ transform: costCurrencyOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} color="#666" />
                    </button>
                    {costCurrencyOpen && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100 }}>
                        {['AED', 'USD', 'EUR', 'GBP'].map(c => (
                          <div key={c} onClick={() => { setCostCurrency(c); setCostCurrencyOpen(false); }} style={{ padding: '10px 14px', fontSize: 13, cursor: 'pointer', color: 'var(--text-primary)', transition: 'background 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            {c}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => setShowCostConfigModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999' }}><X size={18} /></button>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 16, overflowY: 'auto', flex: 1, minHeight: 0, boxShadow: '0 1px 4px rgba(14,15,37,0.04)' }}>
              <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr style={{ background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Phase</th>
                    <th style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Module</th>
                    <th style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Timeline</th>
                    <th style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Resources</th>
                    <th style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Cost (min)</th>
                    <th style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Cost (max)</th>
                    <th style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'center', width: '80px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {costConfigData.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)', background: '#fff' }}>
                      <td style={{ padding: '4px 8px' }}>
                        <input className="editable-cell" value={row.p} onChange={e => { const d = [...costConfigData]; d[i].p = e.target.value; setCostConfigData(d); }} style={{ width: '100%', padding: '10px 8px', background: 'transparent', fontSize: 13, color: 'var(--text-secondary)', outline: 'none', fontFamily: 'inherit', fontWeight: 500 }} />
                      </td>
                      <td style={{ padding: '4px 8px' }}>
                        <input className="editable-cell" value={row.m} onChange={e => { const d = [...costConfigData]; d[i].m = e.target.value; setCostConfigData(d); }} style={{ width: '100%', padding: '10px 8px', background: 'transparent', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} />
                      </td>
                      <td style={{ padding: '4px 8px' }}>
                        <input className="editable-cell" value={row.t} onChange={e => { const d = [...costConfigData]; d[i].t = e.target.value; setCostConfigData(d); }} style={{ width: '100%', padding: '10px 8px', background: 'transparent', fontSize: 13, color: 'var(--text-secondary)', outline: 'none', fontFamily: 'inherit', fontWeight: 500 }} />
                      </td>
                      <td style={{ padding: '4px 8px' }}>
                        <input className="editable-cell" value={row.r} onChange={e => { const d = [...costConfigData]; d[i].r = e.target.value; setCostConfigData(d); }} style={{ width: '100%', padding: '10px 8px', background: 'transparent', fontSize: 13, color: 'var(--text-secondary)', outline: 'none', fontFamily: 'inherit', fontWeight: 500 }} />
                      </td>
                      <td style={{ padding: '4px 8px' }}>
                        <input className="editable-cell" value={row.cmin} onChange={e => { const d = [...costConfigData]; d[i].cmin = e.target.value; setCostConfigData(d); }} style={{ width: '100%', padding: '10px 8px', background: 'transparent', fontSize: 13, color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontWeight: 500 }} />
                      </td>
                      <td style={{ padding: '4px 8px' }}>
                        <input className="editable-cell" value={row.cmax} onChange={e => { const d = [...costConfigData]; d[i].cmax = e.target.value; setCostConfigData(d); }} style={{ width: '100%', padding: '10px 8px', background: 'transparent', fontSize: 13, color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontWeight: 500 }} />
                      </td>
                      <td style={{ padding: '0 16px', textAlign: 'center' }}>
                        <button
                          onClick={() => setCostConfigData(prev => prev.filter((_, idx) => idx !== i))}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'inline-flex', color: '#ef4444' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: 'var(--bg-surface-2)', borderTop: '1px solid var(--border-subtle)' }}>
                    <td colSpan={4} style={{ padding: '12px 16px' }}></td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {getCurrencySymbol(costCurrency) + costConfigData.reduce((acc, curr) => acc + (parseInt((curr.cmin || '').replace(/[^\d]/g, ''), 10) || 0), 0).toLocaleString(costCurrency === 'INR' ? 'en-IN' : 'en-US')}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {getCurrencySymbol(costCurrency) + costConfigData.reduce((acc, curr) => acc + (parseInt((curr.cmax || '').replace(/[^\d]/g, ''), 10) || 0), 0).toLocaleString(costCurrency === 'INR' ? 'en-IN' : 'en-US')}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ flexShrink: 0 }}>
              <button
                onClick={() => setCostConfigData(prev => [...prev, { p: '', m: '', t: '', r: '', cmin: '', cmax: '', isNew: true }])}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: '#0052cc', fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: 0 }}
              >
                <Plus size={16} strokeWidth={2.5} /> Add Row
              </button>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 8, justifyContent: 'flex-end', flexShrink: 0 }}>
              <button onClick={() => setShowCostConfigModal(false)} style={{ padding: '10px 24px', border: '1px solid #e0e0e0', borderRadius: 10, background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#4a4a4a', fontFamily: 'inherit' }}>Cancel</button>
              <button
                onClick={() => {
                  setShowCostConfigModal(false);
                  setSaveToast({ title: 'Changes saved successfully', subtext: 'Cost estimation details have been updated.' });
                  setTimeout(() => setSaveToast(null), 3000);
                }}
                style={{ padding: '10px 24px', border: 'none', borderRadius: 10, background: '#0052cc', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'inherit' }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddVendorModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowAddVendorModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 480, padding: '32px', minHeight: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: 20 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Add Vendor</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>Select vendors to add to the suggested list.</div>
              </div>
              <button onClick={() => setShowAddVendorModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999' }}><X size={18} /></button>
            </div>

            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setIsVendorDropdownOpen(!isVendorDropdownOpen)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', border: '1px solid var(--border-default)', borderRadius: 10, cursor: 'pointer', background: '#fff' }}
              >
                <div style={{ fontSize: 13, color: selectedDummyVendors.length > 0 ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 400, fontFamily: 'inherit' }}>
                  {selectedDummyVendors.length > 0 ? `Vendors: ${selectedDummyVendors.length} selected` : 'Select vendors...'}
                </div>
                <ChevronDown size={16} color="#666" style={{ transform: isVendorDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
              </div>

              {isVendorDropdownOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setIsVendorDropdownOpen(false)} />
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 20, maxHeight: 200, overflowY: 'auto' }}>
                    {DUMMY_VENDORS.map(v => (
                      <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'background 0.1s ease' }}
                        onClick={() => setSelectedDummyVendors(prev => prev.includes(v.id) ? prev.filter(id => id !== v.id) : [...prev, v.id])}
                        onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${selectedDummyVendors.includes(v.id) ? '#0052cc' : '#ccc'}`, background: selectedDummyVendors.includes(v.id) ? '#0052cc' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {selectedDummyVendors.includes(v.id) && <Check size={10} color="#fff" strokeWidth={3} />}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{v.name}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
              <button onClick={() => setShowAddVendorModal(false)} style={{ flex: 1, padding: '11px', border: '1px solid #e0e0e0', borderRadius: 10, background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#4a4a4a', fontFamily: 'inherit' }}>Cancel</button>
              <button
                disabled={selectedDummyVendors.length === 0}
                onClick={() => {
                  const toAdd = DUMMY_VENDORS.filter(v => selectedDummyVendors.includes(v.id));
                  const newVendors = toAdd.map(v => ({
                    id: Date.now() + Math.random(),
                    name: v.name,
                    location: v.location,
                    score: Math.floor(Math.random() * 10) + 65,
                    rationale: v.rationale
                  }));
                  setSuggestedVendors(prev => [...prev, ...newVendors]);
                  setShowAddVendorModal(false);
                  setSelectedDummyVendors([]);
                  setVendorToast('Vendor(s) added successfully.');
                  setTimeout(() => setVendorToast(null), 3000);
                }}
                style={{ flex: 1, padding: '11px', border: 'none', borderRadius: 10, background: selectedDummyVendors.length === 0 ? 'var(--bg-surface-2)' : '#0052cc', fontSize: 13, fontWeight: 600, cursor: selectedDummyVendors.length === 0 ? 'not-allowed' : 'pointer', color: selectedDummyVendors.length === 0 ? 'var(--text-tertiary)' : '#fff', fontFamily: 'inherit' }}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { setShowUploadModal(false); setPropFileDrag(null); setSuppFileDrag(null); }}>
          <div style={{ background: '#fff', borderRadius: 16, width: 900, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            {/* Sticky Header */}
            <div style={{ padding: '32px 32px 24px 32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Upload Proposal</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Upload vendor proposal documents for this RFP.</div>
              </div>
              <button onClick={() => { setShowUploadModal(false); setPropFileDrag(null); setSuppFileDrag(null); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999' }}><X size={18} /></button>
            </div>

            {/* Scrollable Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
              {uploadForms.map((form, index) => (
                <div key={form.id} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: index === uploadForms.length - 1 ? 0 : 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Vendor {index + 1} Details</div>
                    {uploadForms.length > 1 && (
                      <button
                        onClick={() => setUploadForms(prev => prev.filter(f => f.id !== form.id))}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', padding: 4 }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, background: '#fafafa', border: '1px solid var(--border-default)', borderRadius: 12, padding: '24px' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>Vendor Name <span style={{ color: '#dc2626' }}>*</span></div>
                      <input type="text" value={form.vendorName} onChange={e => setUploadForms(prev => prev.map(f => f.id === form.id ? { ...f, vendorName: e.target.value } : f))} placeholder="Enter vendor name" style={{ width: '100%', padding: '10px 12px', boxSizing: 'border-box', background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 13, color: 'var(--text-primary)', fontFamily: 'inherit', outline: 'none' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                      {/* Left Column */}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>Proposal Attachment <span style={{ color: '#dc2626' }}>*</span></div>
                        {!form.file ? (
                          <div
                            onDragOver={e => { e.preventDefault(); setPropFileDrag(form.id); }}
                            onDragLeave={() => setPropFileDrag(null)}
                            onDrop={e => { e.preventDefault(); setPropFileDrag(null); const f = e.dataTransfer.files[0]; if (f) setUploadForms(prev => prev.map(uf => uf.id === form.id ? { ...uf, file: f } : uf)); }}
                            onClick={() => document.getElementById(`prop-file-input-${form.id}`).click()}
                            style={{ flex: 1, border: `2px dashed ${propFileDrag === form.id ? '#7c7cff' : '#e0e0e0'}`, borderRadius: 10, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', background: propFileDrag === form.id ? 'rgba(124,124,255,0.04)' : '#fafafa', transition: 'all 0.15s ease' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c7cff'; e.currentTarget.style.background = 'rgba(124,124,255,0.04)'; }}
                            onMouseLeave={e => { if (propFileDrag !== form.id) { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.background = '#fafafa'; } }}
                          >
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(124,124,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Upload size={16} color="#7c7cff" strokeWidth={2} />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>Drop files or click to upload</div>
                              <div style={{ fontSize: 12, color: '#999' }}>PDF, DOCX or PPT · Max 20MB</div>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <FileText size={20} color="#dc2626" />
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{form.file.name}</div>
                                <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{(form.file.size / (1024 * 1024)).toFixed(1)} MB</div>
                              </div>
                            </div>
                            <button onClick={() => setUploadForms(prev => prev.map(uf => uf.id === form.id ? { ...uf, file: null } : uf))} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#999', padding: 4 }}><X size={14} /></button>
                          </div>
                        )}
                        <input id={`prop-file-input-${form.id}`} type="file" accept=".pdf,.docx,.ppt" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) setUploadForms(prev => prev.map(uf => uf.id === form.id ? { ...uf, file: e.target.files[0] } : uf)); }} />
                      </div>

                      {/* Right Column */}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>Supporting Documents</div>
                          <div style={{ fontSize: 12, color: '#666' }}>({form.supporting.length} Documents)</div>
                        </div>

                        <div
                          onDragOver={e => { e.preventDefault(); setSuppFileDrag(form.id); }}
                          onDragLeave={() => setSuppFileDrag(null)}
                          onDrop={e => {
                            e.preventDefault();
                            setSuppFileDrag(null);
                            const files = Array.from(e.dataTransfer.files);
                            if (files.length > 0) setUploadForms(prev => prev.map(uf => uf.id === form.id ? { ...uf, supporting: [...uf.supporting, ...files] } : uf));
                          }}
                          onClick={() => document.getElementById(`supp-file-input-${form.id}`).click()}
                          style={{ flex: 1, border: `2px dashed ${suppFileDrag === form.id ? '#7c7cff' : '#e0e0e0'}`, borderRadius: 10, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', background: suppFileDrag === form.id ? 'rgba(124,124,255,0.04)' : '#fafafa', transition: 'all 0.15s ease' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c7cff'; e.currentTarget.style.background = 'rgba(124,124,255,0.04)'; }}
                          onMouseLeave={e => { if (suppFileDrag !== form.id) { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.background = '#fafafa'; } }}
                        >
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(124,124,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Upload size={16} color="#7c7cff" strokeWidth={2} />
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>Drop files or click to upload</div>
                            <div style={{ fontSize: 12, color: '#999' }}>PDF, DOCX or PPT · Max 20MB</div>
                          </div>
                        </div>
                        <input id={`supp-file-input-${form.id}`} type="file" multiple accept=".pdf,.docx,.ppt" style={{ display: 'none' }} onChange={e => {
                          const files = Array.from(e.target.files);
                          if (files.length > 0) setUploadForms(prev => prev.map(uf => uf.id === form.id ? { ...uf, supporting: [...uf.supporting, ...files] } : uf));
                          e.target.value = null;
                        }} />

                        {form.supporting.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
                            {form.supporting.map((suppFile, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 10, width: 'calc(50% - 6px)', boxSizing: 'border-box' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
                                  <FileText size={20} color="#dc2626" style={{ flexShrink: 0 }} />
                                  <div style={{ overflow: 'hidden' }}>
                                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{suppFile.name}</div>
                                    <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{(suppFile.size / (1024 * 1024)).toFixed(1)} MB</div>
                                  </div>
                                </div>
                                <button onClick={() => setUploadForms(prev => prev.map(uf => uf.id === form.id ? { ...uf, supporting: uf.supporting.filter((_, i) => i !== idx) } : uf))} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#999', padding: 4, flexShrink: 0 }}><X size={14} /></button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 24 }}>
                <button
                  onClick={() => setUploadForms(prev => [...prev, { id: Date.now(), vendorName: '', file: null, supporting: [] }])}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: '#0052cc', fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: 0 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#0041a3'}
                  onMouseLeave={e => e.currentTarget.style.color = '#0052cc'}
                >
                  <Plus size={16} strokeWidth={2.5} /> Add A New Vendor
                </button>
              </div>
            </div>

            {/* Sticky Footer */}
            <div style={{ padding: '20px 32px 32px 32px', display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
              <button onClick={() => { setShowUploadModal(false); setPropFileDrag(null); setSuppFileDrag(null); }} style={{ padding: '10px 24px', border: '1px solid #e0e0e0', borderRadius: 10, background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#4a4a4a', fontFamily: 'inherit' }}>Cancel</button>
              {(() => {
                const isValid = uploadForms.length > 0 && uploadForms.every(f => f.vendorName.trim() !== '' && f.file !== null);
                return (
                  <button onClick={handleProposalUpload} disabled={!isValid} style={{ padding: '10px 24px', border: 'none', borderRadius: 10, background: !isValid ? 'var(--bg-surface-2)' : '#0052cc', fontSize: 13, fontWeight: 600, cursor: !isValid ? 'not-allowed' : 'pointer', color: !isValid ? 'var(--text-tertiary)' : '#fff', fontFamily: 'inherit', transition: 'all 0.2s ease' }}>Upload</button>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {showPreviewModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowPreviewModal(null)}>
          <div style={{ background: '#fff', borderRadius: 16, width: '80vw', maxWidth: 900, height: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(0,82,204,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={16} color="#0052cc" /></div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{showPreviewModal.fileName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{showPreviewModal.vendorName} · Uploaded {showPreviewModal.uploadDate} · {showPreviewModal.version}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'inherit' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}><Download size={13} /> Download</button>
                <button onClick={() => setShowPreviewModal(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 6, borderRadius: 8 }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}><X size={18} /></button>
              </div>
            </div>
            {/* Document preview area */}
            <div style={{ flex: 1, overflowY: 'auto', background: '#f0f0f0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', gap: 16 }}>
              {/* Simulated document pages */}
              {[1, 2].map(page => (
                <div key={page} style={{ background: '#fff', width: 680, minHeight: page === 1 ? 900 : 600, borderRadius: 4, boxShadow: '0 2px 12px rgba(0,0,0,0.12)', padding: '48px 64px', boxSizing: 'border-box', position: 'relative' }}>
                  {/* Page header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #2563eb', paddingBottom: 8, marginBottom: 40 }}>
                    <div style={{ fontSize: 11, color: '#999', fontStyle: 'italic', textDecoration: 'line-through' }}>{showPreviewModal.vendorName}</div>
                    <div style={{ fontSize: 10, color: '#999' }}>PRD v4.1 &nbsp;|&nbsp; Phase 1 Final &nbsp;|&nbsp; Confidential</div>
                  </div>
                  {page === 1 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60 }}>
                      <div style={{ fontSize: 42, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-1px', marginBottom: 16 }}>{showPreviewModal.vendorName.toUpperCase().split(' ')[0]}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#2563eb', marginBottom: 48, textAlign: 'center' }}>Proposal for AWS Cloud Migration Consulting Services</div>
                      <div style={{ textAlign: 'center', marginBottom: 12 }}><div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>Technical & Commercial Proposal</div></div>
                      <div style={{ textAlign: 'center', color: '#555', fontSize: 14, marginBottom: 6 }}>Version 1.0 &nbsp;|&nbsp; {showPreviewModal.uploadDate}</div>
                      <div style={{ textAlign: 'center', color: '#888', fontSize: 13, fontStyle: 'italic', marginTop: 80 }}>Prepared in response to RFP-2026-004 issued by DDAIS Group</div>
                      <div style={{ textAlign: 'center', color: '#888', fontSize: 13, fontStyle: 'italic' }}>Confidential — For Evaluation Purposes Only</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#2563eb', marginBottom: 16, borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>Proposal Summary</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid #e5e7eb', borderRadius: 4, overflow: 'hidden', marginBottom: 24 }}>
                        {[['Vendor Name', showPreviewModal.vendorName], ['File', showPreviewModal.fileName], ['Technical Score', showPreviewModal.techScore], ['Commercial', showPreviewModal.commercial || 'Pending'], ['Version', showPreviewModal.version], ['Status', showPreviewModal.status]].map(([label, value], li) => (
                          <React.Fragment key={li}>
                            <div style={{ padding: '10px 14px', background: li % 2 === 0 ? '#f8fafc' : '#fff', borderBottom: '1px solid #e5e7eb', fontSize: 12, fontWeight: 600, color: '#374151' }}>{label}</div>
                            <div style={{ padding: '10px 14px', background: li % 2 === 0 ? '#f8fafc' : '#fff', borderBottom: '1px solid #e5e7eb', borderLeft: '1px solid #e5e7eb', fontSize: 12, color: '#1a1a1a' }}>{value}</div>
                          </React.Fragment>
                        ))}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#2563eb', marginBottom: 12, borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>Evaluation Criteria Scores</div>
                      {Object.entries(showPreviewModal.criteriaScores || {}).map(([criterion, score], ci) => (
                        <div key={ci} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: 13 }}>
                          <span style={{ color: '#374151' }}>{criterion}</span>
                          <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{score}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Page footer */}
                  <div style={{ position: 'absolute', bottom: 32, left: 64, right: 64, display: 'flex', justifyContent: 'center', borderTop: '1.5px solid #2563eb', paddingTop: 8 }}>
                    <span style={{ fontSize: 10, color: '#999' }}>Page {page} of 2</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showReuploadModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowReuploadModal(null)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 480, padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: 20 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Reupload Proposal</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Replace the existing proposal document.</div>
              </div>
              <button onClick={() => setShowReuploadModal(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>Proposal Attachment <span style={{ color: '#dc2626' }}>*</span></div>
                <div
                  onDragOver={e => { e.preventDefault(); setReupFileDrag(true); }}
                  onDragLeave={() => setReupFileDrag(false)}
                  onDrop={e => { e.preventDefault(); setReupFileDrag(false); const f = e.dataTransfer.files[0]; if (f) setUploadForm(prev => ({ ...prev, file: f })); }}
                  onClick={() => document.getElementById('reup-file-input').click()}
                  style={{ border: `2px dashed ${reupFileDrag ? '#7c7cff' : uploadForm.file ? '#22c55e' : '#e0e0e0'}`, borderRadius: 10, padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', background: reupFileDrag ? 'rgba(124,124,255,0.04)' : uploadForm.file ? 'rgba(34,197,94,0.03)' : '#fafafa', transition: 'all 0.15s ease' }}
                  onMouseEnter={e => { if (!uploadForm.file) e.currentTarget.style.borderColor = '#7c7cff'; }}
                  onMouseLeave={e => { if (!reupFileDrag && !uploadForm.file) e.currentTarget.style.borderColor = '#e0e0e0'; }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: uploadForm.file ? 'rgba(34,197,94,0.1)' : 'rgba(124,124,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {uploadForm.file ? <CheckCircle size={16} color="#22c55e" strokeWidth={2} /> : <Upload size={16} color="#7c7cff" strokeWidth={2} />}
                  </div>
                  {uploadForm.file ? (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>{uploadForm.file.name}</div>
                      <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>Click to replace</div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>Drop file here or <span style={{ color: '#7c7cff', fontWeight: 600 }}>browse</span></div>
                      <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>PDF, DOCX, XLSX · Max 25MB</div>
                    </div>
                  )}
                </div>
                <input id="reup-file-input" type="file" accept=".pdf,.docx,.xlsx" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) setUploadForm(prev => ({ ...prev, file: e.target.files[0] })); }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>Supporting Documents</div>
                <div
                  onDragOver={e => { e.preventDefault(); setReupSuppDrag(true); }}
                  onDragLeave={() => setReupSuppDrag(false)}
                  onDrop={e => { e.preventDefault(); setReupSuppDrag(false); const f = e.dataTransfer.files[0]; if (f) setUploadForm(prev => ({ ...prev, supporting: f })); }}
                  onClick={() => document.getElementById('reup-supp-input').click()}
                  style={{ border: `2px dashed ${reupSuppDrag ? '#7c7cff' : uploadForm.supporting ? '#22c55e' : '#e0e0e0'}`, borderRadius: 10, padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', background: reupSuppDrag ? 'rgba(124,124,255,0.04)' : uploadForm.supporting ? 'rgba(34,197,94,0.03)' : '#fafafa', transition: 'all 0.15s ease' }}
                  onMouseEnter={e => { if (!uploadForm.supporting) e.currentTarget.style.borderColor = '#7c7cff'; }}
                  onMouseLeave={e => { if (!reupSuppDrag && !uploadForm.supporting) e.currentTarget.style.borderColor = '#e0e0e0'; }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: uploadForm.supporting ? 'rgba(34,197,94,0.1)' : 'rgba(124,124,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {uploadForm.supporting ? <CheckCircle size={16} color="#22c55e" strokeWidth={2} /> : <Upload size={16} color="#7c7cff" strokeWidth={2} />}
                  </div>
                  {uploadForm.supporting ? (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>{uploadForm.supporting.name}</div>
                      <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>Click to replace</div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>Drop file here or <span style={{ color: '#7c7cff', fontWeight: 600 }}>browse</span></div>
                      <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>PDF, DOCX, XLSX · Max 25MB</div>
                    </div>
                  )}
                </div>
                <input id="reup-supp-input" type="file" accept=".pdf,.docx,.xlsx" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) setUploadForm(prev => ({ ...prev, supporting: e.target.files[0] })); }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button onClick={() => setShowReuploadModal(null)} style={{ flex: 1, padding: '11px', border: '1px solid #e0e0e0', borderRadius: 10, background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#4a4a4a', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={handleReupload} disabled={!uploadForm.file} style={{ flex: 1, padding: '11px', border: 'none', borderRadius: 10, background: !uploadForm.file ? 'var(--bg-surface-2)' : '#0052cc', fontSize: 13, fontWeight: 600, cursor: !uploadForm.file ? 'not-allowed' : 'pointer', color: !uploadForm.file ? 'var(--text-tertiary)' : '#fff', fontFamily: 'inherit' }}>Reupload</button>
            </div>
          </div>
        </div>
      )}

      {showSupportingDocModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowSupportingDocModal(null)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 480, padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: 20 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Upload Supporting Document</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Add additional documents without replacing the main proposal.</div>
              </div>
              <button onClick={() => setShowSupportingDocModal(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>Supporting Document Attachment</div>
                <div
                  onDragOver={e => { e.preventDefault(); setSuppDocDrag(true); }}
                  onDragLeave={() => setSuppDocDrag(false)}
                  onDrop={e => { e.preventDefault(); setSuppDocDrag(false); const f = e.dataTransfer.files[0]; if (f) setUploadForm(prev => ({ ...prev, supporting: f })); }}
                  onClick={() => document.getElementById('supp-doc-input').click()}
                  style={{ border: `2px dashed ${suppDocDrag ? '#7c7cff' : uploadForm.supporting ? '#22c55e' : '#e0e0e0'}`, borderRadius: 10, padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', background: suppDocDrag ? 'rgba(124,124,255,0.04)' : uploadForm.supporting ? 'rgba(34,197,94,0.03)' : '#fafafa', transition: 'all 0.15s ease' }}
                  onMouseEnter={e => { if (!uploadForm.supporting) e.currentTarget.style.borderColor = '#7c7cff'; }}
                  onMouseLeave={e => { if (!suppDocDrag && !uploadForm.supporting) e.currentTarget.style.borderColor = '#e0e0e0'; }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: uploadForm.supporting ? 'rgba(34,197,94,0.1)' : 'rgba(124,124,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {uploadForm.supporting ? <CheckCircle size={16} color="#22c55e" strokeWidth={2} /> : <Upload size={16} color="#7c7cff" strokeWidth={2} />}
                  </div>
                  {uploadForm.supporting ? (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>{uploadForm.supporting.name}</div>
                      <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>Click to replace</div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>Drop file here or <span style={{ color: '#7c7cff', fontWeight: 600 }}>browse</span></div>
                      <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>PDF, DOCX, XLSX · Max 25MB</div>
                    </div>
                  )}
                </div>
                <input id="supp-doc-input" type="file" accept=".pdf,.docx,.xlsx" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) setUploadForm(prev => ({ ...prev, supporting: e.target.files[0] })); }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button onClick={() => setShowSupportingDocModal(null)} style={{ flex: 1, padding: '11px', border: '1px solid #e0e0e0', borderRadius: 10, background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#4a4a4a', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={() => { setShowSupportingDocModal(null); setUploadForm({ vendorName: '', file: null, supporting: [] }); }} disabled={uploadForm.supporting.length === 0} style={{ flex: 1, padding: '11px', border: 'none', borderRadius: 10, background: uploadForm.supporting.length === 0 ? 'var(--bg-surface-2)' : '#0052cc', fontSize: 13, fontWeight: 600, cursor: uploadForm.supporting.length === 0 ? 'not-allowed' : 'pointer', color: uploadForm.supporting.length === 0 ? 'var(--text-tertiary)' : '#fff', fontFamily: 'inherit' }}>Upload</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowDeleteConfirmModal(null)}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '36px 28px 28px', width: 460, boxShadow: '0 16px 48px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', animation: 'modalIn 0.15s ease-out forwards' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <AlertTriangle size={32} color="#ef4444" strokeWidth={2} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Delete Proposal?</div>
            <div style={{ fontSize: 14, color: 'var(--text-tertiary)', marginBottom: 28, lineHeight: 1.5 }}>Are you sure you want to delete this proposal? This action cannot be undone.</div>
            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              <button onClick={() => setShowDeleteConfirmModal(null)} style={{ flex: 1, padding: '13px', border: '1px solid var(--border-default)', borderRadius: 12, background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-primary)' }}>Cancel</button>
              <button onClick={() => { setProposals(proposals.filter(p => p.id !== showDeleteConfirmModal)); setShowDeleteConfirmModal(null); }} style={{ flex: 1, padding: '13px', border: 'none', borderRadius: 12, background: '#ef4444', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <MainLayout userRole={userRole} activeNav={activeNav} onNavigate={onNavigate} titleComponent={null} searchPlaceholder={null}>

        <div style={{ display: 'flex', width: '100%', height: '100%' }}>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* STICKY CHROME */}
            <div style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff' }}>
              <div style={{ height: 56, borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12 }}>
                <ArrowLeft size={17} color="var(--text-tertiary)" style={{ cursor: 'pointer' }} onClick={() => onNavigate('Dashboard')} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-tertiary)', cursor: 'pointer' }} onClick={() => onNavigate('Dashboard')}>Dashboard</span>
                  <ChevronRight size={13} color="var(--text-tertiary)" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>PR-2026-004</span>
                </div>
                <div style={{ flex: 1 }} />
                <button onClick={() => setChatPaneOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'linear-gradient(135deg, #0052cc, #7c7cff)', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 3px 12px rgba(0,82,204,0.3)', transition: 'all 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,82,204,0.45)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,82,204,0.3)'}>
                  <Sparkles size={14} strokeWidth={2} /> AI Chat
                </button>
              </div>
              <div style={{ padding: '14px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>AWS Cloud Migration Consulting</div>
                  <div style={{ background: 'rgba(124,124,255,0.08)', border: '1px solid rgba(124,124,255,0.2)', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600, color: '#7c7cff', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Sparkles size={10} strokeWidth={2.5} /> Complex
                  </div>
                  <div style={{ background: statusCfg.bg, border: `1px solid ${statusCfg.border}`, color: statusCfg.color, borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 600 }}>{prStatus}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  {[[User, 'David Kim'], [Calendar, 'Created 08 May 2026'], [Building, 'Engineering'], [Tag, 'Technology and Consulting'], [MapPin, 'Dubai, UAE']].map(([Icon, text]) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon size={12} color="var(--text-tertiary)" /><span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{text}</span></div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '0 24px', display: 'flex' }}>
                {TABS.map(tab => {
                  const isActive = activeTab === tab.id;
                  return <button key={tab.id} className="tab-btn" onClick={() => setActiveTab(tab.id)} style={{ padding: '13px 16px', fontSize: 13, fontWeight: isActive ? 600 : 500, border: 'none', borderBottom: `2px solid ${isActive ? '#7c7cff' : 'transparent'}`, background: 'transparent', cursor: 'pointer', color: isActive ? '#3d3db8' : 'var(--text-secondary)', fontFamily: 'inherit', transition: 'all 0.15s ease' }}>{tab.label}</button>;
                })}
              </div>
            </div>

            {/* PAGE BODY */}
            <div style={{ background: 'var(--bg-surface-2)', flex: 1, overflowY: 'auto' }}>

              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flex: 1 }}>
                  <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
                    <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, overflow: 'hidden' }}>
                      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)' }}>PROCUREMENT WORKFLOW — COMPLEX PR</div>
                        <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-tertiary)' }}>
                          {[['#7c7cff', 'AI Action'], ['#0052cc', 'User Action'], ['#f59e0b', 'Pending'], ['#ccc', 'Upcoming']].map(([c, l]) => (
                            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: c === '#ccc' ? 0.5 : 1 }} />{l}</div>
                          ))}
                        </div>
                      </div>
                      <div style={{ background: '#f8f8fc', backgroundImage: 'radial-gradient(circle,#d0d0e0 1px,transparent 1px)', backgroundSize: '22px 22px', padding: '28px 36px', overflowX: 'auto', minWidth: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: 'max-content', minHeight: 220 }}>
                          {WORKFLOW_GROUPS.map((group, gi) => (
                            <React.Fragment key={group.id}>
                              {gi > 0 && <Arrow dashed={group.nodes ? group.nodes[0].status === 'waiting' : group.node.status === 'waiting'} />}
                              {group.type === 'single' ? <NodeCard node={group.node} onNodeClick={(nd) => { setSelectedNode(nd); setPanelOpen(true); }} /> : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, alignSelf: 'center' }}>
                                  <div style={{ fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#bbb', paddingLeft: 2, marginBottom: 2 }}>{group.label}</div>
                                  {group.nodes.map(n => <NodeCard key={n.id} node={n} compact onNodeClick={(nd) => { setSelectedNode(nd); setPanelOpen(true); }} />)}
                                </div>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '20px 24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)' }}>REQUISITION DETAILS</div>
                        <button onClick={() => setShowEditModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid rgba(0,82,204,0.3)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#0052cc', fontFamily: 'inherit', transition: 'all 0.15s ease' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,82,204,0.04)'}
                          onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                          <Pencil size={13} strokeWidth={2} /> Edit PR Details
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px 0' }}>
                        {[['Request Title', 'AWS Cloud Migration Consulting Services'], ['Category', 'Technology and Consulting'], ['Subcategory', 'Cloud & Infrastructure Services'], ['Cost Centre', 'Engineering'], ['CapEx / OpEx', 'OpEx'], ['Estimated Budget', '₹45,00,000'], ['Required By', '15 July 2026'], ['Delivery Location', 'Dubai, UAE'], ['Project Name', 'Infrastructure Modernisation 2026'], ['Justification', 'Required for modernising backend systems'], ['Sourcing Method', 'Competitive tender'], ['Contract Reference', 'N/A'], ['Pricing Model', 'Time & Materials'], ['Timeline', '6 Months']].map(([l, v]) => (
                          <React.Fragment key={l}><div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', paddingRight: 16 }}>{l}</div><div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{v}</div></React.Fragment>
                        ))}
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Priority</div>
                        <div><span style={{ background: 'rgba(245,158,11,0.1)', color: '#b45309', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>Urgent</span></div>
                      </div>
                      <div style={{ height: 1, background: 'var(--border-subtle)', margin: '16px 0' }} />
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 6 }}>Requirement Description</div>
                      <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                        We require consulting services for migrating our existing on-premise infrastructure to AWS. The engagement should cover assessment, architecture design, migration execution, and post-migration support. Expected team size: 3 senior architects for 6 months.
                      </div>
                      <div style={{ height: 1, background: 'var(--border-subtle)', margin: '16px 0' }} />
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 12 }}>Attachments</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: '1px solid var(--border-default)', borderRadius: 8, background: 'var(--bg-surface-1)', cursor: 'pointer' }}>
                          <FileText size={16} color="#0052cc" />
                          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Q3_Procurement_Requirements.pdf</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* REASONING PANEL */}
                  <div style={{ width: panelOpen ? 300 : 0, flexShrink: 0, borderLeft: panelOpen ? '1px solid var(--border-subtle)' : 'none', overflow: 'hidden', transition: 'width 0.25s ease', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ width: 300, display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div style={{ padding: '16px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Brain size={16} color="#7c7cff" />
                          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>AI Reasoning</span>
                        </div>
                        <button onClick={() => { setPanelOpen(false); setSelectedNode(null); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 4, borderRadius: 6 }}><X size={16} /></button>
                      </div>
                      {selectedNode && (
                        <div style={{ padding: '0 20px 10px', flexShrink: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{selectedNode.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 3 }}>{selectedNode.time || 'Completed'}</div>
                        </div>
                      )}
                      <div style={{ padding: '0 20px 10px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#bbb' }}>REASONING STEPS</div>
                      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {(REASONING_MAP[selectedNode?.id] || []).map((step, i) => (
                          <div key={i} style={{ background: '#fafafa', border: '1px solid #ebebeb', borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 8, animation: 'fadeInUp 0.3s ease forwards', animationDelay: `${i * 0.07}s`, opacity: 0 }}>
                            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#7c7cff', flexShrink: 0, marginTop: 5 }} />
                            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{step}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* RFP TAB */}
              {activeTab === 'rfp' && (
                <div style={{ display: 'flex' }}>
                  <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* TEMPLATE BANNER */}
                    <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,rgba(0,82,204,0.1),rgba(124,124,255,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={17} color="#7c7cff" strokeWidth={2} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Technology Consulting Standard v2.1</div>
                          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>Template · Auto-selected by AI based on category and complexity</div>
                        </div>
                        <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#15803d', marginLeft: 8 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} /> Current: v1.2
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button style={btnGhost} onClick={() => setVersionPaneOpen(v => !v)}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                          <History size={13} /> Version History
                        </button>
                        <button style={btnGhost} onClick={() => { setNewVersionNote(''); setShowNewVersionModal(true); }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                          <Plus size={13} /> New Version
                        </button>
                        {!published && !isEditing && (
                          <button style={btnBlue} onClick={() => setShowPublishConfirm(true)}
                            onMouseEnter={e => e.currentTarget.style.background = '#0041a3'} onMouseLeave={e => e.currentTarget.style.background = '#0052cc'}>
                            <Send size={13} /> Publish
                          </button>
                        )}
                        {published && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', fontSize: 12, fontWeight: 600, color: '#15803d' }}>
                            <CheckCircle size={13} /> Published
                          </div>
                        )}
                      </div>
                    </div>

                    {/* WYSIWYG DOC */}
                    <WYSIWYGEditor isEditing={isEditing} htmlContent={rfpHtml} setHtmlContent={handleHtmlChange} />

                    {/* SUGGESTED VENDORS */}
                    <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '20px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)' }}>SUGGESTED VENDORS</div>
                          <div style={{ background: 'rgba(124,124,255,0.08)', color: '#7c7cff', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{suggestedVendors.length} Vendors</div>
                        </div>
                        <button
                          onClick={() => setShowAddVendorModal(true)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '6px 14px', border: '1px solid rgba(0,82,204,0.3)',
                            borderRadius: 7, background: '#fff', color: '#0052cc',
                            fontSize: 12, fontWeight: 500, cursor: 'pointer',
                            transition: 'all 0.15s ease', fontFamily: 'inherit'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,82,204,0.04)'; e.currentTarget.style.borderColor = '#0052cc'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(0,82,204,0.3)'; }}
                        >
                          <Plus size={12} strokeWidth={2.5} />
                          Add Vendor
                        </button>
                      </div>
                      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
                        {suggestedVendors.map((v, i) => (
                          <div key={v.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', borderBottom: i < suggestedVendors.length - 1 ? '1px solid var(--border-subtle)' : 'none', background: i === 0 ? 'rgba(124,124,255,0.02)' : '#fff', transition: 'background 0.12s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,124,255,0.04)'} onMouseLeave={e => e.currentTarget.style.background = i === 0 ? 'rgba(124,124,255,0.02)' : '#fff'}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Building size={14} color='var(--text-tertiary)' strokeWidth={2} />
                              </div>
                              <div style={{ minWidth: 180 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{v.name}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{v.location}</div>
                              </div>
                              <div style={{ flex: 1, paddingLeft: 20, borderLeft: '1px solid var(--border-subtle)' }}>
                                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, listStyleType: 'disc' }}>
                                  {v.rationale?.map((r, idx) => <li key={idx}>{r}</li>)}
                                </ul>
                              </div>
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginLeft: 20 }}>{v.score}<span style={{ fontSize: 11, fontWeight: 500, color: '#999' }}>/100</span></div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SCORING + COST */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '20px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)' }}>SCORING CONFIG</div>
                            <div style={{ fontSize: 12, color: '#999', fontWeight: 500 }}>100 pts total</div>
                          </div>
                          <button
                            onClick={() => setShowScoringConfigModal(true)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              padding: '6px 14px', border: '1px solid rgba(0,82,204,0.3)',
                              borderRadius: 7, background: '#fff', color: '#0052cc',
                              fontSize: 12, fontWeight: 500, cursor: 'pointer',
                              transition: 'all 0.15s ease', fontFamily: 'inherit'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,82,204,0.04)'; e.currentTarget.style.borderColor = '#0052cc'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(0,82,204,0.3)'; }}>
                            <Pencil size={12} strokeWidth={2} />
                            Edit
                          </button>
                        </div>

                        <div style={{ background: 'linear-gradient(135deg, rgba(0,82,204,0.04), rgba(0,82,204,0.01))', border: '1px solid rgba(0,82,204,0.15)', borderRadius: 10, padding: '14px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', border: '1px solid rgba(0,82,204,0.1)' }}>
                              <Target size={16} color="#0052cc" strokeWidth={2} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#0052cc' }}>Threshold Score</span>
                          </div>
                          <span style={{ fontSize: 20, fontWeight: 800, color: '#0052cc' }}>60<span style={{ fontSize: 12, fontWeight: 600, marginLeft: 2, color: 'rgba(0,82,204,0.6)' }}>pts</span></span>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Core Evaluation</div>
                          {SCORING_CRITERIA.filter(c => ['Technical Competency', 'Relevant Experience'].includes(c.label)).map(c => (
                            <div key={c.label} style={{ marginBottom: 14 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{c.label}</span>
                                <span style={{ fontSize: 14, fontWeight: 700, color: c.color }}>{c.weight}%</span>
                              </div>
                              <div style={{ height: 7, background: 'var(--bg-surface-2)', borderRadius: 99, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${c.weight * 3}%`, background: c.color, borderRadius: 99 }} />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Proposal Details</div>
                          {SCORING_CRITERIA.filter(c => ['Team Composition & CVs', 'Commercial Proposal', 'Approach & Methodology'].includes(c.label)).map(c => (
                            <div key={c.label} style={{ marginBottom: 14 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{c.label}</span>
                                <span style={{ fontSize: 14, fontWeight: 700, color: c.color }}>{c.weight}%</span>
                              </div>
                              <div style={{ height: 7, background: 'var(--bg-surface-2)', borderRadius: 99, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${c.weight * 3}%`, background: c.color, borderRadius: 99 }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '20px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)' }}>COST ESTIMATION</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#7c7cff', fontWeight: 600 }}><Sparkles size={11} /> AI Estimated</div>
                          </div>
                          <button
                            onClick={() => setShowCostConfigModal(true)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              padding: '6px 14px', border: '1px solid rgba(0,82,204,0.3)',
                              borderRadius: 7, background: '#fff', color: '#0052cc',
                              fontSize: 12, fontWeight: 500, cursor: 'pointer',
                              transition: 'all 0.15s ease', fontFamily: 'inherit'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,82,204,0.04)'; e.currentTarget.style.borderColor = '#0052cc'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(0,82,204,0.3)'; }}>
                            <Pencil size={12} strokeWidth={2} />
                            Edit
                          </button>
                        </div>
                        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '3fr 4fr 3fr', padding: '10px 14px', background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-subtle)', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                            <div>Phase</div>
                            <div>Timeline & Resources</div>
                            <div style={{ textAlign: 'right' }}>Estimate</div>
                          </div>
                          {costConfigData.map((item, i) => (
                            <div key={i} style={{ display: 'grid', gridTemplateColumns: '3fr 4fr 3fr', alignItems: 'center', padding: '12px 14px', borderBottom: i < costConfigData.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{item.p}{item.m ? ` — ${item.m}` : ''}</div>
                              <div style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>
                                <div>{item.t}</div>
                                <div>{item.r}</div>
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', textAlign: 'right' }}>{item.cmin} - {item.cmax}</div>
                            </div>
                          ))}
                          <div style={{ padding: '13px 14px', background: 'linear-gradient(135deg,rgba(0,82,204,0.04),rgba(124,124,255,0.06))', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)' }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>Total Estimate</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>
                              {getCurrencySymbol(costCurrency)}{costConfigData.reduce((acc, curr) => acc + (parseInt((curr.cmin || '').replace(/[^\d]/g, ''), 10) || 0), 0).toLocaleString(costCurrency === 'INR' ? 'en-IN' : 'en-US')} - {getCurrencySymbol(costCurrency)}{costConfigData.reduce((acc, curr) => acc + (parseInt((curr.cmax || '').replace(/[^\d]/g, ''), 10) || 0), 0).toLocaleString(costCurrency === 'INR' ? 'en-IN' : 'en-US')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* VERSION PANE */}
                  {versionPaneOpen && (
                    <div style={{ width: 300, flexShrink: 0, borderLeft: '1px solid var(--border-subtle)', background: '#fff' }}>
                      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Version History</div>
                        <button onClick={() => setVersionPaneOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-tertiary)' }}><X size={16} /></button>
                      </div>
                      <div style={{ padding: '8px 20px' }}>
                        {VERSION_HISTORY.map((v, i) => (
                          <div key={v.version} style={{ padding: '14px 0', borderBottom: i < VERSION_HISTORY.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 30, height: 30, borderRadius: 8, background: v.active ? 'linear-gradient(135deg,#0052cc,#7c7cff)' : 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <History size={13} color={v.active ? '#fff' : 'var(--text-tertiary)'} />
                                </div>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{v.version}</span>
                                    {v.active && <span style={{ background: 'rgba(34,197,94,0.08)', color: '#15803d', borderRadius: 20, padding: '1px 8px', fontSize: 9, fontWeight: 700 }}>CURRENT</span>}
                                  </div>
                                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{v.date}</div>
                                </div>
                              </div>
                              <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 7, border: '1px solid var(--border-default)', background: '#fff', fontSize: 11, cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'inherit' }}><Eye size={11} /> View</button>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)', paddingLeft: 38 }}>{v.note}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', paddingLeft: 38, marginTop: 2 }}>By {v.author}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ACTIVITIES TAB */}
              {activeTab === 'activities' && (
                <div style={{ padding: '32px 40px', background: 'transparent' }}>
                  <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>Activity Log</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      {AUDIT_ENTRIES.map((entry, idx, arr) => {
                        const isLast = idx === arr.length - 1;
                        return (
                          <div key={idx} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                            {!isLast && <div style={{ position: 'absolute', left: 19, top: 40, bottom: -24, width: 2, background: 'var(--border-subtle)' }} />}
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {entry.type === 'document' ? <FileText size={18} color="var(--text-secondary)" /> :
                                entry.type === 'ai' ? <Sparkles size={18} color="#0052cc" /> :
                                  entry.type === 'system' ? <Layers size={18} color="var(--text-secondary)" /> :
                                    <User size={18} color="var(--text-secondary)" />}
                            </div>
                            <div style={{ flex: 1, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{entry.title}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{entry.time}</div>
                              </div>
                              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{entry.desc}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 12, color: 'var(--text-tertiary)' }}>
                                {entry.type === 'ai' ? <Sparkles size={12} color="#0052cc" /> : <User size={12} />}
                                {entry.actor}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* PROPOSALS TAB */}
              {activeTab === 'proposals' && (
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 24, background: 'transparent' }}>
                  <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)' }}>PROPOSALS</div>
                        <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>Manage and evaluate vendor proposals for this RFP.</div>
                      </div>
                      {published && (
                        <button onClick={() => setShowUploadModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 8, border: 'none', background: '#0052cc', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'inherit', boxShadow: '0 3px 12px rgba(0,82,204,0.25)' }} onMouseEnter={e => e.currentTarget.style.background = '#0041a3'} onMouseLeave={e => e.currentTarget.style.background = '#0052cc'}><Upload size={14} /> Upload Proposal</button>
                      )}
                    </div>

                    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'visible' }}>
                      <div style={{ overflowX: 'auto', paddingBottom: proposals.length > 0 ? 120 : 0 }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 800 }}>
                        <thead>
                          <tr style={{ background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-subtle)' }}>
                            <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Rank</th>
                            <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Vendor Name</th>
                            <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Upload Date</th>
                            <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Status</th>
                            <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>State</th>
                            <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>File Name</th>
                            <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Tech. Score</th>
                            <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Quotation</th>
                            <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Risks</th>
                            <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Version</th>
                            <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', textAlign: 'center' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {proposals.length === 0 ? (
                            <tr>
                              <td colSpan={11} style={{ padding: '60px 20px', textAlign: 'center' }}>
                                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,82,204,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Upload size={24} color="#0052cc" /></div>
                                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>No Proposals Uploaded</div>
                                <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{published ? 'Upload the first vendor proposal to start evaluation.' : 'Publish the RFP to enable proposal uploads.'}</div>
                                {!published && <button onClick={() => setActiveTab('rfp')} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border-default)', background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'inherit', marginTop: 20 }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}><FileText size={14} /> Review & Publish RFP First</button>}
                              </td>
                            </tr>
                          ) : (
                            proposals.map((prop, idx) => {
                              // derive rank from techScore among completed proposals
                              const completedSorted = [...proposals].filter(p => p.status === 'Completed').sort((a, b) => (parseInt(b.techScore) || 0) - (parseInt(a.techScore) || 0));
                              const rank = prop.status === 'Completed' ? completedSorted.findIndex(p => p.id === prop.id) + 1 : null;
                              const riskLevel = prop.risks && prop.risks.length > 0 ? (prop.risks.some(r => r.toLowerCase().includes('high')) ? 'High' : prop.risks.some(r => r.toLowerCase().includes('none')) ? 'Low' : 'Medium') : null;
                              const riskColor = riskLevel === 'High' ? { bg: 'rgba(239,68,68,0.08)', color: '#dc2626' } : riskLevel === 'Medium' ? { bg: 'rgba(245,158,11,0.08)', color: '#b45309' } : riskLevel === 'Low' ? { bg: 'rgba(34,197,94,0.08)', color: '#15803d' } : { bg: 'var(--bg-surface-2)', color: 'var(--text-tertiary)' };
                              return (
                                <tr key={prop.id} style={{ borderBottom: idx < proposals.length - 1 ? '1px solid var(--border-subtle)' : 'none', transition: 'background 0.12s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                    {rank ? (
                                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: rank === 1 ? 'linear-gradient(135deg,#f59e0b,#d97706)' : rank === 2 ? 'linear-gradient(135deg,#94a3b8,#64748b)' : rank === 3 ? 'linear-gradient(135deg,#b45309,#92400e)' : 'var(--bg-surface-2)', color: rank <= 3 ? '#fff' : 'var(--text-tertiary)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>#{rank}</div>
                                    ) : <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>—</span>}
                                  </td>
                                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{prop.vendorName}</td>
                                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{prop.uploadDate}</td>
                                  <td style={{ padding: '14px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>
                                    {prop.status === 'Processing' ? (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#a16207', fontWeight: 500 }}>
                                        <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> {prop.status}
                                      </div>
                                    ) : (
                                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{prop.status}</span>
                                    )}
                                  </td>
                                  <td style={{ padding: '14px 16px' }}>
                                    {prop.state ? (
                                      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: prop.state === 'pass' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: prop.state === 'pass' ? '#15803d' : '#dc2626', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                                        {prop.state}
                                      </span>
                                    ) : <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>—</span>}
                                  </td>
                                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#0052cc', fontWeight: 500, whiteSpace: 'nowrap' }}><div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><FileText size={13} />{prop.fileName}</div></td>
                                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{prop.techScore}</td>
                                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#15803d', whiteSpace: 'nowrap' }}>{prop.commercial || '—'}</td>
                                  <td style={{ padding: '14px 16px' }}>
                                    {riskLevel ? (
                                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: riskColor.bg, color: riskColor.color, whiteSpace: 'nowrap' }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: riskColor.color }} />{riskLevel}
                                      </span>
                                    ) : <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>—</span>}
                                  </td>
                                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{prop.version}</td>
                                  <td style={{ padding: '14px 16px', textAlign: 'center', position: 'relative' }}>
                                    <button onClick={() => setActiveDropdown(activeDropdown === prop.id ? null : prop.id)} style={{ border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '5px 8px', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', transition: 'all 0.15s ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface-2)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }} onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}><MoreVertical size={15} /></button>
                                    {activeDropdown === prop.id && (
                                      <div style={{ position: 'absolute', right: 16, top: 44, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: 6, zIndex: 50, minWidth: 200, textAlign: 'left' }}>
                                        {[
                                          { label: 'View Proposal', icon: Eye, action: () => { setShowPreviewModal(prop); setActiveDropdown(null); }, color: 'var(--text-primary)' },
                                          { label: 'Reupload Proposal', icon: RefreshCw, action: () => { setShowReuploadModal(prop.id); setActiveDropdown(null); }, color: 'var(--text-primary)' },
                                          { label: 'Supporting Doc', icon: FileText, action: () => { setShowSupportingDocModal(prop.id); setActiveDropdown(null); }, color: 'var(--text-primary)' },
                                          { label: 'Delete Proposal', icon: Trash2, action: () => { setShowDeleteConfirmModal(prop.id); setActiveDropdown(null); }, color: '#ef4444', divider: true },
                                        ].map((item, ii) => {
                                          const ItemIcon = item.icon;
                                          return (
                                            <React.Fragment key={ii}>
                                              {item.divider && <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />}
                                              <div onClick={item.action} style={{ padding: '9px 12px', fontSize: 13, color: item.color, cursor: 'pointer', borderRadius: 7, display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.12s' }} onMouseEnter={e => e.currentTarget.style.background = item.color === '#ef4444' ? 'rgba(239,68,68,0.06)' : 'var(--bg-surface-2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                <div style={{ width: 28, height: 28, borderRadius: 7, background: item.color === '#ef4444' ? 'rgba(239,68,68,0.08)' : 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ItemIcon size={13} color={item.color} strokeWidth={2} /></div>
                                                <span style={{ fontWeight: 500 }}>{item.label}</span>
                                              </div>
                                            </React.Fragment>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>


                  {/* COMPARISON SECTION */}
                  <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)', marginBottom: 20 }}>PROPOSAL COMPARISON MATRIX</div>
                    {proposals.length === 0 ? (
                      <div style={{ background: '#fff', border: '1px dashed var(--border-default)', borderRadius: 12, padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 14 }}>
                        Upload proposals to compare them in the matrix.
                      </div>
                    ) : (
                      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
                        {/* Header Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: `200px repeat(${Math.min(proposals.length, 3)}, 1fr)`, borderBottom: '2px solid var(--border-subtle)', background: 'var(--bg-surface-1)' }}>
                          <div style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, display: 'flex', alignItems: 'center' }}>Criteria</div>
                          {proposals.slice(0, 3).map(p => (
                            <div key={`h-${p.id}`} style={{ padding: '16px 20px', borderLeft: '1px solid var(--border-subtle)' }}>
                              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{p.vendorName}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>Total Score: <span style={{ fontWeight: 600, color: '#0052cc' }}>{p.techScore}</span></div>
                            </div>
                          ))}
                        </div>

                        {/* Criteria Rows */}
                        {SCORING_CRITERIA.map((criterion, i) => (
                          <div key={i} style={{ display: 'grid', gridTemplateColumns: `200px repeat(${Math.min(proposals.length, 3)}, 1fr)`, borderBottom: '1px solid var(--border-subtle)' }}>
                            <div style={{ padding: '14px 20px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                              {criterion.label}
                              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{criterion.weight} points</div>
                            </div>
                            {proposals.slice(0, 3).map(p => (
                              <div key={`c-${p.id}-${i}`} style={{ padding: '14px 20px', borderLeft: '1px solid var(--border-subtle)', fontSize: 14, fontWeight: 600, color: '#1a1a1a', display: 'flex', alignItems: 'center' }}>
                                {p.criteriaScores?.[criterion.label] || 'Pending'}
                              </div>
                            ))}
                          </div>
                        ))}

                        {/* Commercial Snapshot */}
                        <div style={{ display: 'grid', gridTemplateColumns: `200px repeat(${Math.min(proposals.length, 3)}, 1fr)`, borderBottom: '1px solid var(--border-subtle)', background: 'rgba(34,197,94,0.03)' }}>
                          <div style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#15803d', display: 'flex', alignItems: 'center', gap: 6 }}><Banknote size={14} /> Commercials</div>
                          {proposals.slice(0, 3).map(p => (
                            <div key={`comm-${p.id}`} style={{ padding: '14px 20px', borderLeft: '1px solid rgba(34,197,94,0.1)', fontSize: 15, fontWeight: 700, color: '#15803d', display: 'flex', alignItems: 'center' }}>
                              {p.commercial || 'Pending'}
                            </div>
                          ))}
                        </div>

                        {/* Risks */}
                        <div style={{ display: 'grid', gridTemplateColumns: `200px repeat(${Math.min(proposals.length, 3)}, 1fr)`, borderBottom: '1px solid var(--border-subtle)', background: 'rgba(239,68,68,0.02)' }}>
                          <div style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#b91c1c', display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={14} /> Risk Profile</div>
                          {proposals.slice(0, 3).map(p => (
                            <div key={`risk-${p.id}`} style={{ padding: '14px 20px', borderLeft: '1px solid rgba(239,68,68,0.1)' }}>
                              {(p.risks || []).map((r, ri) => (
                                <div key={ri} style={{ fontSize: 12, color: '#991b1b', display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: (p.risks || []).length - 1 === ri ? 0 : 8 }}>
                                  <span style={{ fontSize: 14, lineHeight: 1 }}>•</span> <span style={{ lineHeight: 1.4 }}>{r}</span>
                                </div>
                              ))}
                              {(!p.risks || p.risks.length === 0) && <div style={{ fontSize: 12, color: '#991b1b' }}>Pending</div>}
                            </div>
                          ))}
                        </div>

                        {/* AI Recommendation Highlight */}
                        {(() => {
                          const completed = proposals.filter(p => p.status === 'Completed');
                          if (completed.length === 0) return null;
                          const winner = completed.reduce((prev, current) => {
                            const prevScore = parseInt(prev.techScore) || 0;
                            const currScore = parseInt(current.techScore) || 0;
                            return (currScore > prevScore) ? current : prev;
                          });

                          return (
                            <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(124,124,255,0.1), rgba(0,82,204,0.05))', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fff', border: '1px solid rgba(124,124,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(124,124,255,0.15)' }}>
                                <Award size={20} color="#3d3db8" />
                              </div>
                              <div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#3d3db8', marginBottom: 4 }}>AI Recommendation: {winner.vendorName}</div>
                                <div style={{ fontSize: 13, color: '#4a4a4a', lineHeight: 1.5 }}>Based on the evaluation criteria, {winner.vendorName} leads with a technical score of {winner.techScore}. They show exceptionally strong technical competency and relevant experience. Proceed with commercial negotiations to finalize the award.</div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* NEGOTIATIONS TAB */}
              {activeTab === 'negot' && proposals.some(p => p.status === 'Completed') && (() => {
                const negotProposals = proposals.filter(p => p.status === 'Completed');
                const firstNegotKey = Object.keys(NEGOTIATION_DATA)[0];
                const activeVendorKey = selectedNegotVendorId || firstNegotKey;
                const negotData = NEGOTIATION_DATA[activeVendorKey] || NEGOTIATION_DATA[firstNegotKey];

                return (
                  <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 24, minHeight: '80vh', background: 'transparent' }}>
                    
                    {/* SECTION 1: Negotiation Brief & Table */}
                    <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)' }}>NEGOTIATION BRIEF</div>
                          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>AI-generated strategy and stats based on vendor proposals.</div>
                        </div>
                        <button onClick={() => setShowAwardModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 8, border: 'none', background: '#0052cc', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'inherit', boxShadow: '0 3px 12px rgba(0,82,204,0.25)' }} onMouseEnter={e => e.currentTarget.style.background = '#0041a3'} onMouseLeave={e => e.currentTarget.style.background = '#0052cc'}>
                          <Award size={14} /> Award Project
                        </button>
                      </div>

                      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
                            <thead>
                              <tr style={{ background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                                <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>VENDOR / PROPOSAL</th>
                                <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>SENTIMENT SCORE</th>
                                <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>RISKS IDENTIFIED</th>
                                <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>GAPS & CLARIFICATIONS</th>
                                <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>COMMERCIAL GAP</th>
                                <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>BATNA STAT</th>
                                <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>OVERALL SCORE</th>
                              </tr>
                            </thead>
                            <tbody>
                              {negotProposals.map((p, idx) => {
                                const vData = NEGOTIATION_DATA[p.vendorName] || negotData;
                                return (
                                  <tr key={p.id} style={{ borderBottom: idx < negotProposals.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                                    <td style={{ padding: '14px 16px', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                                      <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{p.vendorName.replace(' v1', '\nv1')}</div>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ fontSize: 15, fontWeight: 600, color: '#16a34a' }}>{vData.stats.sentiment.rating}</span>
                                        <span style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>({vData.stats.sentiment.score})</span>
                                      </div>
                                    </td>
                                    <td style={{ padding: '14px 16px', fontSize: 14, color: 'var(--text-primary)' }}>
                                      <div style={{ display: 'flex', gap: 20 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                          <div style={{ color: '#ef4444', fontWeight: 600, fontSize: 15 }}>{vData.stats.risks.high}</div>
                                          <div style={{ color: '#ef4444', fontSize: 13, fontWeight: 500 }}>High</div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                          <div style={{ color: '#f59e0b', fontWeight: 600, fontSize: 15 }}>{vData.stats.risks.medium}</div>
                                          <div style={{ color: '#f59e0b', fontSize: 13, fontWeight: 500 }}>Med</div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                          <div style={{ color: '#22c55e', fontWeight: 600, fontSize: 15 }}>{vData.stats.risks.low}</div>
                                          <div style={{ color: '#22c55e', fontSize: 13, fontWeight: 500 }}>Low</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td style={{ padding: '14px 16px', fontSize: 15, color: 'var(--text-primary)', fontWeight: 500 }}>{vData.stats.gaps} Questions</td>
                                    <td style={{ padding: '14px 16px', fontSize: 15, color: 'var(--text-primary)' }}>
                                      <div style={{ color: '#f59e0b', fontWeight: 600, marginBottom: 6 }}>{vData.stats.commercial.gap}</div>
                                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{vData.stats.commercial.detail.replace(' target', '\ntarget')}</div>
                                    </td>
                                    <td style={{ padding: '14px 16px', fontSize: 15, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.5 }}>
                                      <div style={{ whiteSpace: 'pre-wrap' }}>{vData.stats.batna.replace(' - ', ' -\n').replace(' Viable', '\nViable')}</div>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                      <div style={{ color: '#16a34a', fontWeight: 700, fontSize: 16 }}>{p.techScore || vData.stats.overall}</div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: Vendor Proposal & Dropdown & Details */}
                    {negotData ? (
                      <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)' }}>VENDOR PROPOSAL DETAILS</div>
                            <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>Detailed analysis and negotiation strategy for the selected vendor.</div>
                          </div>
                          <div style={{ position: 'relative' }} ref={negotVendorRef}>
                            <button type="button" onClick={() => setNegotVendorOpen(!negotVendorOpen)} style={{ width: 240, padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit', background: '#fff', outline: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', fontWeight: 500 }}>
                              {activeVendorKey} <ChevronDown size={16} style={{ transform: negotVendorOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} color="#666" />
                            </button>
                            {negotVendorOpen && (
                              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100 }}>
                                {Object.keys(NEGOTIATION_DATA).map(key => (
                                  <div key={key} onClick={() => { setSelectedNegotVendorId(key); setNegotVendorOpen(false); }} style={{ padding: '10px 14px', fontSize: 13, cursor: 'pointer', color: 'var(--text-primary)', transition: 'background 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    {key}
                                  </div>
                                ))}
                                {negotProposals.filter(p => !NEGOTIATION_DATA[p.vendorName]).map(p => (
                                  <div key={p.id} onClick={() => { setSelectedNegotVendorId(p.vendorName); setNegotVendorOpen(false); }} style={{ padding: '10px 14px', fontSize: 13, cursor: 'pointer', color: 'var(--text-primary)', transition: 'background 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    {p.vendorName}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                        {/* Market News and Sentiment (4 Cards) */}
                        <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-2)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                            MARKET NEWS AND SENTIMENT
                          </div>
                          <div style={{ padding: 24 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                              {Object.entries(negotData.marketSignals).map(([key, signal]) => {
                                const Icon = signal.icon;
                                return (
                                  <div key={key} style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                                      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(124,124,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c7cff' }}>
                                        <Icon size={18} strokeWidth={2.5} />
                                      </div>
                                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{signal.title}</div>
                                    </div>
                                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{signal.desc}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Clarification Questions */}
                        <div style={{ marginTop: 8, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)' }}>CLARIFICATION QUESTIONS</div>
                            <div style={{ padding: '4px 10px', background: '#eef2ff', color: '#4f46e5', fontSize: 11, fontWeight: 600, borderRadius: 100, textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Sparkles size={12} /> AI Generated
                            </div>
                          </div>
                          <div style={{ padding: 24 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                              {negotData.clarificationQuestions && negotData.clarificationQuestions.map((q, i) => (
                                <div key={i} style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', gap: 16 }}>
                                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                                    <HelpCircle size={16} strokeWidth={2.5} />
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.5 }}>{q.question}</div>
                                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--bg-surface-2)', padding: '12px 16px', borderRadius: 8, borderLeft: '3px solid #ddd6fe' }}>
                                      <span style={{ fontWeight: 600, color: '#6b7280', marginRight: 6 }}>Context:</span>
                                      {q.context}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Stacked Layout for the rest */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 8 }}>

                          {/* Technical Gaps & Clarifications */}
                          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-2)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                              TECHNICAL GAPS & CLARIFICATIONS
                            </div>
                            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                              {negotData.technicalGaps.map((gap, i) => (
                                <div key={i} style={{ display: 'flex', gap: 14 }}>
                                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: gap.type === 'strength' ? '#22c55e' : gap.type === 'risk' ? '#ef4444' : gap.type === 'clarification' ? '#f59e0b' : '#7c7cff', marginTop: 6, flexShrink: 0 }} />
                                  <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{gap.title}</div>
                                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{gap.desc}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Commercial Pointers */}
                          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-2)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                              COMMERCIAL POINTERS
                            </div>
                            <div style={{ padding: '24px 24px 24px 24px' }}>
                              <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, listStyleType: 'disc' }}>
                                {negotData.commercialPointers.map((ptr, i) => (
                                  <li key={i} style={{ marginBottom: 14, paddingLeft: 8 }}>{ptr}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Strategy Brief Generator */}
                          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-2)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                              STRATEGY BRIEF
                            </div>
                            <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                                <div>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Opening Position</div>
                                  <div style={{ fontSize: 13, color: '#0052cc', fontWeight: 500, padding: '12px 16px', background: 'rgba(0,82,204,0.04)', borderRadius: 8, border: '1px solid rgba(0,82,204,0.2)', lineHeight: 1.5, height: '100%', boxSizing: 'border-box' }}>
                                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>₹38,00,000</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{negotData.strategyBrief.opening}</div>
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Target Goal</div>
                                  <div style={{ fontSize: 13, color: '#15803d', fontWeight: 500, padding: '12px 16px', background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0', lineHeight: 1.5, height: '100%', boxSizing: 'border-box' }}>
                                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{negotData.strategyBrief.target}</div>
                                    <div style={{ fontSize: 11, color: '#166534' }}>Ideal settlement point.</div>
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Walk-Away Point</div>
                                  <div style={{ fontSize: 13, color: '#b91c1c', fontWeight: 500, padding: '12px 16px', background: '#fef2f2', borderRadius: 8, border: '1px solid #fecaca', lineHeight: 1.5, height: '100%', boxSizing: 'border-box' }}>
                                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{negotData.strategyBrief.walkAway}</div>
                                    <div style={{ fontSize: 11, color: '#991b1b' }}>Maximum acceptable threshold.</div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Concession Sequence</div>
                                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                  <ol style={{ margin: 0, paddingLeft: 20 }}>
                                    {negotData.strategyBrief.concessions.map((c, i) => <li key={i} style={{ marginBottom: 8 }}>{c}</li>)}
                                  </ol>
                                </div>
                              </div>

                              <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>BATNA (With Reasoning)</div>
                                <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, padding: '16px', background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>{negotData.strategyBrief.batna}</div>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    ) : (
                      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>No negotiation data available for this vendor.</div>
                    )}
                  </div>
                );
              })()}

              {/* EMPTY TABS */}
              {((['sow', 'po', 'invoices'].includes(activeTab)) || (activeTab === 'negot' && !proposals.some(p => p.status === 'Completed'))) && (() => {
                const cfg = EMPTY_TABS[activeTab]; const Icon = cfg.icon;
                return (
                  <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 20 }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(124,124,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={30} color={cfg.color} strokeWidth={1.5} /></div>
                    <div style={{ textAlign: 'center', maxWidth: 420 }}>
                      <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{cfg.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.7 }}>{cfg.desc}</div>
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>


          {/* AI CHAT PANE */}
          {chatPaneOpen && (
            <div style={{ width: chatPaneOpen ? '32vw' : 0, /*width: '32vw', minWidth: 350, maxWidth: 550,*/ borderLeft: '1px solid #e5e5e5', background: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                {/* Header */}

                <div style={{ height: 56, minHeight: 56, background: '#fff', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>

                    <X size={18} color="var(--text-tertiary)" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => setChatPaneOpen(false)} />

                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 400 }}>

                      Ask about this PR...

                    </div>

                  </div>

                  <div style={{ position: 'relative' }} ref={chatMenuRef}>

                    <button

                      onClick={() => setChatMenuOpen(!chatMenuOpen)}

                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 8, color: 'var(--text-secondary)' }}

                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'}

                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}

                    >

                      <MoreHorizontal size={18} />

                    </button>

                    {chatMenuOpen && (

                      <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 6, zIndex: 500, minWidth: 180 }}>

                        {[

                          { icon: Edit2, label: 'Rename', action: () => setChatMenuOpen(false) },

                          { icon: chatMenuPinned ? PinOff : Pin, label: chatMenuPinned ? 'Unpin' : 'Pin', action: () => { setChatMenuPinned(p => !p); setChatMenuOpen(false); } },

                          { icon: Share2, label: 'Share', action: () => setChatMenuOpen(false) },

                          { icon: Download, label: 'Download', action: () => setChatMenuOpen(false) },

                        ].map(({ icon: Icon, label, action }) => (

                          <div key={label} onClick={action}

                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)', transition: 'background 0.12s ease' }}

                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'}

                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}

                          >

                            <Icon size={14} color="var(--text-secondary)" />{label}

                          </div>

                        ))}

                        <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />

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

                      <div key={i} style={{ position: 'relative', alignSelf: 'flex-end', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, maxWidth: '78%', animation: 'chatFadeIn 0.2s ease forwards' }}

                        onMouseEnter={() => setChatHoveredUserMsg(i)}

                        onMouseLeave={() => setChatHoveredUserMsg(null)}>

                        <div style={{ alignSelf: 'flex-end', background: 'rgba(0,82,204,0.05)', border: '1px solid rgba(0,82,204,0.1)', borderRadius: '14px 14px 4px 14px', padding: '10px 14px', fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>

                          {msg.text}

                        </div>

                      </div>

                    ) : (

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

                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 38 }}>

                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginRight: 6 }}>Just now</span>

                        </div>

                      </div>

                    );

                  })}

                </div>



                {/* Input bar */}

                <div style={{ flexShrink: 0, padding: '12px 16px 16px', background: '#fff' }}>

                  <div style={{ border: `1.5px solid ${chatInput ? '#7c7cff' : 'var(--border-default)'}`, borderRadius: 14, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, boxShadow: chatInput ? '0 0 0 3px rgba(124,124,255,0.09), 0 2px 8px rgba(14,15,37,0.04)' : '0 2px 8px rgba(14,15,37,0.04)', transition: 'border-color 0.15s, box-shadow 0.15s', background: '#fff' }}>

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

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>

                      <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', transition: 'all 0.15s ease' }}

                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,124,255,0.08)'; e.currentTarget.style.color = '#7c7cff'; }}

                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}>

                        <Paperclip size={18} />

                      </button>

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
          )}

        </div>
      </MainLayout>

      {/* Award Project Modal */}
      {showAwardModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowAwardModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 480, padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Award Project</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>Select the vendor to award this project to.</div>
              </div>
              <button onClick={() => setShowAwardModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999' }}><X size={18} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '16px 0' }}>
              {proposals.filter(p => p.status === 'Completed').map(p => (
                <div key={p.id} onClick={() => setSelectedAwardVendor(p.vendorName)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: `1px solid ${selectedAwardVendor === p.vendorName ? '#0052cc' : 'var(--border-subtle)'}`, borderRadius: 10, background: selectedAwardVendor === p.vendorName ? 'rgba(0,82,204,0.04)' : '#fff', cursor: 'pointer', transition: 'all 0.15s ease' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: `1.5px solid ${selectedAwardVendor === p.vendorName ? '#0052cc' : '#ccc'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#fff' }}>
                    {selectedAwardVendor === p.vendorName && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0052cc' }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{p.vendorName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Tech Score: <span style={{ fontWeight: 600 }}>{p.techScore}</span></div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
              <button onClick={() => setShowAwardModal(false)} style={{ padding: '10px 20px', border: '1px solid #e0e0e0', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#4a4a4a', fontFamily: 'inherit' }}>Cancel</button>
              <button disabled={!selectedAwardVendor} onClick={() => {
                setShowAwardModal(false);
                setShowAwardSuccessToast(true);
                setTimeout(() => setShowAwardSuccessToast(false), 3000);
              }} style={{ padding: '10px 24px', border: 'none', borderRadius: 8, background: selectedAwardVendor ? '#0052cc' : '#ccc', fontSize: 13, fontWeight: 600, cursor: selectedAwardVendor ? 'pointer' : 'not-allowed', color: '#fff', fontFamily: 'inherit' }}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Award Success Toast */}
      {showAwardSuccessToast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: '#f0fdf4', border: '1px solid rgba(34,197,94,0.25)', borderLeft: '4px solid #22c55e', borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 32px rgba(14,15,37,0.1)', minWidth: 340, animation: 'toastIn 0.2s ease forwards' }}>
          <CheckCircle size={20} color="#22c55e" strokeWidth={2} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>Project Awarded Successfully</div>
            <div style={{ fontSize: 12, color: '#166534', marginTop: 2 }}>{selectedAwardVendor} has been notified.</div>
          </div>
          <button onClick={() => setShowAwardSuccessToast(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(21,128,61,0.5)', display: 'flex' }}><X size={16} /></button>
        </div>
      )}
    </>
  );
}
