import React, { useState } from 'react';
import { Zap, ArrowRight, ShieldCheck, Globe, ArrowLeft, Lock } from 'lucide-react';

export default function Login({ onNavigate, onLogin }) {
    const [email, setEmail] = useState('analyst@procurai.com');
    const [password, setPassword] = useState('password123');
    const [isSSO, setIsSSO] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        if (email && password) {
            const role = email === 'manager@procurai.com' ? 'manager' : 'analyst';
            onLogin(role);
            onNavigate('Dashboard');
        }
    };

    if (isSSO) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif' }}>
                {/* Left side - Illustration */}
                <div style={{ flex: 1, background: 'linear-gradient(135deg, #0052cc, #7c7cff)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, color: '#fff', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', width: 600, height: 600, background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)', top: '-10%', left: '-10%', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)', bottom: '-5%', right: '-5%', borderRadius: '50%' }} />
                    
                    <div style={{ width: '100%', maxWidth: 360, aspectRatio: '1', background: 'rgba(255,255,255,0.08)', borderRadius: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 24px 48px rgba(0,0,0,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', position: 'relative', zIndex: 10 }}>
                        <div style={{ position: 'absolute', top: 32, right: 32, width: 48, height: 48, background: 'rgba(255,255,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Lock size={24} color="#fff" strokeWidth={1.5} />
                        </div>
                        <ShieldCheck size={140} color="#fff" strokeWidth={1.2} />
                    </div>
                    
                    <h2 style={{ fontSize: 32, fontWeight: 700, marginTop: 48, marginBottom: 16, textAlign: 'center', position: 'relative', zIndex: 10, letterSpacing: '-0.5px' }}>
                        Secure Enterprise Access
                    </h2>
                    <p style={{ fontSize: 16, opacity: 0.85, textAlign: 'center', maxWidth: 400, lineHeight: 1.6, position: 'relative', zIndex: 10 }}>
                        Log in seamlessly via your organization's Single Sign-On provider to access the intelligent procurement portal.
                    </p>
                </div>

                {/* Right side - Login Option */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, background: 'var(--bg-default)' }}>
                    <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 32 }}>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #0052cc, #7c7cff)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(0,82,204,0.3)'
                                }}>
                                    <Zap size={20} color="#fff" strokeWidth={2.5} />
                                </div>
                                <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>ProcurAI</span>
                            </div>
                            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0', letterSpacing: '-0.5px', textAlign: 'center' }}>
                                Single Sign-On
                            </h1>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, textAlign: 'center' }}>
                                Continue with your corporate identity provider
                            </p>
                        </div>
                        
                        <div style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 8px 32px rgba(14,15,37,0.06)', border: '1px solid var(--border-subtle)' }}>
                            <button
                                onClick={() => {
                                    onLogin('manager'); // Treat SSO as manager login for demo
                                    onNavigate('Dashboard');
                                }}
                                style={{
                                    width: '100%', padding: '14px', borderRadius: 10, border: '1px solid var(--border-default)',
                                    background: '#fff', color: 'var(--text-primary)',
                                    fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 24,
                                    boxShadow: '0 2px 8px rgba(14,15,37,0.03)', transition: 'all 0.2s ease',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'inherit'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-surface-2)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <Globe size={18} color="#0052cc" />
                                Sign in with SAML / SSO
                            </button>
                            
                            <div style={{ textAlign: 'center' }}>
                                <button
                                    onClick={() => setIsSSO(false)}
                                    style={{
                                        background: 'none', border: 'none', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
                                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'color 0.2s ease',
                                        fontFamily: 'inherit', padding: '8px 12px', borderRadius: 6
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-surface-1)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <ArrowLeft size={14} />
                                    Back to credentials
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-default)', fontFamily: 'Inter, sans-serif' }}>
            <div style={{
                width: '100%', maxWidth: 380, background: '#fff',
                borderRadius: 20, boxShadow: '0 8px 32px rgba(14,15,37,0.08)',
                padding: '36px 32px', boxSizing: 'border-box', margin: 20
            }}>

                {/* Header / Logo */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0052cc, #7c7cff)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0,82,204,0.3)'
                        }}>
                            <Zap size={18} color="#fff" strokeWidth={2.5} />
                        </div>
                        <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>ProcurAI</span>
                    </div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
                        Log in to your account
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, textAlign: 'center' }}>
                        Please enter your credentials to access the procurement portal
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@procurai.com"
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border-default)',
                                fontSize: 14, color: 'var(--text-primary)', background: '#fff', outline: 'none',
                                boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#7c7cff';
                                e.target.style.boxShadow = '0 0 0 3px rgba(124,124,255,0.12)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'var(--border-default)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border-default)',
                                fontSize: 14, color: 'var(--text-primary)', background: '#fff', outline: 'none',
                                boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#7c7cff';
                                e.target.style.boxShadow = '0 0 0 3px rgba(124,124,255,0.12)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'var(--border-default)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%', padding: '14px', borderRadius: 10, border: 'none',
                            background: '#0052cc', color: '#fff',
                            fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 8,
                            boxShadow: '0 4px 16px rgba(0,82,204,0.12)', transition: 'transform 0.1s ease, box-shadow 0.2s ease, background 0.2s ease',
                            fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#0049b7'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#0052cc'}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Login
                        <ArrowRight size={16} color="#fff" />
                    </button>

                    {/* SSO Login Link */}
                    <div style={{ textAlign: 'center', marginTop: 2 }}>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); setIsSSO(true); }}
                            style={{
                                fontSize: 13, fontWeight: 600, color: '#0052cc', textDecoration: 'none', transition: 'color 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#003d99'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#0052cc'}
                        >
                            Log in with SSO
                        </a>
                    </div>
                </form>

                {/* Demo Credentials */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 20 }}>
                    <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px 0' }}>
                        Demo Credentials
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Analyst</span>
                            <span style={{ color: 'var(--text-tertiary)' }}>analyst@procurai.com / password123</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Manager</span>
                            <span style={{ color: 'var(--text-tertiary)' }}>manager@procurai.com / password123</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
