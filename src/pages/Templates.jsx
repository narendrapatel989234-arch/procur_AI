import React, { useState, useEffect, useRef, useCallback } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import {
  Search, ChevronDown, ChevronUp, ArrowUpDown,
  ChevronLeft, ChevronRight, X, Upload, Pencil,
  Archive, Trash2, Eye, CheckCircle, Clock, FileText,
  Layers, Send, Plus, MoreVertical
} from 'lucide-react';

const TEMPLATE_ROWS = [
  { id: 'TPL-001', name: 'IT Hardware Procurement Standard', type: 'Purchase Requisition', category: 'Custom App', version: 'v2.3', status: 'Published', owner: 'David Kim', modified: '01-Jun-2026 10:30' },
  { id: 'TPL-002', name: 'SaaS License Agreement Template', type: 'Purchase Order', category: 'Data', version: 'v1.1', status: 'Published', owner: 'Sarah Chen', modified: '30-May-2026 14:20' },
  { id: 'TPL-003', name: 'Consulting Services RFP', type: 'RFP', category: 'AI', version: 'v3.0', status: 'Published', owner: 'David Kim', modified: '29-May-2026 09:15' },
  { id: 'TPL-004', name: 'Office Supplies Routine Order', type: 'Purchase Requisition', category: 'Low-Code', version: 'v1.0', status: 'Draft', owner: 'Mike Ross', modified: '28-May-2026 16:45' },
  { id: 'TPL-005', name: 'Cloud Infrastructure RFQ', type: 'RFP', category: 'AI', version: 'v2.1', status: 'Published', owner: 'Sarah Chen', modified: '27-May-2026 11:00' },
  { id: 'TPL-006', name: 'Marketing Agency Evaluation', type: 'Proposal', category: 'Custom App', version: 'v1.4', status: 'Draft', owner: 'David Kim', modified: '26-May-2026 08:30' },
  { id: 'TPL-007', name: 'Legal Services Procurement', type: 'SOW', category: 'Data', version: 'v2.0', status: 'Archived', owner: 'Mike Ross', modified: '25-May-2026 13:20' },
  { id: 'TPL-008', name: 'Construction & Facilities RFP', type: 'RFP', category: 'Low-Code', version: 'v1.2', status: 'Published', owner: 'Sarah Chen', modified: '24-May-2026 10:10' },
  { id: 'TPL-009', name: 'Data Analytics Platform RFQ', type: 'RFP', category: 'AI', version: 'v1.0', status: 'Draft', owner: 'David Kim', modified: '23-May-2026 15:55' },
  { id: 'TPL-010', name: 'HR Onboarding Supplies Template', type: 'Purchase Requisition', category: 'Low-Code', version: 'v3.1', status: 'Published', owner: 'Mike Ross', modified: '22-May-2026 09:00' },
  { id: 'TPL-011', name: 'Security Audit Services RFP', type: 'RFP', category: 'Custom App', version: 'v1.0', status: 'Archived', owner: 'Sarah Chen', modified: '21-May-2026 14:30' },
  { id: 'TPL-012', name: 'ERP System Upgrade Evaluation', type: 'Proposal', category: 'AI', version: 'v2.2', status: 'Published', owner: 'David Kim', modified: '20-May-2026 11:15' },
  { id: 'TPL-013', name: 'Fleet Management Procurement', type: 'Purchase Order', category: 'Data', version: 'v1.3', status: 'Draft', owner: 'Mike Ross', modified: '19-May-2026 08:45' },
  { id: 'TPL-014', name: 'Training & Development RFP', type: 'RFP', category: 'Low-Code', version: 'v1.1', status: 'Published', owner: 'Sarah Chen', modified: '18-May-2026 16:00' },
  { id: 'TPL-015', name: 'Telecom Services Renewal Template', type: 'SOW', category: 'Custom App', version: 'v2.0', status: 'Archived', owner: 'David Kim', modified: '17-May-2026 10:30' },
];

const STATUS_STYLES = {
  'Published': { background: '#f0fdf4', color: '#15803d' },
  'Draft': { background: '#f5f5f5', color: '#888888' },
  'Archived': { background: '#fff1f2', color: '#be123c' },
};

