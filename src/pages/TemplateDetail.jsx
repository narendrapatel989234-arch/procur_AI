import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import {
  ChevronRight, ChevronDown, Undo, Redo, Bold, Italic, Strikethrough, Underline as UnderlineIcon, Eraser,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Minus, LineChart,
  Save, Plus, CheckSquare, Pencil, CheckCircle, X, Sparkles, ArrowUp, MessageSquare, Search, TrendingUp, RefreshCw
} from 'lucide-react';

export default function TemplateDetail({ onNavigate, activeNav }) {
  const [mode, setMode] = useState('view');
  const [toast, setToast] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);
  const [aiInputValue, setAiInputValue] = useState('');
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const aiMenuRef = useRef(null);

  const [activeState, setActiveState] = useState({
    bold: false,
    italic: false,
    strike: false,
    underline: false,
    h1: false,
    h2: false,
    h3: false,
    h4: false,
    bulletList: false,
    orderedList: false,
    taskList: false,
    align: 'left',
    canUndo: false,
    canRedo: false
  });

  const initialContent = `
    <h2>1. Introduction & Background</h2>
    <p>DDAIS Group invites qualified vendors to submit proposals for <strong>{{Project_Title}}</strong>. The objective of this engagement is to procure services as outlined in the sections below.</p>
    <h2>2. Scope of Work</h2>
    <p>The selected vendor will be required to deliver the following services over a period of <strong>{{Engagement_Duration}}</strong>:</p>
    <ul>
      <li>Assessment and strategy design</li>
      <li>Implementation and execution</li>
      <li>Post-deployment support and training</li>
    </ul>
    <h2>3. Commercial Terms</h2>
    <p>Pricing must be submitted in <strong>{{Currency}}</strong>. Payment terms are Net 30 days against approved milestones.</p>
  `;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: initialContent,
    onTransaction({ editor }) {
      setActiveState({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        strike: editor.isActive('strike'),
        underline: editor.isActive('underline'),
        h1: editor.isActive('heading', { level: 1 }),
        h2: editor.isActive('heading', { level: 2 }),
        h3: editor.isActive('heading', { level: 3 }),
        h4: editor.isActive('heading', { level: 4 }),
        bulletList: editor.isActive('bulletList'),
        orderedList: editor.isActive('orderedList'),
        taskList: editor.isActive('taskList'),
        align: editor.isActive({ textAlign: 'center' }) ? 'center' :
          editor.isActive({ textAlign: 'right' }) ? 'right' :
            editor.isActive({ textAlign: 'justify' }) ? 'justify' : 'left',
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
      });
    }
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(mode === 'edit');
    }
  }, [editor, mode]);

  // Handle clicking outside to close menus
  const headingMenuRef = useRef(null);
  const listMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (headingMenuRef.current && !headingMenuRef.current.contains(event.target)) {
        setShowHeadingMenu(false);
      }
      if (listMenuRef.current && !listMenuRef.current.contains(event.target)) {
        setShowListMenu(false);
      }
      if (aiMenuRef.current && !aiMenuRef.current.contains(event.target)) {
        setShowAiMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = () => {
    setMode('view');
    setToast({ message: 'Saved changes to the document' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAiAction = (action) => {
    setShowAiMenu(false);
    if (!aiInputValue.trim() && !action) return;
    
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      setAiInputValue('');
      
      const targetAction = action || 'paragraph'; // default behavior for just submitting input
      
      if (targetAction === 'comment') {
        editor?.chain().focus().insertContent('<blockquote><strong>AI Comment:</strong> Please ensure the scope includes the latest compliance requirements.</blockquote><p></p>').run();
      } else if (targetAction === 'paragraph') {
        editor?.chain().focus().insertContent('<p>Additionally, the vendor must provide comprehensive documentation and training materials upon successful deployment, ensuring seamless hand-off to the internal team.</p>').run();
      } else if (targetAction === 'proofread') {
        editor?.chain().focus().insertContent(' This section has been proofread for clarity and enterprise standards.').run();
      } else if (targetAction === 'adjust') {
        editor?.chain().focus().insertContent(' The selection has been adjusted to adopt a more formal tone.').run();
      } else if (targetAction === 'component') {
        editor?.chain().focus().insertContent('<div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 16px; border-radius: 8px; margin: 16px 0;"><strong>Approval Matrix:</strong><br/>Level 1: Department Head<br/>Level 2: Procurement Director</div><p></p>').run();
      } else if (targetAction === 'justify') {
        editor?.chain().focus().insertContent(' <em>(Edit justified: Aligning with the updated Q3 procurement guidelines.)</em>').run();
      }
    }, 1500);
  };

  const breadcrumb = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span onClick={() => onNavigate('Templates')} style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-tertiary)', cursor: 'pointer' }}>
          Templates
        </span>
        <ChevronRight size={14} color="var(--text-tertiary)" />
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
          IT Hardware Procurement Standard
        </span>
      </div>
      {mode === 'edit' ? (
        <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0052cc', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Save size={14} /> Save
        </button>
      ) : (
        <button onClick={() => setMode('edit')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0052cc', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Pencil size={14} /> Edit
        </button>
      )}
    </div>
  );

  const getActiveHeadingLabel = () => {
    if (activeState.h1) return 'H1';
    if (activeState.h2) return 'H2';
    if (activeState.h3) return 'H3';
    if (activeState.h4) return 'H4';
    return 'H';
  };

  const getActiveListIcon = () => {
    if (activeState.orderedList) return <ListOrdered size={18} />;
    if (activeState.taskList) return <CheckSquare size={18} />;
    return <List size={18} />;
  };

  const isHeadingActive = activeState.h1 || activeState.h2 || activeState.h3 || activeState.h4;
  const isListActive = activeState.bulletList || activeState.orderedList || activeState.taskList;

  return (
    <MainLayout activeNav={activeNav} onNavigate={onNavigate} titleComponent={breadcrumb} searchPlaceholder={null}>
      {toast && (
        <div style={{ position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', background: '#f0fdf4', border: '1px solid rgba(34,197,94,0.25)', borderLeft: '4px solid #22c55e', padding: '12px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 12px 32px rgba(0,0,0,0.08)', zIndex: 1000, animation: 'toastIn 0.2s ease forwards' }}>
          <CheckCircle size={22} color="#22c55e" strokeWidth={2} />
          <div style={{ fontSize: 14, fontWeight: 600, color: '#15803d', flex: 1 }}>{toast.message}</div>
          <button onClick={() => setToast(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}><X size={16} color="#15803d" opacity={0.5} /></button>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative' }}>

        {/* TOOLBAR RIBBON */}
        {mode === 'edit' && (
          <div style={{ background: '#fff', borderBottom: '1px solid var(--border-subtle)', padding: '8px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>

              {/* Undo / Redo */}
              <button onClick={() => editor?.chain().focus().undo().run()} disabled={!activeState.canUndo} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: activeState.canUndo ? '#444' : '#ccc' }}><Undo size={16} /></button>
              <button onClick={() => editor?.chain().focus().redo().run()} disabled={!activeState.canRedo} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: activeState.canRedo ? '#444' : '#ccc' }}><Redo size={16} /></button>
              <div style={{ width: 1, height: 16, background: '#e5e7eb', margin: '0 4px' }} />

              {/* Zoom Controls */}
              <button onClick={() => setZoom(z => Math.max(50, z - 10))} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: '#444' }}><Minus size={16} /></button>
              <span style={{ fontSize: 13, color: '#444', width: 44, textAlign: 'center', fontWeight: 500 }}>{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(200, z + 10))} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: '#444' }}><Plus size={16} /></button>
              <div style={{ width: 1, height: 16, background: '#e5e7eb', margin: '0 4px' }} />

              {/* Heading Dropdown */}
              <div ref={headingMenuRef} style={{ position: 'relative' }}>
                <button onClick={() => setShowHeadingMenu(!showHeadingMenu)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: isHeadingActive ? '#f1f5f9' : 'transparent', border: 'none', borderRadius: 16, padding: '4px 10px', fontSize: 14, fontWeight: 700, color: isHeadingActive ? '#4f46e5' : '#444', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {getActiveHeadingLabel()} <ChevronDown size={14} color="#666" />
                </button>
                {showHeadingMenu && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.12)', width: 160, zIndex: 100, padding: '4px 0', display: 'flex', flexDirection: 'column' }}>
                    {[1, 2, 3, 4].map(level => (
                      <button
                        key={level}
                        onClick={() => {
                          editor?.chain().focus().toggleHeading({ level }).run();
                          setShowHeadingMenu(false);
                        }}
                        style={{ padding: '8px 16px', background: activeState[`h${level}`] ? '#f8fafc' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: activeState[`h${level}`] ? '#4f46e5' : '#334155' }}
                        onMouseEnter={e => { if (!activeState[`h${level}`]) e.currentTarget.style.background = '#f1f5f9' }}
                        onMouseLeave={e => { if (!activeState[`h${level}`]) e.currentTarget.style.background = 'transparent' }}
                      >
                        <span style={{ fontWeight: 700, width: 20 }}>H{level}</span>
                        <span style={{ fontSize: 13 }}>Heading {level}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* List Dropdown */}
              <div ref={listMenuRef} style={{ position: 'relative' }}>
                <button onClick={() => setShowListMenu(!showListMenu)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: isListActive ? '#f1f5f9' : 'transparent', border: 'none', borderRadius: 6, padding: '4px 8px', color: isListActive ? '#4f46e5' : '#444', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {getActiveListIcon()} <ChevronDown size={14} color="#666" />
                </button>
                {showListMenu && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.12)', width: 160, zIndex: 100, padding: '4px 0', display: 'flex', flexDirection: 'column' }}>
                    <button
                      onClick={() => { editor?.chain().focus().toggleBulletList().run(); setShowListMenu(false); }}
                      style={{ padding: '8px 16px', background: activeState.bulletList ? '#f8fafc' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: activeState.bulletList ? '#4f46e5' : '#334155', fontSize: 13 }}
                      onMouseEnter={e => { if (!activeState.bulletList) e.currentTarget.style.background = '#f1f5f9' }}
                      onMouseLeave={e => { if (!activeState.bulletList) e.currentTarget.style.background = 'transparent' }}
                    >
                      <List size={16} /> Bullet List
                    </button>
                    <button
                      onClick={() => { editor?.chain().focus().toggleOrderedList().run(); setShowListMenu(false); }}
                      style={{ padding: '8px 16px', background: activeState.orderedList ? '#f8fafc' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: activeState.orderedList ? '#4f46e5' : '#334155', fontSize: 13 }}
                      onMouseEnter={e => { if (!activeState.orderedList) e.currentTarget.style.background = '#f1f5f9' }}
                      onMouseLeave={e => { if (!activeState.orderedList) e.currentTarget.style.background = 'transparent' }}
                    >
                      <ListOrdered size={16} /> Ordered List
                    </button>
                    <button
                      onClick={() => { editor?.chain().focus().toggleTaskList().run(); setShowListMenu(false); }}
                      style={{ padding: '8px 16px', background: activeState.taskList ? '#f8fafc' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: activeState.taskList ? '#4f46e5' : '#334155', fontSize: 13 }}
                      onMouseEnter={e => { if (!activeState.taskList) e.currentTarget.style.background = '#f1f5f9' }}
                      onMouseLeave={e => { if (!activeState.taskList) e.currentTarget.style.background = 'transparent' }}
                    >
                      <CheckSquare size={16} /> Task List
                    </button>
                  </div>
                )}
              </div>

              <div style={{ width: 1, height: 16, background: '#e5e7eb', margin: '0 4px' }} />

              {/* Formatting Tools */}
              <button onClick={() => editor?.chain().focus().toggleBold().run()} style={{ background: activeState.bold ? '#e0e7ff' : 'transparent', color: activeState.bold ? '#4f46e5' : '#444', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', transition: 'all 0.15s' }}><Bold size={16} /></button>
              <button onClick={() => editor?.chain().focus().toggleItalic().run()} style={{ background: activeState.italic ? '#e0e7ff' : 'transparent', color: activeState.italic ? '#4f46e5' : '#444', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', transition: 'all 0.15s' }}><Italic size={16} /></button>
              <button onClick={() => editor?.chain().focus().toggleStrike().run()} style={{ background: activeState.strike ? '#e0e7ff' : 'transparent', color: activeState.strike ? '#4f46e5' : '#444', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', transition: 'all 0.15s' }}><Strikethrough size={16} /></button>
              <button onClick={() => editor?.chain().focus().toggleUnderline().run()} style={{ background: activeState.underline ? '#e0e7ff' : 'transparent', color: activeState.underline ? '#4f46e5' : '#444', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', transition: 'all 0.15s' }}><UnderlineIcon size={16} /></button>
              <button onClick={() => editor?.chain().focus().unsetAllMarks().run()} style={{ background: 'transparent', color: '#444', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', transition: 'all 0.15s' }}><Eraser size={16} /></button>
              <div style={{ width: 1, height: 16, background: '#e5e7eb', margin: '0 4px' }} />

              {/* Alignment Icons */}
              <button onClick={() => editor?.chain().focus().setTextAlign('left').run()} style={{ background: activeState.align === 'left' ? '#e0e7ff' : 'transparent', color: activeState.align === 'left' ? '#4f46e5' : '#444', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', transition: 'all 0.15s' }}><AlignLeft size={16} /></button>
              <button onClick={() => editor?.chain().focus().setTextAlign('center').run()} style={{ background: activeState.align === 'center' ? '#e0e7ff' : 'transparent', color: activeState.align === 'center' ? '#4f46e5' : '#444', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', transition: 'all 0.15s' }}><AlignCenter size={16} /></button>
              <button onClick={() => editor?.chain().focus().setTextAlign('right').run()} style={{ background: activeState.align === 'right' ? '#e0e7ff' : 'transparent', color: activeState.align === 'right' ? '#4f46e5' : '#444', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', transition: 'all 0.15s' }}><AlignRight size={16} /></button>
              <button onClick={() => editor?.chain().focus().setTextAlign('justify').run()} style={{ background: activeState.align === 'justify' ? '#e0e7ff' : 'transparent', color: activeState.align === 'justify' ? '#4f46e5' : '#444', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', transition: 'all 0.15s' }}><AlignJustify size={16} /></button>
              <div style={{ width: 1, height: 16, background: '#e5e7eb', margin: '0 4px' }} />

              {/* Chart placeholder */}
              <button style={{ background: 'transparent', color: '#444', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}><LineChart size={16} /></button>
            </div>
          </div>
        )}

        {/* EDITOR CANVAS */}
        <div className="custom-scrollbar" style={{ flex: 1, background: '#f3f4f6', overflowY: 'auto', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            background: '#fff',
            width: '100%',
            maxWidth: 850,
            minHeight: 1000,
            borderRadius: 8,
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            padding: '60px 70px',
            display: 'flex',
            flexDirection: 'column',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out'
          }}>

            {/* DOCUMENT HEADER */}
            <div style={{ borderBottom: '2px solid #0052cc', paddingBottom: 16, marginBottom: 24 }}>
              <input type="text" defaultValue="Standard RFP Template - Technology" readOnly={mode === 'view'} style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', border: 'none', outline: 'none', width: '100%', background: 'transparent', fontFamily: 'inherit' }} />
              <div style={{ fontSize: 13, color: '#666', marginTop: 8 }}>Template ID: TMP-2026-04 • Last modified by David Kim</div>
            </div>

            {/* UNIFIED TIPTAP EDITOR */}
            <div className="unified-tiptap" style={{ fontSize: 15, color: '#334155', lineHeight: 1.7, fontFamily: 'inherit', flex: 1 }}>
              <EditorContent editor={editor} />
            </div>

          </div>
        </div>

        {/* AI TOOLKIT INPUT */}
        {mode === 'edit' && (
          <div ref={aiMenuRef} style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 750, zIndex: 100 }}>
            {showAiMenu && !aiLoading && (
              <div style={{ position: 'absolute', bottom: 'calc(100% + 12px)', left: 0, background: '#fff', borderRadius: 16, boxShadow: '0 12px 40px rgba(0,0,0,0.12)', border: '1px solid var(--border-subtle)', padding: '16px 0', width: 280, zIndex: 50 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', padding: '0 20px', marginBottom: 12 }}>AI Toolkit examples</div>
                
                <div className="ai-menu-item" onClick={() => handleAiAction('comment')} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <MessageSquare size={16} /> <span style={{ fontSize: 14 }}>Add AI comment</span>
                </div>
                <div className="ai-menu-item" onClick={() => handleAiAction('paragraph')} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <Plus size={16} /> <span style={{ fontSize: 14 }}>Add new paragraph</span>
                </div>
                <div className="ai-menu-item" onClick={() => handleAiAction('proofread')} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <Search size={16} /> <span style={{ fontSize: 14 }}>Proofread</span>
                </div>
                <div className="ai-menu-item" onClick={() => handleAiAction('adjust')} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <Pencil size={16} /> <span style={{ fontSize: 14 }}>Adjust text selection</span>
                </div>
                <div className="ai-menu-item" onClick={() => handleAiAction('component')} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <TrendingUp size={16} /> <span style={{ fontSize: 14 }}>Add custom component</span>
                </div>
                <div className="ai-menu-item" onClick={() => handleAiAction('justify')} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <CheckSquare size={16} /> <span style={{ fontSize: 14 }}>Justify edit</span>
                </div>
              </div>
            )}
            
            <div style={{ position: 'relative', background: '#fff', borderRadius: 12, border: '1.5px solid rgba(124,124,255,0.4)', boxShadow: '0 8px 30px rgba(124,124,255,0.15)', overflow: 'hidden', transition: 'border-color 0.2s', display: 'flex', alignItems: 'center', padding: '12px 18px' }}>
              {aiLoading ? (
                <RefreshCw size={18} color="#7c7cff" style={{ flexShrink: 0, marginRight: 10, animation: 'spin 1s linear infinite' }} />
              ) : (
                <Sparkles size={18} color="#7c7cff" style={{ flexShrink: 0, marginRight: 10 }} />
              )}
              <input
                type="text"
                placeholder="Tell AI what else needs to be changed..."
                value={aiInputValue}
                onChange={(e) => setAiInputValue(e.target.value)}
                onFocus={() => setShowAiMenu(true)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAiAction(); }}
                disabled={aiLoading}
                style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: 14, color: aiLoading ? '#999' : '#1a1a1a', fontFamily: 'inherit' }}
              />
              <button onClick={() => handleAiAction()} disabled={aiLoading || !aiInputValue.trim()} style={{ background: aiInputValue.trim() && !aiLoading ? '#0052cc' : '#f3f4f6', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: aiInputValue.trim() && !aiLoading ? 'pointer' : 'not-allowed', flexShrink: 0, marginLeft: 10, transition: 'background 0.2s' }}>
                <ArrowUp size={16} color={aiInputValue.trim() && !aiLoading ? '#fff' : '#6b7280'} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(-12px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .ai-menu-item { transition: background 0.15s ease; }
        .ai-menu-item:hover { background: var(--bg-surface-2); }
        .unified-tiptap .ProseMirror {
          outline: none;
          min-height: 800px;
        }
        .unified-tiptap h1 { font-size: 2em; margin-top: 1em; margin-bottom: 0.5em; font-weight: 700; color: #1e293b; }
        .unified-tiptap h2 { font-size: 1.5em; margin-top: 1em; margin-bottom: 0.5em; font-weight: 700; color: #1e293b; }
        .unified-tiptap h3 { font-size: 1.17em; margin-top: 1em; margin-bottom: 0.5em; font-weight: 700; color: #1e293b; }
        .unified-tiptap h4 { font-size: 1em; margin-top: 1em; margin-bottom: 0.5em; font-weight: 700; color: #1e293b; }
        .unified-tiptap ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
        .unified-tiptap ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
        .unified-tiptap p { margin-bottom: 1em; }
        .unified-tiptap ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }
        .unified-tiptap ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 4px;
        }
        .unified-tiptap ul[data-type="taskList"] li > label {
          margin-right: 8px;
          user-select: none;
          margin-top: 2px;
        }
        .unified-tiptap ul[data-type="taskList"] li > label input[type="checkbox"] {
          cursor: pointer;
        }
      `}} />
    </MainLayout>
  );
}