import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth';

export default function Dashboard() {
  const { user, logout, fetchUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => { fetchUser(); }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #f0f4ff 0%, #fafbff 50%, #f0f7ff 100%)',
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{
        background: 'white', borderRadius: 16,
        border: '1px solid #e8eef5',
        boxShadow: '0 20px 60px rgba(15,28,53,0.1)',
        padding: '48px 40px', maxWidth: 480, width: '100%',
        textAlign: 'center',
      }}>
        {/* Avatar */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff9c43 0%, #e07620 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: 22, color: 'white', fontWeight: 800,
        }}>
          {user?.name?.[0]?.toUpperCase() ?? '?'}
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 20, padding: '4px 12px', marginBottom: 16 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#166534' }}>Authenticated</span>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1208', marginBottom: 6, letterSpacing: '-0.5px' }}>
          Welcome, {user?.name ?? 'Applicant'}
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>{user?.email}</p>
        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 36, lineHeight: 1.6 }}>
          Your applicant dashboard is under construction.<br />
          Full Phase 1–4 workflow coming in <strong style={{ color: '#ff9c43' }}>v1.0.0</strong>.
        </p>

        {/* Upcoming phases teaser */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 32 }}>
          {[
            { label: 'Registration & Application', phase: '01', status: 'Coming soon' },
            { label: 'BPLO Review & Clearances',   phase: '02', status: 'Coming soon' },
            { label: 'Assessment & Payment',        phase: '03', status: 'Coming soon' },
            { label: 'Permit Issuance',             phase: '04', status: 'Coming soon' },
          ].map((p) => (
            <div key={p.phase} style={{
              background: '#f8fafc', border: '1px solid #e8eef5',
              borderRadius: 10, padding: '14px 16px', textAlign: 'left',
            }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fff3e6', letterSpacing: '-1px', lineHeight: 1, marginBottom: 6, fontFamily: 'Georgia, serif' }}>{p.phase}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1208', marginBottom: 2, lineHeight: 1.4 }}>{p.label}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{p.status}</div>
            </div>
          ))}
        </div>

        <button onClick={handleLogout} style={{
          width: '100%', padding: '12px',
          background: 'transparent', color: '#64748b',
          border: '1.5px solid #e2e8f0', borderRadius: 8,
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'inherit', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff9c43'; e.currentTarget.style.color = '#ff9c43'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}