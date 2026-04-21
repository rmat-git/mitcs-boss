import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();

  const from = location.state?.from?.pathname ?? '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated]);

  // Clear store error when user edits form
  useEffect(() => { clearError(); }, [form.email, form.password]);
  useEffect(() => {                                          // 👈 add here
  document.body.style.overflow = 'hidden';
  return () => { document.body.style.overflow = ''; };
}, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
    if (result.success) navigate(from, { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      background: 'linear-gradient(160deg, #f0f4ff 0%, #fafbff 50%, #f0f7ff 100%)',
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      padding: '48px 2rem 48px',
      position: 'relative', overflow: 'hidden',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(26,79,139,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,79,139,0.04) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div style={{ width: '100%', maxWidth: 440, zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #ff9c43 0%, #e07620 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(26,79,139,0.3)',
            }}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L3 6.5V13.5L10 18L17 13.5V6.5L10 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M10 6V14M7 8L13 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#e07620', letterSpacing: '-0.3px', lineHeight: 1 }}>eBOSS</div>
              <div style={{ fontSize: 10, color: '#64748b', letterSpacing: '0.08em', lineHeight: 1.3, textTransform: 'uppercase' }}>Bacolod City</div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div style={{
          background: 'white', borderRadius: 16,
          border: '1px solid #e8eef5',
          boxShadow: '0 20px 60px rgba(15,28,53,0.1), 0 4px 16px rgba(15,28,53,0.05)',
          padding: '40px 40px 36px',
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1208', marginBottom: 4, letterSpacing: '-0.5px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>
            Sign in to continue your permit application.
          </p>

          {/* Error banner */}
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 8, padding: '10px 14px', marginBottom: 20,
              fontSize: 13, color: '#dc2626', display: 'flex', gap: 8, alignItems: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#dc2626" strokeWidth="1.4"/>
                <path d="M7 4v3M7 9.5v.5" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email" name="email" required
                value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '11px 14px', fontSize: 14,
                  border: '1.5px solid #e2e8f0', borderRadius: 8,
                  outline: 'none', color: '#1a1208', background: '#fafbff',
                  boxSizing: 'border-box', transition: 'border-color 0.2s',
                  fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = '#ff9c43'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Password</label>
                <a href="#" style={{ fontSize: 12, color: '#ff9c43', textDecoration: 'none', fontWeight: 500 }}>
                  Forgot password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password" required
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '11px 40px 11px 14px', fontSize: 14,
                    border: '1.5px solid #e2e8f0', borderRadius: 8,
                    outline: 'none', color: '#1a1208', background: '#fafbff',
                    boxSizing: 'border-box', transition: 'border-color 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => e.target.style.borderColor = '#ff9c43'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  color: '#94a3b8', display: 'flex', alignItems: 'center',
                }}>
                  {showPassword
                    ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading} style={{
              width: '100%', padding: '13px', marginTop: 4,
              background: isLoading ? '#93b4d9' : '#ff9c43',
              color: 'white', border: 'none', borderRadius: 8,
              fontSize: 14, fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s, transform 0.1s',
              fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = '#e07620'; }}
              onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background = '#ff9c43'; }}
            >
              {isLoading && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                  <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                  <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Register link */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#ff9c43', fontWeight: 600, textDecoration: 'none' }}>
            Register here
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}