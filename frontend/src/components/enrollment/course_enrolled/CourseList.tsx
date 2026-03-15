import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import { useAuth } from '../../../auth/useAuth';

type Course = {
  course_id: string;
  course_name: string;
  technology: string;
  instructor: { user_id: string; full_name: string };
  enrolled?: boolean;
};

export default function CourseList({ enrolledOnly = false }: { enrolledOnly?: boolean }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  // live search: updates as the user types
  const [search, setSearch] = useState('');
  // track which card is hovered to apply inline hover styles
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // wishlist functionality removed; token-only auth now
  const toggleLike = (_e: React.MouseEvent, _course: Course) => {
    /* no-op */
  };

  const getUserId = () => user?.sub; // JWT payload 'sub' is user id


  useEffect(() => { loadCourses(); }, [user]);

  async function loadCourses() {
    setLoading(true);
    setFetchError('');
    try {
      const uid = getUserId();
      const res = await api.get(uid ? `/courses?userId=${uid}` : `/courses`);
      setCourses(res.data || []);
    } catch {
      setFetchError('Could not load courses. Make sure the backend is running on port 3000.');
    } finally {
      setLoading(false);
    }
  }

  async function handleEnrollClick(course: Course) {
    // navigate to nested enrollment route under /student
    navigate(`/student/enrollment/${course.course_id}`, { state: { course } });
  }

  async function toggleEnroll(uid: string, course: Course) {
    try {
      if (course.enrolled) {
        await api.post(`/courses/unroll`, { user_id: uid, course_id: course.course_id });
        showToast('You have successfully deregistered.', 'error');
      } else {
        await api.post(`/courses/enroll`, { user_id: uid, course_id: course.course_id });
        showToast('You have successfully registered!', 'success');
      }
      setCourses(prev =>
        prev.map(c => c.course_id === course.course_id ? { ...c, enrolled: !c.enrolled } : c)
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeregister(course: Course) {
    const uid = getUserId();
    if (!uid) return;
    setOpenMenuId(null);
    await toggleEnroll(uid, course);
  }

  const displayCourses = enrolledOnly ? courses.filter(c => c.enrolled) : courses;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return displayCourses;
    return displayCourses.filter(c =>
      c.course_name.toLowerCase().includes(q) ||
      c.technology.toLowerCase().includes(q) ||
      c.instructor.full_name.toLowerCase().includes(q)
    );
  }, [displayCourses, search]);

  if (loading) return <div style={s.centered}>Loading courses...</div>;
  if (fetchError) return <div style={{ ...s.centered, color: '#ef4444' }}>{fetchError}</div>;

  return (
    <div style={s.page}>
      {/* Toast */}
      {toast && (
        <div
          style={{ ...s.toast, background: toast.type === 'success' ? 'linear-gradient(90deg,#16a34a,#15803d)' : 'linear-gradient(90deg,#dc2626,#b91c1c)' }}
          onClick={() => setToast(null)}
        >
          <span>{toast.msg}</span>
          <span style={s.toastClose}>×</span>
        </div>
      )}
      <div style={s.headerRow}>
        <h1 style={s.pageTitle}>{enrolledOnly ? 'My Enrolled Courses' : 'Browse Courses'}</h1>
        <div style={s.searchBar}>
          <input
            aria-label="Search courses"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={s.searchInput}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={s.filterSelect}
          >
            <option value="">Sort By</option>
            <option value="course_asc">Course Name (A-Z)</option>
            <option value="course_desc">Course Name (Z-A)</option>
            <option value="instructor">Instructor Name</option>
          </select>
        </div>
      </div>

  {enrolledOnly && filtered.length === 0 && !loading && (
        <div style={s.centered}>
          <p>You haven't enrolled in any courses yet.</p>
          <button style={s.enrollBtn} onClick={() => navigate('/student/my-courses')}>Browse Courses</button>
        </div>
      )}

      <div style={s.grid}>
        {filtered.map(course => (
          <div
            key={course.course_id}
            style={{
              ...s.card,
              transform: hoveredCard === course.course_id ? 'translateY(-6px)' : undefined,
              boxShadow: hoveredCard === course.course_id ? '0 12px 40px rgba(79,70,229,0.18)' : (s.card as any).boxShadow,
            }}
            className="course-card"
            onClick={() => setOpenMenuId(null)}
            onMouseEnter={() => setHoveredCard(course.course_id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={s.cardTop}>
              <span style={s.techBadge}>{course.technology}</span>
              {course.enrolled && <span style={s.enrolledBadge}>✓ Enrolled</span>}
            </div>
            <h3 style={s.courseName}>{course.course_name}</h3>
            <p style={s.instructorText}>by {course.instructor.full_name}</p>

            {course.enrolled ? (
              <div style={s.actionRow}>
                <button style={s.registeredBtn} className="registered-btn" disabled>Registered</button>
                <div style={{ position: 'relative' }}>
                  <button
                    style={s.dotsBtn}
                    className="dots-btn"
                    onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === course.course_id ? null : course.course_id); }}
                    title="Options"
                  >⋮</button>
                  {openMenuId === course.course_id && (
                    <div style={s.dropdown} onClick={e => e.stopPropagation()}>
                      <button style={s.dropdownItem} className="deregister-item" onClick={() => handleDeregister(course)}>
                        Deregister
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={s.actionRow}>
                <button
                  style={{
                    ...s.enrollBtn,
                    transform: hoveredCard === course.course_id ? 'translateY(-3px)' : undefined,
                    boxShadow: hoveredCard === course.course_id ? '0 8px 24px rgba(79,70,229,0.28)' : (s.enrollBtn as any).boxShadow,
                  }}
                  className="enroll-btn"
                  onClick={() => handleEnrollClick(course)}
                >
                  Enroll Now
                </button>

              </div>
            )}
          </div>
        ))}
      </div>


    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { maxWidth: 1160, margin: '0 auto', padding: '40px 24px', fontFamily: 'Inter, system-ui, sans-serif' },
  pageTitle: {
    fontSize: 28, fontWeight: 800, marginBottom: 32, color: '#1e1b4b',
    borderLeft: '4px solid #7c3aed', paddingLeft: 14,
  },
  filterSelect: {
  padding: '10px 12px',
  fontSize: 14,
  borderRadius: 10,
  border: '1px solid #e6e7f8',
  outline: 'none',
  cursor: 'pointer'
},
  headerRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 12 },
  searchBar: { display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' },
  searchInput: {
    padding: '10px 12px', fontSize: 14, borderRadius: 10, border: '1px solid #e6e7f8', outline: 'none', minWidth: 280,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)'
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 },
  card: {
    background: 'linear-gradient(160deg, #fff 70%, #f5f3ff 100%)',
    border: '1px solid #e0e7ff', borderRadius: 18,
    padding: '22px 22px 18px', boxShadow: '0 4px 20px rgba(79,70,229,0.08)',
    display: 'flex', flexDirection: 'column', gap: 10,
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  techBadge: {
    background: 'linear-gradient(90deg,#7c3aed,#4f46e5)', color: '#fff',
    padding: '3px 13px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
  },
  enrolledBadge: {
    background: '#d1fae5', color: '#065f46', padding: '3px 12px',
    borderRadius: 20, fontSize: 11, fontWeight: 700,
  },
  courseName: { margin: 0, fontSize: 16, fontWeight: 700, color: '#1e1b4b', lineHeight: 1.45 },
  instructorText: { margin: 0, fontSize: 13, color: '#6b7280', flex: 1 },
  enrollBtn: {
    background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none',
    borderRadius: 10, padding: '11px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 14,
    marginTop: 6, boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
  },
  registeredBtn: {
    background: 'transparent', color: '#4f46e5', border: '1.5px solid #7c3aed',
    borderRadius: 10, padding: '11px 18px', fontWeight: 700, fontSize: 14,
    cursor: 'default', flex: 1,
  },
  actionRow: { display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 },
  dotsBtn: {
    background: '#f5f3ff', border: '1.5px solid #ddd6fe', borderRadius: 10,
    padding: '8px 13px', cursor: 'pointer', fontSize: 20, color: '#7c3aed', lineHeight: 1,
  },
  heartBtn: {
    background: 'transparent', border: '1.5px solid #ddd6fe', borderRadius: 10,
    padding: '8px 13px', cursor: 'pointer', fontSize: 18, lineHeight: 1,
    flexShrink: 0,
  },
  dropdown: {
    position: 'absolute', right: 0, top: 'calc(100% + 6px)',
    background: '#fff', border: '1px solid #e0e7ff', borderRadius: 10,
    boxShadow: '0 8px 24px rgba(79,70,229,0.15)', zIndex: 50, minWidth: 140, overflow: 'hidden',
  },
  dropdownItem: {
    display: 'block', width: '100%', padding: '11px 18px', background: 'none',
    border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 14,
    fontWeight: 600, color: '#ef4444',
  },
  centered: { textAlign: 'center', marginTop: 100, fontSize: 18, color: '#6b7280' },
  toast: {
    position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
    color: '#fff', padding: '14px 24px', borderRadius: 12, zIndex: 9999,
    display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer',
    boxShadow: '0 6px 24px rgba(79,70,229,0.35)',
    fontSize: 14, fontWeight: 600, minWidth: 280, maxWidth: 480,
    animation: 'slideDown 0.3s ease',
  },
  toastClose: {
    marginLeft: 'auto', fontSize: 18, opacity: 0.8, lineHeight: 1,
  },
};
