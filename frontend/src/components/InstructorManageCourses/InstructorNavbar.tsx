import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

export default function InstructorNavbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isActive = (path: string) => location.pathname === path;
  const [panelOpen, setPanelOpen] = useState(false);

  const instructorId = localStorage.getItem("userId");

  return (
    <>
      <nav style={s.nav}>
        {/* Left spacer */}
        <div style={{ flex: 1 }} />

        {/* Centre links */}
        <div style={s.links}>
          {[{ to: '/instructor/manage-courses', label: 'Manage Courses' }, { to: `/instructor/${instructorId}/course/create`, label: 'Create Course' }].map(({ to, label }) => (
            <Link key={to} to={to} className={`nav-link${isActive(to) ? ' nav-link-active' : ''}`} style={{ ...s.link, ...(isActive(to) ? s.linkActive : {}) }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Profile — right side */}
        <div style={{ ...s.profileArea, flex: 1, justifyContent: 'flex-end' }}>
          {user ? (
            <div
              style={s.profileTrigger}
              onMouseEnter={() => setPanelOpen(true)}
              onMouseLeave={() => setPanelOpen(false)}
            >
              <div style={s.avatar}>{user.full_name?.charAt(0).toUpperCase()}</div>
              <span style={s.userName}>{user.full_name}</span>
            </div>
          ) : (
            <Link to="/student/profile" className={`nav-link${isActive('/student/profile') ? ' nav-link-active' : ''}`} style={{ ...s.link, ...(isActive('/student/profile') ? s.linkActive : {}) }}>
              Profile
            </Link>
          )}
        </div>
      </nav>

      {/* Sliding profile panel */}
      {user && (
        <div
          style={{ ...s.slidePanel, transform: panelOpen ? 'translateX(0)' : 'translateX(110%)' }}
          onMouseEnter={() => setPanelOpen(true)}
          onMouseLeave={() => setPanelOpen(false)}
        >
          {/* Header */}
          <div style={s.panelHeader}>
            <div style={s.panelAvatar}>{user.full_name?.charAt(0).toUpperCase()}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={s.panelName}>{user.full_name}</div>
              <span style={s.panelRoleBadge}>{user.role}</span>
              <button style={s.logoutBtn} className="logout-btn" onClick={logout}>🚪&nbsp; Logout</button>
            </div>
          </div>

          <div style={s.divider} />

          {/* Details */}
          {[
            { label: '✉️  Email', value: user.email },
            { label: '🪪  Role', value: user.role },
            { label: '🔑  User ID', value: String(user.sub) },
          ].map(({ label, value }) => (
            <div key={label} style={s.detailRow}>
              <span style={s.detailLabel}>{label}</span>
              <span style={s.detailValue}>{value}</span>
            </div>
          ))}

          <div style={s.divider} />
        </div>
      )}
    </>
  );
}

const PANEL_WIDTH = 280;

const s: Record<string, React.CSSProperties> = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 36px', height: 64,
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    position: 'sticky', top: 0, zIndex: 200,
    boxShadow: '0 4px 20px rgba(79,70,229,0.35)',
  },
  links: { display: 'flex', gap: 4 },
  link: {
    padding: '7px 18px', borderRadius: 20, textDecoration: 'none',
    fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)',
    transition: 'background 0.2s, color 0.2s',
  },
  linkActive: {
    background: 'rgba(255,255,255,0.2)', color: '#fff',
  },
  profileArea: {
    display: 'flex', alignItems: 'center', gap: 10,
  },
  profileTrigger: {
    display: 'flex', alignItems: 'center', gap: 10,
    cursor: 'pointer', padding: '4px 8px', borderRadius: 24,
    transition: 'background 0.2s',
  },
  avatar: {
    width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.25)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: 15, border: '2px solid rgba(255,255,255,0.5)',
    flexShrink: 0,
  },
  userName: {
    fontSize: 14, fontWeight: 600, color: '#fff',
    maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  /* Slide panel */
  slidePanel: {
    position: 'fixed', top: 64, right: 0,
    width: PANEL_WIDTH, height: 'calc(100vh - 64px)',
    background: '#fff',
    boxShadow: '-6px 0 30px rgba(79,70,229,0.18)',
    zIndex: 199,
    transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
    display: 'flex', flexDirection: 'column',
    padding: '28px 24px', gap: 0,
    fontFamily: 'Inter, system-ui, sans-serif',
    overflowY: 'auto',
  },
  panelHeader: {
    display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20,
  },
  panelAvatar: {
    width: 52, height: 52, borderRadius: '50%',
    background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, fontWeight: 800, flexShrink: 0,
    boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
  },
  panelName: {
    fontSize: 16, fontWeight: 700, color: '#1e1b4b', marginBottom: 5,
  },
  panelRoleBadge: {
    background: 'linear-gradient(90deg,#7c3aed,#4f46e5)', color: '#fff',
    padding: '2px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: 0.6,
  },
  divider: {
    height: 1, background: '#e0e7ff', margin: '16px 0',
  },
  detailRow: {
    display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 14,
  },
  detailLabel: {
    fontSize: 11, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14, color: '#1e1b4b', fontWeight: 500, wordBreak: 'break-all',
  },
  logoutBtn: {
    background: 'linear-gradient(90deg,#4f46e5,#7c3aed)',
    color: '#fff', border: 'none', borderRadius: 8,
    padding: '6px 12px', cursor: 'pointer', fontWeight: 700, fontSize: 12,
    boxShadow: '0 2px 8px rgba(79,70,229,0.3)', alignSelf: 'flex-start',
    whiteSpace: 'nowrap',
  },
};
