import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import { Search, Calendar, Plus, MoreVertical, Bot, Edit2, X, Cpu, Layers, Zap, Activity, Database, Code, Layout, Cloud, ChevronLeft, ChevronRight, ChevronDown, CheckCircle, Eye, Pencil, Trash2 } from 'lucide-react';

const INITIAL_AGENTS = [
  { id: 1, name: 'Deep Research', icon: Search, description: 'Performs deep web research, aggregates data across multiple sources, and extracts relevant entities for procurement analysis.', status: 'Active', lastUsed: '01/01/25', color: '#ffedd5', iconColor: '#f97316' },
  { id: 2, name: 'Airia', icon: Zap, description: 'Automates data fetching and patch operations, seamlessly integrating external signals with your internal SQL records.', status: 'Inactive', lastUsed: '11/01/25', color: '#dcfce7', iconColor: '#22c55e' },
  { id: 3, name: 'Leave Agent', icon: Activity, description: 'Manages employee leave records, updates database states, and classifies different types of leave dynamically.', status: 'Active', lastUsed: '14/02/25', color: '#dbeafe', iconColor: '#3b82f6' },
  { id: 4, name: 'Code Captain', icon: Code, description: 'Assists in script generation, code reviews, and automating CSV-to-SQL data pipelines efficiently.', status: 'Inactive', lastUsed: '07/03/25', color: '#f3e8ff', iconColor: '#a855f7' },
  { id: 5, name: 'Data Dynamo', icon: Database, description: 'Assembles complex datasets, performs advanced SQL joins, and summarizes high-level insights for management.', status: 'Active', lastUsed: '12/03/25', color: '#fae8ff', iconColor: '#d946ef' },
  { id: 6, name: 'Code Crafter', icon: Cpu, description: 'Compiles metric data from disparate systems, modifies logic configurations, and extracts actionable insights.', status: 'Inactive', lastUsed: '22/03/25', color: '#e0f2fe', iconColor: '#0ea5e9' },
  { id: 7, name: 'Logic Luminary', icon: Layers, description: 'Connects unstructured data sources and translates HTML patterns into structured SQL models.', status: 'Active', lastUsed: '22/04/25', color: '#e0e7ff', iconColor: '#6366f1' },
  { id: 8, name: 'Pixel Pioneer', icon: Layout, description: 'Focuses on visual data representation, rendering statistics into easily digestible formats and charts.', status: 'Active', lastUsed: '28/04/25', color: '#ffedd5', iconColor: '#f97316' },
  { id: 9, name: 'Cloud Catalyst', icon: Cloud, description: 'Obtains cloud data, transforms it for NoSQL storage, and identifies underlying usage patterns automatically.', status: 'Active', lastUsed: '29/04/25', color: '#dcfce7', iconColor: '#22c55e' },
];

