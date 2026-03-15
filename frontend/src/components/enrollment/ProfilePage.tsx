import React, { useState } from 'react';
import { loginUser } from '../../api/auth.api';
import { useAuth } from '../../auth/useAuth';

// backend base URL already configured in axios instance


export default function ProfilePage() {
  const { user, login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(form);
      login(res.data.access_token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <h2 style={s.title}>Sign In</h2>
          <p style={s.sub}>Sign in to view your profile</p>
          <form onSubmit={handleLogin}>
            <input
              style={s.input}
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              autoFocus
            />
            <input
              style={s.input}
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
            {error && <p style={s.error}>{error}</p>}
            <button type="submit" disabled={loading} style={s.btn}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.avatarLarge}>{user.full_name?.charAt(0).toUpperCase()}</div>
        <h2 style={s.title}>{user.full_name}</h2>
        <span style={s.roleBadge}>{user.role}</span>

        <div style={s.detailsGrid}>
          <div style={s.detailRow}>
            <span style={s.label}>Email</span>
            <span style={s.value}>{user.email}</span>
          </div>
          <div style={s.detailRow}>
            <span style={s.label}>Role</span>
            <span style={s.value}>{user.role}</span>
          </div>
          <div style={s.detailRow}>
            <span style={s.label}>User ID</span>
            <span style={{ ...s.value, fontSize: 12, color: '#9ca3af' }}>{user.sub}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '40px 24px', minHeight: 'calc(100vh - 64px)',
    background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  /* Tabs */
  tabBar: {
    display: 'flex', gap: 8, marginBottom: 28,
    background: 'rgba(255,255,255,0.6)', borderRadius: 30, padding: 6,
    boxShadow: '0 2px 12px rgba(79,70,229,0.10)',
  },
  tab: {
    padding: '9px 26px', borderRadius: 24, border: 'none', cursor: 'pointer',
    fontSize: 14, fontWeight: 600, color: '#6b7280', background: 'transparent',
    display: 'flex', alignItems: 'center', gap: 6,
    transition: 'all 0.18s',
  },
  tabActive: {
    background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', color: '#fff',
    boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
  },
  badge: {
    background: '#fff', color: '#7c3aed', borderRadius: 20,
    fontSize: 11, fontWeight: 800, padding: '1px 7px', marginLeft: 2,
  },
  card: {
    background: '#fff', borderRadius: 20, padding: '44px 40px',
    boxShadow: '0 8px 40px rgba(79,70,229,0.14)', width: '100%', maxWidth: 440,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
  },
  avatarLarge: {
    width: 80, height: 80, borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 34, fontWeight: 800, marginBottom: 4,
    boxShadow: '0 6px 20px rgba(79,70,229,0.35)',
  },
  title: { margin: 0, fontSize: 22, fontWeight: 800, color: '#1e1b4b' },
  sub: { margin: '0 0 12px', fontSize: 14, color: '#6b7280', textAlign: 'center' },
  roleBadge: {
    background: 'linear-gradient(90deg,#7c3aed,#4f46e5)', color: '#fff',
    padding: '4px 18px', borderRadius: 20, fontSize: 11, fontWeight: 700,
    letterSpacing: 1, textTransform: 'uppercase',
  },
  detailsGrid: {
    width: '100%', marginTop: 20,
    display: 'flex', flexDirection: 'column', gap: 0,
    border: '1px solid #e0e7ff', borderRadius: 12, overflow: 'hidden',
  },
  detailRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '13px 18px', borderBottom: '1px solid #f5f3ff', background: '#fff',
  },
  label: { fontSize: 13, color: '#7c3aed', fontWeight: 700 },
  value: { fontSize: 14, color: '#1e1b4b', fontWeight: 500, textAlign: 'right' },
  input: {
    display: 'block', width: '100%', padding: '12px 14px', marginBottom: 12,
    border: '1.5px solid #ddd6fe', borderRadius: 10, fontSize: 14, boxSizing: 'border-box',
    outline: 'none',
  },
  error: { color: '#ef4444', margin: '0 0 10px', fontSize: 13 },
  btn: {
    width: '100%',
    background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none',
    borderRadius: 10, padding: '13px', cursor: 'pointer', fontWeight: 700, fontSize: 15,
    boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
  },
  /* Wishlist tab pane */
  wishlistPane: {
    width: '100%', maxWidth: 900,
  },
  wishlistEmpty: {
    background: '#fff', borderRadius: 16, padding: '48px 24px', textAlign: 'center',
    border: '1px dashed #ddd6fe', boxShadow: '0 4px 20px rgba(79,70,229,0.06)',
  },
  wishlistGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16,
  },
  wishlistCard: {
    background: 'linear-gradient(160deg,#fff 70%,#f5f3ff 100%)',
    border: '1px solid #e0e7ff', borderRadius: 14, padding: '16px 18px',
    display: 'flex', flexDirection: 'column', gap: 8,
    boxShadow: '0 2px 12px rgba(79,70,229,0.08)',
  },
  wishlistCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  techBadge: {
    background: 'linear-gradient(90deg,#7c3aed,#4f46e5)', color: '#fff',
    padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
  },
  removeBtn: {
    background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 2,
  },
  heartToggleBtn: {
    background: 'transparent', border: '1.5px solid #ddd6fe', borderRadius: 8,
    padding: '4px 8px', cursor: 'pointer', fontSize: 16, lineHeight: 1,
  },
  wishlistCourseName: { margin: 0, fontSize: 14, fontWeight: 700, color: '#1e1b4b' },
  wishlistInstructor: { margin: 0, fontSize: 12, color: '#6b7280' },
};
