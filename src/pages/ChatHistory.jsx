import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ChevronDown, MessageSquare, Plus, ArrowRight, MoreHorizontal, Pin, PinOff, Trash2, Edit2, Share2, Download, CheckCircle, AlertTriangle, FileText, X, Link } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const CHAT_DATA = [
  { id: 1, title: 'MacBook Pro Upgrade Request', snippet: "AI: Based on your requirements, I've shortlisted 3 vendors...", pr: 'PR-2026-001', status: 'Active', time: '2 hours ago' },
  { id: 2, title: 'Enterprise Salesforce License Renewal', snippet: "You: Can you check if the current vendor is on the preferred list?", pr: 'PR-2026-002', status: 'Active', time: '4 hours ago' },
  { id: 3, title: 'Office Supplies Q2 Procurement', snippet: "AI: Your request has been approved. PO generation is next.", pr: 'PR-2026-003', status: 'Closed', time: 'Yesterday' },
  { id: 4, title: 'AWS Cloud Migration Cost Estimate', snippet: "You: I need a rough cost estimate before I raise the PR.", pr: null, status: 'Draft', time: '2 days ago' },
  { id: 5, title: 'General Vendor Query — IT Hardware', snippet: "AI: Here are the top-rated vendors in the IT Hardware category...", pr: null, status: 'Closed', time: '3 days ago' },
  { id: 6, title: 'Q1 Stationery Bulk Order', snippet: "AI: Duplicate PR detected. Would you like to merge with PR-2025-112?", pr: 'PR-2026-007', status: 'Closed', time: '1 week ago' },
];

const STAGE_STYLES = {
  'Active': { background: '#f0fdf4', color: '#15803d' }, // matches green Active/Approved from Dashboard
  'Draft': { background: '#f5f5f5', color: '#888888' }, // matches neutral Draft
  'Closed': { background: '#fafafa', color: '#888888' }, // slightly lighter for Closed
};

const FILTER_OPTIONS = {
  'View Chats': ['All', 'Linked', 'Not Linked'],
  'Date Range': ['All', 'Today', 'This Week', 'This Month', 'Last 3 Months', 'Older'],
};

