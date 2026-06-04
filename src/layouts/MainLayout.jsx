import React from 'react';
import Topbar from './Topbar';

export default function MainLayout({ activeNav, onNavigate, titleComponent, searchPlaceholder, children, userRole }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: 'var(--bg-default)' }}>
      <Topbar titleComponent={titleComponent} searchPlaceholder={searchPlaceholder} />
      {children}
    </div>
  );
}
