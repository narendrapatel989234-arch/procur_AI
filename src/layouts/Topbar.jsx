import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function Topbar({ titleComponent, searchPlaceholder = "Search..." }) {
  const [topSearchFocused, setTopSearchFocused] = useState(false);
  if (!titleComponent && !searchPlaceholder) return null;
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 10, height: 56, minHeight: 56, background: '#fff', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
      {titleComponent}
      {searchPlaceholder && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 240, background: 'var(--bg-surface-1)', borderRadius: 8, padding: '7px 12px', border: `1px solid ${topSearchFocused ? '#7c7cff' : 'var(--border-default)'}`, boxShadow: topSearchFocused ? '0 0 0 3px rgba(124,124,255,0.12)' : 'none', transition: 'border-color .15s ease, box-shadow .15s ease' }}>
          <Search size={14} color="var(--text-tertiary)" strokeWidth={2} />
          <input type="text" placeholder={searchPlaceholder} onFocus={() => setTopSearchFocused(true)} onBlur={() => setTopSearchFocused(false)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: 'var(--text-primary)', width: '100%', fontFamily: 'inherit' }} />
        </div>
      )}
    </div>
  );
}
