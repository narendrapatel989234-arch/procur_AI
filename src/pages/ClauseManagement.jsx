import React, { useState, useEffect, useRef, useCallback } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import {
  Search, ChevronDown, ChevronUp, ArrowUpDown,
  X, Plus, FileText, Pen, Trash2
} from 'lucide-react';

const CLAUSE_ROWS = [
  { id: 'CLS-101', name: 'Standard Payment Terms 30 Days', type: 'Payment Terms', geography: 'Global', risk: 'Low', version: 'v1.2' },
  { id: 'CLS-102', name: 'Limitation of Liability Capped', type: 'Liability', geography: 'North America', risk: 'Medium', version: 'v2.0' },
  { id: 'CLS-103', name: 'Software Warranty 90 Days', type: 'Warranty', geography: 'Global', risk: 'Low', version: 'v1.1' },
  { id: 'CLS-104', name: 'Mutual Indemnification', type: 'Indemnity', geography: 'EMEA', risk: 'High', version: 'v3.1' },
  { id: 'CLS-105', name: 'Termination for Convenience 60 Days', type: 'Termination', geography: 'Global', risk: 'Medium', version: 'v1.0' },
  { id: 'CLS-106', name: 'Strict Confidentiality NDA', type: 'Confidentiality', geography: 'APAC', risk: 'High', version: 'v2.2' },
  { id: 'CLS-107', name: 'Extended Payment Terms 60 Days', type: 'Payment Terms', geography: 'EMEA', risk: 'Medium', version: 'v1.0' },
  { id: 'CLS-108', name: 'Unlimited Liability (Data Breach)', type: 'Liability', geography: 'Global', risk: 'High', version: 'v1.5' },
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
      let filtered = [...CLAUSE_ROWS];

      if (hasSearch) {
        const q = tableSearch.toLowerCase();
        filtered = filtered.filter(r =>
          r.id.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q)
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
  }, [tableSearch, activeFilters, sortCol, sortDir]);

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

          <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 8, border: 'none', background: '#0052cc', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'inherit', boxShadow: '0 3px 12px rgba(0,82,204,0.25)' }} onMouseEnter={e => e.currentTarget.style.background = '#0041a3'} onMouseLeave={e => e.currentTarget.style.background = '#0052cc'}>
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
                    { label: 'Clause', key: 'name', width: 300 },
                    { label: 'Clause type', key: 'type', width: 160 },
                    { label: 'Geography', key: 'geography', width: 120 },
                    { label: 'Risk level', key: 'risk', width: 120 },
                    { label: 'Version', key: 'version', width: 100 },
                    { label: 'Actions', key: null, width: 100 }
                  ].map((col, idx) => (
                    <th key={idx} onClick={() => col.key && handleSort(col.key)} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', cursor: col.key ? 'pointer' : 'default', width: col.width, userSelect: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
                  <td colSpan={6} style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 8, background: 'linear-gradient(to right, rgba(0,0,0,0.03), transparent)', pointerEvents: 'none', border: 'none', padding: 0 }} />
                )}
                {isSearching ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} style={{ padding: '16px 20px' }}>
                          <div className="skeleton-box" style={{ height: 16, width: j === 0 ? '80%' : '60%' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : displayedRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 14 }}>
                      No clauses found matching your search.
                    </td>
                  </tr>
                ) : (
                  displayedRows.map((row, idx) => {
                    const riskStyle = RISK_STYLES[row.risk] || RISK_STYLES['Low'];
                    return (
                      <tr key={row.id} className="tptr" style={{ borderBottom: idx < displayedRows.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                        <td style={{ padding: '13px 16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{row.name}</span>
                            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>{row.id}</span>
                          </div>
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{row.type}</td>
                        <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>{row.geography}</td>
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: riskStyle.background, color: riskStyle.color }}>{row.risk}</span>
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>{row.version}</td>
                        <td style={{ padding: '13px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, borderRadius: 6, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }} onMouseEnter={e => { e.currentTarget.style.color = '#0052cc'; e.currentTarget.style.background = 'rgba(0, 82, 204, 0.08)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}>
                              <Pen size={16} />
                            </button>
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, borderRadius: 6, color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220, 38, 38, 0.08)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                              <Trash2 size={16} />
                            </button>
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
    </MainLayout>
  );
}
