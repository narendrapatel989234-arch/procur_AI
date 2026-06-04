import React from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import { ChevronRight } from 'lucide-react';

export default function TemplateDetail({ onNavigate, activeNav, navState, userRole }) {
  const breadcrumb = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span onClick={() => onNavigate('templates')} style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-tertiary)', cursor: 'pointer', transition: 'color 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}>
        Templates
      </span>
      <ChevronRight size={14} color="var(--text-tertiary)" />
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
        Template Details
      </span>
    </div>
  );

  return (
    <MainLayout
      activeNav={activeNav}
      onNavigate={onNavigate}
      userRole={userRole}
      titleComponent={breadcrumb}
    >
      <div style={{ flex: 1, background: 'var(--bg-default)' }} />
    </MainLayout>
  );
}
