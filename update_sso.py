import os

with open('src/pages/Login.jsx', 'r', encoding='utf-8') as f:
    lines = f.read().split('\n')

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if 'if (isSSO) {' in line:
        start_idx = i
        break

if start_idx != -1:
    open_brackets = 0
    for i in range(start_idx, len(lines)):
        open_brackets += lines[i].count('{')
        open_brackets -= lines[i].count('}')
        if open_brackets == 0:
            end_idx = i
            break

print("Start idx:", start_idx)
print("End idx:", end_idx)

new_block = """    if (isSSO) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif' }}>
                {/* Left side - Illustration */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 60 }}>
                        <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 16px 0', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                            Where AI Drives<br />Procurement.
                        </h2>
                        <div style={{ background: '#0052cc', color: '#fff', padding: '6px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, display: 'inline-block' }}>
                            Welcome to ProcurAI Workspace.
                        </div>
                    </div>

                    {/* Central Diagram */}
                    <div style={{ position: 'relative', width: 600, height: 400 }}>
                        
                        {/* Connecting Lines */}
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                            {/* Horizontal / straight lines to nodes */}
                            <line x1="300" y1="200" x2="150" y2="100" stroke="var(--border-strong)" strokeWidth="1.5" strokeDasharray="4 4" />
                            <line x1="300" y1="200" x2="450" y2="100" stroke="var(--border-strong)" strokeWidth="1.5" strokeDasharray="4 4" />
                            <line x1="300" y1="200" x2="78" y2="200" stroke="var(--border-strong)" strokeWidth="1.5" strokeDasharray="4 4" />
                            <line x1="300" y1="200" x2="522" y2="200" stroke="var(--border-strong)" strokeWidth="1.5" strokeDasharray="4 4" />
                            <line x1="300" y1="200" x2="150" y2="300" stroke="var(--border-strong)" strokeWidth="1.5" strokeDasharray="4 4" />
                            <line x1="300" y1="200" x2="450" y2="300" stroke="var(--border-strong)" strokeWidth="1.5" strokeDasharray="4 4" />
                            
                            {/* Connection dots at the end of lines */}
                            <circle cx="150" cy="100" r="4" fill="#0052cc" />
                            <circle cx="450" cy="100" r="4" fill="#0052cc" />
                            <circle cx="78" cy="200" r="4" fill="#0052cc" />
                            <circle cx="522" cy="200" r="4" fill="#0052cc" />
                            <circle cx="150" cy="300" r="4" fill="#0052cc" />
                            <circle cx="450" cy="300" r="4" fill="#0052cc" />
                        </svg>

                        {/* Center Icon */}
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            width: 120, height: 120, background: '#fff', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 12px 32px rgba(0,82,204,0.15)', border: '1px solid var(--border-subtle)',
                            zIndex: 10
                        }}>
                            <Bot size={54} color="#0052cc" strokeWidth={1.5} />
                            <div style={{ position: 'absolute', width: 144, height: 144, border: '1.5px dashed var(--border-strong)', borderRadius: '50%' }} />
                        </div>

                        {/* Node Pills */}
                        <div style={{ position: 'absolute', top: '25%', left: '25%', transform: 'translate(-50%, -50%)', background: 'var(--text-primary)', color: '#fff', padding: '10px 20px', borderRadius: 24, fontSize: 13, fontWeight: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>Autonomous Agents</div>
                        <div style={{ position: 'absolute', top: '25%', left: '75%', transform: 'translate(-50%, -50%)', background: 'var(--text-primary)', color: '#fff', padding: '10px 20px', borderRadius: 24, fontSize: 13, fontWeight: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>Predictive Analytics</div>
                        
                        <div style={{ position: 'absolute', top: '50%', left: '13%', transform: 'translate(-50%, -50%)', background: 'var(--text-primary)', color: '#fff', padding: '10px 20px', borderRadius: 24, fontSize: 13, fontWeight: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>ERP Integration</div>
                        <div style={{ position: 'absolute', top: '50%', left: '87%', transform: 'translate(-50%, -50%)', background: 'var(--text-primary)', color: '#fff', padding: '10px 20px', borderRadius: 24, fontSize: 13, fontWeight: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>Smart Workflows</div>
                        
                        <div style={{ position: 'absolute', top: '75%', left: '25%', transform: 'translate(-50%, -50%)', background: 'var(--text-primary)', color: '#fff', padding: '10px 20px', borderRadius: 24, fontSize: 13, fontWeight: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>Cost Reduction</div>
                        <div style={{ position: 'absolute', top: '75%', left: '75%', transform: 'translate(-50%, -50%)', background: 'var(--text-primary)', color: '#fff', padding: '10px 20px', borderRadius: 24, fontSize: 13, fontWeight: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>Risk Mitigation</div>
                    </div>
                </div>

                {/* Right side - Login Option */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, background: '#fff', position: 'relative', overflow: 'hidden' }}>
                    
                    {/* Background Blob like in image */}
                    <div style={{ position: 'absolute', top: -150, right: -150, width: 600, height: 600, background: 'var(--bg-surface-2)', borderRadius: '50%', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: -150, left: -200, width: 500, height: 500, background: 'var(--bg-surface-2)', borderRadius: '50%', pointerEvents: 'none' }} />

                    <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0052cc, #7c7cff)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(0,82,204,0.3)'
                            }}>
                                <Zap size={18} color="#fff" strokeWidth={2.5} />
                            </div>
                            <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>ProcurAI</span>
                        </div>
                        
                        <h1 style={{ fontSize: 24, fontWeight: 400, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
                            Single sign on
                        </h1>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 32px 0' }}>
                            Sign in with your identity provider
                        </p>
                        
                        <button
                            onClick={() => {
                                localStorage.setItem('userRole', 'manager');
                                onLogin('manager');
                                onNavigate('Dashboard');
                            }}
                            style={{
                                width: '100%', padding: '16px', background: '#fff', border: '1px solid var(--border-default)', borderRadius: 4,
                                color: 'var(--text-primary)', fontSize: 14, textAlign: 'left', cursor: 'pointer', paddingLeft: '24px',
                                transition: 'all 0.2s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', fontFamily: 'inherit'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7c7cff'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(124,124,255,0.1)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)'; }}
                        >
                            Single Sign On
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '32px 0' }}>
                            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                            <span style={{ padding: '0 16px', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>OR</span>
                            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                        </div>

                        <button
                            onClick={() => setIsSSO(false)}
                            style={{
                                width: '100%', padding: '16px', background: '#fff', border: '1px solid var(--border-default)', borderRadius: 4,
                                color: 'var(--text-secondary)', fontSize: 14, textAlign: 'center', cursor: 'pointer',
                                transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'inherit'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        >
                            <Lock size={16} color="#0052cc" />
                            Sign in with ProcurAI Credentials
                        </button>
                        
                        <div style={{ marginTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                <span>Powered By</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.6 }}>
                                    <Zap size={14} /> <strong style={{ letterSpacing: 0.5 }}>ProcurAI</strong>
                                </div>
                            </div>
                            
                            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 16 }}>
                                © 2026 ProcurAI Digital Solutions Pvt Ltd.
                            </div>
                            
                            <div style={{ display: 'flex', gap: 24, fontSize: 12, color: 'var(--text-secondary)' }}>
                                <span style={{ cursor: 'pointer' }}>Cookie Policy</span>
                                <span style={{ cursor: 'pointer' }}>Terms Of Use</span>
                                <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }"""

if start_idx != -1 and end_idx != -1:
    lines = lines[:start_idx] + [new_block] + lines[end_idx+1:]
    with open('src/pages/Login.jsx', 'w', encoding='utf-8') as f:
        f.write('\\n'.join(lines))
    print("Replaced successfully!")
else:
    print("Failed to find block boundaries.")
