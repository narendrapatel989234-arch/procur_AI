import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import { Plus, Paperclip, ChevronDown, Mic, Send, Sparkles, FileText, BarChart2, Package, ArrowLeft, X, Copy, CheckCircle, ThumbsUp, ThumbsDown, RotateCcw, Edit2, AlertTriangle, MoreHorizontal, Pin, PinOff, Share2, Download, Trash2, Scale } from 'lucide-react';

export default function NewChat({ setCurrentPage, onNavigate, activeNav , userRole}) {
  const [inputFocused, setInputFocused] = useState(false);
  const [inputText, setInputText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [toast, setToast] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [messages, setMessages] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [showUploadTooltip, setShowUploadTooltip] = useState(false);
  const [reasoningSteps, setReasoningSteps] = useState([]);
  const [reasoningComplete, setReasoningComplete] = useState(false);
  const [showReasoningPanel, setShowReasoningPanel] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [regeneratingMsgs, setRegeneratingMsgs] = useState(new Set());
  const [editingMsgIndex, setEditingMsgIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [copiedMsgs, setCopiedMsgs] = useState(new Set());
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadDone, setDownloadDone] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const menuRef = useRef(null);
  
  const [likedMsgs, setLikedMsgs] = useState(new Set());
  const [dislikedMsgs, setDislikedMsgs] = useState(new Set());
  const [likedTooltipVisible, setLikedTooltipVisible] = useState(new Set());
  const [dislikedTooltipVisible, setDislikedTooltipVisible] = useState(new Set());
  const [hoveredUserMsg, setHoveredUserMsg] = useState(null);

  const scrollRef = useRef(null);
  const tooltipTimers = useRef(new Set());

  const [typedTitles, setTypedTitles] = useState({});

  useEffect(() => {
    const activeIndex = reasoningSteps.findIndex(s => s.status === 'active');
    if (activeIndex === -1) return;

    const step = reasoningSteps[activeIndex];
    const fullTitle = step.title;

    setTypedTitles(prev => ({ ...prev, [activeIndex]: 0 }));

    let charCount = 0;
    const interval = setInterval(() => {
      charCount++;
      setTypedTitles(prev => ({ ...prev, [activeIndex]: charCount }));
      if (charCount >= fullTitle.length) clearInterval(interval);
    }, 35);

    return () => clearInterval(interval);
  }, [reasoningSteps.length]);

  // Typewriter effect state
  const placeholders = [
    "Write a message...",
    "Ask ProcurAI for vendor recommendations...",
    "Check PR status...",
    "Compare IT hardware prices..."
  ];
  const [phIndex, setPhIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    return () => {
      tooltipTimers.current.forEach(clearTimeout);
      tooltipTimers.current.clear();
    };
  }, []);

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

  useEffect(() => {
    const typingSpeed = isDeleting ? 30 : 60;
    const currentString = placeholders[phIndex];

    if (!isDeleting && charIndex === currentString.length) {
      const timer = setTimeout(() => setIsDeleting(true), 2500);
      return () => clearTimeout(timer);
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhIndex((prev) => (prev + 1) % placeholders.length);
      return;
    }

    const timer = setTimeout(() => {
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, phIndex]);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, reasoningSteps]);

  const currentPlaceholder = placeholders[phIndex].substring(0, charIndex) + (inputFocused ? '' : '|');
  
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

  const startReasoning = () => {
    let delay = 200;
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
          role: 'ai',
          content: "I've analyzed your request. Based on what you've described, I can help you initiate the procurement process. Could you share more details about the timeline and budget?",
        }]);
      }, 800);
    }, delay + 200);
  };
  
  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMsg = { role: 'user', content: inputText.trim() };
    if (attachedFiles.length > 0) {
        userMsg.attachments = attachedFiles;
        setAttachedFiles([]);
    }
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setHasStarted(true);
    setReasoningSteps([]);
    setReasoningComplete(false);
    setShowReasoningPanel(false);
  
    // Add status message
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'status' }]);
      startReasoning();
    }, 400);
  };

  return (
    <>
      <style>{`
        .prompt-card {
          background: #fff;
          border: 1px solid var(--border-default);
          border-radius: 12px;
          padding: 16px;
          width: 240px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          text-align: left;
        }
        .prompt-card:hover {
          border-color: #7c7cff;
          box-shadow: 0 6px 16px rgba(124,124,255,0.12);
          transform: translateY(-2px);
        }
        @keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
        @keyframes textShimmer {
          0% { opacity: 1 }
          50% { opacity: 0.4 }
          100% { opacity: 1 }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        @keyframes spinOnce { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      <MainLayout userRole={userRole} activeNav="Chat History" onNavigate={onNavigate} titleComponent={null} searchPlaceholder={null}>

        {/* ── Top Bar (Header) ── */}
        <div style={{
          height: 56, minHeight: 56, background: '#fff', borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <ArrowLeft size={18} color="var(--text-tertiary)" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => onNavigate('Chat History')} />
            {!hasStarted ? (
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>New Chat</div>
            ) : (
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 300 }}>
                {messages.find(m => m.role === 'user')?.content || 'New Chat'}
              </div>
            )}
          </div>
          {hasStarted && (
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 8, color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <MoreHorizontal size={18} />
              </button>
              {menuOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 6, zIndex: 200, minWidth: 180 }}>
                  {[
                    { icon: Edit2, label: 'Rename', action: () => { setMenuOpen(false); setRenameValue(messages.find(m => m.role === 'user')?.content || ''); setShowRenameModal(true); } },
                    { icon: isPinned ? PinOff : Pin, label: isPinned ? 'Unpin' : 'Pin', action: () => { setIsPinned(p => !p); setMenuOpen(false); } },
                    { icon: Share2, label: 'Share', action: () => { setMenuOpen(false); setShowShareModal(true); setLinkCopied(false); } },
                    { icon: Download, label: 'Download', action: handleDownload },
                  ].map(({ icon: Icon, label, action }) => (
                    <div key={label} onClick={action} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)', transition: 'background 0.12s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-2)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <Icon size={14} color="var(--text-secondary)" />{label}
                    </div>
                  ))}
                  <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
                  <div onClick={() => { setMenuOpen(false); setShowDeleteModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13, color: '#ef4444', transition: 'background 0.12s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <Trash2 size={14} color="#ef4444" />Delete
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Main Chat Thread Area ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Messages Scroll Area */}
            <div className="chat-scroll" ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: hasStarted ? '24px' : '40px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: hasStarted ? 'flex-start' : 'center', gap: hasStarted ? 16 : 0 }}>
              
              {!hasStarted ? (
                <>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, rgb(0, 82, 204), rgb(124, 124, 255))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: 24, boxShadow: '0 4px 12px rgba(0,82,204,0.15)' }}>
                    <Sparkles size={20} color="#fff" strokeWidth={2} />
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, letterSpacing: '-0.3px' }}>How can I help you today?</div>
                  <div style={{ fontSize: 15, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 420, lineHeight: 1.6 }}>
                    I can assist with creating purchase requests, analyzing vendor contracts, tracking orders, and evaluating supply chain metrics.
                  </div>

                  {/* Starter Prompts */}
                  <div style={{ display: 'flex', gap: 16, marginTop: 48, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 800 }}>

                    <div className="prompt-card" onClick={() => setInputText("I want to compare proposals from multiple vendors. Please help me evaluate pricing, commercial terms, and supplier strengths.")}>
                      <div style={{ color: '#0052cc', marginBottom: 12, background: 'rgba(0,82,204,0.06)', width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Scale size={18} strokeWidth={2.5} />
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Compare Proposals</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Compare quotations, pricing, commercial terms, and supplier strengths</div>
                    </div>

                    <div className="prompt-card" onClick={() => setInputText("Help me create a detailed Scope of Work for a procurement engagement. I'll share the product or service details.")}>
                      <div style={{ color: '#0052cc', marginBottom: 12, background: 'rgba(0,82,204,0.06)', width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={18} strokeWidth={2.5} />
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Create Scope of Work</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Generate a detailed SOW for products, services, or projects</div>
                    </div>

                    <div className="prompt-card" onClick={() => setInputText("I have a question about my procurement data. Can you help me with insights on requests, suppliers, contracts, or spending?")}>
                      <div style={{ color: '#0052cc', marginBottom: 12, background: 'rgba(0,82,204,0.06)', width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BarChart2 size={18} strokeWidth={2.5} />
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Procurement Insights</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Ask questions about requests, suppliers, contracts, spending, and orders</div>
                    </div>

                  </div>
                </>
              ) : (
                <div style={{ width: '56%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 16 }}>
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
                                  <CheckCircle size={14} color="#22c55e" />
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
                            >Cancel</button>
                            <button
                              onClick={() => {
                                setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, content: editingText } : m));
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
                          {msg.content}
                        </div>
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
                            onClick={() => { setEditingMsgIndex(i); setEditingText(msg.content); }}
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
                            {msg.content}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 0 }}>
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginRight: 8 }}>Just now</span>
                          <button onClick={() => {
                            setCopiedMsgs(prev => new Set(prev).add(i));
                            const timer = setTimeout(() => setCopiedMsgs(prev => { const n = new Set(prev); n.delete(i); return n; }), 2000);
                            tooltipTimers.current.add(timer);
                          }} style={{ position: 'relative', overflow: 'visible', width: 28, height: 28, borderRadius: 7, border: 'none', background: copiedMsgs.has(i) ? 'rgba(34,197,94,0.08)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: copiedMsgs.has(i) ? '#22c55e' : 'var(--text-tertiary)', transition: 'all 0.15s ease' }} onMouseEnter={e => { if (!copiedMsgs.has(i)) { e.currentTarget.style.background = 'var(--bg-surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; } }} onMouseLeave={e => { if (!copiedMsgs.has(i)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; } }}>
                            {copiedMsgs.has(i) ? <CheckCircle size={14} /> : <Copy size={14} />}
                            {copiedMsgs.has(i) && <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: 'rgba(26,26,26,0.9)', color: 'white', fontSize: 10, fontWeight: 500, borderRadius: 5, padding: '4px 8px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 100 }}>Copied!</div>}
                          </button>

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
                </div>
              )}
            </div>

            {/* ── Sticky Input Bar ── */}
            <div style={{ flexShrink: 0, padding: '16px 24px 20px', background: 'white' }}>
              <div style={{ width: '56%', margin: '0 auto' }}>

                {/* Attachment pills — shown when files attached */}
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

                {/* Input box */}
                <div
                  style={{
                    background: 'white',
                    border: `1.5px solid ${inputFocused ? '#7c7cff' : 'var(--border-default)'}`,
                    borderRadius: 14,
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    boxShadow: inputFocused ? '0 0 0 3px rgba(124,124,255,0.09), 0 2px 8px rgba(14,15,37,0.06)' : '0 2px 8px rgba(14,15,37,0.06)',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                >
                  {/* Textarea row */}
                  <textarea
                    ref={textareaRef}
                    value={inputText}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (inputText.trim()) handleSend();
                      }
                    }}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      if (textareaRef.current) {
                        textareaRef.current.style.height = 'auto';
                        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 154) + 'px';
                      }
                    }}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder={inputFocused ? 'Ask ProcurAI anything...' : currentPlaceholder}
                    style={{
                      width: '100%', border: 'none', outline: 'none', background: 'transparent',
                      fontSize: 14, color: 'var(--text-primary)', resize: 'none',
                      minHeight: 24, maxHeight: 154, overflowY: 'auto',
                      fontFamily: 'Inter, sans-serif', lineHeight: 1.5,
                    }}
                  />

                  {/* Bottom action row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>

                    {/* Left: Attach icon */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', transition: 'all 0.15s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(124,124,255,0.08)'; e.currentTarget.style.color = '#7c7cff'; setShowUploadTooltip(true); }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; setShowUploadTooltip(false); }}
                      >
                        <Paperclip size={18} />
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
                          Upload up to 5 files in PDF, JPEG or PNG format, up to 10 MB each
                        </div>
                      )}
                      <input type="file" multiple accept=".pdf,.docx,.txt" style={{ display: 'none' }} ref={fileInputRef} onChange={(e) => {
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

                    {/* Right: char count + send */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 11, color: inputText.length > 18000 ? '#ef4444' : 'var(--text-tertiary)' }}>
                        {inputText.length} / 20000
                      </span>
                      <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', transition: 'all 0.15s ease' }} onMouseEnter={e => { e.currentTarget.style.color = '#7c7cff'; e.currentTarget.style.background = 'rgba(124,124,255,0.08)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}>
                        <Mic size={18} strokeWidth={2} />
                      </button>
                      <Mic size={18} color="var(--text-tertiary)" style={{ cursor: 'pointer', transition: 'color 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#0052cc'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'} />
                      <button
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                        style={{
                          width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                          background: inputText.trim() ? 'linear-gradient(135deg, #0052cc, #7c7cff)' : 'var(--bg-surface-3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          boxShadow: inputText.trim() ? '0 2px 8px rgba(0,82,204,0.3)' : 'none',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Send size={15} color={inputText.trim() ? 'white' : 'var(--text-tertiary)'} />
                      </button>
                    </div>
                  </div>
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
            {/* Toast */}
            {toast && (
              <div style={{
                position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
                zIndex: 1000, pointerEvents: 'auto',
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
                            <>
                              {step.title.substring(0, typedTitles[i] ?? 0)}
                              {(typedTitles[i] ?? 0) < step.title.length && (
                                <span style={{
                                  display: 'inline-block',
                                  width: 1.5,
                                  height: '0.9em',
                                  background: '#7c7cff',
                                  marginLeft: 2,
                                  verticalAlign: 'middle',
                                  animation: 'blink 0.7s step-end infinite',
                                }} />
                              )}
                            </>
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

      {showShareModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowShareModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px', width: 440, boxShadow: '0 16px 48px rgba(0,0,0,0.15)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Share this chat</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-surface-1)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
              <Link size={16} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 14, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>procurai.com/c/8f92a1b3</div>
              <button onClick={() => setLinkCopied(true)} style={{ background: linkCopied ? '#22c55e' : '#fff', border: `1px solid ${linkCopied ? '#22c55e' : 'var(--border-default)'}`, borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 600, color: linkCopied ? '#fff' : 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.15s ease' }}>
                {linkCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowShareModal(false)} style={{ padding: '10px 20px', border: '1px solid var(--border-default)', borderRadius: 10, background: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', color: 'var(--text-primary)' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showDownload && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px', width: 360, boxShadow: '0 16px 48px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            {downloadDone ? (
              <>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <CheckCircle size={28} color="#22c55e" strokeWidth={2.5} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Download Complete</div>
                <div style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>File saved as PDF</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 24 }}>Preparing Download...</div>
                <div style={{ width: '100%', height: 6, background: 'var(--bg-surface-2)', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{ height: '100%', background: '#0052cc', width: `${downloadProgress}%`, transition: 'width 0.2s ease' }} />
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{Math.round(downloadProgress)}%</div>
              </>
            )}
          </div>
        </div>
      )}

    </MainLayout>
    </>
  );
}