function FilterDropdown({ label, options, activeOption, isOpen, onToggle, onClose, onSelect }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: isOpen ? 'var(--bg-surface-1)' : '#fff',
          border: `1px solid ${isOpen ? '#7c7cff' : 'var(--border-default)'}`,
          borderRadius: 8, padding: '7px 12px', fontSize: 12,
          color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit',
          transition: 'all .15s ease', whiteSpace: 'nowrap',
        }}
      >
        {`${label}: ${activeOption}`}
        <ChevronDown size={13} strokeWidth={2} style={{ transition: 'transform .15s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0,
          background: '#fff', border: '1px solid var(--border-default)',
          borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          padding: 6, zIndex: 100, minWidth: 180,
        }}>
          {options.map((opt) => (
            <div
              key={opt}
              style={{
                padding: '7px 12px', fontSize: 13, borderRadius: 6,
                cursor: 'pointer', color: activeOption === opt ? '#0052cc' : 'var(--text-primary)',
                fontWeight: activeOption === opt ? 600 : 400,
                background: activeOption === opt ? 'rgba(0,82,204,0.06)' : 'transparent',
                transition: 'background .12s ease',
              }}
              onMouseEnter={(e) => { if (activeOption !== opt) e.currentTarget.style.background = 'var(--bg-surface-2)'; }}
              onMouseLeave={(e) => { if (activeOption !== opt) e.currentTarget.style.background = 'transparent'; }}
              onClick={() => { onSelect(label, opt); onClose(); }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ChatHistory({ setCurrentPage, onNavigate, activeNav }) {
  const [toast, setToast] = useState(null); // { message, type: 'success'|'neutral' }
  const [downloadState, setDownloadState] = useState(null); // { filename, progress, done }
  const [shareModal, setShareModal] = useState(null); // { title }
  const [linkCopied, setLinkCopied] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [tableSearchFocused, setTableSearchFocused] = useState(false);
  const [tableSearch, setTableSearch] = useState('');
  const [openFilter, setOpenFilter] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    'View Chats': 'All',
    'Date Range': 'All'
  });
  const [allData, setAllData] = useState(() => {
    const savedPinned = JSON.parse(localStorage.getItem('chat_pinned') || '[]');
    return CHAT_DATA.map(item => ({
      ...item,
      isPinned: savedPinned.includes(item.id)
    }));
  });
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      const query = tableSearch.toLowerCase();
      const results = allData.filter(item => {
        const matchesSearch = !query || item.title.toLowerCase().includes(query) || item.snippet.toLowerCase().includes(query);

        let matchesLinked = true;
        if (activeFilters['View Chats'] === 'Linked') matchesLinked = !!item.pr;
        if (activeFilters['View Chats'] === 'Not Linked') matchesLinked = !item.pr;

        return matchesSearch && matchesLinked;
      });
      setFilteredData(results);
      setIsSearching(false);
    }, tableSearch.trim() ? 800 : 0);

    return () => clearTimeout(timer);
  }, [tableSearch, allData, activeFilters]);

  const handleFilterSelect = (filterName, option) => {
    setActiveFilters(prev => ({ ...prev, [filterName]: option }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const togglePin = (e, id) => {
    e.stopPropagation();
    setAllData(prev => {
      const next = prev.map(item => item.id === id ? { ...item, isPinned: !item.isPinned } : item);
      const pinIds = next.filter(item => item.isPinned).map(item => item.id);
      localStorage.setItem('chat_pinned', JSON.stringify(pinIds));
      return next;
    });
    setOpenMenuId(null);
    const wasPinned = allData.find(item => item.id === id)?.isPinned;
    showToast(
      wasPinned ? `Unpinned "${allData.find(i => i.id === id)?.title}"` : `Pinned "${allData.find(i => i.id === id)?.title}"`,
      wasPinned ? 'neutral' : 'success'
    );
  };

  const closeFilter = useCallback(() => setOpenFilter(null), []);

  const css = `
    @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(-12px) } to { opacity: 1; transform: translateX(-50%) translateY(0) } }
    @keyframes toastOut { from { opacity:1; transform: translateY(0) } to { opacity:0; transform: translateY(-12px) } }
    @keyframes progressFill { from { width: 0% } to { width: 100% } }
    .pcard{transition:box-shadow .18s ease,transform .18s ease}
    .pcard:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(14,15,37,0.08)}
    .pcard .presume{opacity:0;transition:all .15s ease}
    .pcard:hover .presume{opacity:1}
    .presume:hover{background:rgba(0,82,204,0.06)!important}
    .pcard .pdots{opacity:0;transition:all .15s ease}
    .pcard:hover .pdots{opacity:1}
    .pdots:hover{background:var(--bg-surface-2)!important}
    .pmenu-item{transition:background 0.1s ease}
    .pmenu-item:hover{background:var(--bg-surface-2)!important}
    .pmenu-danger:hover{background:var(--status-error-bg)!important}
    @keyframes shimmer {
      0% { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
    .skeleton-box {
      animation: shimmer 1.5s infinite linear;
      background: linear-gradient(to right, #f0f0f0 4%, #fafafa 25%, #f0f0f0 36%);
      background-size: 800px 100%;
    }
  `;

  return (
    <MainLayout
      activeNav={activeNav}
      onNavigate={onNavigate}
      searchPlaceholder={null}
      titleComponent={<span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Chat History</span>}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {toast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          zIndex: 1000, pointerEvents: 'auto',
          background: '#f0fdf4',
          border: '1px solid rgba(34,197,94,0.25)',
          borderLeft: '4px solid #22c55e',
          borderRadius: 12, padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 8px 32px rgba(14,15,37,0.1)',
          minWidth: 360, maxWidth: 500,
          animation: 'toastIn 0.2s ease forwards',
        }}>
          <CheckCircle size={22} color="#22c55e" strokeWidth={2} style={{ flexShrink: 0 }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: '#15803d', flex: 1, lineHeight: 1.4 }}>
            {toast.message}
          </div>
          <div
            onClick={() => setToast(null)}
            style={{ padding: 4, borderRadius: 6, cursor: 'pointer', color: 'rgba(21,128,61,0.5)', display: 'flex', flexShrink: 0, transition: 'all 0.15s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#15803d'; e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(21,128,61,0.5)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <X size={18} strokeWidth={2} />
          </div>
        </div>
      )}

      {downloadState && (
        <div style={{
          position: 'fixed', top: 32, right: 32, zIndex: 1000,
          background: '#fff', border: '1px solid var(--border-subtle)',
          borderRadius: 14, padding: '14px 16px', width: 320,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          animation: 'toastIn 0.2s ease forwards',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={18} color="#ef4444" strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{downloadState.filename}</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                {downloadState.done ? 'Downloaded' : 'Downloading...'}
              </div>
            </div>
            <button onClick={() => setDownloadState(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 4, display: 'flex', alignItems: 'center' }}>
              <X size={14} />
            </button>
          </div>
          <div style={{ height: 4, background: 'var(--bg-surface-2)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 999,
              background: downloadState.done ? '#22c55e' : 'linear-gradient(90deg, #0052cc, #7c7cff)',
              width: `${downloadProgress}%`,
              transition: 'width 0.2s ease, background 0.3s ease',
            }} />
          </div>
        </div>
      )}

      {shareModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setShareModal(null)}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: '28px 28px 24px',
            width: 480, boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
            animation: 'toastIn 0.2s ease forwards',
          }} onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Share Conversation</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>Anyone with this link can view this conversation</div>
              </div>
              <button onClick={() => setShareModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 4, display: 'flex', alignItems: 'center', marginLeft: 12 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '16px 0' }} />

            {/* Link row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                flex: 1, background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)',
                borderRadius: 8, padding: '9px 12px', fontSize: 12,
                color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                https://procurai.app/share/conv-{Math.random().toString(36).substr(2, 8)}
              </div>
              <button
                onClick={() => {
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 2000);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: linkCopied ? '#22c55e' : '#0052cc',
                  color: '#fff', border: 'none', borderRadius: 8,
                  padding: '9px 16px', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
                  transition: 'background 0.2s ease',
                }}
              >
                {linkCopied
                  ? <><CheckCircle size={14} /> Copied!</>
                  : <><Link size={14} /> Copy Link</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '24px 0', width: '70%', margin: '0 auto' }}>

        {/* Header & Filters wrapper */}
        <div style={{ marginBottom: 24 }}>
          {/* Top Line: Title + New Chat */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              My Conversations
            </div>
            <button
              onClick={() => onNavigate('New Chat')}
              style={{
                padding: '7px 16px', border: 'none', borderRadius: 8,
                background: 'linear-gradient(135deg, #0052cc, #7c7cff)', color: '#fff',
                fontWeight: 600, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 8,
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,82,204,0.12)', fontFamily: 'inherit',
              }}>
              <Plus size={15} strokeWidth={2.5} />
              New Chat
            </button>
          </div>

          {/* Bottom Line: Search + Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
            {/* Search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, flex: 1,
              background: '#fff', borderRadius: 8, padding: '7px 12px',
              border: `1px solid ${tableSearchFocused ? '#7c7cff' : 'var(--border-default)'}`,
              boxShadow: tableSearchFocused ? '0 0 0 3px rgba(124,124,255,0.12)' : 'none',
              transition: 'border-color .15s ease, box-shadow .15s ease',
            }}>
              <Search size={14} color="var(--text-tertiary)" strokeWidth={2} />
              <input
                type="text" placeholder="Search..." value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                onFocus={() => setTableSearchFocused(true)}
                onBlur={() => setTableSearchFocused(false)}
                style={{
                  border: 'none', background: 'transparent', outline: 'none',
                  fontSize: 13, color: 'var(--text-primary)', width: '100%', fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Filter dropdowns */}
            {Object.keys(FILTER_OPTIONS).map((label) => (
              <FilterDropdown
                key={label}
                label={label}
                options={FILTER_OPTIONS[label]}
                activeOption={activeFilters[label]}
                isOpen={openFilter === label}
                onToggle={() => setOpenFilter(openFilter === label ? null : label)}
                onClose={closeFilter}
                onSelect={handleFilterSelect}
              />
            ))}
          </div>
        </div>

        {/* List Container */}
        <div>
          {isSearching ? (
            [1, 2, 3].map((i) => (
              <div key={`skel-${i}`} style={{
                background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 12,
                padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16,
                marginBottom: 12
              }}>
                <div className="skeleton-box" style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 10 }}></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="skeleton-box" style={{ height: 16, width: '40%', borderRadius: 4, marginBottom: 8 }}></div>
                  <div className="skeleton-box" style={{ height: 14, width: '80%', borderRadius: 4 }}></div>
                </div>
                <div style={{ display: 'flex', gap: 14, flexShrink: 0 }}>
                  <div className="skeleton-box" style={{ width: 60, height: 20, borderRadius: 20 }}></div>
                  <div className="skeleton-box" style={{ width: 60, height: 16, borderRadius: 4 }}></div>
                </div>
                <div className="skeleton-box" style={{ width: 24, height: 24, borderRadius: '50%', marginLeft: 12 }}></div>
              </div>
            ))
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div key={item.id} className="pcard" onClick={() => onNavigate('Chat Detail')} style={{
                background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 12,
                padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16,
                marginBottom: 12, cursor: 'pointer',
              }}>
                <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 10, background: 'rgba(0,82,204,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={18} color="#0052cc" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                    {item.isPinned && <Pin size={14} fill="#0052cc" color="#0052cc" style={{ flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.snippet}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                  {/* Linked PR Tag */}
                  {item.pr ? (
                    <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#e6f0ff', color: '#0052cc', border: '1px solid transparent' }}>{item.pr}</span>
                  ) : (
                    <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}>Not Linked</span>
                  )}

                  {/* Timestamp */}
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', width: 80, textAlign: 'right' }}>{item.time}</div>
                </div>

                <div style={{ position: 'relative' }}>
                  <button className="pdots" onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === item.id ? null : item.id); }} style={{
                    marginLeft: 12, padding: '8px', borderRadius: '50%',
                    background: 'transparent', border: 'none', color: 'var(--text-secondary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <MoreHorizontal size={18} />
                  </button>
                  {openMenuId === item.id && (
                    <div style={{
                      position: 'absolute', right: 0, top: '100%', marginTop: 4,
                      background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: 4, zIndex: 50, minWidth: 140,
                    }}>
                      <div className="pmenu-item" onClick={(e) => togglePin(e, item.id)} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer', borderRadius: 6 }}>
                        {item.isPinned ? <PinOff size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} /> : <Pin size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} />}
                        {item.isPinned ? 'Unpin chat' : 'Pin chat'}
                      </div>
                      <div className="pmenu-item" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setRenameValue(item.title); setShowRenameModal(true); }} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer', borderRadius: 6 }}>
                        <Edit2 size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} /> Rename
                      </div>
                      <div className="pmenu-item" onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(null);
                        setShareModal({ title: item.title });
                        setLinkCopied(false);
                      }} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer', borderRadius: 6 }}>
                        <Share2 size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} /> Share
                      </div>
                      <div className="pmenu-item" onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(null);
                        const filename = `Chat — ${item.title}.pdf`;
                        setDownloadState({ filename, done: false });
                        setDownloadProgress(0);
                        let prog = 0;
                        const interval = setInterval(() => {
                          prog += Math.random() * 18 + 8;
                          if (prog >= 100) {
                            prog = 100;
                            clearInterval(interval);
                            setDownloadState({ filename, done: true });
                            setTimeout(() => setDownloadState(null), 2500);
                          }
                          setDownloadProgress(Math.min(prog, 100));
                        }, 200);
                      }} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer', borderRadius: 6 }}>
                        <Download size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} /> Download
                      </div>
                      <div className="pmenu-item pmenu-danger" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setShowDeleteModal(true); }} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--colors-red-500)', cursor: 'pointer', borderRadius: 6 }}>
                        <Trash2 size={14} color="var(--colors-red-500)" style={{ flexShrink: 0 }} /> Delete
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <MessageSquare size={24} color="var(--text-tertiary)" />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>No past conversations found.</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Start a new request to begin a procurement conversation.</div>
              <button onClick={() => onNavigate('New Request')} style={{
                padding: '10px 18px', border: 'none', borderRadius: 8,
                background: 'linear-gradient(135deg, #0052cc, #7c7cff)', color: '#fff',
                fontWeight: 600, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 8,
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,82,204,0.25)', fontFamily: 'inherit',
              }}>
                <Plus size={15} strokeWidth={2.5} />
                New Request
              </button>
            </div>
          )}
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