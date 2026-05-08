import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  'Real-time claims tracking',
  'Member management',
  'Policy utilization insights',
  'Branch performance analytics',
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', width: '100%' }}>

      {/* ── LEFT PANEL (dark) ── */}
      <div
        style={{
          width: '60%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '40px 48px',
          color: 'white',
          flexShrink: 0,
          position: 'relative',
          backgroundImage: 'url(/login-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#0f1923',
        }}
      >
        {/* Dark overlay so text is always readable over any image */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(15,25,35,0.88) 0%, rgba(10,20,50,0.82) 100%)',
          zIndex: 0,
        }} />
        {/* All content above overlay */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', flex: 1 }}>
        {/* Top section: logo + tagline + bullets */}
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              backgroundColor: 'white', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: '800', fontSize: '15px', color: '#3b82f6',
              flexShrink: 0, overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}>
              <img src="/bb-logo.png" alt="Bharat Bima" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.35)', transformOrigin: 'center' }}
                onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }} />
              <span style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>BB</span>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'white', lineHeight: '1.2' }}>Bharat Bima</div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>Partner Portal</div>
            </div>
          </div>

          {/* Tagline */}
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'white', lineHeight: '1.3', marginBottom: '12px' }}>
            Your health. Our partnership.
          </h1>
          <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '32px', lineHeight: '1.6' }}>
            Manage your company's health insurance portfolio with ease.
          </p>

          {/* Feature bullets */}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {features.map((f) => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#d1d5db' }}>
                <span style={{
                  width: '22px', height: '22px', borderRadius: '50%',
                  backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: Trusted by */}
        <p style={{ fontSize: '12px', color: '#3b82f6' }}>
          Trusted by 500+ companies across Africa
        </p>
        </div>{/* end z-index wrapper */}
      </div>

      {/* ── RIGHT PANEL (white) ── */}
      <div style={{
        flex: 1,
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 60px',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>

          <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>Sign In</h2>
          <p style={{ fontSize: '14px', color: '#3b82f6', marginBottom: '32px' }}>
            Enter your credentials to access your dashboard
          </p>

          {error && (
            <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                style={{
                  width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
                  borderRadius: '6px', fontSize: '14px', color: '#111827',
                  outline: 'none', boxSizing: 'border-box', backgroundColor: 'white',
                }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '10px 50px 10px 12px', border: '1px solid #d1d5db',
                    borderRadius: '6px', fontSize: '14px', color: '#111827',
                    outline: 'none', boxSizing: 'border-box', backgroundColor: 'white',
                  }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#6b7280', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  style={{ width: '15px', height: '15px' }}
                />
                Remember me
              </label>
              <button type="button" style={{ fontSize: '13px', color: '#3b82f6', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}>
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '11px', backgroundColor: '#22d3ee',
                color: 'white', border: 'none', borderRadius: '6px',
                fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading
                ? <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }}></span>
                : 'Sign In to Partner Portal'
              }
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
          </div>

          {/* Google */}
          <button
            type="button"
            style={{
              width: '100%', padding: '10px', border: '1px solid #e5e7eb',
              borderRadius: '6px', fontSize: '14px', fontWeight: '500',
              color: '#374151', backgroundColor: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>

          <p style={{ fontSize: '12px', textAlign: 'center', color: '#9ca3af', marginTop: '28px', lineHeight: '1.6' }}>
            Access restricted to registered distribution partners.<br />
            Contact your Bharat Bima account manager for access.
          </p>
        </div>
      </div>
    </div>
  );
}
