import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import {
  ChevronRight, ChevronDown, Undo, Redo, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered,
  Outdent, Indent, Link, Image, Printer, Highlighter, Baseline, Eraser,
  Save, ArrowUp, ArrowDown, Trash2, Plus, Wand2
} from 'lucide-react';

export default function TemplateDetail({ onNavigate, activeNav, navState }) {
  const [sections, setSections] = useState([
    { id: 1, title: '1. Introduction & Background', content: 'DDAIS Group invites qualified vendors to submit proposals for {{Project_Title}}. The objective of this engagement is to procure services as outlined in the sections below.' },
    { id: 2, title: '2. Scope of Work', content: 'The selected vendor will be required to deliver the following services over a period of {{Engagement_Duration}}:\n\n• Assessment and strategy design\n• Implementation and execution\n• Post-deployment support and training' },
    { id: 3, title: '3. Commercial Terms', content: 'Pricing must be submitted in {{Currency}}. Payment terms are Net 30 days against approved milestones.' }
  ]);
  const [activeSection, setActiveSection] = useState(0);
  const [showFieldMenu, setShowFieldMenu] = useState(false);

  const moveUp = (index) => {
    if (index === 0) return;
    const newSecs = [...sections];
    [newSecs[index - 1], newSecs[index]] = [newSecs[index], newSecs[index - 1]];
    setSections(newSecs);
    setActiveSection(index - 1);
  };

  const moveDown = (index) => {
    if (index === sections.length - 1) return;
    const newSecs = [...sections];
    [newSecs[index + 1], newSecs[index]] = [newSecs[index], newSecs[index + 1]];
    setSections(newSecs);
    setActiveSection(index + 1);
  };

  const removeSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const addSection = () => {
    setSections([...sections, { id: Date.now(), title: 'New Section', content: '' }]);
    setActiveSection(sections.length);
  };

  const insertField = (fieldName) => {
    const newSecs = [...sections];
    if (newSecs[activeSection]) {
      newSecs[activeSection].content += (newSecs[activeSection].content ? ' ' : '') + `{{${fieldName}}}`;
      setSections(newSecs);
    }
    setShowFieldMenu(false);
  };

  const breadcrumb = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span onClick={() => onNavigate('Templates')} style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-tertiary)', cursor: 'pointer', transition: 'color 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}>
        Templates
      </span>
      <ChevronRight size={14} color="var(--text-tertiary)" />
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
        IT Hardware Procurement Standard
      </span>
    </div>
  );

  const IconButton = ({ Icon }) => (
    <button style={{ background: 'transparent', border: 'none', padding: 6, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <Icon size={16} strokeWidth={2.2} />
    </button>
  );

  return (
    <MainLayout activeNav={activeNav} onNavigate={onNavigate} titleComponent={breadcrumb}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

        {/* EXPANDED RICH TEXT RIBBON */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--border-subtle)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', zIndex: 10 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>

            {/* Undo / Redo */}
            <div style={{ display: 'flex', gap: 2, paddingRight: 12, borderRight: '1px solid #eee' }}>
              <IconButton Icon={Undo} />
              <IconButton Icon={Redo} />
            </div>

            {/* Text Style */}
            <div style={{ display: 'flex', gap: 2, paddingRight: 12, borderRight: '1px solid #eee' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: '#444', padding: '6px 8px', borderRadius: 4 }} onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                Normal text <ChevronDown size={14} />
              </button>
            </div>

            {/* Formatting */}
            <div style={{ display: 'flex', gap: 2, paddingRight: 12, borderRight: '1px solid #eee' }}>
              <IconButton Icon={Bold} />
              <IconButton Icon={Italic} />
              <IconButton Icon={Underline} />
            </div>

            {/* Alignment */}
            <div style={{ display: 'flex', gap: 2, paddingRight: 12, borderRight: '1px solid #eee' }}>
              <IconButton Icon={AlignLeft} />
              <IconButton Icon={AlignCenter} />
              <IconButton Icon={AlignRight} />
              <IconButton Icon={AlignJustify} />
            </div>

            {/* Lists & Indents */}
            <div style={{ display: 'flex', gap: 2, paddingRight: 12, borderRight: '1px solid #eee' }}>
              <IconButton Icon={List} />
              <IconButton Icon={ListOrdered} />
              <IconButton Icon={Outdent} />
              <IconButton Icon={Indent} />
            </div>

            {/* Insert & Colors */}
            <div style={{ display: 'flex', gap: 2, paddingRight: 12, borderRight: '1px solid #eee' }}>
              <IconButton Icon={Link} />
              <IconButton Icon={Image} />
              <IconButton Icon={Baseline} />
              <IconButton Icon={Highlighter} />
              <IconButton Icon={Eraser} />
            </div>

            {/* Insert Field Dropdown */}
            <div style={{ position: 'relative' }}>
              {showFieldMenu && <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowFieldMenu(false)} />}

              <button onClick={() => setShowFieldMenu(!showFieldMenu)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#f0f4ff', border: '1px solid #d6e2ff', borderRadius: 6, fontSize: 13, fontWeight: 600, color: '#0052cc', cursor: 'pointer', transition: 'all 0.15s', zIndex: 100, position: 'relative' }} onMouseEnter={e => e.currentTarget.style.background = '#e0e7ff'} onMouseLeave={e => e.currentTarget.style.background = '#f0f4ff'}>
                <Plus size={14} /> Insert Field <ChevronDown size={14} />
              </button>

              {showFieldMenu && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.12)', width: 220, zIndex: 100, padding: '8px 0', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#999', padding: '6px 16px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Variables</div>
                  {['Vendor_Name', 'Project_Title', 'Contract_Value', 'Start_Date', 'End_Date'].map(f => (
                    <button key={f} onClick={() => insertField(f)} style={{ padding: '8px 16px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: 13, color: '#1a1a1a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <span style={{ background: '#e0e7ff', color: '#0052cc', padding: '2px 6px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{`{ }`}</span>
                      {f.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0052cc', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }} onMouseEnter={e => e.currentTarget.style.background = '#0041a3'} onMouseLeave={e => e.currentTarget.style.background = '#0052cc'}>
            <Save size={14} /> Save Template
          </button>
        </div>

        {/* EDITOR CANVAS (GREY BACKGROUND) */}
        <div style={{ flex: 1, background: '#f3f4f6', overflowY: 'auto', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* THE PAPER (WHITE, A4 STYLE) */}
          <div style={{ background: '#fff', width: '100%', maxWidth: 850, minHeight: 1000, borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '60px 70px', display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* DOCUMENT HEADER */}
            <div style={{ borderBottom: '2px solid #0052cc', paddingBottom: 16, marginBottom: 12 }}>
              <input type="text" defaultValue="Standard RFP Template - Technology" style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', border: 'none', outline: 'none', width: '100%', background: 'transparent', fontFamily: 'inherit' }} />
              <div style={{ fontSize: 13, color: '#666', marginTop: 8 }}>Template ID: TMP-2026-04 • Last modified by David Kim</div>
            </div>

            {/* SECTIONS */}
            {sections.map((sec, index) => (
              <div key={sec.id} onClick={() => setActiveSection(index)} style={{ position: 'relative', border: `1px solid ${activeSection === index ? '#cbd5e1' : 'transparent'}`, borderRadius: 12, padding: '16px 20px', marginLeft: -20, marginRight: -20, transition: 'all 0.2s ease', background: activeSection === index ? '#f8fafc' : 'transparent' }}
                onMouseEnter={e => {
                  if (activeSection !== index) e.currentTarget.style.background = '#fafafa';
                  e.currentTarget.querySelector('.controls').style.opacity = 1;
                }}
                onMouseLeave={e => {
                  if (activeSection !== index) e.currentTarget.style.background = 'transparent';
                  e.currentTarget.querySelector('.controls').style.opacity = activeSection === index ? 1 : 0;
                }}>

                {/* FLOATING CONTROLS */}
                <div className="controls" style={{ position: 'absolute', right: 20, top: 16, display: 'flex', gap: 6, opacity: activeSection === index ? 1 : 0, transition: 'opacity 0.2s' }}>
                  <button onClick={(e) => { e.stopPropagation(); moveUp(index); }} style={{ padding: 6, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', display: 'flex', color: '#64748b' }} onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}><ArrowUp size={14} /></button>
                  <button onClick={(e) => { e.stopPropagation(); moveDown(index); }} style={{ padding: 6, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', display: 'flex', color: '#64748b' }} onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}><ArrowDown size={14} /></button>
                  <button onClick={(e) => { e.stopPropagation(); removeSection(index); }} style={{ padding: 6, background: '#fff', border: '1px solid #fee2e2', borderRadius: 6, cursor: 'pointer', display: 'flex', color: '#ef4444' }} onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}><Trash2 size={14} /></button>
                </div>

                <input type="text" value={sec.title} onChange={e => { const n = [...sections]; n[index].title = e.target.value; setSections(n); }} style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', border: 'none', outline: 'none', width: '85%', background: 'transparent', marginBottom: 12, fontFamily: 'inherit' }} />

                <textarea value={sec.content} onChange={e => { const n = [...sections]; n[index].content = e.target.value; setSections(n); }} style={{ width: '100%', minHeight: 80, fontSize: 14, color: '#334155', lineHeight: 1.7, border: 'none', outline: 'none', resize: 'vertical', background: 'transparent', fontFamily: 'inherit' }} />
              </div>
            ))}

            {/* ADD SECTION BUTTON */}
            <button onClick={addSection} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 12, color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', marginTop: 8 }} onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.color = '#475569'; }} onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#64748b'; }}>
              <Plus size={16} /> Add New Section
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
