import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/auth';
import logoImg from '../../assets/logo.png';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();

  const from = location.state?.from?.pathname ?? '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  // OTP state
  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated]);

  useEffect(() => { clearError(); }, [form.email, form.password]);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Optionally pre-validate credentials here before showing OTP step:
    // const result = await checkCredentials(form); if (!result.success) return;
    // Then send OTP: await sendOtp(form.email)
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    setResendCooldown(60);
    setStep('otp');
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  // Handle OTP digit input
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setOtpError('');
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) otpRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    pasted.split('').forEach((d, i) => { next[i] = d; });
    setOtp(next);
    const focusIdx = Math.min(pasted.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  const handleOtpConfirm = async () => {
    const code = otp.join('');
    if (code.length < 6) { setOtpError('Please enter the complete 6-digit code.'); return; }
    setOtpLoading(true);
    setOtpError('');
    try {
      // Replace with your actual OTP verification + login call:
      // e.g. await verifyOtp(form.email, code); then login(form)
      const result = await login(form);
      if (result.success) navigate(from, { replace: true });
      else setOtpError('Invalid or expired code. Please try again.');
    } catch {
      setOtpError('Something went wrong. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    setResendCooldown(60);
    // Call your resend OTP API here: await sendOtp(form.email)
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const otpBoxStyle = (index) => ({
    width: 48, height: 56,
    textAlign: 'center', fontSize: 22, fontWeight: 700,
    border: `1.5px solid ${otpError ? '#fca5a5' : otp[index] ? '#ff9c43' : '#e2e8f0'}`,
    borderRadius: 10, outline: 'none', color: '#1a1208',
    background: otpError ? '#fff5f5' : otp[index] ? '#fff8f3' : '#fafbff',
    transition: 'border-color 0.2s, background 0.2s',
    fontFamily: 'inherit',
    caretColor: '#ff9c43',
  });

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
            <img
              src={logoImg}
              alt="Bacolod City eBOSS Logo"
              style={{ width: 36, height: 36, objectFit: 'contain' }}
            />
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

          {step === 'form' ? (
            <>
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
            </>
          ) : (
            /* ── OTP Step ── */
            <>
              {/* Back button */}
              <button
                type="button"
                onClick={() => { setStep('form'); setOtpError(''); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#64748b', fontSize: 13, fontWeight: 600,
                  padding: 0, marginBottom: 20, fontFamily: 'inherit',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </button>

              {/* Shield icon */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: '#fff8f3', border: '1.5px solid #ffd8b0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L4 5.5V11c0 4.418 3.358 8.16 8 9 4.642-.84 8-4.582 8-9V5.5L12 2Z" stroke="#ff9c43" strokeWidth="1.6" strokeLinejoin="round"/>
                    <path d="M9 12l2 2 4-4" stroke="#ff9c43" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1208', marginBottom: 4, letterSpacing: '-0.5px', textAlign: 'center' }}>
                Verify your identity
              </h1>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24, textAlign: 'center', lineHeight: 1.6 }}>
                We sent a 6-digit code to<br />
                <span style={{ fontWeight: 600, color: '#374151' }}>{form.email}</span>
              </p>

              {/* OTP boxes */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    onPaste={i === 0 ? handleOtpPaste : undefined}
                    onFocus={e => {
                      e.target.style.borderColor = otpError ? '#fca5a5' : '#ff9c43';
                      e.target.style.boxShadow = '0 0 0 3px rgba(255,156,67,0.15)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = otpError ? '#fca5a5' : digit ? '#ff9c43' : '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                    style={otpBoxStyle(i)}
                  />
                ))}
              </div>

              {/* OTP error */}
              {otpError && (
                <p style={{ fontSize: 12, color: '#dc2626', textAlign: 'center', marginBottom: 12, marginTop: 4 }}>
                  {otpError}
                </p>
              )}

              {/* Resend */}
              <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 20, marginTop: otpError ? 0 : 12 }}>
                Didn't receive a code?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  style={{
                    background: 'none', border: 'none', cursor: resendCooldown > 0 ? 'default' : 'pointer',
                    color: resendCooldown > 0 ? '#94a3b8' : '#ff9c43',
                    fontWeight: 600, fontSize: 13, padding: 0, fontFamily: 'inherit',
                  }}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                </button>
              </p>

              {/* Confirm button */}
              <button
                type="button"
                onClick={handleOtpConfirm}
                disabled={otpLoading || otp.join('').length < 6}
                style={{
                  width: '100%', padding: '13px',
                  background: otpLoading || otp.join('').length < 6 ? '#93b4d9' : '#ff9c43',
                  color: 'white', border: 'none', borderRadius: 8,
                  fontSize: 14, fontWeight: 700,
                  cursor: otpLoading || otp.join('').length < 6 ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
                onMouseEnter={e => { if (!otpLoading && otp.join('').length === 6) e.currentTarget.style.background = '#e07620'; }}
                onMouseLeave={e => { if (!otpLoading && otp.join('').length === 6) e.currentTarget.style.background = '#ff9c43'; }}
              >
                {otpLoading && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                    <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
                {otpLoading ? 'Verifying…' : 'Confirm'}
              </button>
            </>
          )}
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