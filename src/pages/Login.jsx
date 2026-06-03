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
            <div style={{ position: 'relative', display: 'flex', height: '100vh', width: '100%', background: '#fafcff', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>

                {/* Subtle Gradients for entire screen */}
                <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 800, height: 800, background: 'radial-gradient(circle, rgba(124,124,255,0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-20%', right: '10%', width: 1000, height: 1000, background: 'radial-gradient(circle, rgba(0,82,204,0.12) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

                {/* Left side - Illustration */}
                <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 40px', position: 'relative', overflow: 'hidden', background: 'transparent' }}>

                    <style>{`
                        @keyframes float1 { 0%, 100% { transform: translate(-50%, -50%) translateY(0); } 50% { transform: translate(-50%, -50%) translateY(-10px); } }
                        @keyframes float2 { 0%, 100% { transform: translate(-50%, -50%) translateY(0); } 50% { transform: translate(-50%, -50%) translateY(8px); } }
                        @keyframes float3 { 0%, 100% { transform: translate(-50%, -50%) translateY(0); } 50% { transform: translate(-50%, -50%) translateY(-6px); } }
                        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(124,124,255,0.4); } 50% { box-shadow: 0 0 0 20px rgba(124,124,255,0); } }
                        @keyframes spinSlow { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }
                    `}</style>

                    <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 20 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: 'linear-gradient(135deg, rgba(0,82,204,0.1), rgba(124,124,255,0.1))', border: '1px solid rgba(124,124,255,0.2)', borderRadius: 20, marginBottom: 12 }}>
                            <Sparkles size={12} color="#0052cc" />
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#0052cc', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Enterprise Grade</span>
                        </div>
                        <h2 style={{ fontSize: 38, fontWeight: 800, margin: '0 0 12px 0', color: 'var(--text-primary)', letterSpacing: '-1px', lineHeight: 1.1 }}>
                            Where <span style={{ background: 'linear-gradient(135deg, #0052cc, #7c7cff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Drives</span><br />Procurement.
                        </h2>
                        <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 380, lineHeight: 1.4, margin: 0 }}>
                            Welcome to the next generation of autonomous enterprise sourcing.
                        </p>
                    </div>

                    {/* Central Diagram */}
                    <div style={{ position: 'relative', width: '100%', maxWidth: 700, height: 400 }}>

                        {/* Connecting Lines */}
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                            <path d="M 350 200 C 250 200, 200 100, 150 100" fill="none" stroke="url(#grad1)" strokeWidth="2.5" strokeDasharray="6 6" />
                            <path d="M 350 200 C 450 200, 500 100, 550 100" fill="none" stroke="url(#grad2)" strokeWidth="2.5" strokeDasharray="6 6" />

                            <path d="M 350 200 C 250 201, 150 199, 80 200" fill="none" stroke="url(#grad1)" strokeWidth="2.5" strokeDasharray="6 6" />
                            <path d="M 350 200 C 450 201, 550 199, 620 200" fill="none" stroke="url(#grad2)" strokeWidth="2.5" strokeDasharray="6 6" />

                            <path d="M 350 200 C 250 200, 200 300, 150 300" fill="none" stroke="url(#grad1)" strokeWidth="2.5" strokeDasharray="6 6" />
                            <path d="M 350 200 C 450 200, 500 300, 550 300" fill="none" stroke="url(#grad2)" strokeWidth="2.5" strokeDasharray="6 6" />

                            <defs>
                                <linearGradient id="grad1" x1="1" y1="0" x2="0" y2="0">
                                    <stop offset="0%" stopColor="rgba(0,82,204,0.6)" />
                                    <stop offset="100%" stopColor="rgba(0,82,204,0)" />
                                </linearGradient>
                                <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="rgba(124,124,255,0.6)" />
                                    <stop offset="100%" stopColor="rgba(124,124,255,0)" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Center Icon */}
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            width: 120, height: 120, background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 20px 40px rgba(0,82,204,0.1)', border: '1px solid rgba(255,255,255,0.8)',
                            zIndex: 10
                        }}>
                            <div style={{
                                width: 84, height: 84, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #0052cc, #7c7cff)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                animation: 'pulseGlow 3s infinite',
                                boxShadow: '0 8px 24px rgba(0,82,204,0.4)'
                            }}>
                                <ShieldCheck size={40} color="#fff" strokeWidth={1.5} />
                            </div>
                            {/* Orbiting rings - tight around the bounding box */}
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 140, height: 140, border: '1px solid rgba(124,124,255,0.3)', borderRadius: '50%', pointerEvents: 'none' }} />
                            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 160, height: 160, border: '1.5px dashed rgba(0,82,204,0.3)', borderRadius: '50%', animation: 'spinSlow 20s linear infinite', pointerEvents: 'none', transformOrigin: 'center center' }} />
                        </div>

                        {/* Node Pills */}
                        {(() => {
                            const pillStyle = {
                                position: 'absolute', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
                                color: 'var(--text-primary)', padding: '10px 18px', borderRadius: 30, fontSize: 13, fontWeight: 600,
                                boxShadow: '0 8px 24px rgba(0,82,204,0.08)', border: '1px solid rgba(255,255,255,1)',
                                display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.3s ease', whiteSpace: 'nowrap'
                            };
                            const dotStyle = { width: 8, height: 8, flexShrink: 0, borderRadius: '50%', background: 'linear-gradient(135deg, #0052cc, #7c7cff)', boxShadow: '0 0 8px rgba(124,124,255,0.6)' };

                            return (
                                <>
                                    <div style={{ ...pillStyle, top: '25%', left: '21%', transform: 'translate(-50%, -50%)', animation: 'float1 6s ease-in-out infinite' }}>
                                        <div style={dotStyle} /> Autonomous Agents
                                    </div>
                                    <div style={{ ...pillStyle, top: '25%', left: '79%', transform: 'translate(-50%, -50%)', animation: 'float2 7s ease-in-out infinite' }}>
                                        <div style={dotStyle} /> Predictive Analytics
                                    </div>

                                    <div style={{ ...pillStyle, top: '50%', left: '11%', transform: 'translate(-50%, -50%)', animation: 'float3 5s ease-in-out infinite' }}>
                                        <div style={dotStyle} /> ERP Integration
                                    </div>
                                    <div style={{ ...pillStyle, top: '50%', left: '89%', transform: 'translate(-50%, -50%)', animation: 'float1 8s ease-in-out infinite' }}>
                                        <div style={dotStyle} /> Smart Workflows
                                    </div>

                                    <div style={{ ...pillStyle, top: '75%', left: '21%', transform: 'translate(-50%, -50%)', animation: 'float2 6s ease-in-out infinite' }}>
                                        <div style={dotStyle} /> Cost Reduction
                                    </div>
                                    <div style={{ ...pillStyle, top: '75%', left: '79%', transform: 'translate(-50%, -50%)', animation: 'float3 7s ease-in-out infinite' }}>
                                        <div style={dotStyle} /> Risk Mitigation
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>

                {/* Right side - Login Option */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', background: 'transparent', position: 'relative', overflow: 'hidden' }}>

                    <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10, margin: 'auto' }}>

                        {/* The Box */}
                        <div style={{
                            width: '100%', padding: '48px 36px', background: '#fff',
                            border: '1px solid var(--border-subtle)', borderRadius: 20,
                            boxShadow: '0 12px 40px rgba(0,0,0,0.04)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center'
                        }}>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #3b5bdb, #4b6ef6)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(0,82,204,0.3)'
                                }}>
                                    <Zap size={22} color="#fff" strokeWidth={2.5} />
                                </div>
                                <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>ProcurAI</span>
                            </div>

                            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
                                Single Sign-On
                            </h1>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 32px 0', textAlign: 'center' }}>
                                Continue with your corporate identity provider
                            </p>

                            <button
                                onClick={() => {
                                    localStorage.setItem('userRole', 'manager');
                                    onLogin('manager');
                                    onNavigate('Dashboard');
                                }}
                                style={{
                                    width: '100%', padding: '16px', background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12,
                                    color: 'var(--text-primary)', fontSize: 15, fontWeight: 500, textAlign: 'center', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    transition: 'all 0.2s ease', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', fontFamily: 'inherit'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7c7cff'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(124,124,255,0.1)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)'; }}
                            >
                                <Globe size={18} color="#0052cc" />
                                Sign in with SSO
                            </button>

                            <button
                                onClick={() => setIsSSO(false)}
                                style={{
                                    marginTop: 24, background: 'none', border: 'none', fontSize: 14, fontWeight: 500,
                                    color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                                    fontFamily: 'inherit', transition: 'color 0.2s ease'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                            >
                                <ArrowLeft size={16} />
                                Back to credentials
                            </button>
                        </div>

                        {/*<div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 40 }}>
                            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                <span>Powered By</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.6 }}>
                                    <Zap size={14} /> <strong style={{ letterSpacing: 0.5 }}>ProcurAI</strong>
                                </div>
                            </div>

                            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 8 }}>
                                © 2026 ProcurAI Digital Solutions Pvt Ltd.
                            </div>

                            <div style={{ display: 'flex', gap: 24, fontSize: 11, color: 'var(--text-secondary)' }}>
                                <span style={{ cursor: 'pointer' }}>Cookie Policy</span>
                                <span style={{ cursor: 'pointer' }}>Terms Of Use</span>
                                <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
                            </div>
                        </div>*/}

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
