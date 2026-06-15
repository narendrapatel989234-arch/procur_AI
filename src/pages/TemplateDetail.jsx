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
  Save, Plus, CheckSquare
} from 'lucide-react';

export default function TemplateDetail({ onNavigate, activeNav }) {
  const [zoom, setZoom] = useState(100);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);
  
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
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0052cc', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
        <Save size={14} /> Save Template
      </button>
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
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

        {/* TOOLBAR RIBBON */}
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
                      onMouseEnter={e => { if(!activeState[`h${level}`]) e.currentTarget.style.background = '#f1f5f9' }} 
                      onMouseLeave={e => { if(!activeState[`h${level}`]) e.currentTarget.style.background = 'transparent' }}
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
                    onMouseEnter={e => { if(!activeState.bulletList) e.currentTarget.style.background = '#f1f5f9' }} 
                    onMouseLeave={e => { if(!activeState.bulletList) e.currentTarget.style.background = 'transparent' }}
                  >
                    <List size={16} /> Bullet List
                  </button>
                  <button 
                    onClick={() => { editor?.chain().focus().toggleOrderedList().run(); setShowListMenu(false); }} 
                    style={{ padding: '8px 16px', background: activeState.orderedList ? '#f8fafc' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: activeState.orderedList ? '#4f46e5' : '#334155', fontSize: 13 }}
                    onMouseEnter={e => { if(!activeState.orderedList) e.currentTarget.style.background = '#f1f5f9' }} 
                    onMouseLeave={e => { if(!activeState.orderedList) e.currentTarget.style.background = 'transparent' }}
                  >
                    <ListOrdered size={16} /> Ordered List
                  </button>
                  <button 
                    onClick={() => { editor?.chain().focus().toggleTaskList().run(); setShowListMenu(false); }} 
                    style={{ padding: '8px 16px', background: activeState.taskList ? '#f8fafc' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: activeState.taskList ? '#4f46e5' : '#334155', fontSize: 13 }}
                    onMouseEnter={e => { if(!activeState.taskList) e.currentTarget.style.background = '#f1f5f9' }} 
                    onMouseLeave={e => { if(!activeState.taskList) e.currentTarget.style.background = 'transparent' }}
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

        {/* EDITOR CANVAS */}
        <div style={{ flex: 1, background: '#f3f4f6', overflowY: 'auto', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
              <input type="text" defaultValue="Standard RFP Template - Technology" style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', border: 'none', outline: 'none', width: '100%', background: 'transparent', fontFamily: 'inherit' }} />
              <div style={{ fontSize: 13, color: '#666', marginTop: 8 }}>Template ID: TMP-2026-04 • Last modified by David Kim</div>
            </div>

            {/* UNIFIED TIPTAP EDITOR */}
            <div className="unified-tiptap" style={{ fontSize: 15, color: '#334155', lineHeight: 1.7, fontFamily: 'inherit' }}>
              <EditorContent editor={editor} />
            </div>

          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
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