import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout({ activeNav, onNavigate, titleComponent, searchPlaceholder, children, userRole }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', overflow: 'hidden', fontFamily: 'var(--typography-font-family-primary), Inter, sans-serif', background: 'var(--bg-default)' }}>
      <Sidebar activeNav={activeNav} onNavigate={onNavigate} userRole={userRole} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: 'var(--bg-default)' }}>
        <Topbar titleComponent={titleComponent} searchPlaceholder={searchPlaceholder} />
        {children}
      </div>
    </div>
  );
}
