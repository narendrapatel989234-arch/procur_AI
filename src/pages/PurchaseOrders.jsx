import React from 'react';
import MainLayout from '../layouts/MainLayout.jsx';

export default function PurchaseOrders({ activeNav, onNavigate, userRole }) {
  return (
    <MainLayout 
      userRole={userRole}
      activeNav={activeNav}
      onNavigate={onNavigate}
      searchPlaceholder={null}
      titleComponent={<span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Purchase Orders</span>}
    >
      <div style={{ flex: 1, padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-default)' }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-secondary)' }}>Purchase Orders</div>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 8 }}>This page is currently empty.</div>
      </div>
    </MainLayout>
  );
}
