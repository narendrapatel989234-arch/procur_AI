import React, { useState, useEffect, useRef, useCallback } from 'react';


import {

  Search, ChevronDown, ChevronUp, ArrowUpDown,
  ChevronLeft, ChevronRight, Eye, Pencil, X, Trash2, MessageSquare,
  Clock, CheckCircle, AlertTriangle, Calendar, Sparkles, Send, Plus, Paperclip, Mic,
  TrendingUp, TrendingDown, Zap, FileText, Layers, Briefcase
} from 'lucide-react';

import MainLayout from '../layouts/MainLayout.jsx';



/* ═══════════════════════════════════════════════════════════

   STATIC DATA

   ═══════════════════════════════════════════════════════════ */



const KPIS = [
  {
    newStyle: true,
    label: 'Active Requisitions',
    value: '12',
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
    Icon: FileText,
    subKpis: [
      { value: '2%', trend: '↗', trendColor: '#16a34a', title: 'vs last month volume' }
    ]
  },
  {
    newStyle: true,
    label: 'Active RFPs',
    value: '8',
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
    Icon: Layers,
    subKpis: [
      { value: '3', title: 'Drafts' },
      { value: '5', title: 'Published' }
    ]
  },
  {
    newStyle: true,
    label: 'SOW',
    value: '15',
    iconBg: '#faf5ff',
    iconColor: '#9333ea',
    Icon: Briefcase,
    subKpis: [
      { value: '5', title: 'Pending Signature' },
      { value: '10', title: 'Signed' }
    ]
  },
  {
    newStyle: true,
    label: 'POs Pending',
    value: '24',
    iconBg: '#fffbeb',
    iconColor: '#d97706',
    Icon: Clock,
    subKpis: [
      { value: '85%', trend: '↗', trendColor: '#16a34a', title: 'PR-PO Completion rate' }
    ]
  },
  {
    newStyle: true,
    label: 'Avg PR-PO Cycle Time',
    value: '6.2d',
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
    Icon: Zap,
    subKpis: [
      { value: '12%', trend: '↘', trendColor: '#16a34a', title: 'vs last month' }
    ]
  }
];



const STAGE_STYLES = {
  'Requisition': { background: '#e8f1fb', color: '#0052cc' },
  'RFP': { background: '#ede9fe', color: '#6d28d9' },
  'Bid Evaluation': { background: '#fdf4ff', color: '#a21caf' },
  'Negotiation': { background: '#fff3e0', color: '#e65100' },
  'Award': { background: '#f0fdf4', color: '#15803d' },
  'Contract / SOW': { background: '#fff1f2', color: '#be123c' },
  'Purchase Order (PO)': { background: '#ecfdf5', color: '#065f46' },
};

const STATUS_STYLES = {
  'PR Drafted': { background: '#f5f5f5', color: '#888888' },
  'PR in progress': { background: '#e8f1fb', color: '#0052cc' },
  'PR Cancelled': { background: '#fff1f2', color: '#be123c' },
  'RFP Drafted': { background: '#f5f5f5', color: '#888888' },
  'RFP Published': { background: '#ede9fe', color: '#6d28d9' },
  'Evaluation in progress': { background: '#fdf4ff', color: '#a21caf' },
  'Negotiation in progress': { background: '#fff3e0', color: '#e65100' },
  'Vendor Finalized': { background: '#f0fdf4', color: '#15803d' },
  'SoW Drafted': { background: '#f5f5f5', color: '#888888' },
  'SoW Approved': { background: '#f0fdf4', color: '#15803d' },
  'SoW Signed': { background: '#ecfdf5', color: '#065f46' },
  'PO Pending': { background: '#fff3e0', color: '#e65100' },
  'PO Approved': { background: '#f0fdf4', color: '#15803d' },
  'PO Rejected': { background: '#fff1f2', color: '#be123c' },
};

