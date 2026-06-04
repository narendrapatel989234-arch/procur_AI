import { useState, useRef, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import {
  ArrowLeft, Send, Sparkles, FileText, Brain,
  Copy, Edit2, RotateCcw, ThumbsUp, ThumbsDown,
  VolumeX, Volume2, X, Link, CheckCircle, AlertTriangle,
  Paperclip, MoreHorizontal, Pin, PinOff, Download, Share2, Trash2
, Mic} from 'lucide-react';

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

const INITIAL_THREAD = [
  { role: 'divider', text: 'May 12, 2026' },
  { role: 'ai', time: '10:02 AM', content: "Hi David! I'll help you initiate a procurement request for MacBook Pro upgrades. Could you share the number of units required and your budget range?", insight: null, sources: null, action: null },
  { role: 'user', time: '10:04 AM', content: "We need 15 units. Budget is around ₹18,00,000." },
  { role: 'status' },
  { role: 'ai', time: '10:04 AM', content: "Got it. Based on your budget and category, I've classified this as a Routine procurement. I've identified 3 preferred vendors from your approved list.", insight: { vendors: [{ name: 'TechDirect India', match: '94%', rating: '4.8★' }, { name: 'InfraSource Pvt Ltd', match: '87%', rating: '4.5★' }, { name: 'Apex IT Solutions', match: '81%', rating: '4.2★' }] }, sources: null, action: null },
  { role: 'user', time: '10:07 AM', content: "Let's go with TechDirect India. Please raise the PR." },
  { role: 'status' },
  { role: 'ai', time: '10:07 AM', content: "PR-2026-001 has been created and submitted for approval. Preferred vendor set to TechDirect India.", insight: null, sources: ['PR-2026-001'], action: "Open PR-2026-001 →" },
  { role: 'divider', text: 'Today' },
  { role: 'ai', time: '9:45 AM', content: "Your PR is currently In Sourcing stage. TechDirect India has been notified. Expected PO generation within 2 business days based on current SLA.", insight: null, sources: null, action: "View PR status →" },
];

export default function ChatDetail({ setCurrentPage, onNavigate, activeNav , userRole}) {
  const [messages, setMessages] = useState(INITIAL_THREAD);
  const [activeRightPane, setActiveRightPane] = useState(null);
  const [showReasoningPanel, setShowReasoningPanel] = useState(false);
  const [reasoningSteps, setReasoningSteps] = useState(REASONING_STEPS_FULL.map(s => ({ ...s, status: 'complete' })));
  const [reasoningComplete, setReasoningComplete] = useState(false);
  const [showUploadTooltip, setShowUploadTooltip] = useState(false);

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
  const menuRef = useRef(null);

  const [inputText, setInputText] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [toast, setToast] = useState(null);
  const [hoveredUserMsg, setHoveredUserMsg] = useState(null);
  const [likedMsgs, setLikedMsgs] = useState(new Set());
  const [dislikedMsgs, setDislikedMsgs] = useState(new Set());
  const [copiedMsgs, setCopiedMsgs] = useState(new Set());
  const [speakingMsgs, setSpeakingMsgs] = useState(new Set());
  const [regeneratingMsgs, setRegeneratingMsgs] = useState(new Set());
  const [editingMsgIndex, setEditingMsgIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [likedTooltipVisible, setLikedTooltipVisible] = useState(new Set());
  const [dislikedTooltipVisible, setDislikedTooltipVisible] = useState(new Set());

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);
  const tooltipTimers = useRef(new Set());

  useEffect(() => {
    return () => { tooltipTimers.current.forEach(clearTimeout); tooltipTimers.current.clear(); };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, reasoningSteps]);

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

  const startReasoning = () => {
    let delay = 200;
    const newSteps = [];
    REASONING_STEPS_FULL.forEach((step, i) => {
      setTimeout(() => {
        setReasoningSteps(prev => [
          ...prev.map(s => ({ ...s, status: 'complete' })),
          { ...step, status: 'active' }
        ]);
      }, delay);
      delay += 600;
    });
    setTimeout(() => {
      setReasoningSteps(prev => prev.map(s => ({ ...s, status: 'complete' })));
      setReasoningComplete(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'ai', time: 'Just now',
          content: "I've analyzed your follow-up. Let me check the latest status on this procurement request and get back to you with an update.",
          insight: null, sources: null, action: null,
        }]);
      }, 800);
    }, delay + 200);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMsg = { role: 'user', time: 'Just now', content: inputText.trim() };
    if (attachedFiles.length > 0) { userMsg.attachments = attachedFiles; setAttachedFiles([]); }
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setReasoningSteps([]);
    setReasoningComplete(false);
    setShowReasoningPanel(false);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'status' }]);
      startReasoning();
    }, 400);
  };

  const css = `
    .chat-scroll::-webkit-scrollbar { width: 6px; }
    .chat-scroll::-webkit-scrollbar-track { background: transparent; }
    .chat-scroll::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 4px; }
    .msg-action-btn { background: transparent; border: none; padding: 4px; cursor: pointer; color: var(--text-tertiary); border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; }
    .msg-action-btn:hover { background: var(--bg-surface-2); color: var(--text-secondary); }
    @keyframes fadeInUp { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform: translateY(0) } }
    @keyframes spinOnce { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }

    @keyframes textShimmer { 0% { opacity: 1 } 50% { opacity: 0.4 } 100% { opacity: 1 } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    @keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
    @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(-12px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
  `;

  return (
    <MainLayout userRole={userRole} activeNav="Chat History" onNavigate={onNavigate} titleComponent={null} searchPlaceholder={null}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          zIndex: 2000, pointerEvents: 'auto',
          background: toast.type === 'error' ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${toast.type === 'error' ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}`,
          borderLeft: `4px solid ${toast.type === 'error' ? '#ef4444' : '#22c55e'}`,
          borderRadius: 12, padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 8px 32px rgba(14,15,37,0.1)',
          minWidth: 360, maxWidth: 500,
          animation: 'toastIn 0.2s ease forwards',
        }}>
          <AlertTriangle size={22} color={toast.type === 'error' ? '#ef4444' : '#22c55e'} strokeWidth={2} style={{ flexShrink: 0 }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: toast.type === 'error' ? '#991b1b' : '#15803d', flex: 1, lineHeight: 1.4 }}>
            {toast.msg}
          </div>
          <div
            onClick={() => setToast(null)}
            style={{ padding: 4, borderRadius: 6, cursor: 'pointer', color: toast.type === 'error' ? 'rgba(153,27,27,0.5)' : 'rgba(21,128,61,0.5)', display: 'flex', flexShrink: 0, transition: 'all 0.15s ease' }}
          >
            <X size={18} strokeWidth={2} />
          </div>
        </div>
      )}

      {/* DOWNLOAD CARD */}
      {showDownload && (
        <div style={{ position: 'fixed', top: 20, right: 24, zIndex: 1000, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '14px 16px', width: 320, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={18} color="#ef4444" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Chat Transcript.pdf</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{downloadDone ? 'Downloaded' : 'Downloading...'}</div>
            </div>
            <button onClick={() => setShowDownload(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 4, display: 'flex' }}><X size={14} /></button>
          </div>
          <div style={{ height: 4, background: 'var(--bg-surface-2)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 999, background: downloadDone ? '#22c55e' : 'linear-gradient(90deg, #0052cc, #7c7cff)', width: `${downloadProgress}%`, transition: 'width 0.2s ease, background 0.3s ease' }} />
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {showShareModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowShareModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px 28px 24px', width: 480, boxShadow: '0 16px 48px rgba(0,0,0,0.15)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Share Conversation</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>Anyone with this link can view this conversation</div>
              </div>
              <button onClick={() => setShowShareModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 4, display: 'flex', marginLeft: 12 }}><X size={18} /></button>
            </div>
            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '16px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '9px 12px', fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                https://procurai.app/share/conv-a8f2c91d
              </div>
              <button onClick={() => { setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); }} style={{ display: 'flex', alignItems: 'center', gap: 7, background: linkCopied ? '#22c55e' : '#0052cc', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, transition: 'background 0.2s ease' }}>
                {linkCopied ? <><CheckCircle size={14} /> Copied!</> : <><Link size={14} /> Copy Link</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'row', height: '100%', overflow: 'hidden' }}>

        {/* CENTER PANEL */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

          {/* TOP BAR */}
          <div style={{ height: 56, background: 'white', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ArrowLeft size={16} color="var(--text-tertiary)" style={{ cursor: 'pointer' }} onClick={() => onNavigate('Chat History')} />
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>MacBook Pro Upgrade Request</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => { setActiveRightPane(activeRightPane === 'pr' ? null : 'pr'); setShowReasoningPanel(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, border: `1px solid ${activeRightPane === 'pr' ? '#7c7cff' : 'var(--border-default)'}`, background: activeRightPane === 'pr' ? 'rgba(124,124,255,0.06)' : 'white', fontSize: 12, fontWeight: 600, color: activeRightPane === 'pr' ? '#7c7cff' : 'var(--text-primary)', cursor: 'pointer' }}
              >
                <Link size={14} /> PR Details
              </button>
              <div ref={menuRef} style={{ position: 'relative' }}>
                <button onClick={() => setMenuOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 8, border: '1px solid var(--border-default)', background: menuOpen ? 'var(--bg-surface-1)' : '#fff', cursor: 'pointer', color: 'var(--text-tertiary)', transition: 'all 0.15s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-1)'}
                  onMouseLeave={(e) => { if (!menuOpen) e.currentTarget.style.background = '#fff'; }}>
                  <MoreHorizontal size={16} />
                </button>
                {menuOpen && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 6, zIndex: 200, minWidth: 180 }}>
                    {[
                      { icon: Edit2, label: 'Rename', action: () => { setMenuOpen(false); setRenameValue('MacBook Pro Upgrade Request'); setShowRenameModal(true); } },
                      { icon: isPinned ? PinOff : Pin, label: isPinned ? 'Unpin' : 'Pin', action: () => { setIsPinned(p => !p); setMenuOpen(false); } },
                      { icon: Share2, label: 'Share', action: () => { setMenuOpen(false); setShowShareModal(true); setLinkCopied(false); } },
                      { icon: Download, label: 'Download', action: handleDownload },
                    ].map(({ icon: Icon, label, action }) => (
                      <div key={label} onClick={action} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)', transition: 'background 0.12s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <Icon size={14} color="var(--text-secondary)" />{label}
                      </div>
                    ))}
                    <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
                    <div onClick={() => { setMenuOpen(false); setShowDeleteModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13, color: '#ef4444', transition: 'background 0.12s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <Trash2 size={14} color="#ef4444" />Delete
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="chat-scroll" ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '40px 0' }}>
            <div style={{ width: '56%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {messages.map((msg, i) => {
                const isLiked = likedMsgs.has(i);
                const isDisliked = dislikedMsgs.has(i);

                if (msg.role === 'divider') return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', padding: '4px 12px' }}>{msg.text}</span>
                  </div>
                );

                if (msg.role === 'status') return (
                  <div key={i} style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, width: '90%' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #0052cc, #7c7cff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Sparkles size={13} color="#fff" strokeWidth={2} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(124,124,255,0.04)', border: '1px solid rgba(124,124,255,0.15)', borderRadius: 10, padding: '10px 16px' }}>
                      <div style={{ flex: 1 }}>
                        {reasoningComplete ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                            <CheckCircle size={14} color="#22c55e" />Completed
                          </div>
                        ) : (
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', animation: 'textShimmer 1.2s ease-in-out infinite', display: 'inline-block' }}>
                            {[...reasoningSteps].reverse().find(s => s.status === 'active')?.title || 'Analysing your request...'}
                          </div>
                        )}
                      </div>
                      <button onClick={() => { setShowReasoningPanel(p => !p); setActiveRightPane(null); }} style={{ fontSize: 12, fontWeight: 500, color: '#7c7cff', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, marginLeft: 12 }}>
                        {showReasoningPanel ? 'Hide Steps' : 'Show Steps'}
                      </button>
                    </div>
                  </div>
                );

                if (msg.role === 'user') return (
                  editingMsgIndex === i ? (
                    <div key={i} style={{ alignSelf: 'flex-end', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, maxWidth: '72%', width: '100%' }}>
                      <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} autoFocus
                        style={{ width: '100%', minHeight: 60, padding: '10px 14px', border: '1.5px solid #7c7cff', borderRadius: 12, background: '#fff', fontSize: 14, color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'none', outline: 'none', boxShadow: '0 0 0 3px rgba(124,124,255,0.1)' }} />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setEditingMsgIndex(null)} style={{ padding: '6px 14px', border: '1px solid var(--border-default)', borderRadius: 7, background: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-secondary)' }}>Cancel</button>
                        <button onClick={() => { setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, content: editingText } : m)); setEditingMsgIndex(null); }}
                          style={{ padding: '6px 14px', border: 'none', borderRadius: 7, background: '#0052cc', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Save</button>
                      </div>
                    </div>
                  ) : (
                    <div key={i} style={{ alignSelf: 'flex-end', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, maxWidth: '72%' }}
                      onMouseEnter={() => setHoveredUserMsg(i)} onMouseLeave={() => setHoveredUserMsg(null)}>
                      <div style={{ background: 'rgba(0,82,204,0.05)', border: '1px solid rgba(0,82,204,0.1)', borderRadius: '14px 14px 4px 14px', padding: '12px 16px', fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5, maxWidth: '100%', whiteSpace: 'pre-wrap' }}>
                        {msg.content}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', height: 26, visibility: hoveredUserMsg === i ? 'visible' : 'hidden', opacity: hoveredUserMsg === i ? 1 : 0, transition: 'opacity 0.15s ease' }}>
                        <button onClick={() => { setCopiedMsgs(prev => new Set(prev).add(i)); const t = setTimeout(() => setCopiedMsgs(prev => { const n = new Set(prev); n.delete(i); return n; }), 2000); tooltipTimers.current.add(t); }}
                          style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: copiedMsgs.has(i) ? 'rgba(34,197,94,0.08)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: copiedMsgs.has(i) ? '#22c55e' : 'var(--text-tertiary)', transition: 'all 0.15s ease' }}>
                          {copiedMsgs.has(i) ? <CheckCircle size={13} /> : <Copy size={13} />}
                        </button>
                        <button onClick={() => { setEditingMsgIndex(i); setEditingText(msg.content); }}
                          style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', transition: 'all 0.15s ease' }}>
                          <Edit2 size={13} />
                        </button>
                      </div>
                    </div>
                  )
                );

                if (msg.role === 'ai') return (
                  <div key={i} style={{ alignSelf: 'flex-start', maxWidth: '90%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      {/* Blue sparkle avatar — matches status bubble & NewChat */}
                      {messages[i - 1]?.role !== 'status' ? (
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #0052cc, #7c7cff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                          <Sparkles size={13} color="#fff" strokeWidth={2} />
                        </div>
                      ) : (
                        <div style={{ width: 28, flexShrink: 0 }} />
                      )}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>{msg.content}</div>
                        {msg.insight && (
                          <div style={{ background: 'white', border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden', minWidth: 300, maxWidth: 420 }}>
                            <div style={{ padding: '8px 14px', background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-default)', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>VENDOR RECOMMENDATION</div>
                            {msg.insight.vendors.map((v, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: idx < msg.insight.vendors.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{v.name}</span>
                                <div style={{ display: 'flex', gap: 6 }}>
                                  <span style={{ background: '#e6f0ff', color: '#0052cc', fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 4 }}>{v.match}</span>
                                  <span style={{ background: '#f5f5f5', color: 'var(--text-secondary)', fontSize: 11, padding: '2px 7px', borderRadius: 4 }}>{v.rating}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {msg.sources && (
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {msg.sources.map(s => (
                              <div key={s} onClick={() => { setActiveRightPane('citation'); setShowReasoningPanel(false); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', padding: '4px 8px', borderRadius: 16, color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--border-default)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-surface-2)'}>
                                <FileText size={11} />{s}
                              </div>
                            ))}
                          </div>
                        )}
                        {msg.action && (
                          <button onClick={() => onNavigate('prdetail')} style={{ alignSelf: 'flex-start', background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--text-primary)', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                            {msg.action}
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Action row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 40 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginRight: 6 }}>{msg.time}</span>
                      <button onClick={() => { setCopiedMsgs(prev => new Set(prev).add(i)); const t = setTimeout(() => setCopiedMsgs(prev => { const n = new Set(prev); n.delete(i); return n; }), 2000); tooltipTimers.current.add(t); }}
                        style={{ position: 'relative', width: 28, height: 28, borderRadius: 7, border: 'none', background: copiedMsgs.has(i) ? 'rgba(34,197,94,0.08)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: copiedMsgs.has(i) ? '#22c55e' : 'var(--text-tertiary)', transition: 'all 0.15s ease' }}>
                        {copiedMsgs.has(i) ? <CheckCircle size={14} /> : <Copy size={14} />}
                      </button>
                      <button onClick={() => { setLikedMsgs(prev => { const n = new Set(prev); if (n.has(i)) n.delete(i); else { n.add(i); setDislikedMsgs(d => { const nd = new Set(d); nd.delete(i); return nd; }); setLikedTooltipVisible(t => new Set(t).add(i)); const timer = setTimeout(() => setLikedTooltipVisible(t => { const nt = new Set(t); nt.delete(i); return nt; }), 1500); tooltipTimers.current.add(timer); } return n; }); }}
                        style={{ position: 'relative', width: 28, height: 28, borderRadius: 7, border: 'none', background: isLiked ? 'rgba(34,197,94,0.08)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isLiked ? '#22c55e' : 'var(--text-tertiary)', transition: 'all 0.15s ease' }}>
                        <ThumbsUp size={14} />
                        {likedTooltipVisible.has(i) && <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: 'rgba(26,26,26,0.9)', color: 'white', fontSize: 10, borderRadius: 5, padding: '4px 8px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 100 }}>Liked</div>}
                      </button>
                      <button onClick={() => { setDislikedMsgs(prev => { const n = new Set(prev); if (n.has(i)) n.delete(i); else { n.add(i); setLikedMsgs(l => { const nl = new Set(l); nl.delete(i); return nl; }); setDislikedTooltipVisible(t => new Set(t).add(i)); const timer = setTimeout(() => setDislikedTooltipVisible(t => { const nt = new Set(t); nt.delete(i); return nt; }), 1500); tooltipTimers.current.add(timer); } return n; }); }}
                        style={{ position: 'relative', width: 28, height: 28, borderRadius: 7, border: 'none', background: isDisliked ? 'rgba(239,68,68,0.08)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDisliked ? '#ef4444' : 'var(--text-tertiary)', transition: 'all 0.15s ease' }}>
                        <ThumbsDown size={14} />
                        {dislikedTooltipVisible.has(i) && <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: 'rgba(26,26,26,0.9)', color: 'white', fontSize: 10, borderRadius: 5, padding: '4px 8px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 100 }}>Disliked</div>}
                      </button>
                      <button onClick={() => { setRegeneratingMsgs(prev => new Set([...prev, i])); setTimeout(() => { setRegeneratingMsgs(prev => { const next = new Set(prev); next.delete(i); return next; }); }, 1500); }}
                        style={{ position: 'relative', width: 28, height: 28, borderRadius: 7, border: 'none', background: regeneratingMsgs.has(i) ? 'rgba(124,124,255,0.08)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: regeneratingMsgs.has(i) ? '#7c7cff' : 'var(--text-tertiary)', transition: 'all 0.15s ease' }}>
                        <RotateCcw size={14} style={{ animation: regeneratingMsgs.has(i) ? 'spinOnce 0.6s linear infinite' : 'none' }} />
                        {regeneratingMsgs.has(i) && <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: 'rgba(26,26,26,0.9)', color: 'white', fontSize: 10, borderRadius: 5, padding: '4px 8px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 100 }}>Regenerating...</div>}
                      </button>
                    </div>
                  </div>
                );

                return null;
              })}
            </div>
          </div>

          {/* INPUT BAR */}
          <div style={{ flexShrink: 0, padding: '16px 24px 20px', background: 'white' }}>
            <div style={{ width: '56%', margin: '0 auto' }}>
              {attachedFiles.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  {attachedFiles.map((f, i) => (
                    <div key={i} style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12 }}>
                      <FileText size={13} color="#0052cc" />
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{f.name}</span>
                      <span style={{ color: 'var(--text-tertiary)' }}>{f.size}</span>
                      <X size={12} style={{ color: 'var(--text-tertiary)', cursor: 'pointer', marginLeft: 2 }} onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))} />
                    </div>
                  ))}
                </div>
              )}
              <div style={{ background: 'white', border: `1.5px solid ${inputFocused ? '#7c7cff' : 'var(--border-default)'}`, borderRadius: 14, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, boxShadow: inputFocused ? '0 0 0 3px rgba(124,124,255,0.09), 0 2px 8px rgba(14,15,37,0.06)' : '0 2px 8px rgba(14,15,37,0.06)', transition: 'border-color 0.15s, box-shadow 0.15s' }}>
                <textarea ref={textareaRef} value={inputText}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (inputText.trim()) handleSend(); } }}
                  onChange={(e) => { setInputText(e.target.value); if (textareaRef.current) { textareaRef.current.style.height = 'auto'; textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 154) + 'px'; } }}
                  onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)}
                  placeholder="Reply to ProcurAI..."
                  style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: 'var(--text-primary)', resize: 'none', minHeight: 24, maxHeight: 154, overflowY: 'auto', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                  <div style={{ position: 'relative' }}>
                    <button onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', transition: 'all 0.15s ease' }}
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
                    <input type="file" multiple accept=".pdf,.docx,.ppt,.pptx" style={{ display: 'none' }} ref={fileInputRef} onChange={(e) => {
                      const files = Array.from(e.target.files);
                      if (attachedFiles.length + files.length > 5) {
                        setToast({ msg: 'Upload up to 5 files maximum.', type: 'error' });
                        setTimeout(() => setToast(null), 3000);
                        e.target.value = '';
                        return;
                      }
                      const validFiles = [];
                      for (const file of files) {
                        if (file.size > 10 * 1024 * 1024) {
                          setToast({ msg: 'Each file up to 10 MB maximum.', type: 'error' });
                          setTimeout(() => setToast(null), 3000);
                          e.target.value = '';
                          return;
                        }
                        validFiles.push({ name: file.name, size: (file.size / 1024 / 1024).toFixed(1) + ' MB', file });
                      }
                      setAttachedFiles(prev => [...prev, ...validFiles]);
                      e.target.value = '';
                    }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, color: inputText.length > 18000 ? '#ef4444' : 'var(--text-tertiary)' }}>{inputText.length} / 20000</span>
                    <Mic size={18} color="var(--text-tertiary)" style={{ cursor: 'pointer', transition: 'color 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#0052cc'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'} />
                      <button onClick={handleSend} disabled={!inputText.trim()}
                      style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: inputText.trim() ? 'pointer' : 'not-allowed', background: inputText.trim() ? 'linear-gradient(135deg, #0052cc, #7c7cff)' : 'var(--bg-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: inputText.trim() ? '0 2px 8px rgba(0,82,204,0.3)' : 'none', transition: 'all 0.15s ease' }}>
                      <Send size={15} color={inputText.trim() ? 'white' : 'var(--text-tertiary)'} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PR DETAILS PANE */}
        {activeRightPane === 'pr' && (
          <div style={{ width: 320, flexShrink: 0, borderLeft: '1px solid var(--border-subtle)', background: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>PR DETAILS</div>
              <X size={16} style={{ cursor: 'pointer' }} onClick={() => setActiveRightPane(null)} />
            </div>
            <div className="chat-scroll" style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[['Requisition ID', 'PR-2026-001', true], ['Request Title', 'MacBook Pro Upgrade Request', false], ['Request Date', '12 May 2026', false], ['Required By', '26 May 2026', false], ['Project Name', 'Q2 Infra Refresh', false]].map(([label, value, bold]) => (
                <div key={label}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: bold ? 600 : 400 }}>{value}</div>
                </div>
              ))}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Priority</div>
                <span style={{ background: '#fff3e0', color: '#e65100', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>Urgent</span>
              </div>
              <div style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[['Category', 'Technology'], ['Spend Type', 'CapEx'], ['Subcategory', 'Hardware']].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[['Requester', 'David Kim'], ['Cost Centre', 'ENG-402']].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
              <button onClick={() => onNavigate('prdetail')} style={{ width: '100%', background: 'linear-gradient(135deg, #0052cc, #7c7cff)', color: 'white', border: 'none', borderRadius: 8, padding: 11, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                View Full PR
              </button>
            </div>
          </div>
        )}

        {/* CITATION FULL SCREEN MODAL */}
        {activeRightPane === 'citation' && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}
            onClick={() => setActiveRightPane(null)}>
            <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 1000, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}
              onClick={(e) => e.stopPropagation()}>
              <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid var(--border-subtle)', background: 'white', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <FileText size={20} color="var(--text-secondary)" />
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>DOCUMENT PREVIEW - PR-2026-001</div>
                </div>
                <button onClick={() => setActiveRightPane(null)} style={{ background: 'var(--bg-surface-2)', border: 'none', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)', transition: 'background 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--border-default)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-surface-2)'}><X size={16} /></button>
              </div>
              <div className="chat-scroll" style={{ flex: 1, overflowY: 'auto', padding: 40, display: 'flex', justifyContent: 'center', background: 'var(--bg-surface-1)' }}>
                <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 40, boxShadow: '0 8px 24px rgba(0,0,0,0.06)', width: '100%', maxWidth: 800, minHeight: '100%' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>PR-2026-001</div>
                  <div style={{ fontSize: 14, color: 'var(--text-tertiary)', marginBottom: 32, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 24 }}>Generated on May 12, 2026</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ height: 16, background: 'var(--bg-surface-2)', borderRadius: 6, width: '100%' }} />
                    <div style={{ height: 16, background: 'var(--bg-surface-2)', borderRadius: 6, width: '90%' }} />
                    <div style={{ height: 16, background: 'var(--bg-surface-2)', borderRadius: 6, width: '95%' }} />
                    <div style={{ height: 16, background: 'var(--bg-surface-2)', borderRadius: 6, width: '80%' }} />
                    <div style={{ marginTop: 24, height: 240, background: 'var(--bg-surface-2)', borderRadius: 12, width: '100%' }} />
                    <div style={{ marginTop: 24, height: 16, background: 'var(--bg-surface-2)', borderRadius: 6, width: '85%' }} />
                    <div style={{ height: 16, background: 'var(--bg-surface-2)', borderRadius: 6, width: '60%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REASONING PANEL */}
        <div style={{ maxWidth: showReasoningPanel ? 300 : 0, width: '100%', flexShrink: 0, borderLeft: showReasoningPanel ? '1px solid var(--border-subtle)' : 'none', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'max-width 0.25s ease' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: 300 }}>
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Brain size={16} color="#7c7cff" />
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Agent Reasoning</div>
              </div>
              <button onClick={() => setShowReasoningPanel(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, borderRadius: 6, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s ease' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <X size={16} />
              </button>
            </div>
            <div style={{ padding: '0 20px 8px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={12} color="#7c7cff" />
              Thinking Steps
            </div>
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
                <div key={i} style={{ display: 'flex', flexDirection: 'column', background: step.status === 'active' ? 'rgba(124,124,255,0.06)' : 'var(--bg-surface-1)', border: step.status === 'active' ? '1px solid rgba(124,124,255,0.15)' : '1px solid var(--border-subtle)', borderRadius: 8, padding: '10px 12px', marginBottom: 8, position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 4, flexShrink: 0, background: step.status === 'active' ? '#7c7cff' : '#1a1a1a', animation: step.status === 'active' ? 'pulse 1.4s ease-in-out infinite' : 'none', position: 'relative', zIndex: 2 }} />
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
                              <span style={{ flexShrink: 0 }}>·</span><span>{b}</span>
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

      {showRenameModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowRenameModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px', width: 440, boxShadow: '0 16px 48px rgba(0,0,0,0.15)' }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Rename this chat</div>
            <input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter' && renameValue.trim()) setShowRenameModal(false); if (e.key === 'Escape') setShowRenameModal(false); }}
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #7c7cff', borderRadius: 10, fontSize: 14, color: 'var(--text-primary)', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', boxShadow: '0 0 0 3px rgba(124,124,255,0.1)', marginBottom: 20 }}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowRenameModal(false)} style={{ padding: '10px 20px', border: '1px solid var(--border-default)', borderRadius: 10, background: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-primary)' }}>Cancel</button>
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
              <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, padding: '13px', border: '1px solid var(--border-default)', borderRadius: 12, background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-primary)' }}>Cancel</button>
              <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, padding: '13px', border: 'none', borderRadius: 12, background: '#ef4444', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

    </MainLayout>
  );
}