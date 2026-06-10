import React, { useState, useEffect, useRef, useCallback } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import {
  Search, ChevronDown, ChevronUp, ArrowUpDown,
  X, Plus, FileText, Pencil, Trash2, MoreVertical, AlertTriangle, CheckCircle
} from 'lucide-react';

const INITIAL_CLAUSE_ROWS = [
  { id: 'CLS-101', name: 'Standard Payment Terms 30 Days', type: 'Payment Terms', geography: 'Global', risk: 'Low', version: 'v1.2', description: 'This clause outlines the standard payment terms for all vendors, specifying a net 30-day payment cycle from the date of invoice receipt. It includes penalties for late payments and details the required format for invoice submissions to ensure timely processing and compliance with internal financial policies.' },
  { id: 'CLS-102', name: 'Limitation of Liability Capped', type: 'Liability', geography: 'North America', risk: 'Medium', version: 'v2.0', description: 'Sets a cap on the maximum liability exposure for the company in the event of a breach of contract or negligence. The cap is generally tied to the total contract value or a fixed amount, excluding cases of gross negligence, willful misconduct, or breaches of confidentiality obligations.' },
  { id: 'CLS-103', name: 'Software Warranty 90 Days', type: 'Warranty', geography: 'Global', risk: 'Low', version: 'v1.1', description: 'Provides a standard 90-day warranty period for all customized software deliverables. During this period, the vendor is obligated to fix any defects, bugs, or non-conformities at no additional cost. It also details the procedure for reporting issues and the expected response times.' },
  { id: 'CLS-104', name: 'Mutual Indemnification', type: 'Indemnity', geography: 'EMEA', risk: 'High', version: 'v3.1', description: 'A mutual indemnification clause where both parties agree to hold each other harmless against third-party claims arising from intellectual property infringement, bodily injury, or property damage caused by the indemnifying party’s negligence or willful misconduct.' },
  { id: 'CLS-105', name: 'Termination for Convenience 60 Days', type: 'Termination', geography: 'Global', risk: 'Medium', version: 'v1.0', description: 'Allows either party to terminate the agreement for any reason without cause by providing a 60-day written notice. It covers the rights and obligations of both parties upon termination, including the payment for services rendered up to the termination date and the return of confidential information.' },
  { id: 'CLS-106', name: 'Strict Confidentiality NDA', type: 'Confidentiality', geography: 'APAC', risk: 'High', version: 'v2.2', description: 'Defines what constitutes confidential information and imposes strict obligations on the receiving party to protect it. It specifies the duration of the confidentiality obligations, permitted disclosures (e.g., to legally compelled entities), and the consequences of a breach.' },
  { id: 'CLS-107', name: 'Extended Payment Terms 60 Days', type: 'Payment Terms', geography: 'EMEA', risk: 'Medium', version: 'v1.0', description: 'Similar to standard payment terms but extends the payment cycle to 60 days. Typically used for strategic vendors or specific regional requirements where extended credit periods are standard practice. Requires higher level approval before inclusion.' },
  { id: 'CLS-108', name: 'Unlimited Liability (Data Breach)', type: 'Liability', geography: 'Global', risk: 'High', version: 'v1.5', description: 'Specifies that liability is uncapped in cases involving a data breach or violation of data privacy regulations (like GDPR or CCPA). It mandates that the vendor assumes full financial responsibility for any damages, fines, and remediation costs resulting from such a breach.' },
];

const FILTER_OPTIONS = {
  'Clause type': ['Payment Terms', 'Liability', 'Warranty', 'Indemnity', 'Termination', 'Confidentiality'],
  'Geography': ['Global', 'North America', 'EMEA', 'APAC'],
  'Risk level': ['Low', 'Medium', 'High'],
};

const RISK_STYLES = {
  'Low': { background: '#f0fdf4', color: '#15803d' },
  'Medium': { background: '#fffbeb', color: '#b45309' },
  'High': { background: '#fef2f2', color: '#b91c1c' },
};