const CATEGORY_STYLES = {
  'AI': { background: 'rgba(124,124,255,0.08)', color: '#5b5bd6' },
  'Data': { background: 'rgba(0,82,204,0.08)', color: '#0052cc' },
  'Low-Code': { background: 'rgba(34,197,94,0.08)', color: '#15803d' },
  'Custom App': { background: 'rgba(245,158,11,0.08)', color: '#b45309' },
};

const FILTER_OPTIONS = {
  'Template Type': ['Purchase Requisition', 'RFP', 'Proposal', 'SOW', 'Purchase Order'],
  'Category': ['AI', 'Data', 'Low-Code', 'Custom App'],
  'Status': ['Draft', 'Published', 'Archived'],
  'Owner': ['David Kim', 'Sarah Chen', 'Mike Ross'],
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
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 12px', fontSize: 13, borderRadius: 6,
                cursor: 'pointer',
                color: isSelected(opt) ? '#0052cc' : 'var(--text-primary)',
                fontWeight: isSelected(opt) ? 600 : 400,
                background: isSelected(opt) ? 'rgba(0,82,204,0.06)' : 'transparent',
                transition: 'background .12s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-surface-2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = isSelected(opt) ? 'rgba(0,82,204,0.06)' : 'transparent'; }}
              onClick={() => {
                onSelect(label, opt);
                if (!isMulti) onClose();
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

export default function Templates({ setCurrentPage, onNavigate, activeNav, userRole }) {
  const [tableSearch, setTableSearch] = useState('');
  const [tableSearchFocused, setTableSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [displayedRows, setDisplayedRows] = useState([]);

  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState(null); // 'asc' | 'desc'

  const [tablePage, setTablePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openRpp, setOpenRpp] = useState(false);
  const rppRef = useRef(null);

  const [openFilter, setOpenFilter] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    'Template Type': [],
    'Category': [],
    'Status': [],
    'Owner': []
  });

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [tableScrollable, setTableScrollable] = useState(false);
  const tableScrollRef = useRef(null);

  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState('');
  const [templateTypeOpen, setTemplateTypeOpen] = useState(false);
  const [templateCategory, setTemplateCategory] = useState('');
  const [templateCategoryOpen, setTemplateCategoryOpen] = useState(false);
  const [templateSubcategory, setTemplateSubcategory] = useState('');
  const [templateSubcategoryOpen, setTemplateSubcategoryOpen] = useState(false);
  const [templateDesc, setTemplateDesc] = useState('');
  const [templateFile, setTemplateFile] = useState(null);
  const [templateFileDrag, setTemplateFileDrag] = useState(false);

  const templateTypeRef = useRef(null);
  const templateCategoryRef = useRef(null);
  const templateSubcategoryRef = useRef(null);

  // Click outside for dropdowns
  useEffect(() => {
    const handleDocClick = (e) => {
      if (!e.target.closest('.tptr') && !e.target.closest('.pmenu-item')) {
        setActiveDropdown(null);
      }
      if (templateTypeRef.current && !templateTypeRef.current.contains(e.target)) setTemplateTypeOpen(false);
      if (templateCategoryRef.current && !templateCategoryRef.current.contains(e.target)) setTemplateCategoryOpen(false);
      if (templateSubcategoryRef.current && !templateSubcategoryRef.current.contains(e.target)) setTemplateSubcategoryOpen(false);
    };
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  // Click outside for rows-per-page dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (rppRef.current && !rppRef.current.contains(event.target)) {
        setOpenRpp(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setActiveFilters({ 'Template Type': [], Category: [], Status: [], Owner: [] });
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

  // Search & Filter Effect
  useEffect(() => {
    setIsSearching(true);
    const hasSearch = tableSearch.trim().length > 0;
    const delay = hasSearch ? 600 : 150;
    const timeoutId = setTimeout(() => {
      let filtered = [...TEMPLATE_ROWS];

      // text search
      if (hasSearch) {
        const q = tableSearch.toLowerCase();
        filtered = filtered.filter(r =>
          r.id.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.owner.toLowerCase().includes(q)
        );
      }

      // template type filter
      if (activeFilters['Template Type'] && activeFilters['Template Type'].length > 0) {
        filtered = filtered.filter(r => activeFilters['Template Type'].includes(r.type));
      }

      // category filter
      if (activeFilters.Category.length > 0) {
        filtered = filtered.filter(r => activeFilters.Category.includes(r.category));
      }

      // status filter
      if (activeFilters.Status.length > 0) {
        filtered = filtered.filter(r => activeFilters.Status.includes(r.status));
      }

      // owner filter
      if (activeFilters.Owner.length > 0) {
        filtered = filtered.filter(r => activeFilters.Owner.includes(r.owner));
      }

      // sort
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
      setTablePage(1); // reset to page 1 on filter change
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [tableSearch, activeFilters, sortCol, sortDir]);

  const totalRows = displayedRows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedRows = displayedRows.slice((tablePage - 1) * rowsPerPage, tablePage * rowsPerPage);

  const css = `
    @keyframes shimmer {
      0% { background-position: -800px 0; }
      100% { background-position: 800px 0; }
    }
    .skeleton-box {
      animation: shimmer 1.5s infinite linear;
      background: linear-gradient(to right, #f0f0f0 4%, #fafafa 25%, #f0f0f0 36%);
      background-size: 800px 100%;
      border-radius: 4px;
    }
    .tptr { transition: background 0.12s ease; }
    .tptr:hover { background: var(--bg-surface-1) !important; }
    .tab-btn:hover { color: var(--text-primary) !important; }
    .pmenu-item { transition: background 0.1s ease; }
    .pmenu-item:hover { background: var(--bg-surface-2) !important; }
    .pmenu-danger:hover { background: var(--status-error-bg) !important; }
    .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scroll::-webkit-scrollbar-track { background: #eeeeee; border-radius: 4px; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #666666; border-radius: 4px; }
  `;

  const anyFilterActive = activeFilters.Category.length > 0 || activeFilters.Status.length > 0 || activeFilters.Owner.length > 0 || tableSearch.length > 0;

  const handleUploadSubmit = () => {
    if (!templateName || !templateFile) return;
    // mock submit
    setShowUploadModal(false);
    setTemplateName('');
    setTemplateType('');
    setTemplateCategory('');
    setTemplateSubcategory('');
    setTemplateDesc('');
    setTemplateFile(null);
  };

  const TemplateDrop = ({ refEl, open, onToggle, value, placeholder, options, onChange }) => (
    <div ref={refEl} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        style={{
          width: '100%', padding: '9px 12px', boxSizing: 'border-box',
          border: `1px solid ${open ? '#7c7cff' : 'var(--border-default)'}`,
          borderRadius: 8, fontSize: 14, cursor: 'pointer',
          background: '#fff', fontFamily: 'inherit', outline: 'none',
          color: value ? 'var(--text-primary)' : 'var(--text-tertiary)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: open ? '0 0 0 3px rgba(124,124,255,0.1)' : 'none',
          transition: 'all .15s ease',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>{value || placeholder}</span>
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
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <MainLayout
      activeNav={activeNav}
      onNavigate={onNavigate}
      userRole={userRole}
      titleComponent={<span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Templates</span>}
      searchPlaceholder={null}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="custom-scrollbar" style={{ padding: 24, background: 'var(--bg-default)', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* TOP BAR & FILTERS */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, background: tableSearchFocused ? 'var(--bg-surface-1)' : '#fff',
            border: `1px solid ${tableSearchFocused ? '#7c7cff' : 'var(--border-default)'}`,
            borderRadius: 8, padding: '0 12px', height: 36, width: 260, transition: 'all 0.15s ease',
            boxShadow: tableSearchFocused ? '0 0 0 3px rgba(124,124,255,0.1)' : 'none'
          }}>
            <Search size={14} color="var(--text-tertiary)" />
            <input
              type="text" placeholder="Search templates..."
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
          <button onClick={() => setShowUploadModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 8, border: 'none', background: '#0052cc', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'inherit', boxShadow: '0 3px 12px rgba(0,82,204,0.25)' }} onMouseEnter={e => e.currentTarget.style.background = '#0041a3'} onMouseLeave={e => e.currentTarget.style.background = '#0052cc'}>
            <Upload size={14} /> Upload Template
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
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 1000 }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-subtle)' }}>
                  {[
                    { label: 'Template ID', key: 'id', width: 100 },
                    { label: 'Name', key: 'name', width: 240 },
                    { label: 'Template Type', key: 'type', width: 150 },
                    { label: 'Category', key: 'category', width: 130 },
                    { label: 'Version', key: 'version', width: 90 },
                    { label: 'Status', key: 'status', width: 110 },
                    { label: 'Owner', key: 'owner', width: 130 },
                    { label: 'Last Modified', key: 'modified', width: 150 },
                    { label: 'Actions', key: null, width: 120 }
                  ].map((col, idx) => (
                    <th key={idx} onClick={() => col.key && handleSort(col.key)} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', cursor: col.key ? 'pointer' : 'default', width: col.width, userSelect: 'none' }}>
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
                  <td colSpan={10} style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 8, background: 'linear-gradient(to right, rgba(0,0,0,0.03), transparent)', pointerEvents: 'none', border: 'none', padding: 0 }} />
                )}
                {isSearching ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      {Array.from({ length: 9 }).map((_, j) => (
                        <td key={j} style={{ padding: '16px 20px' }}>
                          <div className="skeleton-box" style={{ height: 16, width: j === 1 ? '80%' : '60%' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 14 }}>
                      No templates found matching your search.
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row, idx) => {
                    const statusStyle = STATUS_STYLES[row.status] || STATUS_STYLES['Draft'];
                    const catStyle = CATEGORY_STYLES[row.category] || CATEGORY_STYLES['AI'];
                    return (
                      <tr key={row.id} className="tptr" onClick={() => onNavigate('templatedetail')} style={{ borderBottom: idx < paginatedRows.length - 1 ? '1px solid var(--border-subtle)' : 'none', cursor: 'pointer' }}>
                        <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{row.id}</td>
                        <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>{row.name}</td>
                        <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>{row.type}</td>
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: catStyle.background, color: catStyle.color }}>{row.category}</span>
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>{row.version}</td>
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: statusStyle.background, color: statusStyle.color }}>{row.status}</span>
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>{row.owner}</td>
                        <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>{row.modified}</td>
                        <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                          <div style={{ position: 'relative', display: 'inline-flex' }}>
                            <button
                              onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === row.id ? null : row.id); }}
                              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '4px', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface-2)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                            >
                              <MoreVertical size={16} />
                            </button>
                            {activeDropdown === row.id && (
                              <div style={{ position: 'absolute', right: '100%', top: 0, marginRight: 8, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: 4, zIndex: 50, minWidth: 140, display: 'flex', flexDirection: 'column', textAlign: 'left' }} onClick={e => e.stopPropagation()}>
                                <div className="pmenu-item" onClick={() => setActiveDropdown(null)} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer', borderRadius: 6 }}>
                                  <Pencil size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} /> Edit
                                </div>
                                <div className="pmenu-item" onClick={() => setActiveDropdown(null)} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer', borderRadius: 6 }}>
                                  <Archive size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} /> Archive
                                </div>
                                <div className="pmenu-item pmenu-danger" onClick={() => setActiveDropdown(null)} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--colors-red-500)', cursor: 'pointer', borderRadius: 6 }}>
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

          {/* PAGINATION */}
          <div style={{ padding: '12px 16px', background: '#fff', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            {/* Left: rows-per-page dropdown + count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>Rows per page:</span>
                <div ref={rppRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setOpenRpp(v => !v)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: openRpp ? 'var(--bg-surface-1)' : '#fff', border: `1px solid ${openRpp ? '#7c7cff' : 'var(--border-default)'}`, borderRadius: 8, padding: '7px 12px', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s ease', whiteSpace: 'nowrap' }}
                  >
                    {rowsPerPage}
                    <ChevronDown size={13} strokeWidth={2} style={{ transition: 'transform .15s ease', transform: openRpp ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </button>
                  {openRpp && (
                    <div style={{ position: 'absolute', bottom: 'calc(100% + 4px)', left: 0, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: 6, zIndex: 200, minWidth: 80 }}>
                      {[5, 10, 25, 50, 100].map(n => (
                        <div key={n} onClick={() => { setRowsPerPage(n); setTablePage(1); setOpenRpp(false); }}
                          style={{ padding: '7px 12px', fontSize: 13, borderRadius: 6, cursor: 'pointer', color: rowsPerPage === n ? '#0052cc' : 'var(--text-primary)', fontWeight: rowsPerPage === n ? 600 : 400, background: rowsPerPage === n ? 'rgba(0,82,204,0.06)' : 'transparent', transition: 'background .12s ease' }}
                          onMouseEnter={e => { if (rowsPerPage !== n) e.currentTarget.style.background = 'var(--bg-surface-2)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = rowsPerPage === n ? 'rgba(0,82,204,0.06)' : 'transparent'; }}>
                          {n}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                Showing {totalRows === 0 ? 0 : (tablePage - 1) * rowsPerPage + 1}–{Math.min(tablePage * rowsPerPage, totalRows)} of {totalRows} templates
              </span>
            </div>

            {/* Right: Previous / Next */}
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => setTablePage(p => p - 1)} disabled={tablePage === 1}
                style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1px solid var(--border-default)', borderRadius: 7, padding: '5px 12px', background: '#fff', color: 'var(--text-secondary)', fontSize: 12, cursor: tablePage === 1 ? 'default' : 'pointer', fontFamily: 'inherit', opacity: tablePage === 1 ? 0.4 : 1, transition: 'all .12s ease' }}
                onMouseEnter={e => { if (tablePage !== 1) e.currentTarget.style.background = 'var(--bg-surface-2)'; }}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                <ChevronLeft size={14} strokeWidth={2} /> Previous
              </button>
              <button onClick={() => setTablePage(p => p + 1)} disabled={tablePage === totalPages || totalPages === 0}
                style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1px solid var(--border-default)', borderRadius: 7, padding: '5px 12px', background: '#fff', color: 'var(--text-secondary)', fontSize: 12, cursor: (tablePage === totalPages || totalPages === 0) ? 'default' : 'pointer', fontFamily: 'inherit', opacity: (tablePage === totalPages || totalPages === 0) ? 0.4 : 1, transition: 'all .12s ease' }}
                onMouseEnter={e => { if (tablePage !== totalPages && totalPages !== 0) e.currentTarget.style.background = 'var(--bg-surface-2)'; }}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                Next <ChevronRight size={14} strokeWidth={2} />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* UPLOAD TEMPLATE MODAL */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowUploadModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 520, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>

            <div style={{ padding: '32px 32px 20px', flexShrink: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Upload Template</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Add a new procurement template to the library.</div>
              </div>
              <button onClick={() => setShowUploadModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 4 }}><X size={18} /></button>
            </div>

            <div className="custom-scrollbar" style={{ padding: '24px 32px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>Template Name <span style={{ color: '#dc2626' }}>*</span></div>
                <input
                  type="text"
                  placeholder="Enter template name"
                  value={templateName}
                  onChange={e => setTemplateName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit', outline: 'none', transition: 'all 0.15s ease', background: '#fff' }}
                  onFocus={e => { e.target.style.borderColor = '#7c7cff'; e.target.style.boxShadow = '0 0 0 3px rgba(124,124,255,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>Template Type <span style={{ color: '#dc2626' }}>*</span></div>
                  <TemplateDrop
                    refEl={templateTypeRef}
                    open={templateTypeOpen}
                    onToggle={() => setTemplateTypeOpen(!templateTypeOpen)}
                    value={templateType}
                    placeholder="Select template type"
                    options={['Purchase Requisition', 'RFP', 'Proposal', 'SOW', 'Purchase Order']}
                    onChange={setTemplateType}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>Category <span style={{ color: '#dc2626' }}>*</span></div>
                  <TemplateDrop
                    refEl={templateCategoryRef}
                    open={templateCategoryOpen}
                    onToggle={() => setTemplateCategoryOpen(!templateCategoryOpen)}
                    value={templateCategory}
                    placeholder="Select category"
                    options={['AI', 'Data', 'Low-Code', 'Custom App']}
                    onChange={setTemplateCategory}
                  />
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>Subcategory <span style={{ color: '#dc2626' }}>*</span></div>
                <TemplateDrop
                  refEl={templateSubcategoryRef}
                  open={templateSubcategoryOpen}
                  onToggle={() => setTemplateSubcategoryOpen(!templateSubcategoryOpen)}
                  value={templateSubcategory}
                  placeholder="Select subcategory"
                  options={['Land & Development', 'Construction & Infrastructure', 'Facilities Management', 'Property Management']}
                  onChange={setTemplateSubcategory}
                />
              </div>

              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>Description <span style={{ color: '#dc2626' }}>*</span></div>
                <textarea
                  value={templateDesc}
                  onChange={e => setTemplateDesc(e.target.value)}
                  placeholder="Briefly describe this template's use case"
                  style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit', outline: 'none', transition: 'all 0.15s ease', minHeight: 80, resize: 'vertical', background: '#fff' }}
                  onFocus={e => { e.target.style.borderColor = '#7c7cff'; e.target.style.boxShadow = '0 0 0 3px rgba(124,124,255,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>Template File <span style={{ color: '#dc2626' }}>*</span></div>
                <div
                  onDragOver={e => { e.preventDefault(); setTemplateFileDrag(true); }}
                  onDragLeave={() => setTemplateFileDrag(false)}
                  onDrop={e => { e.preventDefault(); setTemplateFileDrag(false); const f = e.dataTransfer.files[0]; if (f) setTemplateFile(f); }}
                  onClick={() => document.getElementById('template-file-input').click()}
                  style={{ border: `2px dashed ${templateFileDrag ? '#7c7cff' : templateFile ? '#22c55e' : 'var(--border-default)'}`, borderRadius: 10, padding: '28px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', background: templateFileDrag ? 'rgba(124,124,255,0.04)' : templateFile ? 'rgba(34,197,94,0.03)' : '#fafafa', transition: 'all 0.15s ease' }}
                  onMouseEnter={e => { if (!templateFile) e.currentTarget.style.borderColor = '#7c7cff'; }}
                  onMouseLeave={e => { if (!templateFileDrag && !templateFile) e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: templateFile ? 'rgba(34,197,94,0.1)' : 'rgba(124,124,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {templateFile ? <CheckCircle size={16} color="#22c55e" strokeWidth={2} /> : <Upload size={16} color="#7c7cff" strokeWidth={2} />}
                  </div>
                  {templateFile ? (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>{templateFile.name}</div>
                      <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>Click to replace</div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>Drop file here or <span style={{ color: '#7c7cff', fontWeight: 600 }}>browse</span></div>
                      <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>PDF, DOCX A Max 25MB</div>
                    </div>
                  )}
                </div>
                <input id="template-file-input" type="file" accept=".pdf,.docx" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) setTemplateFile(e.target.files[0]); }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                <button onClick={() => setShowUploadModal(false)} style={{ padding: '9px 16px', border: '1px solid var(--border-default)', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)', fontFamily: 'inherit' }}>Cancel</button>
                <button
                  onClick={handleUploadSubmit}
                  disabled={!(templateName && templateType && templateCategory && templateSubcategory && templateDesc && templateFile)}
                  style={{ padding: '9px 16px', border: 'none', borderRadius: 8, background: !(templateName && templateType && templateCategory && templateSubcategory && templateDesc && templateFile) ? 'var(--bg-surface-2)' : '#0052cc', fontSize: 13, fontWeight: 600, cursor: !(templateName && templateType && templateCategory && templateSubcategory && templateDesc && templateFile) ? 'not-allowed' : 'pointer', color: !(templateName && templateType && templateCategory && templateSubcategory && templateDesc && templateFile) ? 'var(--text-tertiary)' : '#fff', fontFamily: 'inherit' }}
                >
                  Upload
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </MainLayout>
  );
}
