import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, MessageSquare, Receipt, Plus, Zap, PanelLeftClose, PanelLeft, Settings, HelpCircle, LogOut, ChevronDown, Layers, Bot, Cpu } from 'lucide-react';

const NAV = [
  { name: 'Dashboard', Icon: LayoutDashboard },
  { name: 'Chat History', Icon: MessageSquare },
  { name: 'Purchase Orders', Icon: Receipt },
  { name: 'Templates', Icon: Layers },
  { name: 'Agent Management', Icon: Cpu },
];

export default function Sidebar({ activeNav, onNavigate, userRole }) {
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebar_collapsed') === 'true');
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(prev => { const next = !prev; localStorage.setItem('sidebar_collapsed', next); return next; });
  };

  const css = `
    .pnav{display:flex;align-items:center;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;transition:all .2s ease;font-family:inherit;overflow:visible;}
    .pnav.on{background:rgba(124,124,255,0.1);color:#3d3db8;font-weight:600;position:relative;}
    .pnav.off{color:#4a4a4a;border-left:3px solid transparent;}
    .pnav.off:hover{background:var(--bg-surface-2)!important;}
    .pnew{transition:box-shadow .18s ease,transform .1s ease}
    .pnew:hover{box-shadow:0 6px 22px rgba(0,82,204,0.35)}
    .pnew:active{transform:scale(0.97)}
    .pmenu-item{transition:background 0.15s ease;}
    .pmenu-item:hover{background:var(--bg-surface-2);}
    .pkpi{transition:transform .18s ease,box-shadow .18s ease}
    .pkpi:hover{transform:translateY(-2px);box-shadow:0 4px 14px rgba(14,15,37,0.09)}
    .ptr{transition:background .12s ease}
    .ptr:hover{background:var(--bg-surface-1)!important}
    .pbtn{transition:all .12s ease}
    .pbtn:hover{background:var(--bg-surface-2)!important}
    .pbtn-x:hover{color:var(--colors-red-500)!important;background:var(--status-error-bg)!important}
    .pvall{transition:color .12s ease}
    .pvall:hover{color:#003c95;text-decoration:underline}
    .ppag{transition:all .12s ease}
    .ppag:hover{background:var(--bg-surface-2)!important}
    .table-scroll::-webkit-scrollbar{height:6px;}
    .table-scroll::-webkit-scrollbar-track{background:#eeeeee;border-radius:4px;}
    .table-scroll::-webkit-scrollbar-thumb{background:#666666;border-radius:4px;}
  `;

  return (
    <aside style={{ width: isCollapsed ? 76 : 220, minWidth: isCollapsed ? 76 : 220, height: '100vh', background: '#ffffff', borderRight: '1px solid var(--border-subtle)', boxShadow: '4px 0 24px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', flexShrink: 0, transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1)', position: 'relative', zIndex: 50 }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div onMouseEnter={() => setIsLogoHovered(true)} onMouseLeave={() => setIsLogoHovered(false)} onClick={toggleCollapse} style={{ padding: isCollapsed ? '24px 0 20px' : '24px 16px 20px', display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', gap: 8, overflow: 'hidden', cursor: 'pointer' }}>
        {isCollapsed ? (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {isLogoHovered ? <PanelLeft size={18} color="var(--text-tertiary)" /> : <Zap size={18} color="var(--colors-blue-500)" strokeWidth={2.5} />}
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={18} color="var(--colors-blue-500)" strokeWidth={2.5} />
              <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--colors-blue-500)', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>ProcurAI</span>
            </div>
            <PanelLeftClose size={18} color="var(--text-tertiary)" style={{ opacity: isLogoHovered ? 1 : 0.6, transition: 'opacity 0.2s ease' }} />
          </>
        )}
      </div>
      <div style={{ margin: isCollapsed ? '0 auto 20px' : '0 16px 20px', display: 'flex', justifyContent: 'center' }}>
        <button className="pnew" onClick={() => onNavigate && onNavigate('New Request')} style={{ width: isCollapsed ? 44 : '100%', height: isCollapsed ? 44 : 'auto', padding: isCollapsed ? '0' : '11px 16px', border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #0052cc, #7c7cff)', color: '#fff', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,82,204,0.25)', fontFamily: 'inherit', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <Plus size={16} strokeWidth={2.5} />
          {!isCollapsed && <span>New Request</span>}
        </button>
      </div>
      <div style={{ padding: '0 20px 8px', fontSize: 10, fontWeight: 400, height: 20, letterSpacing: '0.8px', color: 'var(--text-tertiary)', textTransform: 'uppercase', opacity: isCollapsed ? 0 : 1, transition: 'opacity 0.2s ease', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        {!isCollapsed && "Workspace"}
      </div>
      <nav style={{ padding: isCollapsed ? '0' : '0 12px', display: 'flex', flexDirection: 'column', gap: 6, alignItems: isCollapsed ? 'center' : 'stretch' }}>
        {NAV.map(({ name, Icon }) => {
          const isActive = activeNav === name;
          return (
            <div key={name} title={name} className={`pnav ${isActive ? 'on' : 'off'}`} onClick={() => onNavigate(name)} style={{ overflow: 'visible', position: 'relative', gap: isCollapsed ? 0 : 12, padding: isCollapsed ? '0' : '10px 14px', justifyContent: isCollapsed ? 'center' : 'flex-start', width: isCollapsed ? 44 : 'auto', height: isCollapsed ? 44 : 'auto', borderRadius: isCollapsed ? 10 : 8 }}>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: isCollapsed ? -16 : -12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 5,
                  height: '90%',
                  background: '#3d3db8',
                  borderRadius: '0 3px 3px 0',
                }} />
              )}
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{name}</span>}
            </div>
          );
        })}
      </nav>
      <div ref={profileRef} onClick={() => setProfileMenuOpen(!profileMenuOpen)} style={{ marginTop: 'auto', padding: isCollapsed ? '20px 0' : '20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', cursor: 'pointer', position: 'relative', background: profileMenuOpen ? 'var(--bg-surface-1)' : 'transparent', transition: 'background 0.2s ease' }} onMouseEnter={(e) => { if (!profileMenuOpen) e.currentTarget.style.background = 'var(--bg-surface-1)'; }} onMouseLeave={(e) => { if (!profileMenuOpen) e.currentTarget.style.background = 'transparent'; }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #0052cc, #7c7cff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{userRole === 'manager' ? 'SC' : 'DK'}</div>
          {!isCollapsed && (<div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}><span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userRole === 'manager' ? 'Sarah Chen' : 'David Kim'}</span><span style={{ fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{userRole === 'manager' ? 'Procurement Manager' : 'Procurement Analyst'}</span></div>)}
        </div>
        {!isCollapsed && <ChevronDown size={14} color="var(--text-tertiary)" style={{ flexShrink: 0, transition: 'transform 0.2s ease', transform: profileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />}
        {profileMenuOpen && (
          <div style={{ position: 'absolute', bottom: 'calc(100% + 4px)', left: isCollapsed ? '10px' : '20px', width: isCollapsed ? 180 : 'calc(100% - 40px)', background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', padding: 6, zIndex: 100 }}>
            <div className="pmenu-item" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer', borderRadius: 6 }}><Settings size={14} color="var(--text-secondary)" /> Settings</div>
            <div className="pmenu-item" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer', borderRadius: 6 }}><HelpCircle size={14} color="var(--text-secondary)" /> Help</div>
            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
            <div className="pmenu-item" onClick={() => { setProfileMenuOpen(false); onNavigate && onNavigate('Login'); }} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--colors-red-500)', cursor: 'pointer', borderRadius: 6 }}><LogOut size={14} color="var(--colors-red-500)" /> Log out</div>
          </div>
        )}
      </div>
    </aside>
  );
}
