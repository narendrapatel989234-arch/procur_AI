import React, { useState, useEffect, useRef, useCallback } from 'react';

import {

  Search, ChevronDown, ChevronUp, ArrowUpDown,
  ChevronLeft, ChevronRight, Eye, Pencil, X, Trash2,
  Clock, CheckCircle, AlertTriangle,
  TrendingUp, TrendingDown, Zap, FileText, Layers,
} from 'lucide-react';

import MainLayout from '../layouts/MainLayout.jsx';



/* ═══════════════════════════════════════════════════════════

   STATIC DATA

   ═══════════════════════════════════════════════════════════ */



const KPIS = [

  { label: 'My Active Requests', value: '12', trend: '+2 this week', TrendIcon: TrendingUp, trendColor: '#22c55e', Icon: FileText, iconColor: '#0052cc', iconBg: 'rgba(0,82,204,0.07)' },

  { label: 'Pending My Action', value: '5', trend: 'Needs attention', TrendIcon: AlertTriangle, trendColor: '#f59e0b', Icon: Clock, iconColor: '#f59e0b', iconBg: 'rgba(245,158,11,0.07)' },

  { label: 'Approved This Month', value: '8', trend: '+3 vs last month', TrendIcon: TrendingUp, trendColor: '#22c55e', Icon: CheckCircle, iconColor: '#22c55e', iconBg: 'rgba(34,197,94,0.07)' },

  { label: 'Rejected / Returned', value: '2', trend: 'This month', TrendIcon: TrendingDown, trendColor: '#ef4444', Icon: X, iconColor: '#ef4444', iconBg: 'rgba(239,68,68,0.07)' },

  { label: 'Avg PR-to-PO Time', value: '6.2d', trend: '-0.8d improvement', TrendIcon: TrendingUp, trendColor: '#22c55e', Icon: Zap, iconColor: '#7c7cff', iconBg: 'rgba(124,124,255,0.07)' },

];



const STAGE_STYLES = {

  'Requisition': { background: '#e8f1fb', color: '#0052cc' },

  'RFQ / RFP': { background: '#ede9fe', color: '#6d28d9' },

  'Bid Evaluation': { background: '#fdf4ff', color: '#a21caf' },

  'Negotiation': { background: '#fff3e0', color: '#e65100' },

  'Award': { background: '#f0fdf4', color: '#15803d' },

  'Contract / SOW': { background: '#fff1f2', color: '#be123c' },

  'Purchase Order (PO)': { background: '#ecfdf5', color: '#065f46' },

  'Draft': { background: '#f5f5f5', color: '#888888' },

};