function CustomSelect({ label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: '12px 14px', background: '#fff',
          border: `1px solid ${isOpen ? '#7c7cff' : 'var(--border-default)'}`,
          borderRadius: 8, fontSize: 14, outline: 'none',
          color: value ? 'var(--text-primary)' : 'var(--text-tertiary)',
          cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.15s ease'
        }}
      >
        {value || label}
        <ChevronDown size={14} color="var(--text-secondary)" style={{ transition: 'transform 0.15s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>
      {isOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: '#fff', border: '1px solid var(--border-default)',
          borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          padding: 6, zIndex: 100, maxHeight: 200, overflowY: 'auto'
        }}>
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className="pmenu-item"
              style={{
                padding: '8px 12px', fontSize: 13, borderRadius: 6, cursor: 'pointer',
                color: value === opt ? '#0052cc' : 'var(--text-primary)',
                fontWeight: value === opt ? 600 : 400,
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterDropdown({ label, options, isOpen, onToggle, onClose, activeOption, onSelect, isMulti }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  const selectedCount = isMulti && Array.isArray(activeOption) ? activeOption.length : 0;
  const isSelected = (opt) => isMulti ? activeOption?.includes(opt) : activeOption === opt;
  const hasSelection = isMulti ? selectedCount > 0 : !!activeOption;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: isOpen || hasSelection ? 'var(--bg-surface-1)' : '#fff',
          border: `1px solid ${isOpen || hasSelection ? '#7c7cff' : 'var(--border-default)'}`,
          borderRadius: 8, padding: '0 12px', height: 36, fontSize: 12,
          color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit',
          transition: 'all .15s ease', whiteSpace: 'nowrap',
        }}
      >
        {isMulti ? (
          selectedCount === 0 ? label :
            selectedCount === 1 ? `${label}: ${activeOption[0]}` :
              `${label}: ${selectedCount} selected`
        ) : (
          activeOption ? `${label}: ${activeOption}` : label
        )}
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
              onClick={() => onSelect(label, opt)}
              className="pmenu-item"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 12px', fontSize: 13, borderRadius: 6,
                cursor: 'pointer',
                color: isSelected(opt) ? '#0052cc' : 'var(--text-primary)',
                fontWeight: isSelected(opt) ? 600 : 400,
              }}
            >
              {isMulti && (
                <div style={{
                  width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                  border: isSelected(opt) ? '1.5px solid #0052cc' : '1.5px solid var(--border-default)',
                  background: isSelected(opt) ? '#0052cc' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}>
                  {isSelected(opt) && <span style={{ color: '#fff', fontSize: 9, fontWeight: 700, lineHeight: 1 }}>✓</span>}
                </div>
              )}
              {opt}
            </div>
          ))}
          {isMulti && selectedCount > 0 && (
            <div
              onClick={() => { onSelect(label, 'CLEAR_ALL'); }}
              style={{
                padding: '6px 12px', fontSize: 11, color: '#ef4444',
                cursor: 'pointer', borderTop: '1px solid var(--border-subtle)',
                marginTop: 4, fontWeight: 600,
              }}
            >
              Clear all
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ClauseManagement({ setCurrentPage, onNavigate, activeNav, userRole }) {
  const [clauses, setClauses] = useState(INITIAL_CLAUSE_ROWS);
  const [showToaster, setShowToaster] = useState(false);
  const [toasterMsg, setToasterMsg] = useState('');

  const [tableSearch, setTableSearch] = useState('');
  const [tableSearchFocused, setTableSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [displayedRows, setDisplayedRows] = useState([]);

  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState(null); // 'asc' | 'desc'

  const [openFilter, setOpenFilter] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    'Clause type': [],
    'Geography': [],
    'Risk level': []
  });

  const [tableScrollable, setTableScrollable] = useState(false);
  const tableScrollRef = useRef(null);

  const [openActionId, setOpenActionId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showEditPane, setShowEditPane] = useState(false);
  const [showCreatePane, setShowCreatePane] = useState(false);
  
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [clauseToView, setClauseToView] = useState(null);

  const [editClauseNo, setEditClauseNo] = useState('');
  const [editClauseType, setEditClauseType] = useState('');
  const [editClauseDesc, setEditClauseDesc] = useState('');
  const [editClauseGeo, setEditClauseGeo] = useState('');
  const [editClauseRisk, setEditClauseRisk] = useState('');

  const [newClauseNo, setNewClauseNo] = useState('');
  const [newClauseType, setNewClauseType] = useState('');
  const [newClauseDesc, setNewClauseDesc] = useState('');
  const [newClauseGeo, setNewClauseGeo] = useState('');
  const [newClauseRisk, setNewClauseRisk] = useState('');

  useEffect(() => {
    if (!openActionId) return;
    const handleClick = () => setOpenActionId(null);
    setTimeout(() => document.addEventListener('click', handleClick), 0);
    return () => document.removeEventListener('click', handleClick);
  }, [openActionId]);

  const handleFilterSelect = (label, option) => {
    if (option === 'CLEAR_ALL') {
      setActiveFilters(prev => ({ ...prev, [label]: [] }));
      return;
    }
    setActiveFilters(prev => {
      const arr = prev[label];
      const nextArr = arr.includes(option) ? arr.filter(o => o !== option) : [...arr, option];
      return { ...prev, [label]: nextArr };
    });
  };

  const handleClearAllFilters = () => {
    setActiveFilters({ 'Clause type': [], 'Geography': [], 'Risk level': [] });
    setTableSearch('');
  };

  const handleSort = (colKey) => {
    if (sortCol === colKey) {
      if (sortDir === 'asc') setSortDir('desc');
      else if (sortDir === 'desc') { setSortCol(null); setSortDir(null); }
    } else {
      setSortCol(colKey);
      setSortDir('asc');
    }
  };

  const handleTableScroll = () => {
    if (tableScrollRef.current) {
      setTableScrollable(tableScrollRef.current.scrollLeft > 0);
    }
  };

  useEffect(() => {
    setIsSearching(true);
    const hasSearch = tableSearch.trim().length > 0;
    const delay = hasSearch ? 600 : 150;
    const timeoutId = setTimeout(() => {
      let filtered = [...clauses];

      if (hasSearch) {
        const q = tableSearch.toLowerCase();
        filtered = filtered.filter(r =>
          r.id.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
        );
      }

      if (activeFilters['Clause type'].length > 0) {
        filtered = filtered.filter(r => activeFilters['Clause type'].includes(r.type));
      }
      if (activeFilters['Geography'].length > 0) {
        filtered = filtered.filter(r => activeFilters['Geography'].includes(r.geography));
      }
      if (activeFilters['Risk level'].length > 0) {
        filtered = filtered.filter(r => activeFilters['Risk level'].includes(r.risk));
      }

      if (sortCol && sortDir) {
        filtered.sort((a, b) => {
          let valA = a[sortCol] || '';
          let valB = b[sortCol] || '';
          if (valA < valB) return sortDir === 'asc' ? -1 : 1;
          if (valA > valB) return sortDir === 'asc' ? 1 : -1;
          return 0;
        });
      }

      setDisplayedRows(filtered);
      setIsSearching(false);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [tableSearch, activeFilters, sortCol, sortDir, clauses]);

  const anyFilterActive = Object.values(activeFilters).some(arr => arr.length > 0) || tableSearch.trim().length > 0;

  const css = `
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    .skeleton-box {
      animation: shimmer 2s infinite linear;
      background: linear-gradient(to right, #f6f7f8 4%, #edeef1 25%, #f6f7f8 36%);
      background-size: 1000px 100%;
      border-radius: 4px;
    }
    .tptr { transition: background 0.15s ease; }
    .tptr:hover { background: var(--bg-surface-1); }
    .pmenu-item{transition:background 0.15s ease;}
    .pmenu-item:hover{background:var(--bg-surface-2);}
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    .pdots { transition: all 0.15s ease; }
    .pdots:hover { background: var(--bg-surface-2) !important; }
    .pmenu-danger:hover { background: var(--status-error-bg) !important; }
    @keyframes toastIn {
      from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `;

  return (
    <MainLayout
      activeNav={activeNav}
      onNavigate={onNavigate}
      userRole={userRole}
      titleComponent={<span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Clause Management</span>}
      searchPlaceholder={null}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div style={{ padding: 24, background: 'var(--bg-default)', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* FILTER BAR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, background: tableSearchFocused ? 'var(--bg-surface-1)' : '#fff',
              border: `1px solid ${tableSearchFocused ? '#7c7cff' : 'var(--border-default)'}`,
              borderRadius: 8, padding: '0 12px', height: 36, width: 260, transition: 'all 0.15s ease',
              boxShadow: tableSearchFocused ? '0 0 0 3px rgba(124,124,255,0.1)' : 'none'
            }}>
              <Search size={14} color="var(--text-tertiary)" />
              <input
                type="text" placeholder="Search clauses..."
                value={tableSearch} onChange={(e) => setTableSearch(e.target.value)}
                onFocus={() => setTableSearchFocused(true)} onBlur={() => setTableSearchFocused(false)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: 'var(--text-primary)', width: '100%', fontFamily: 'inherit' }}
              />
            </div>

            {Object.keys(FILTER_OPTIONS).map(label => (
              <FilterDropdown
                key={label}
                label={label}
                options={FILTER_OPTIONS[label]}
                isOpen={openFilter === label}
                onToggle={() => setOpenFilter(openFilter === label ? null : label)}
                onClose={() => setOpenFilter(null)}
                activeOption={activeFilters[label]}
                onSelect={handleFilterSelect}
                isMulti={true}
              />
            ))}

            {anyFilterActive && (
              <button
                onClick={handleClearAllFilters}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444',
                  border: 'none', borderRadius: 8, padding: '0 12px', height: 36,
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
              >
                <X size={13} strokeWidth={2.5} /> Clear filters
              </button>
            )}
          </div>

          <button onClick={() => {
            setNewClauseNo(''); setNewClauseType(''); setNewClauseDesc(''); setNewClauseGeo(''); setNewClauseRisk('');
            setShowCreatePane(true);
          }} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 8, border: 'none', background: '#0052cc', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'inherit', boxShadow: '0 3px 12px rgba(0,82,204,0.25)' }} onMouseEnter={e => e.currentTarget.style.background = '#0041a3'} onMouseLeave={e => e.currentTarget.style.background = '#0052cc'}>
            <Plus size={14} strokeWidth={2.5} /> Create Clause
          </button>
        </div>

        {/* TABLE CONTAINER */}
        <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
          <div
            className="table-scroll"
            ref={tableScrollRef}
            onScroll={handleTableScroll}
            style={{ width: '100%', overflowX: 'auto' }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 900 }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-subtle)' }}>
                  {[
                    { label: 'Clause No', key: 'id', width: 100 },
                    { label: 'Clause Type', key: 'type', width: 140 },
                    { label: 'Clause Description', key: 'name', width: 300 },
                    { label: 'Geography', key: 'geography', width: 120 },
                    { label: 'Risk level', key: 'risk', width: 120 },
                    { label: 'Version', key: 'version', width: 100 },
                    { label: 'Actions', key: null, width: 80 }
                  ].map((col, idx) => (
                    <th key={idx} onClick={() => col.key && handleSort(col.key)} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', cursor: col.key ? 'pointer' : 'default', width: col.width, userSelect: 'none', textAlign: col.label === 'Actions' ? 'center' : 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: col.label === 'Actions' ? 'center' : 'flex-start' }}>
                        {col.label}
                        {col.key && (
                          sortCol === col.key ? (
                            sortDir === 'asc' ? <ChevronUp size={12} color="#0052cc" /> : <ChevronDown size={12} color="#0052cc" />
                          ) : (
                            <ArrowUpDown size={12} style={{ opacity: 0.3 }} />
                          )
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ position: 'relative' }}>
                {tableScrollable && (
                  <td colSpan={7} style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 8, background: 'linear-gradient(to right, rgba(0,0,0,0.03), transparent)', pointerEvents: 'none', border: 'none', padding: 0 }} />
                )}
                {isSearching ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} style={{ padding: '16px 20px' }}>
                          <div className="skeleton-box" style={{ height: 16, width: j === 2 ? '80%' : '60%' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : displayedRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 14 }}>
                      No clauses found matching your search.
                    </td>
                  </tr>
                ) : (
                  displayedRows.map((row, idx) => {
                    const riskStyle = RISK_STYLES[row.risk] || RISK_STYLES['Low'];
                    return (
                      <tr key={row.id} className="tptr" style={{ borderBottom: idx < displayedRows.length - 1 ? '1px solid var(--border-subtle)' : 'none', cursor: 'pointer' }} onClick={() => {
                        setClauseToView(row);
                        setEditClauseNo(row.id);
                        setEditClauseType(row.type);
                        setEditClauseDesc(row.description);
                        setEditClauseGeo(row.geography);
                        setEditClauseRisk(row.risk);
                        setIsViewOnly(true);
                        setShowEditPane(true);
                      }}>
                        <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                          {row.id}
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
                          {row.type}
                        </td>
                        <td style={{ padding: '13px 16px', maxWidth: 300 }}>
                          <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                            {row.description}
                          </div>
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>{row.geography}</td>
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: riskStyle.background, color: riskStyle.color }}>{row.risk}</span>
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>{row.version}</td>
                        <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                            <button
                              className="pdots"
                              onClick={(e) => { e.stopPropagation(); setOpenActionId(openActionId === row.id ? null : row.id); }}
                              style={{
                                padding: '8px', borderRadius: '50%', background: 'transparent', border: 'none',
                                color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}
                            >
                              <MoreVertical size={18} />
                            </button>

                            {openActionId === row.id && (
                              <div style={{
                                position: 'absolute', right: '100%', top: 0, marginRight: 4,
                                background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: 4, zIndex: 50, minWidth: 140,
                                display: 'flex', flexDirection: 'column', textAlign: 'left'
                              }}>
                                <div onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionId(null);
                                  setClauseToView(row);
                                  setEditClauseNo(row.id);
                                  setEditClauseType(row.type);
                                  setEditClauseDesc(row.description);
                                  setEditClauseGeo(row.geography);
                                  setEditClauseRisk(row.risk);
                                  setIsViewOnly(false);
                                  setShowEditPane(true);
                                }} className="pmenu-item" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer', borderRadius: 6 }}>
                                  <Pencil size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} /> Edit
                                </div>
                                <div onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionId(null);
                                  setShowDeleteConfirm(row.id);
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
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease' }}>
          <div style={{ width: 400, background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.15)', textAlign: 'center', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px 0' }}>Delete Clause</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 8px 0', lineHeight: 1.5 }}>Are you sure you want to delete this clause?</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', margin: '0 0 28px 0' }}>Action performed is irreversable.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowDeleteConfirm(null)} style={{ flex: 1, padding: '0 16px', height: 42, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => {
                setShowDeleteConfirm(null);
              }} style={{ flex: 1, padding: '0 16px', height: 42, background: '#ef4444', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Pane */}
      {showCreatePane && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'flex-end', animation: 'fadeIn 0.2s ease' }}>
          <div style={{ width: 500, background: '#fff', height: '100%', boxShadow: '-8px 0 24px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Create Clause</h2>
              <button onClick={() => setShowCreatePane(false)} style={{ background: 'var(--bg-surface-2)', border: 'none', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={16} />
              </button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Clause No. <span style={{color: '#ef4444'}}>*</span></label>
                <input type="text" placeholder="e.g. CLS-109" value={newClauseNo} onChange={e => setNewClauseNo(e.target.value)} style={{ width: '100%', padding: '12px 14px', background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, outline: 'none', color: 'var(--text-primary)', transition: 'border-color 0.15s ease' }} onFocus={e => e.currentTarget.style.borderColor = '#7c7cff'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Clause type <span style={{color: '#ef4444'}}>*</span></label>
                <CustomSelect label="Select clause type" options={FILTER_OPTIONS['Clause type']} value={newClauseType} onChange={setNewClauseType} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Geography <span style={{color: '#ef4444'}}>*</span></label>
                <CustomSelect label="Select geography" options={FILTER_OPTIONS['Geography']} value={newClauseGeo} onChange={setNewClauseGeo} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Risk level <span style={{color: '#ef4444'}}>*</span></label>
                <CustomSelect label="Select risk level" options={FILTER_OPTIONS['Risk level']} value={newClauseRisk} onChange={setNewClauseRisk} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Clause description <span style={{color: '#ef4444'}}>*</span></label>
                <textarea placeholder="Enter description..." value={newClauseDesc} onChange={e => setNewClauseDesc(e.target.value)} style={{ width: '100%', padding: '14px', background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, outline: 'none', resize: 'none', minHeight: 120, fontFamily: 'inherit', color: 'var(--text-primary)', transition: 'border-color 0.15s ease' }} onFocus={e => e.currentTarget.style.borderColor = '#7c7cff'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'} />
              </div>
            </div>

            <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 16 }}>
              <button
                disabled={!(newClauseNo.trim() && newClauseType && newClauseDesc.trim() && newClauseGeo && newClauseRisk)}
                onClick={() => {
                  const newClause = {
                    id: newClauseNo.trim(),
                    name: 'New Clause',
                    type: newClauseType,
                    geography: newClauseGeo,
                    risk: newClauseRisk,
                    version: 'v1.0',
                    description: newClauseDesc.trim()
                  };
                  setClauses([newClause, ...clauses]);
                  setShowCreatePane(false);
                  
                  setToasterMsg('Clause created successfully');
                  setShowToaster(true);
                  setTimeout(() => setShowToaster(false), 3000);
                }}
                style={{ flex: 1, padding: '0 16px', height: 42, background: (newClauseNo.trim() && newClauseType && newClauseDesc.trim() && newClauseGeo && newClauseRisk) ? '#0052cc' : 'var(--bg-surface-2)', border: 'none', borderRadius: 8, color: (newClauseNo.trim() && newClauseType && newClauseDesc.trim() && newClauseGeo && newClauseRisk) ? '#fff' : 'var(--text-tertiary)', fontSize: 14, fontWeight: 600, cursor: (newClauseNo.trim() && newClauseType && newClauseDesc.trim() && newClauseGeo && newClauseRisk) ? 'pointer' : 'default', transition: 'box-shadow 0.15s ease' }}
                onMouseEnter={e => { if (newClauseNo.trim() && newClauseType && newClauseDesc.trim() && newClauseGeo && newClauseRisk) e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,82,204,0.3)' }}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                Create
              </button>
              <button onClick={() => setShowCreatePane(false)} style={{ flex: 1, padding: '0 16px', height: 42, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Pane */}
      {showEditPane && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'flex-end', animation: 'fadeIn 0.2s ease' }}>
          <div style={{ width: 500, background: '#fff', height: '100%', boxShadow: '-8px 0 24px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{isViewOnly ? 'Clause Details' : 'Edit Clause'}</h2>
              <button onClick={() => setShowEditPane(false)} style={{ background: 'var(--bg-surface-2)', border: 'none', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Clause No. {(!isViewOnly) && <span style={{color: '#ef4444'}}>*</span>}</label>
                <input type="text" value={editClauseNo} disabled={isViewOnly} onChange={e => setEditClauseNo(e.target.value)} style={{ width: '100%', padding: '12px 14px', background: isViewOnly ? 'var(--bg-surface-1)' : '#fff', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, outline: 'none', color: 'var(--text-primary)', transition: 'border-color 0.15s ease' }} onFocus={e => !isViewOnly && (e.currentTarget.style.borderColor = '#7c7cff')} onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Clause type {(!isViewOnly) && <span style={{color: '#ef4444'}}>*</span>}</label>
                {isViewOnly ? (
                  <input type="text" value={editClauseType} disabled style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, outline: 'none', color: 'var(--text-primary)' }} />
                ) : (
                  <CustomSelect label="Select clause type" options={FILTER_OPTIONS['Clause type']} value={editClauseType} onChange={setEditClauseType} />
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Geography {(!isViewOnly) && <span style={{color: '#ef4444'}}>*</span>}</label>
                {isViewOnly ? (
                  <input type="text" value={editClauseGeo} disabled style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, outline: 'none', color: 'var(--text-primary)' }} />
                ) : (
                  <CustomSelect label="Select geography" options={FILTER_OPTIONS['Geography']} value={editClauseGeo} onChange={setEditClauseGeo} />
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Risk level {(!isViewOnly) && <span style={{color: '#ef4444'}}>*</span>}</label>
                {isViewOnly ? (
                  <input type="text" value={editClauseRisk} disabled style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, outline: 'none', color: 'var(--text-primary)' }} />
                ) : (
                  <CustomSelect label="Select risk level" options={FILTER_OPTIONS['Risk level']} value={editClauseRisk} onChange={setEditClauseRisk} />
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Clause description {(!isViewOnly) && <span style={{color: '#ef4444'}}>*</span>}</label>
                <textarea value={editClauseDesc} disabled={isViewOnly} onChange={e => setEditClauseDesc(e.target.value)} style={{ width: '100%', padding: '14px', background: isViewOnly ? 'var(--bg-surface-1)' : '#fff', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, outline: 'none', resize: 'none', minHeight: 120, fontFamily: 'inherit', color: 'var(--text-primary)', transition: 'border-color 0.15s ease' }} onFocus={e => !isViewOnly && (e.currentTarget.style.borderColor = '#7c7cff')} onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'} />
              </div>
            </div>

            <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 16 }}>
              {isViewOnly ? (
                <>
                  <button onClick={() => setIsViewOnly(false)} style={{ flex: 1, padding: '0 16px', height: 42, background: '#0052cc', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'box-shadow 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,82,204,0.3)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>Edit</button>
                  <button onClick={() => setShowEditPane(false)} style={{ flex: 1, padding: '0 16px', height: 42, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                </>
              ) : (
                <>
                  <button
                    disabled={!(editClauseNo.trim() && editClauseType && editClauseDesc.trim() && editClauseGeo && editClauseRisk)}
                    onClick={() => {
                      setClauses(prev => prev.map(c => c.id === clauseToView.id ? {
                        ...c,
                        id: editClauseNo.trim(),
                        type: editClauseType,
                        geography: editClauseGeo,
                        risk: editClauseRisk,
                        description: editClauseDesc.trim()
                      } : c));
                      setShowEditPane(false);
                      setToasterMsg('Changes have been saved');
                      setShowToaster(true);
                      setTimeout(() => setShowToaster(false), 3000);
                    }}
                    style={{ flex: 1, padding: '0 16px', height: 42, background: (editClauseNo.trim() && editClauseType && editClauseDesc.trim() && editClauseGeo && editClauseRisk) ? '#0052cc' : 'var(--bg-surface-2)', border: 'none', borderRadius: 8, color: (editClauseNo.trim() && editClauseType && editClauseDesc.trim() && editClauseGeo && editClauseRisk) ? '#fff' : 'var(--text-tertiary)', fontSize: 14, fontWeight: 600, cursor: (editClauseNo.trim() && editClauseType && editClauseDesc.trim() && editClauseGeo && editClauseRisk) ? 'pointer' : 'default', transition: 'box-shadow 0.15s ease' }}
                    onMouseEnter={e => { if (editClauseNo.trim() && editClauseType && editClauseDesc.trim() && editClauseGeo && editClauseRisk) e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,82,204,0.3)' }}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    Save
                  </button>
                  <button onClick={() => setShowEditPane(false)} style={{ flex: 1, padding: '0 16px', height: 42, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toaster */}
      {showToaster && (
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
            {toasterMsg}
          </div>
          <div
            onClick={() => setShowToaster(false)}
            style={{ padding: 4, borderRadius: 6, cursor: 'pointer', color: 'rgba(21,128,61,0.5)', display: 'flex', flexShrink: 0, transition: 'all 0.15s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#15803d'; e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(21,128,61,0.5)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <X size={18} strokeWidth={2} />
          </div>
        </div>
      )}

    </MainLayout>
  );
}