export default function AgentManagement({ activeNav, onNavigate }) {
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [search, setSearch] = useState('');
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [enabledToggle, setEnabledToggle] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [toast, setToast] = useState(null);

  const [isSearching, setIsSearching] = useState(false);
  const [displayedAgents, setDisplayedAgents] = useState(INITIAL_AGENTS);

  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentIntro, setNewAgentIntro] = useState('');
  const [newAgentDesc, setNewAgentDesc] = useState('');
  const [newAgentInstr, setNewAgentInstr] = useState('');

  const [viewOnlyMode, setViewOnlyMode] = useState(false);
  const [agentToView, setAgentToView] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Pagination & Action Dropdown
  const [tablePage, setTablePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openRpp, setOpenRpp] = useState(false);
  const [openActionId, setOpenActionId] = useState(null);

  const rppRef = useRef(null);

  useEffect(() => {
    if (!openRpp) return;
    const handleClick = (e) => {
      if (rppRef.current && !rppRef.current.contains(e.target)) setOpenRpp(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openRpp]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!openActionId) return;
    const handleClick = () => setOpenActionId(null);
    setTimeout(() => document.addEventListener('click', handleClick), 0);
    return () => document.removeEventListener('click', handleClick);
  }, [openActionId]);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      if (search.trim()) {
        const q = search.toLowerCase();
        setDisplayedAgents(agents.filter(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)));
      } else {
        setDisplayedAgents(agents);
      }
      setTablePage(1);
      setIsSearching(false);
    }, search.trim() ? 600 : 150);

    return () => clearTimeout(timer);
  }, [search, agents]);

  const totalRows = displayedAgents.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedAgents = displayedAgents.slice((tablePage - 1) * rowsPerPage, tablePage * rowsPerPage);

  const showToast = (message) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveAgent = () => {
    if (agentToView) {
      setAgents(prev => prev.map(a => a.id === agentToView.id ? {
        ...a,
        name: newAgentName || a.name,
        description: newAgentDesc || a.description,
        status: enabledToggle ? 'Active' : 'Inactive'
      } : a));
      showToast(`Saved changes to "${newAgentName || agentToView.name}"`);
    } else {
      const newAgent = {
        id: Date.now(),
        name: newAgentName || 'New Custom Agent',
        icon: Bot,
        description: newAgentDesc || 'A custom agent designed for automated tasks and processing.',
        status: enabledToggle ? 'Active' : 'Inactive',
        lastUsed: 'Just now',
        color: '#dbeafe',
        iconColor: '#3b82f6'
      };
      setAgents(prev => [newAgent, ...prev]);
      showToast(`Added agent "${newAgent.name}"`);
    }
    setShowAddAgent(false);
    setNewAgentName('');
    setNewAgentIntro('');
    setNewAgentDesc('');
    setNewAgentInstr('');
    setEnabledToggle(false);
    setAgentToView(null);
  };

  return (
    <MainLayout
      activeNav={activeNav}
      onNavigate={onNavigate}
      searchPlaceholder={null}
      titleComponent={<span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Agent Management</span>}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        .pdots { transition: all 0.15s ease; }
        .pdots:hover { background: var(--bg-surface-2) !important; }
        .pmenu-item { transition: background 0.1s ease; }
        .pmenu-item:hover { background: var(--bg-surface-2) !important; }
        .pmenu-danger:hover { background: var(--status-error-bg) !important; }
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skeleton-box {
          animation: shimmer 1.5s infinite linear;
          background: linear-gradient(to right, #f0f0f0 4%, #fafafa 25%, #f0f0f0 36%);
          background-size: 800px 100%;
        }
      `}} />
      <div style={{ flex: 1, padding: 24, overflowY: 'auto', background: 'var(--bg-default)', position: 'relative', display: 'flex', flexDirection: 'column' }}>

        {/* Header Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ position: 'relative', width: 320 }}>
            <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search Agent"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0 12px 0 36px', height: 36, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 13, outline: 'none', color: 'var(--text-primary)', transition: 'border-color 0.15s ease, box-shadow 0.15s ease' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#7c7cff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,124,255,0.12)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowDatePicker(!showDatePicker)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: showDatePicker ? 'var(--bg-surface-1)' : '#fff', border: `1px solid ${showDatePicker ? '#7c7cff' : 'var(--border-default)'}`, padding: '0 12px', height: 36, borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s ease', fontFamily: 'inherit' }}>
                <Calendar size={13} strokeWidth={2} /> Select Date <ChevronDown size={13} strokeWidth={2} style={{ transition: 'transform 0.15s ease', transform: showDatePicker ? 'rotate(180deg)' : 'rotate(0)' }} />
              </button>

              {/* Custom Date Picker Popover */}
              {showDatePicker && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '20px 24px', boxShadow: '0 12px 32px rgba(0,0,0,0.1)', zIndex: 100, width: 360, animation: 'fadeIn 0.15s ease' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Select Date Range</div>
                    <button onClick={() => setShowDatePicker(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex' }}><X size={16} /></button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: 'var(--text-primary)' }}><ChevronLeft size={18} /></button>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ border: '1px solid var(--border-default)', borderRadius: 8, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer', transition: 'background 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>January <ChevronDown size={14} color="var(--text-secondary)" /></div>
                      <div style={{ border: '1px solid var(--border-default)', borderRadius: 8, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer', transition: 'background 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>2025 <ChevronDown size={14} color="var(--text-secondary)" /></div>
                    </div>
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: 'var(--text-primary)' }}><ChevronRight size={18} /></button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 12 }}>
                    <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 8, textAlign: 'center', fontSize: 13, color: 'var(--text-primary)' }}>
                    {/* Empty slots */}
                    <div /><div /><div /><div /><div />
                    <div style={{ padding: '8px 0' }}>01</div><div style={{ padding: '8px 0' }}>02</div>
                    <div style={{ padding: '8px 0' }}>03</div><div style={{ padding: '8px 0' }}>04</div><div style={{ padding: '8px 0' }}>05</div><div style={{ padding: '8px 0' }}>06</div>
                    <div style={{ background: '#0052cc', color: '#fff', borderRadius: '16px 0 0 16px', padding: '8px 0', fontWeight: 600 }}>07</div>
                    <div style={{ background: '#e8f1fb', padding: '8px 0' }}>08</div><div style={{ background: '#e8f1fb', padding: '8px 0' }}>09</div>
                    <div style={{ background: '#e8f1fb', padding: '8px 0' }}>10</div><div style={{ background: '#e8f1fb', padding: '8px 0' }}>11</div><div style={{ background: '#e8f1fb', padding: '8px 0', color: '#0052cc', fontWeight: 600 }}>12</div>
                    <div style={{ background: '#0052cc', color: '#fff', borderRadius: '0 16px 16px 0', padding: '8px 0', fontWeight: 600 }}>13</div>
                    <div style={{ padding: '8px 0' }}>14</div><div style={{ padding: '8px 0' }}>15</div><div style={{ padding: '8px 0' }}>16</div>
                    <div style={{ padding: '8px 0' }}>17</div><div style={{ padding: '8px 0' }}>18</div><div style={{ padding: '8px 0' }}>19</div><div style={{ padding: '8px 0' }}>20</div>
                    <div style={{ padding: '8px 0' }}>21</div><div style={{ padding: '8px 0' }}>22</div><div style={{ padding: '8px 0' }}>23</div>
                    <div style={{ padding: '8px 0' }}>24</div><div style={{ padding: '8px 0' }}>25</div><div style={{ padding: '8px 0' }}>26</div><div style={{ padding: '8px 0' }}>27</div>
                    <div style={{ padding: '8px 0' }}>28</div><div style={{ padding: '8px 0' }}>29</div><div style={{ padding: '8px 0' }}>30</div>
                    <div style={{ padding: '8px 0' }}>31</div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '16px -24px 0', padding: '16px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>07 Jan 2025 - 13 Jan 2025</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={{ padding: '8px 16px', border: '1px solid var(--border-default)', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>Clear</button>
                      <button onClick={() => setShowDatePicker(false)} style={{ padding: '8px 16px', border: 'none', borderRadius: 8, background: 'linear-gradient(135deg, #0052cc, #7c7cff)', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Apply</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => {
              setNewAgentName(''); setNewAgentIntro(''); setNewAgentDesc(''); setNewAgentInstr(''); setEnabledToggle(false);
              setViewOnlyMode(false); setAgentToView(null); setShowAddAgent(true);
            }} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0052cc', border: 'none', padding: '0 16px', height: 42, borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,82,204,0.2)', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,82,204,0.3)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,82,204,0.2)'; }}>
              <Plus size={16} strokeWidth={2.5} /> Add Agent
            </button>
          </div>
        </div>

        {/* Table */}
        {/* Table container */}
        <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 16, overflow: 'visible', boxShadow: '0 1px 4px rgba(14,15,37,0.04)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Agent Name</th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', width: '40%' }}>Description</th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Used</th>
                  <th style={{ padding: '10px 16px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {isSearching ? (
                  [1, 2, 3, 4, 5].map(i => (
                    <tr key={`skel-${i}`} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div className="skeleton-box" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                          <div className="skeleton-box" style={{ height: 14, width: 120, borderRadius: 4 }} />
                        </div>
                      </td>
                      <td style={{ padding: '13px 16px' }}><div className="skeleton-box" style={{ height: 14, width: '100%', borderRadius: 4 }} /></td>
                      <td style={{ padding: '13px 16px' }}><div className="skeleton-box" style={{ height: 20, width: 60, borderRadius: 12 }} /></td>
                      <td style={{ padding: '13px 16px' }}><div className="skeleton-box" style={{ height: 14, width: 70, borderRadius: 4 }} /></td>
                      <td style={{ padding: '13px 16px', textAlign: 'center' }}><div className="skeleton-box" style={{ height: 18, width: 18, borderRadius: '50%', margin: '0 auto' }} /></td>
                    </tr>
                  ))
                ) : paginatedAgents.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px 16px', textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)' }}>No agents found matching "{search}"</td>
                  </tr>
                ) : (
                  paginatedAgents.map((agent, idx) => {
                    const IconComp = agent.icon;
                    return (
                      <tr
                        key={agent.id}
                        style={{ borderBottom: idx < paginatedAgents.length - 1 ? '1px solid var(--border-subtle)' : 'none', cursor: 'pointer', transition: 'background 0.15s ease' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        onClick={() => {
                          setAgentToView(agent);
                          setNewAgentName(agent.name);
                          setNewAgentIntro('');
                          setNewAgentDesc(agent.description);
                          setEnabledToggle(agent.status === 'Active');
                          setViewOnlyMode(true);
                          setShowAddAgent(true);
                        }}
                      >
                        <td style={{ padding: '13px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: agent.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <IconComp size={18} color={agent.iconColor} strokeWidth={2} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{agent.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '13px 16px', maxWidth: 300 }}>
                          <div style={{
                            fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                          }}>
                            {agent.description}
                          </div>
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{
                            display: 'inline-block', padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                            background: agent.status === 'Active' ? '#dcfce7' : '#fee2e2',
                            color: agent.status === 'Active' ? '#15803d' : '#ef4444'
                          }}>
                            {agent.status}
                          </span>
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{agent.lastUsed}</td>
                        <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                            <button
                              className="pdots"
                              onClick={(e) => { e.stopPropagation(); setOpenActionId(openActionId === agent.id ? null : agent.id); }}
                              style={{
                                padding: '8px', borderRadius: '50%', background: 'transparent', border: 'none',
                                color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}
                            >
                              <MoreVertical size={18} />
                            </button>

                            {openActionId === agent.id && (
                              <div style={{
                                position: 'absolute', right: '100%', top: 0, marginRight: 4,
                                background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: 4, zIndex: 50, minWidth: 140,
                                display: 'flex', flexDirection: 'column', textAlign: 'left'
                              }}>
                                <div onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionId(null);
                                  setAgentToView(agent);
                                  setNewAgentName(agent.name);
                                  setNewAgentIntro('');
                                  setNewAgentDesc(agent.description);
                                  setEnabledToggle(agent.status === 'Active');
                                  setViewOnlyMode(false);
                                  setShowAddAgent(true);
                                }} className="pmenu-item" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer', borderRadius: 6 }}>
                                  <Pencil size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} /> Edit
                                </div>
                                <div onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionId(null);
                                  setShowDeleteConfirm(agent.id);
                                }} className="pmenu-item pmenu-danger" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--colors-red-500)', cursor: 'pointer', borderRadius: 6 }}>
                                  <Trash2 size={14} color="var(--colors-red-500)" style={{ flexShrink: 0 }} /> Delete
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{
            padding: '12px 16px', background: '#fff', borderTop: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '0 0 16px 16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>Rows per page:</span>
                <div ref={rppRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setOpenRpp(v => !v)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: openRpp ? 'var(--bg-surface-1)' : '#fff',
                      border: `1px solid ${openRpp ? '#7c7cff' : 'var(--border-default)'}`,
                      borderRadius: 8, padding: '7px 12px', fontSize: 12,
                      color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all .15s ease', whiteSpace: 'nowrap',
                    }}
                  >
                    {rowsPerPage}
                    <ChevronDown size={13} strokeWidth={2} style={{ transition: 'transform .15s ease', transform: openRpp ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </button>
                  {openRpp && (
                    <div style={{
                      position: 'absolute', bottom: 'calc(100% + 4px)', left: 0,
                      background: '#fff', border: '1px solid var(--border-default)',
                      borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      padding: 6, zIndex: 200, minWidth: 80,
                    }}>
                      {[5, 10, 25, 50, 100].map(n => (
                        <div
                          key={n}
                          onClick={() => { setRowsPerPage(n); setTablePage(1); setOpenRpp(false); }}
                          style={{
                            padding: '7px 12px', fontSize: 13, borderRadius: 6, cursor: 'pointer',
                            color: rowsPerPage === n ? '#0052cc' : 'var(--text-primary)',
                            fontWeight: rowsPerPage === n ? 600 : 400,
                            background: rowsPerPage === n ? 'rgba(0,82,204,0.06)' : 'transparent',
                            transition: 'background .12s ease',
                          }}
                          onMouseEnter={(e) => { if (rowsPerPage !== n) e.currentTarget.style.background = 'var(--bg-surface-2)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = rowsPerPage === n ? 'rgba(0,82,204,0.06)' : 'transparent'; }}
                        >
                          {n}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                Showing {totalRows === 0 ? 0 : (tablePage - 1) * rowsPerPage + 1}–{Math.min(tablePage * rowsPerPage, totalRows)} of {totalRows} agents
              </span>
            </div>

            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => setTablePage(p => p - 1)} disabled={tablePage === 1} style={{
                display: 'flex', alignItems: 'center', gap: 4, border: '1px solid var(--border-default)', borderRadius: 7,
                padding: '5px 12px', background: '#fff', color: 'var(--text-secondary)',
                fontSize: 12, cursor: tablePage === 1 ? 'default' : 'pointer', fontFamily: 'inherit',
                opacity: tablePage === 1 ? 0.4 : 1
              }}>
                <ChevronLeft size={14} strokeWidth={2} /> Previous
              </button>
              <button onClick={() => setTablePage(p => p + 1)} disabled={tablePage === totalPages || totalPages === 0} style={{
                display: 'flex', alignItems: 'center', gap: 4, border: '1px solid var(--border-default)', borderRadius: 7,
                padding: '5px 12px', background: '#fff', color: 'var(--text-secondary)',
                fontSize: 12, cursor: (tablePage === totalPages || totalPages === 0) ? 'default' : 'pointer', fontFamily: 'inherit',
                opacity: (tablePage === totalPages || totalPages === 0) ? 0.4 : 1
              }}>
                Next <ChevronRight size={14} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
            zIndex: 1000, pointerEvents: 'auto',
            background: '#f0fdf4', border: '1px solid rgba(34,197,94,0.25)', borderLeft: '4px solid #22c55e',
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

      </div>

      {/* Add Agent Slide-out Panel */}
      {showAddAgent && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'flex-end', animation: 'fadeIn 0.2s ease' }}>
          <div style={{ width: 500, background: '#fff', height: '100%', boxShadow: '-8px 0 24px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{viewOnlyMode ? 'Agent Details' : (agentToView ? 'Edit Agent' : 'Add Agent')}</h2>
              <button onClick={() => setShowAddAgent(false)} style={{ background: 'var(--bg-surface-2)', border: 'none', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
              <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
                <div style={{ width: 140 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Agent Icon</label>
                  <div style={{ position: 'relative', width: 100, height: 100, borderRadius: '50%', background: agentToView ? agentToView.color : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {agentToView ? (
                      <agentToView.icon size={40} color={agentToView.iconColor} strokeWidth={1.5} />
                    ) : (
                      <Bot size={40} color="#9ca3af" strokeWidth={1.5} />
                    )}
                    {!viewOnlyMode && (
                      <button style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: '#fff', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <Edit2 size={12} color="var(--text-secondary)" />
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Agent Name</label>
                    <input type="text" placeholder="Enter Agent Name" value={newAgentName} disabled={viewOnlyMode} onChange={e => setNewAgentName(e.target.value)} style={{ width: '100%', padding: '12px 14px', background: viewOnlyMode ? 'var(--bg-surface-1)' : '#fff', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, outline: 'none', color: 'var(--text-primary)', transition: 'border-color 0.15s ease' }} onFocus={e => !viewOnlyMode && (e.currentTarget.style.borderColor = '#7c7cff')} onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Agent Intro (4-5 words only)</label>
                    <input type="text" placeholder="Enter Agent Intro" value={newAgentIntro} disabled={viewOnlyMode} onChange={e => setNewAgentIntro(e.target.value)} style={{ width: '100%', padding: '12px 14px', background: viewOnlyMode ? 'var(--bg-surface-1)' : '#fff', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, outline: 'none', color: 'var(--text-primary)', transition: 'border-color 0.15s ease' }} onFocus={e => !viewOnlyMode && (e.currentTarget.style.borderColor = '#7c7cff')} onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Agent Enabled</label>
                <div onClick={() => !viewOnlyMode && setEnabledToggle(!enabledToggle)} style={{ width: 36, height: 20, borderRadius: 10, background: enabledToggle ? '#0052cc' : '#e5e7eb', position: 'relative', cursor: viewOnlyMode ? 'default' : 'pointer', transition: 'background 0.2s ease', opacity: viewOnlyMode ? 0.7 : 1 }}>
                  <div style={{ position: 'absolute', top: 2, left: enabledToggle ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s ease', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Description</label>
                <textarea placeholder="Enter" value={newAgentDesc} onChange={e => setNewAgentDesc(e.target.value)} disabled={viewOnlyMode} style={{ width: '100%', padding: '14px', background: viewOnlyMode ? 'var(--bg-surface-1)' : '#fff', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, outline: 'none', resize: 'none', minHeight: 120, fontFamily: 'inherit', color: 'var(--text-primary)', transition: 'border-color 0.15s ease' }} onFocus={e => !viewOnlyMode && (e.currentTarget.style.borderColor = '#7c7cff')} onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Instructions</label>
                <textarea placeholder="Enter" value={newAgentInstr} onChange={e => setNewAgentInstr(e.target.value)} disabled={viewOnlyMode} style={{ width: '100%', padding: '14px', background: viewOnlyMode ? 'var(--bg-surface-1)' : '#fff', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, outline: 'none', resize: 'none', minHeight: 120, fontFamily: 'inherit', color: 'var(--text-primary)', transition: 'border-color 0.15s ease' }} onFocus={e => !viewOnlyMode && (e.currentTarget.style.borderColor = '#7c7cff')} onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'} />
              </div>
            </div>

            <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 16 }}>
              {viewOnlyMode ? (
                <>
                  <button onClick={() => setViewOnlyMode(false)} style={{ flex: 1, padding: '0 16px', height: 42, background: '#0052cc', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'box-shadow 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,82,204,0.3)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>Edit</button>
                  <button onClick={() => setShowAddAgent(false)} style={{ flex: 1, padding: '0 16px', height: 42, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSaveAgent}
                    disabled={!newAgentName.trim() && !newAgentIntro.trim()}
                    style={{ flex: 1, padding: '0 16px', height: 42, background: (!newAgentName.trim() && !newAgentIntro.trim()) ? 'var(--bg-surface-2)' : '#0052cc', border: 'none', borderRadius: 8, color: (!newAgentName.trim() && !newAgentIntro.trim()) ? 'var(--text-tertiary)' : '#fff', fontSize: 14, fontWeight: 600, cursor: (!newAgentName.trim() && !newAgentIntro.trim()) ? 'default' : 'pointer', transition: 'box-shadow 0.15s ease' }}
                    onMouseEnter={e => { if (newAgentName.trim() || newAgentIntro.trim()) e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,82,204,0.3)' }}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    Save
                  </button>
                  <button onClick={() => setShowAddAgent(false)} style={{ flex: 1, padding: '0 16px', height: 42, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease' }}>
          <div style={{ width: 400, background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.15)', textAlign: 'center', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px 0' }}>Delete Agent</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 8px 0', lineHeight: 1.5 }}>Are you sure you want to delete this agent?</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', margin: '0 0 28px 0' }}>Action performed is irreversable.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowDeleteConfirm(null)} style={{ flex: 1, padding: '0 16px', height: 42, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => {
                setAgents(agents.filter(a => a.id !== showDeleteConfirm));
                setShowDeleteConfirm(null);
                showToast('Agent deleted successfully');
              }} style={{ flex: 1, padding: '0 16px', height: 42, background: '#ef4444', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -800px 0; }
          100% { background-position: 800px 0; }
        }
        .skeleton-box {
          animation: shimmer 1.5s infinite linear;
          background: linear-gradient(to right, #f0f0f0 4%, #fafafa 25%, #f0f0f0 36%);
          background-size: 800px 100%;
        }
        .action-item {
          padding: 8px 12px; font-size: 13px; font-weight: 500; color: var(--text-secondary); cursor: pointer; border-radius: 6px; display: flex; align-items: center; gap: 8px; transition: all 0.15s ease;
        }
        .action-item:hover {
          background: var(--bg-surface-2); color: var(--text-primary);
        }
        .action-item.text-danger:hover {
          background: #fef2f2; color: #ef4444;
        }
      `}</style>
    </MainLayout>
  );
}