const ROWS = [
  { id: 'PR-2026-000', title: 'IT Equipment Budget Q3', created: '13-May-2026 09:00', stage: 'Requisition', status: 'PR Drafted', type: 'Routine', updated: 'Just now', costCentre: 'IT' },
  { id: 'PR-2026-001', title: 'MacBook Pro Upgrades', created: '12-May-2026 14:30', stage: 'Requisition', status: 'PR in progress', type: 'Routine', updated: '2 hours ago', costCentre: 'IT' },
  { id: 'PR-2026-002', title: 'Enterprise Salesforce License', created: '10-May-2026 09:15', stage: 'RFP', status: 'RFP Published', type: 'Complex', updated: '4 hours ago', costCentre: 'DDAIS' },
  { id: 'PR-2026-003', title: 'Office Supplies Q2', created: '09-May-2026 11:45', stage: 'Award', status: 'Vendor Finalized', type: 'Routine', updated: '1 day ago', costCentre: 'Operations' },
  { id: 'PR-2026-004', title: 'AWS Cloud Migration Consulting', created: '08-May-2026 16:20', stage: 'Negotiation', status: 'Negotiation in progress', type: 'Complex', updated: '1 day ago', costCentre: 'Engineering' },
  { id: 'PR-2026-005', title: 'Ergonomic Office Chairs', created: '07-May-2026 08:05', stage: 'Award', status: 'Vendor Finalized', type: 'Routine', updated: '2 days ago', costCentre: 'HR' },
  { id: 'PR-2026-006', title: 'Data Analytics Platform', created: '06-May-2026 13:50', stage: 'Bid Evaluation', status: 'Evaluation in progress', type: 'Complex', updated: '2 days ago', costCentre: 'Finance' },
  { id: 'PR-2026-007', title: 'Security Audit Services', created: '05-May-2026 10:10', stage: 'Contract / SOW', status: 'SoW Approved', type: 'Complex', updated: '3 days ago', costCentre: 'Legal' },
  { id: 'PR-2026-008', title: 'Printer Toner Refills', created: '04-May-2026 15:25', stage: 'Purchase Order (PO)', status: 'PO Approved', type: 'Routine', updated: '3 days ago', costCentre: 'Operations' },
  { id: 'PR-2026-009', title: 'Marketing Agency Retainer', created: '03-May-2026 12:40', stage: 'RFP', status: 'RFP Published', type: 'Complex', updated: '4 days ago', costCentre: 'Marketing' },
  { id: 'PR-2026-010', title: 'Warehouse Shelving Units', created: '02-May-2026 09:55', stage: 'Purchase Order (PO)', status: 'PO Pending', type: 'Routine', updated: '5 days ago', costCentre: 'Procurement' },
  { id: 'PR-2026-011', title: 'Finance System Upgrade Draft', created: '01-May-2026 10:30', stage: 'Requisition', status: 'PR Drafted', type: 'Complex', updated: '6 days ago', costCentre: 'Finance' },
  { id: 'PR-2026-012', title: 'Brand Assets Refresh Draft', created: '30-Apr-2026 14:00', stage: 'Requisition', status: 'PR Drafted', type: 'Routine', updated: '1 week ago', costCentre: 'Marketing' },
  { id: 'PR-2026-013', title: 'HR Onboarding Kits', created: '29-Apr-2026 09:45', stage: 'Requisition', status: 'PR in progress', type: 'Routine', updated: '1 week ago', costCentre: 'HR' },
  { id: 'PR-2026-014', title: 'Legal Document Management SaaS', created: '28-Apr-2026 11:20', stage: 'RFP', status: 'RFP Drafted', type: 'Complex', updated: '1 week ago', costCentre: 'Legal' },
  { id: 'PR-2026-015', title: 'Network Infrastructure Refresh', created: '27-Apr-2026 16:00', stage: 'Negotiation', status: 'Negotiation in progress', type: 'Complex', updated: '8 days ago', costCentre: 'Engineering' },
  { id: 'PR-2026-016', title: 'Office Pantry Restocking', created: '26-Apr-2026 08:30', stage: 'Purchase Order (PO)', status: 'PO Rejected', type: 'Routine', updated: '9 days ago', costCentre: 'Operations' },
  { id: 'PR-2026-017', title: 'ERP Module Licensing', created: '25-Apr-2026 13:15', stage: 'Bid Evaluation', status: 'Evaluation in progress', type: 'Complex', updated: '10 days ago', costCentre: 'DDAIS' },
  { id: 'PR-2026-018', title: 'Training Room AV Equipment', created: '24-Apr-2026 10:00', stage: 'Contract / SOW', status: 'SoW Signed', type: 'Routine', updated: '11 days ago', costCentre: 'HR' },
  { id: 'PR-2026-019', title: 'Procurement Analytics Licence', created: '23-Apr-2026 15:45', stage: 'Award', status: 'Vendor Finalized', type: 'Complex', updated: '12 days ago', costCentre: 'Procurement' },
];

