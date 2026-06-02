import React, { useState } from 'react';
import { Zap, ArrowRight, ShieldCheck, Globe, ArrowLeft, Lock, Bot, Sparkles, BarChart, Layers } from 'lucide-react';

export default function Login({ onNavigate, onLogin }) {
    const [email, setEmail] = useState('analyst@procurai.com');
    const [password, setPassword] = useState('password123');
    const [isSSO, setIsSSO] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        if (email && password) {
            const role = email === 'manager@procurai.com' ? 'manager' : 'analyst';
            localStorage.setItem('userRole', role);
            onLogin(role);
            onNavigate('Dashboard');
        }
    };

    if (isSSO) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif' }}>
                {/* Left side - Illustration */}
                <div style={{ flex: 1, background: 'linear-gradient(135deg, #0a192f, #112240, #0052cc)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                    {/* Decorative elements */}
                    <div style={{ position: 'absolute', width: 800, height: 800, background: 'radial-gradient(circle, rgba(124,124,255,0.15) 0%, rgba(124,124,255,0) 70%)', top: '-20%', left: '-20%', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', width: 600, height: 600, background: 'radial-gradient(circle, rgba(0,82,204,0.2) 0%, rgba(0,82,204,0) 70%)', bottom: '-10%', right: '-10%', borderRadius: '50%' }} />

                    <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 10 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: 30, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', marginBottom: 24 }}>
                            <Sparkles size={16} color="#7c7cff" />
                            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.5px', color: '#e0e7ff' }}>AI-NATIVE PROCUREMENT</span>
                        </div>

                        <h2 style={{ fontSize: 42, fontWeight: 700, margin: '0 0 20px 0', letterSpacing: '-1px', lineHeight: 1.1 }}>
                            Procurement on <br />
                            <span style={{ background: 'linear-gradient(90deg, #7c7cff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Autopilot.</span>
                        </h2>

                        <p style={{ fontSize: 17, opacity: 0.85, lineHeight: 1.6, marginBottom: 40, maxWidth: 380 }}>
                            Empower your enterprise with intelligent agent assistance, automated workflows, and predictive analytics.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <Bot size={20} color="#a5b4fc" />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 600 }}>Autonomous Agents</h4>
                                    <p style={{ margin: 0, fontSize: 14, opacity: 0.7, lineHeight: 1.5 }}>AI assistants that draft PRs, evaluate bids, and negotiate terms instantly.</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <BarChart size={20} color="#a5b4fc" />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 600 }}>Predictive Analytics</h4>
                                    <p style={{ margin: 0, fontSize: 14, opacity: 0.7, lineHeight: 1.5 }}>Deep insights into spend patterns, supplier risks, and cost-saving opportunities.</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <Layers size={20} color="#a5b4fc" />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 600 }}>Seamless Integrations</h4>
                                    <p style={{ margin: 0, fontSize: 14, opacity: 0.7, lineHeight: 1.5 }}>Connects flawlessly with your existing ERPs and identity providers.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Login Option */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, background: 'linear-gradient(135deg, #f0f4fc 0%, #e0e7ff 100%)', position: 'relative', overflow: 'hidden' }}>

                    {/* Subtle AI Background Patterns */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none',
                        backgroundImage: 'radial-gradient(rgba(124, 124, 255, 0.25) 1.5px, transparent 1.5px)',
                        backgroundSize: '32px 32px',
                        maskImage: 'radial-gradient(ellipse at center, transparent 20%, black 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 20%, black 100%)'
                    }} />
                    {/* Ambient Glows */}
                    <div style={{ position: 'absolute', width: 600, height: 600, background: 'radial-gradient(circle, rgba(124,124,255,0.06) 0%, rgba(124,124,255,0) 70%)', top: '-20%', right: '-20%', borderRadius: '50%', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', width: 600, height: 600, background: 'radial-gradient(circle, rgba(0,82,204,0.04) 0%, rgba(0,82,204,0) 70%)', bottom: '-20%', left: '-20%', borderRadius: '50%', pointerEvents: 'none' }} />

                    <div style={{
                        width: '100%', maxWidth: 380, background: '#fff',
                        borderRadius: 20, boxShadow: '0 8px 32px rgba(14,15,37,0.06)',
                        padding: '36px 32px', boxSizing: 'border-box', border: '1px solid var(--border-subtle)',
                        position: 'relative', zIndex: 10
                    }}>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
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
                            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0', letterSpacing: '-0.5px', textAlign: 'center' }}>
                                Single Sign-On
                            </h1>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, textAlign: 'center' }}>
                                Continue with your corporate identity provider
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                localStorage.setItem('userRole', 'manager');
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
                            Sign in with SSO
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
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0f4fc 0%, #e0e7ff 100%)', fontFamily: 'Inter, sans-serif' }}>
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