const ROWS = [

  { id: 'PR-2026-000', title: 'IT Equipment Budget Q3', creator: 'David Kim', created: '13-May-2026 09:00', stage: 'Draft', type: 'Routine', updated: 'Just now', costCentre: 'IT' },

  { id: 'PR-2026-001', title: 'MacBook Pro Upgrades', creator: 'David Kim', created: '12-May-2026 14:30', stage: 'Requisition', type: 'Routine', updated: '2 hours ago', costCentre: 'IT' },

  { id: 'PR-2026-002', title: 'Enterprise Salesforce License', creator: 'David Kim', created: '10-May-2026 09:15', stage: 'RFQ / RFP', type: 'Complex', updated: '4 hours ago', costCentre: 'DDAIS' },

  { id: 'PR-2026-003', title: 'Office Supplies Q2', creator: 'David Kim', created: '09-May-2026 11:45', stage: 'Award', type: 'Routine', updated: '1 day ago', costCentre: 'Operations' },

  { id: 'PR-2026-004', title: 'AWS Cloud Migration Consulting', creator: 'David Kim', created: '08-May-2026 16:20', stage: 'Negotiation', type: 'Complex', updated: '1 day ago', costCentre: 'Engineering' },

  { id: 'PR-2026-005', title: 'Ergonomic Office Chairs', creator: 'David Kim', created: '07-May-2026 08:05', stage: 'Award', type: 'Routine', updated: '2 days ago', costCentre: 'HR' },

  { id: 'PR-2026-006', title: 'Data Analytics Platform', creator: 'David Kim', created: '06-May-2026 13:50', stage: 'Bid Evaluation', type: 'Complex', updated: '2 days ago', costCentre: 'Finance' },

  { id: 'PR-2026-007', title: 'Security Audit Services', creator: 'David Kim', created: '05-May-2026 10:10', stage: 'Contract / SOW', type: 'Complex', updated: '3 days ago', costCentre: 'Legal' },

  { id: 'PR-2026-008', title: 'Printer Toner Refills', creator: 'David Kim', created: '04-May-2026 15:25', stage: 'Purchase Order (PO)', type: 'Routine', updated: '3 days ago', costCentre: 'Operations' },

  { id: 'PR-2026-009', title: 'Marketing Agency Retainer', creator: 'David Kim', created: '03-May-2026 12:40', stage: 'RFQ / RFP', type: 'Complex', updated: '4 days ago', costCentre: 'Marketing' },

  { id: 'PR-2026-010', title: 'Warehouse Shelving Units', creator: 'David Kim', created: '02-May-2026 09:55', stage: 'Purchase Order (PO)', type: 'Routine', updated: '5 days ago', costCentre: 'Procurement' },

  { id: 'PR-2026-011', title: 'Finance System Upgrade Draft', creator: 'David Kim', created: '01-May-2026 10:30', stage: 'Draft', type: 'Complex', updated: '6 days ago', costCentre: 'Finance' },

  { id: 'PR-2026-012', title: 'Brand Assets Refresh Draft', creator: 'David Kim', created: '30-Apr-2026 14:00', stage: 'Draft', type: 'Routine', updated: '1 week ago', costCentre: 'Marketing' },

  { id: 'PR-2026-013', title: 'HR Onboarding Kits', creator: 'David Kim', created: '29-Apr-2026 09:45', stage: 'Requisition', type: 'Routine', updated: '1 week ago', costCentre: 'HR' },

  { id: 'PR-2026-014', title: 'Legal Document Management SaaS', creator: 'David Kim', created: '28-Apr-2026 11:20', stage: 'RFQ / RFP', type: 'Complex', updated: '1 week ago', costCentre: 'Legal' },

  { id: 'PR-2026-015', title: 'Network Infrastructure Refresh', creator: 'David Kim', created: '27-Apr-2026 16:00', stage: 'Negotiation', type: 'Complex', updated: '8 days ago', costCentre: 'Engineering' },

  { id: 'PR-2026-016', title: 'Office Pantry Restocking', creator: 'David Kim', created: '26-Apr-2026 08:30', stage: 'Purchase Order (PO)', type: 'Routine', updated: '9 days ago', costCentre: 'Operations' },

  { id: 'PR-2026-017', title: 'ERP Module Licensing', creator: 'David Kim', created: '25-Apr-2026 13:15', stage: 'Bid Evaluation', type: 'Complex', updated: '10 days ago', costCentre: 'DDAIS' },

  { id: 'PR-2026-018', title: 'Training Room AV Equipment', creator: 'David Kim', created: '24-Apr-2026 10:00', stage: 'Contract / SOW', type: 'Routine', updated: '11 days ago', costCentre: 'HR' },

  { id: 'PR-2026-019', title: 'Procurement Analytics Licence', creator: 'David Kim', created: '23-Apr-2026 15:45', stage: 'Award', type: 'Complex', updated: '12 days ago', costCentre: 'Procurement' },

];

const APPROVAL_ROWS = [
  { id: 'PR-2026-011', title: 'Cloud Infrastructure Upgrade', creator: 'Sarah Chen', created: '11-May-2026 10:00', stage: 'Negotiation', type: 'Complex', updated: '1 hour ago' },
  { id: 'PR-2026-012', title: 'Office Renovation Supplies', creator: 'James Patel', created: '10-May-2026 14:30', stage: 'Requisition', type: 'Routine', updated: '3 hours ago' },
  { id: 'PR-2026-013', title: 'Annual Software Licenses', creator: 'Priya Nair', created: '09-May-2026 09:00', stage: 'Negotiation', type: 'Complex', updated: '1 day ago' },
  { id: 'PR-2026-014', title: 'Marketing Campaign Tools', creator: 'Alex Wong', created: '08-May-2026 11:20', stage: 'Requisition', type: 'Routine', updated: '2 days ago' },
  { id: 'PR-2026-015', title: 'Data Center Equipment', creator: 'Riya Sharma', created: '07-May-2026 16:45', stage: 'RFQ / RFP', type: 'Complex', updated: '3 days ago' },
];



