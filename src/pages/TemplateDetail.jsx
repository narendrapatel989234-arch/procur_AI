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
  Save, Plus, CheckSquare, Pencil, CheckCircle, X, Sparkles, ArrowUp, MessageSquare, Search, TrendingUp, RefreshCw,
  Check, Edit3, Send, FileText, Mic, Paperclip, CornerDownRight
} from 'lucide-react';

export default function TemplateDetail({ onNavigate, activeNav }) {
  const [mode, setMode] = useState('view');
  const [toast, setToast] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);

  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [rightPane, setRightPane] = useState({ visible: false, action: null, title: '' });
  const [rpState, setRpState] = useState('idle');
  const [rpPrompt, setRpPrompt] = useState('');
  const [rpSubmittedPrompt, setRpSubmittedPrompt] = useState('');
  const [rpGeneratedText, setRpGeneratedText] = useState('');
  const [rpIsEditing, setRpIsEditing] = useState(false);
  const [rpOriginalText, setRpOriginalText] = useState('');

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
  const contextMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (headingMenuRef.current && !headingMenuRef.current.contains(event.target)) {
        setShowHeadingMenu(false);
      }
      if (listMenuRef.current && !listMenuRef.current.contains(event.target)) {
        setShowListMenu(false);
      }
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        if (contextMenu.visible) setContextMenu({ visible: false, x: 0, y: 0 });
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [contextMenu.visible]);

  const handleSave = () => {
    setMode('view');
    setToast({ message: 'Saved changes to the document' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleContextMenu = (e) => {
    if (mode !== 'edit') return;
    e.preventDefault();
    let y = e.clientY;
    const menuHeight = 60; // 1 option height approx
    if (window.innerHeight - y < menuHeight) {
      y = Math.max(10, window.innerHeight - menuHeight - 10);
    }
    setContextMenu({ visible: true, x: e.clientX, y });
  };

  const closeRightPane = () => {
    setRightPane({ visible: false, action: null, title: '' });
    setTimeout(() => {
      setRpState('idle');
      setRpPrompt('');
      setRpSubmittedPrompt('');
      setRpGeneratedText('');
    }, 300);
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
            <div className="unified-tiptap" onContextMenu={handleContextMenu} style={{ fontSize: 15, color: '#334155', lineHeight: 1.7, fontFamily: 'inherit', flex: 1 }}>
              <EditorContent editor={editor} />
            </div>

          </div>
        </div>

        {/* CONTEXT MENU */}
        {contextMenu.visible && (
          <div ref={contextMenuRef} style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 12, boxShadow: '0 12px 40px rgba(0,0,0,0.12)', width: 280, zIndex: 10000, padding: '8px 0', overflow: 'hidden' }}
            onMouseLeave={() => setContextMenu({ visible: false, x: 0, y: 0 })}>
            <div
              onClick={() => {
                setContextMenu({ visible: false, x: 0, y: 0 });
                setRightPane({ visible: true, action: 'generate_section', title: 'Generate Section' });
              }}
              style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', color: 'var(--text-secondary)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <FileText size={16} />
              <span style={{ fontSize: 14 }}>Generate Section</span>
            </div>
          </div>
        )}

        {/* RIGHT PANE */}
        {rightPane.visible && (
          <>
            <div onClick={closeRightPane} style={{ position: 'fixed', inset: 0, background: 'rgba(14,15,37,0.3)', zIndex: 9999, backdropFilter: 'blur(2px)', animation: 'fadeIn 0.2s ease' }} />
            <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 450, background: '#fff', display: 'flex', flexDirection: 'column', zIndex: 10000, boxShadow: '-8px 0 32px rgba(0,0,0,0.1)', animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              {/* Header */}
              <div style={{ height: 56, minHeight: 56, background: '#fff', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, width: '100%' }}>
                  <X size={18} color="var(--text-tertiary)" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={closeRightPane} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8, padding: '6px 12px', background: 'transparent', border: 'none', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'inherit' }}>
                    {rightPane.title}
                  </div>
                </div>
              </div>

              <div className="custom-scrollbar" style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {rpState !== 'idle' && (
                    <>
                      {/* User Prompt Bubble */}
                      <div style={{ alignSelf: 'flex-end', background: '#0052cc', color: '#fff', padding: '10px 14px', borderRadius: '14px 14px 4px 14px', fontSize: 14, maxWidth: '85%', boxShadow: '0 2px 8px rgba(0,82,204,0.15)', animation: 'chatFadeIn 0.2s ease forwards' }}>
                        {rpSubmittedPrompt}
                      </div>

                      {/* AI Response Bubble */}
                      <div style={{ alignSelf: 'flex-start', background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#1a1a1a', padding: '14px', borderRadius: '14px 14px 14px 4px', fontSize: 14, maxWidth: '90%', lineHeight: 1.55, animation: 'chatFadeIn 0.3s ease forwards' }}>
                        {rpState === 'generating' || rpState === 'regenerating' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#666' }}>
                            <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                            <span>{rpState === 'generating' ? 'Generating section...' : 'Regenerating section...'}</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {rpIsEditing ? (
                              <textarea
                                value={rpGeneratedText}
                                onChange={e => setRpGeneratedText(e.target.value)}
                                style={{ width: '100%', minHeight: 120, padding: 12, border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', resize: 'vertical', outline: 'none' }}
                                autoFocus
                              />
                            ) : (
                              <div style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: rpGeneratedText.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            )}
                            {/* Action Buttons */}
                            {rpState === 'generated' && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
                                {rpIsEditing ? (
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <button onClick={() => setRpIsEditing(false)} style={{ padding: '0 16px', height: 32, background: '#0052cc', border: 'none', borderRadius: 6, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'box-shadow 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,82,204,0.3)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>Save</button>
                                    <button onClick={() => { setRpGeneratedText(rpOriginalText); setRpIsEditing(false); }} style={{ padding: '0 16px', height: 32, background: 'transparent', border: '1px solid var(--border-default)', borderRadius: 6, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Cancel</button>
                                  </div>
                                ) : (
                                  <>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                      <button onClick={() => {
                                        editor?.chain().focus().insertContent(`<p>${rpGeneratedText}</p>`).run();
                                        closeRightPane();
                                      }} style={{ padding: '0 16px', height: 32, background: '#0052cc', border: 'none', borderRadius: 6, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'box-shadow 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,82,204,0.3)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                                        <Check size={15} strokeWidth={2.5} /> Accept
                                      </button>
                                      <button onClick={() => {
                                        closeRightPane();
                                      }} style={{ padding: '0 16px', height: 32, background: 'transparent', border: '1px solid var(--border-default)', borderRadius: 6, color: 'var(--colors-red-500)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#fff0f0'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <X size={15} strokeWidth={2.5} /> Reject
                                      </button>
                                    </div>
                                    <div style={{ width: 1, height: 20, background: 'var(--border-subtle)' }} />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <button
                                        title="Edit"
                                        onClick={() => { setRpOriginalText(rpGeneratedText); setRpIsEditing(true); }}
                                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', transition: 'all 0.15s ease' }}
                                        onMouseEnter={e => { e.currentTarget.style.color = '#7c7cff'; e.currentTarget.style.background = 'rgba(124,124,255,0.08)' }}
                                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent' }}
                                      >
                                        <Edit3 size={15} />
                                      </button>
                                      <button
                                        title="Regenerate"
                                        onClick={() => {
                                          setRpIsEditing(false);
                                          setRpState('regenerating');
                                          setTimeout(() => { setRpState('generated'); }, 2000);
                                        }}
                                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', transition: 'all 0.15s ease' }}
                                        onMouseEnter={e => { e.currentTarget.style.color = '#7c7cff'; e.currentTarget.style.background = 'rgba(124,124,255,0.08)' }}
                                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent' }}
                                      >
                                        <RefreshCw size={15} />
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Prompt Input Box */}
              <div style={{ position: 'relative', marginTop: 'auto', padding: '16px 20px', background: '#fff', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
                <div style={{ padding: '0 0 16px', background: '#fff' }}>
                  <div style={{ border: `1.5px solid ${rpPrompt ? '#7c7cff' : 'var(--border-default)'}`, borderRadius: 14, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, boxShadow: rpPrompt ? '0 0 0 3px rgba(124,124,255,0.09), 0 2px 8px rgba(14,15,37,0.04)' : '0 2px 8px rgba(14,15,37,0.04)', transition: 'border-color 0.15s, box-shadow 0.15s', background: '#fff' }}>
                    <textarea
                      value={rpPrompt}
                      onChange={e => {
                        setRpPrompt(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (rpPrompt.trim()) {
                            setRpSubmittedPrompt(rpPrompt);
                            setRpPrompt('');
                            setRpIsEditing(false);
                            setRpState('generating');
                            setTimeout(() => {
                              setRpGeneratedText("1. Objective\nThis section describes the objectives for the deliverables as outlined in the prompt provided.\n\n2. Requirements\nAll requirements must be fulfilled according to the timeline.");
                              setRpState('generated');
                            }, 2500);
                          }
                        }
                      }}
                      placeholder={"Describe your requirement..."}
                      rows={1}
                      style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: 'var(--text-primary)', resize: 'none', minHeight: 24, maxHeight: 120, overflowY: 'auto', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', transition: 'all 0.15s ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,124,255,0.08)'; e.currentTarget.style.color = '#7c7cff'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}>
                          <Paperclip size={18} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 11, color: rpPrompt.length > 18000 ? '#ef4444' : 'var(--text-tertiary)' }}>{rpPrompt.length} / 20000</span>
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', transition: 'all 0.15s ease' }} onMouseEnter={e => { e.currentTarget.style.color = '#7c7cff'; e.currentTarget.style.background = 'rgba(124,124,255,0.08)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}>
                          <Mic size={18} strokeWidth={2} />
                        </button>
                        <button onClick={() => {
                          if (!rpPrompt.trim()) return;
                          setRpSubmittedPrompt(rpPrompt);
                          setRpPrompt('');
                          setRpIsEditing(false);
                          setRpState('generating');
                          setTimeout(() => {
                            setRpGeneratedText("1. Objective\nThis section describes the objectives for the deliverables as outlined in the prompt provided.\n\n2. Requirements\nAll requirements must be fulfilled according to the timeline.");
                            setRpState('generated');
                          }, 2500);
                        }} style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: rpPrompt.trim() ? 'pointer' : 'not-allowed', background: rpPrompt.trim() ? 'linear-gradient(135deg, #0052cc, #7c7cff)' : 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: rpPrompt.trim() ? '0 2px 8px rgba(0,82,204,0.3)' : 'none', transition: 'all 0.15s ease' }}>
                          <Send size={15} color={rpPrompt.trim() ? '#fff' : 'var(--text-tertiary)'} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
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