const APPROVAL_ROWS = [
  { id: 'PR-2026-011', title: 'Cloud Infrastructure Upgrade', created: '11-May-2026 10:00', stage: 'Negotiation', status: 'Negotiation in progress', type: 'Complex', updated: '1 hour ago', costCentre: 'Engineering' },
  { id: 'PR-2026-012', title: 'Office Renovation Supplies', created: '10-May-2026 14:30', stage: 'Requisition', status: 'PR in progress', type: 'Routine', updated: '3 hours ago', costCentre: 'Operations' },
  { id: 'PR-2026-013', title: 'Annual Software Licenses', created: '09-May-2026 09:00', stage: 'Negotiation', status: 'Negotiation in progress', type: 'Complex', updated: '1 day ago', costCentre: 'IT' },
  { id: 'PR-2026-014', title: 'Marketing Campaign Tools', created: '08-May-2026 11:20', stage: 'Requisition', status: 'PR in progress', type: 'Routine', updated: '2 days ago', costCentre: 'Marketing' },
  { id: 'PR-2026-015', title: 'Data Center Equipment', created: '07-May-2026 16:45', stage: 'RFP', status: 'RFP Published', type: 'Complex', updated: '3 days ago', costCentre: 'IT' },
];



const FILTER_OPTIONS = {
  'Lifecycle Stage': ['Requisition', 'RFP', 'Bid Evaluation', 'Negotiation', 'Award', 'Contract / SOW', 'Purchase Order (PO)'],
  'Status': ['PR Drafted', 'PR in progress', 'PR Cancelled', 'RFP Drafted', 'RFP Published', 'Evaluation in progress', 'Negotiation in progress', 'Vendor Finalized', 'SoW Drafted', 'SoW Approved', 'SoW Signed', 'PO Pending', 'PO Approved', 'PO Rejected'],
  'Cost Centre': ['DDAIS', 'Finance', 'Engineering', 'Operations', 'Marketing', 'HR', 'Legal', 'Procurement', 'IT', 'Other'],
  'Type': ['Routine', 'Complex'],
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



/* ═══════════════════════════════════════════════════════════

   DASHBOARD — main content area only (no sidebar)

   ═══════════════════════════════════════════════════════════ */



export default function Dashboard({ setCurrentPage, onNavigate, activeNav, userRole }) {

  const [topSearchFocused, setTopSearchFocused] = useState(false);

  const [tableSearchFocused, setTableSearchFocused] = useState(false);

  const [tableSearch, setTableSearch] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [deleteRequestId, setDeleteRequestId] = useState(null);


  const [openFilter, setOpenFilter] = useState(null);
  const [activeTab, setActiveTab] = useState('my'); // 'my' | 'approval'
  const [activeFilters, setActiveFilters] = useState({
    'Lifecycle Stage': [],
    'Status': [],
    'Cost Centre': [],
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
      const baseRows = activeTab === 'approval' ? APPROVAL_ROWS : ROWS;
      let results = [...baseRows];

      // search filter
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase();
        results = results.filter(r =>
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          (r.costCentre && r.costCentre.toLowerCase().includes(q))
        );
      }

      // status filter
      if (activeFilters['Status'] && activeFilters['Status'].length > 0) {
        results = results.filter(r => activeFilters['Status'].includes(r.status));
      }

      // lifecycle stage filter
      if (activeFilters['Lifecycle Stage'] && activeFilters['Lifecycle Stage'].length > 0) {
        results = results.filter(r => activeFilters['Lifecycle Stage'].includes(r.stage));
      }

      // cost centre filter
      if (activeFilters['Cost Centre'] && activeFilters['Cost Centre'].length > 0) {
        results = results.filter(r => activeFilters['Cost Centre'].includes(r.costCentre));
      }

      // type filter
      if (activeFilters['Type']) {
        results = results.filter(r => r.type === activeFilters['Type']);
      }

      // sort
      if (sortCol) {
        const colMap = {
          'PR ID': 'id', 'Title': 'title',
          'Created Date': 'created', 'Lifecycle Stage': 'stage', 'Status': 'status',
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
  }, [tableSearch, sortCol, sortDir, activeFilters, activeTab, userRole]);

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
    .pbtn-chat { transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease; }
    .pbtn-chat:hover { background: rgba(0,82,204,0.07) !important; border-color: rgba(0,82,204,0.3) !important; color: #0052cc !important; }
    .pbtn-chat:hover svg { stroke: #0052cc; }
    .pbtn-x { transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease; }
    .pbtn-x:hover { background: rgba(239,68,68,0.07) !important; border-color: rgba(239,68,68,0.3) !important; color: #ef4444 !important; }
    .pbtn-x:hover svg { stroke: #ef4444; }
  `;

  return (

    <MainLayout userRole={userRole}

      activeNav={activeNav}

      onNavigate={onNavigate}

      titleComponent={<span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Hi {userRole === 'manager' ? 'Sarah' : 'David'} 👋</span>}

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
          {KPIS.map((k, i) => {
            if (k.newStyle) {
              return (
                <div key={i} style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 24, padding: '16px 20px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 60, height: 60, borderRadius: 16, background: k.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <k.Icon size={26} color={k.iconColor} strokeWidth={2} />
                    </div>
                    <div style={{ height: 60, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{k.label}</div>
                      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{k.value}</div>
                    </div>
                  </div>

                  <div style={{ height: 1, background: 'var(--border-subtle)', margin: '32px 0 16px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    {k.subKpis.map((sub, idx) => (
                      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                          <span style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '-0.5px' }}>{sub.value}</span>
                          {sub.trend && <span style={{ fontSize: 14, fontWeight: 600, color: sub.trendColor }}>{sub.trend}</span>}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{sub.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <div key={i} style={{
                background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14,
                padding: '12px 16px', boxShadow: '0 1px 3px rgba(14,15,37,0.05)',
                display: 'flex', flexDirection: 'column', height: '100%'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10, background: k.iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <k.Icon size={16} color={k.iconColor} strokeWidth={2} />
                  </div>
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)',
                  textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: 10,
                  lineHeight: 1.3
                }}>{k.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{k.value}</div>
                <div style={{
                  fontSize: 11, color: k.trendColor, marginTop: 10,
                  display: 'flex', alignItems: 'flex-start', gap: 6, lineHeight: 1.4
                }}>
                  <div style={{ paddingTop: 1 }}><k.TrendIcon size={12} strokeWidth={2.5} /></div>
                  <span style={{ flex: 1 }}>{k.trend}</span>
                </div>
              </div>
            );
          })}
        </div>



        {/* ── Active Requests ── */}

        <div style={{ marginTop: 28 }}>



          <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--border-subtle)', marginBottom: 14 }}>
            <button
              onClick={() => setActiveTab('my')}
              style={{
                background: 'transparent', border: 'none', borderBottom: activeTab === 'my' ? '2px solid #0052cc' : '2px solid transparent',
                padding: '0 4px 10px', fontSize: 13, fontWeight: activeTab === 'my' ? 600 : 500,
                color: activeTab === 'my' ? '#0052cc' : 'var(--text-tertiary)',
                cursor: 'pointer', transition: 'all 0.15s ease'
              }}
            >
              My Requests
            </button>
            <button
              onClick={() => setActiveTab('approval')}
              style={{
                background: 'transparent', border: 'none', borderBottom: activeTab === 'approval' ? '2px solid #0052cc' : '2px solid transparent',
                padding: '0 4px 10px', fontSize: 13, fontWeight: activeTab === 'approval' ? 600 : 500,
                color: activeTab === 'approval' ? '#0052cc' : 'var(--text-tertiary)',
                cursor: 'pointer', transition: 'all 0.15s ease',
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              Pending Requests <span style={{ fontSize: 12, background: 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>5</span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                background: 'transparent', border: 'none', borderBottom: activeTab === 'all' ? '2px solid #0052cc' : '2px solid transparent',
                padding: '0 4px 10px', fontSize: 13, fontWeight: activeTab === 'all' ? 600 : 500,
                color: activeTab === 'all' ? '#0052cc' : 'var(--text-tertiary)',
                cursor: 'pointer', transition: 'all 0.15s ease',
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              All Requests
              {/*<span style={{ fontSize: 12, background: 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>12</span>*/}
            </button>
          </div>



          {/* Filters bar */}

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>

            <div style={{

              display: 'flex', alignItems: 'center', gap: 8, width: 260,
              background: '#fff', borderRadius: 8, padding: '0 12px', height: 36,
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
                isMulti={label === 'Lifecycle Stage' || label === 'Cost Centre' || label === 'Status'}

                onSelect={(label, opt) => {
                  if (label === 'Lifecycle Stage' || label === 'Cost Centre' || label === 'Status') {
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

            {/* Date Range Calendar */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowDatePicker(!showDatePicker)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: showDatePicker ? 'var(--bg-surface-1)' : '#fff', border: `1px solid ${showDatePicker ? '#7c7cff' : 'var(--border-default)'}`, padding: '0 12px', height: 36, borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s ease', fontFamily: 'inherit' }}>
                <Calendar size={13} strokeWidth={2} /> Select Date <ChevronDown size={13} strokeWidth={2} style={{ transition: 'transform 0.15s ease', transform: showDatePicker ? 'rotate(180deg)' : 'rotate(0)' }} />
              </button>
              {showDatePicker && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 100, width: 280, animation: 'fadeIn 0.15s ease' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Select Date Range</div>
                    <button onClick={() => setShowDatePicker(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex' }}><X size={14} /></button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', color: 'var(--text-primary)' }}><ChevronLeft size={16} /></button>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ border: '1px solid var(--border-default)', borderRadius: 6, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer', transition: 'background 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>January <ChevronDown size={12} color="var(--text-secondary)" /></div>
                      <div style={{ border: '1px solid var(--border-default)', borderRadius: 6, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer', transition: 'background 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>2025 <ChevronDown size={12} color="var(--text-secondary)" /></div>
                    </div>
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', color: 'var(--text-primary)' }}><ChevronRight size={16} /></button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 8 }}>
                    <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 4, textAlign: 'center', fontSize: 12, color: 'var(--text-primary)' }}>
                    <div /><div /><div /><div /><div />
                    <div style={{ padding: '4px 0' }}>01</div><div style={{ padding: '4px 0' }}>02</div>
                    <div style={{ padding: '4px 0' }}>03</div><div style={{ padding: '4px 0' }}>04</div><div style={{ padding: '4px 0' }}>05</div><div style={{ padding: '4px 0' }}>06</div>
                    <div style={{ background: '#0052cc', color: '#fff', borderRadius: '12px 0 0 12px', padding: '4px 0', fontWeight: 600 }}>07</div>
                    <div style={{ background: '#e8f1fb', padding: '4px 0' }}>08</div><div style={{ background: '#e8f1fb', padding: '4px 0' }}>09</div>
                    <div style={{ background: '#e8f1fb', padding: '4px 0' }}>10</div><div style={{ background: '#e8f1fb', padding: '4px 0' }}>11</div><div style={{ background: '#e8f1fb', padding: '4px 0', color: '#0052cc', fontWeight: 600 }}>12</div>
                    <div style={{ background: '#0052cc', color: '#fff', borderRadius: '0 12px 12px 0', padding: '4px 0', fontWeight: 600 }}>13</div>
                    <div style={{ padding: '4px 0' }}>14</div><div style={{ padding: '4px 0' }}>15</div><div style={{ padding: '4px 0' }}>16</div>
                    <div style={{ padding: '4px 0' }}>17</div><div style={{ padding: '4px 0' }}>18</div><div style={{ padding: '4px 0' }}>19</div><div style={{ padding: '4px 0' }}>20</div>
                    <div style={{ padding: '4px 0' }}>21</div><div style={{ padding: '4px 0' }}>22</div><div style={{ padding: '4px 0' }}>23</div>
                    <div style={{ padding: '4px 0' }}>24</div><div style={{ padding: '4px 0' }}>25</div><div style={{ padding: '4px 0' }}>26</div><div style={{ padding: '4px 0' }}>27</div>
                    <div style={{ padding: '4px 0' }}>28</div><div style={{ padding: '4px 0' }}>29</div><div style={{ padding: '4px 0' }}>30</div>
                    <div style={{ padding: '4px 0' }}>31</div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '12px -16px 0', padding: '12px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>07 Jan - 13 Jan 2025</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ padding: '6px 12px', border: '1px solid var(--border-default)', borderRadius: 6, background: '#fff', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>Clear</button>
                      <button onClick={() => setShowDatePicker(false)} style={{ padding: '6px 12px', border: 'none', borderRadius: 6, background: '#0052cc', fontSize: 12, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Apply</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {(activeFilters['Lifecycle Stage'].length > 0 || activeFilters['Status']?.length > 0 || activeFilters['Cost Centre'].length > 0 || activeFilters['Type']) && (
              <button
                onClick={() => setActiveFilters({ 'Lifecycle Stage': [], 'Status': [], 'Cost Centre': [], 'Type': null })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', background: 'rgba(239, 68, 68, 0.08)',
                  border: 'none', borderRadius: 6,
                  fontSize: 12, fontWeight: 600, color: '#ef4444',
                  cursor: 'pointer', transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
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

                      {(() => {
                        const cols = activeTab === 'my'
                          ? ['PR ID', 'Title', 'Created Date', 'Lifecycle Stage', 'Status', 'Cost Centre', 'Type', 'Last Updated']
                          : ['PR ID', 'Title', 'Created Date', 'Created by', 'Lifecycle Stage', 'Status', 'Cost Centre', 'Type', 'Last Updated'];

                        const widths = activeTab === 'my'
                          ? ['80px', '170px', '100px', '120px', '140px', '110px', '80px', '100px']
                          : ['80px', '160px', '100px', '120px', '120px', '130px', '110px', '80px', '100px'];

                        return cols.map((col, idx) => (
                          <th key={col} onClick={() => {
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
                              {sortCol === col ? (
                                sortDir === 'asc' ? <ChevronUp size={11} color="#0052cc" strokeWidth={2} /> : <ChevronDown size={11} color="#0052cc" strokeWidth={2} />
                              ) : (
                                <ArrowUpDown size={11} color="var(--text-tertiary)" strokeWidth={2} />
                              )}
                            </span>
                          </th>
                        ));
                      })()}

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
                        const isDraft = r.status?.toLowerCase() === 'pr drafted';
                        return (
                          <tr key={r.id} className="ptr" onClick={() => {
                            if (r.status === 'PR Drafted') setCurrentPage('prdetaildraft');
                            else if (r.type === 'Complex') setCurrentPage('prdetailrfp');
                            else setCurrentPage('prdetailfresh');
                          }} style={{
                            borderBottom: idx < paginatedRows.length - 1 ? '1px solid #f5f5f5' : 'none',
                            cursor: 'pointer'
                          }}>
                            <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{r.id}</td>
                            <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</td>
                            <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{r.created}</td>
                            {activeTab !== 'my' && (
                              <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                                {r.createdBy || 'David Kim'}
                              </td>
                            )}
                            <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{r.stage}</td>
                            <td style={{ padding: '13px 16px' }}>
                              <span style={{
                                display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                                fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', ...(STATUS_STYLES[r.status] || { background: '#f5f5f5', color: '#888888' }),
                              }}>{r.status}</span>
                            </td>
                            <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{r.costCentre || '—'}</td>
                            <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{r.type}</td>
                            <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{r.updated}</td>
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

      {/* Delete Confirmation Popup */}
      {deleteRequestId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease' }}>
          <div style={{ width: 400, background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.15)', textAlign: 'center', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px 0' }}>Delete Request</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 8px 0', lineHeight: 1.5 }}>Are you sure you want to delete this request?</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', margin: '0 0 28px 0' }}>Action performed is irreversable.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setDeleteRequestId(null)} style={{ flex: 1, padding: '0 16px', height: 42, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => setDeleteRequestId(null)} style={{ flex: 1, padding: '0 16px', height: 42, background: '#ef4444', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}




    </MainLayout>

  );

}