const COLUMNS = ['PR ID', 'Title', 'Creator', 'Created Date', 'Lifecycle Stage', 'Cost Centre', 'Type', 'Last Updated', 'Actions'];



const FILTER_OPTIONS = {

  'Lifecycle Stage': ['Draft', 'Requisition', 'RFQ / RFP', 'Bid Evaluation', 'Negotiation', 'Award', 'Contract / SOW', 'Purchase Order (PO)'],

  'Cost Centre': ['DDAIS', 'Finance', 'Engineering', 'Operations', 'Marketing', 'HR', 'Legal', 'Procurement', 'IT', 'Other'],

  'Type': ['Routine', 'Complex'],

  'Date Range': ['Today', 'This Week', 'This Month', 'Last 3 Months'],

};



/* ═══════════════════════════════════════════════════════════

   FILTER DROPDOWN

   ═══════════════════════════════════════════════════════════ */



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

          borderRadius: 8, padding: '7px 12px', fontSize: 12,

          color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit',

          transition: 'all .15s ease', whiteSpace: 'nowrap',

        }}

      >

        {isMulti ? (

          selectedCount === 0 ? label :

            selectedCount === 1 ? activeOption[0] :

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



/* ═══════════════════════════════════════════════════════════

   DASHBOARD — main content area only (no sidebar)

   ═══════════════════════════════════════════════════════════ */



export default function Dashboard({ setCurrentPage, onNavigate, activeNav, userRole }) {

  const [topSearchFocused, setTopSearchFocused] = useState(false);

  const [tableSearchFocused, setTableSearchFocused] = useState(false);

  const [tableSearch, setTableSearch] = useState('');

  const [openFilter, setOpenFilter] = useState(null);
  const [managerTab, setManagerTab] = useState('my'); // 'my' | 'approval'
  const [activeFilters, setActiveFilters] = useState({
    'Lifecycle Stage': [],
    'Cost Centre': null,
    'Type': null,
  });
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [tablePage, setTablePage] = useState(1);

  const [isSearching, setIsSearching] = useState(false);
  const [displayedRows, setDisplayedRows] = useState(ROWS);
  const [tableScrollable, setTableScrollable] = useState(false);
  const tableScrollRef = useRef(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openRpp, setOpenRpp] = useState(false);
  const rppRef = useRef(null);

  useEffect(() => {
    if (!openRpp) return;
    function handleClick(e) {
      if (rppRef.current && !rppRef.current.contains(e.target)) setOpenRpp(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openRpp]);

  useEffect(() => {
    const el = tableScrollRef.current;
    if (!el) return;
    const check = () => setTableScrollable(el.scrollWidth > el.clientWidth);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [displayedRows]);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      const baseRows = (userRole === 'manager' && managerTab === 'approval') ? APPROVAL_ROWS : ROWS;
      let results = [...baseRows];

      // search filter
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase();
        results = results.filter(r =>
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.creator.toLowerCase().includes(q)
        );
      }

      // lifecycle stage filter
      if (activeFilters['Lifecycle Stage'] && activeFilters['Lifecycle Stage'].length > 0) {
        results = results.filter(r => activeFilters['Lifecycle Stage'].includes(r.stage));
      }

      // cost centre filter
      if (activeFilters['Cost Centre']) {
        results = results.filter(r => r.costCentre === activeFilters['Cost Centre']);
      }

      // type filter
      if (activeFilters['Type']) {
        results = results.filter(r => r.type === activeFilters['Type']);
      }

      // sort
      if (sortCol) {
        const colMap = {
          'PR ID': 'id', 'Title': 'title', 'Creator': 'creator',
          'Created Date': 'created', 'Lifecycle Stage': 'stage',
          'Type': 'type', 'Last Updated': 'updated'
        };
        const key = colMap[sortCol];
        if (key) {
          results = results.sort((a, b) => {
            const av = a[key].toLowerCase();
            const bv = b[key].toLowerCase();
            return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
          });
        }
      }

      setDisplayedRows(results);
      setTablePage(1);
      setIsSearching(false);
    }, tableSearch.trim() ? 600 : 150);

    return () => clearTimeout(timer);
  }, [tableSearch, sortCol, sortDir, activeFilters, managerTab, userRole]);

  const totalRows = displayedRows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedRows = displayedRows.slice((tablePage - 1) * rowsPerPage, tablePage * rowsPerPage);

  const closeFilter = useCallback(() => setOpenFilter(null), []);

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
    .pbtn-edit { transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease; }
    .pbtn-edit:hover { background: rgba(0,82,204,0.07) !important; border-color: rgba(0,82,204,0.3) !important; color: #0052cc !important; }
    .pbtn-edit:hover svg { stroke: #0052cc; }
    .pbtn-x { transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease; }
    .pbtn-x:hover { background: rgba(239,68,68,0.07) !important; border-color: rgba(239,68,68,0.3) !important; color: #ef4444 !important; }
    .pbtn-x:hover svg { stroke: #ef4444; }
  `;

  return (

    <MainLayout

      activeNav={activeNav}

      onNavigate={onNavigate}

      titleComponent={<span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Hi David 👋</span>}

      searchPlaceholder={null}

    >

      <style dangerouslySetInnerHTML={{ __html: css }} />





      <div style={{ flex: 1, overflowY: 'auto', padding: 24, background: 'var(--bg-default)' }}>



        {/* KPI section label */}

        <div style={{

          fontSize: 13, fontWeight: 700,

          color: 'var(--text-primary)', marginBottom: 16,

        }}>My Overview</div>



        {/* KPI cards */}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>

          {KPIS.map((k, i) => (

            <div key={i} className="pkpi" style={{

              background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14,

              padding: '18px 20px', boxShadow: '0 1px 3px rgba(14,15,37,0.05)',

            }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

                <div style={{

                  width: 36, height: 36, borderRadius: 10, background: k.iconBg,

                  display: 'flex', alignItems: 'center', justifyContent: 'center',

                }}>

                  <k.Icon size={18} color={k.iconColor} strokeWidth={2} />

                </div>

              </div>

              <div style={{

                fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)',

                textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: 14,

              }}>{k.label}</div>

              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>{k.value}</div>

              <div style={{

                fontSize: 11, color: k.trendColor, marginTop: 4,

                display: 'flex', alignItems: 'center', gap: 4,

              }}>

                <k.TrendIcon size={12} strokeWidth={2.2} />

                {k.trend}

              </div>

            </div>

          ))}

        </div>



        {/* ── Active Requests ── */}

        <div style={{ marginTop: 28 }}>



          {/* Section header */}
          {userRole === 'manager' ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'var(--bg-surface-2)', borderRadius: 10, padding: 3 }}>
                <button
                  onClick={() => setManagerTab('my')}
                  style={{
                    padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                    background: managerTab === 'my' ? '#fff' : 'transparent',
                    color: managerTab === 'my' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    boxShadow: managerTab === 'my' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  My Requests
                </button>
                <button
                  onClick={() => setManagerTab('approval')}
                  style={{
                    padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                    background: managerTab === 'approval' ? '#fff' : 'transparent',
                    color: managerTab === 'approval' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    boxShadow: managerTab === 'approval' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Pending Approval
                  <span style={{ marginLeft: 6, background: 'rgba(245,158,11,0.12)', color: '#b45309', borderRadius: 20, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>5</span>
                </button>
              </div>
              <span className="pvall" style={{ fontSize: 13, color: 'var(--colors-blue-500)', cursor: 'pointer', fontWeight: 500 }}>View All</span>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Active Requests</span>
                <span style={{ background: 'rgba(0,82,204,0.08)', color: '#0052cc', borderRadius: 20, padding: '2px 9px', fontSize: 11, fontWeight: 700 }}>47</span>
              </div>

              <span className="pvall" style={{ fontSize: 13, color: 'var(--colors-blue-500)', cursor: 'pointer', fontWeight: 500 }}>View All</span>

            </div>
          )}



          {/* Filters bar */}

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>

            <div style={{

              display: 'flex', alignItems: 'center', gap: 8, width: 260,

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



            {Object.keys(FILTER_OPTIONS).map((label) => (

              <FilterDropdown

                key={label}

                label={label}

                options={FILTER_OPTIONS[label]}

                isOpen={openFilter === label}

                onToggle={() => setOpenFilter(openFilter === label ? null : label)}

                onClose={closeFilter}

                activeOption={activeFilters[label]}
                isMulti={label === 'Lifecycle Stage'}

                onSelect={(label, opt) => {
                  if (label === 'Lifecycle Stage') {
                    if (opt === 'CLEAR_ALL') {
                      setActiveFilters(prev => ({ ...prev, [label]: [] }));
                      return;
                    }
                    setActiveFilters(prev => {
                      const arr = prev[label] || [];
                      const next = arr.includes(opt) ? arr.filter(x => x !== opt) : [...arr, opt];
                      return { ...prev, [label]: next };
                    });
                  } else {
                    setActiveFilters(prev => ({ ...prev, [label]: prev[label] === opt ? null : opt }));
                  }
                }}

              />

            ))}

            {(activeFilters['Lifecycle Stage'].length > 0 || activeFilters['Cost Centre'] || activeFilters['Type']) && (
              <button
                onClick={() => setActiveFilters({ 'Lifecycle Stage': [], 'Cost Centre': null, 'Type': null })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: '#ef4444', fontWeight: 600, fontFamily: 'inherit',
                  padding: '7px 4px', transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <X size={13} strokeWidth={2.5} /> Clear filters
              </button>
            )}

          </div>



          {/* Table container */}

          <div style={{

            background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 16,

            overflow: 'hidden', boxShadow: '0 1px 4px rgba(14,15,37,0.04)',

          }}>

            <div style={{ position: 'relative' }}>

              <div className="table-scroll" ref={tableScrollRef} onScroll={(e) => { const el = e.currentTarget; setTableScrollable(el.scrollWidth - el.scrollLeft > el.clientWidth + 2); }} style={{ overflowX: 'auto', width: '100%' }}>

                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>

                  <thead>

                    <tr style={{ background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-subtle)' }}>

                      {COLUMNS.map((col, idx) => {

                        const widths = ['80px', '170px', '100px', '110px', '130px', '110px', '80px', '110px', '80px'];

                        return (

                          <th key={col} onClick={() => {
                            if (col === 'Actions') return;
                            if (sortCol === col) {
                              setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                            } else {
                              setSortCol(col);
                              setSortDir('asc');
                            }
                          }} style={{

                            padding: '10px 16px', fontSize: 11, fontWeight: 700,

                            color: 'var(--text-tertiary)', textTransform: 'uppercase',

                            letterSpacing: '0.5px', textAlign: 'left', whiteSpace: 'nowrap', cursor: 'pointer',

                            width: widths[idx], minWidth: widths[idx]

                          }}>

                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>

                              {col}

                              {col !== 'Actions' && (
                                sortCol === col ? (
                                  sortDir === 'asc' ? <ChevronUp size={11} color="#0052cc" strokeWidth={2} /> : <ChevronDown size={11} color="#0052cc" strokeWidth={2} />
                                ) : (
                                  <ArrowUpDown size={11} color="var(--text-tertiary)" strokeWidth={2} />
                                )
                              )}

                            </span>

                          </th>

                        )
                      })}

                    </tr>

                  </thead>

                  <tbody>
                    {isSearching ? (
                      [1, 2, 3, 4, 5].map(i => (
                        <tr key={`skel-${i}`} style={{ borderBottom: '1px solid #f5f5f5' }}>
                          <td style={{ padding: '13px 16px' }}><div className="skeleton-box" style={{ height: 14, width: 80 }} /></td>
                          <td style={{ padding: '13px 16px' }}><div className="skeleton-box" style={{ height: 14, width: 160 }} /></td>
                          <td style={{ padding: '13px 16px' }}><div className="skeleton-box" style={{ height: 14, width: 80 }} /></td>
                          <td style={{ padding: '13px 16px' }}><div className="skeleton-box" style={{ height: 14, width: 100 }} /></td>
                          <td style={{ padding: '13px 16px' }}><div className="skeleton-box" style={{ height: 22, width: 90, borderRadius: 20 }} /></td>
                          <td style={{ padding: '13px 16px' }}><div className="skeleton-box" style={{ height: 14, width: 80 }} /></td>
                          <td style={{ padding: '13px 16px' }}><div className="skeleton-box" style={{ height: 14, width: 60 }} /></td>
                          <td style={{ padding: '13px 16px' }}><div className="skeleton-box" style={{ height: 14, width: 80 }} /></td>
                          <td style={{ padding: '13px 16px' }}><div className="skeleton-box" style={{ height: 28, width: 80, borderRadius: 7 }} /></td>
                        </tr>
                      ))
                    ) : paginatedRows.length > 0 ? (
                      paginatedRows.map((r, idx) => {
                        const ss = STAGE_STYLES[r.stage] || STAGE_STYLES['Draft'];
                        const isDraft = r.stage === 'Draft';
                        return (
                          <tr key={r.id} className="ptr" onClick={() => setCurrentPage('prdetail')} style={{
                            borderBottom: idx < paginatedRows.length - 1 ? '1px solid #f5f5f5' : 'none',
                            cursor: 'pointer'
                          }}>
                            <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{r.id}</td>
                            <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</td>
                            <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{r.creator}</td>
                            <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{r.created}</td>
                            <td style={{ padding: '13px 16px' }}>
                              <span style={{
                                display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                                fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', ...ss,
                              }}>{r.stage}</span>
                            </td>
                            <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{r.costCentre || '—'}</td>
                            <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{r.type}</td>
                            <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{r.updated}</td>
                            <td style={{ padding: '13px 16px' }}>
                              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                                <button className="pbtn" onClick={(e) => { e.stopPropagation(); setCurrentPage('prdetail'); }} style={{
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                                  height: 30, padding: '0 10px', boxSizing: 'border-box',
                                  border: '1px solid var(--border-default)', borderRadius: 7,
                                  fontSize: 12, background: '#fff',
                                  color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'inherit',
                                }}>
                                  <Eye size={13} strokeWidth={2} /> View
                                </button>
                                <button className="pbtn pbtn-edit" onClick={(e) => e.stopPropagation()} style={{
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  height: 30, minWidth: 30, padding: '0 9px', boxSizing: 'border-box',
                                  border: '1px solid var(--border-default)', borderRadius: 7,
                                  background: '#fff',
                                  color: 'var(--text-tertiary)', cursor: 'pointer',
                                }}>
                                  <Pencil size={13} strokeWidth={2} />
                                </button>
                                {isDraft && (
                                  <button className="pbtn pbtn-x" onClick={(e) => e.stopPropagation()} style={{
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    height: 30, minWidth: 30, padding: '0 9px', boxSizing: 'border-box',
                                    border: '1px solid var(--border-default)', borderRadius: 7,
                                    background: '#fff',
                                    color: 'var(--text-tertiary)', cursor: 'pointer',
                                  }}>
                                    <Trash2 size={13} strokeWidth={2} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={9} style={{ padding: '40px 16px', textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)' }}>
                          No requests found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>

              </div>

              {tableScrollable && (
                <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 32, background: 'linear-gradient(to right, rgba(255,255,255,0), #fff)', pointerEvents: 'none' }} />
              )}

            </div>



            {/* Pagination */}

            <div style={{

              padding: '12px 16px', background: '#fff',

              borderTop: '1px solid var(--border-subtle)',

              display: 'flex', alignItems: 'center', justifyContent: 'space-between',

            }}>

              {/* Left: rows-per-page + count */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

                {/* Custom rows-per-page dropdown */}
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
                  Showing {totalRows === 0 ? 0 : (tablePage - 1) * rowsPerPage + 1}–{Math.min(tablePage * rowsPerPage, totalRows)} of {totalRows} requests
                </span>
              </div>

              {/* Right: Prev / Next */}
              <div style={{ display: 'flex', gap: 4 }}>

                <button className="ppag" onClick={() => setTablePage(p => p - 1)} disabled={tablePage === 1} style={{

                  display: 'flex', alignItems: 'center', gap: 4,

                  border: '1px solid var(--border-default)', borderRadius: 7,

                  padding: '5px 12px', background: '#fff', color: 'var(--text-secondary)',

                  fontSize: 12, cursor: tablePage === 1 ? 'default' : 'pointer', fontFamily: 'inherit',

                  opacity: tablePage === 1 ? 0.4 : 1

                }}>

                  <ChevronLeft size={14} strokeWidth={2} /> Previous

                </button>

                <button className="ppag" onClick={() => setTablePage(p => p + 1)} disabled={tablePage === totalPages || totalPages === 0} style={{

                  display: 'flex', alignItems: 'center', gap: 4,

                  border: '1px solid var(--border-default)', borderRadius: 7,

                  padding: '5px 12px', background: '#fff', color: 'var(--text-secondary)',

                  fontSize: 12, cursor: (tablePage === totalPages || totalPages === 0) ? 'default' : 'pointer', fontFamily: 'inherit',

                  opacity: (tablePage === totalPages || totalPages === 0) ? 0.4 : 1

                }}>

                  Next <ChevronRight size={14} strokeWidth={2} />

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </MainLayout>

  );

}

