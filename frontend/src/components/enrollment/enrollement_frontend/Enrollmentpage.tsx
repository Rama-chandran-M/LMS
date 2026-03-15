import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../../api/axios';
import { loginUser } from '../../../api/auth.api';
import { useAuth } from "../../../auth/useAuth";

type Section = {
  section_id: string;
  section_title: string;
  section_content?: string;
};

type Module = {
  module_id: string;
  module_title: string;
  module_description: string;
  sections: Section[];
};

type CourseDetail = {
  course_id: string;
  course_name: string;
  technology: string;
  created_at: string;
  instructor: { user_id: string; full_name: string };
  modules: Module[];
};

function EnrollmentPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  // note: full_name not used by auth endpoint but retained for UI
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // Fetch full course details with modules & sections
  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    api
      .get(`/courses/${courseId}`)
      .then((res) => setCourse(res.data))
      .catch(() => setError("Course not found."))
      .finally(() => setLoading(false));
  }, [courseId]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.has(moduleId) ? next.delete(moduleId) : next.add(moduleId);
      return next;
    });
  };

  const handleEnroll = async () => {
    setError("");

    if (!courseId) {
      setError("Invalid course.");
      return;
    }


    if (!user) {
      navigate("/login");
      return;
    }

    setEnrolling(true);
    try {
      const uid = (user as any).sub;
      if (!uid) throw new Error("Unable to determine user id");
      await api.post(`/courses/enroll`, {
        user_id: uid,
        course_id: courseId || "",
      });

      setSuccess(true);
    } catch (err: any) {
      setError("Enrollment failed. Please try again.");
      console.error(err);
    } finally {
      setEnrolling(false);
    }
  };

  /* ---- Loading state ---- */
  if (loading) {
    return (
      <div style={s.page}>
        <p style={{ color: "#6b7280", fontSize: 18 }}>Loading course details...</p>
      </div>
    );
  }

  /* ---- Success state ---- */
  if (success) {
    return (
      <div style={s.page}>
        <div style={s.successCard}>
          <div style={s.successIcon}>✓</div>
          <h2 style={s.successTitle}>Enrollment Successful!</h2>
          <p style={s.successText}>
            You have been enrolled in <strong>{course?.course_name}</strong>.
          </p>
          <button style={s.primaryBtn} onClick={() => navigate("/student/enroll")}>
            ← Back to Courses
          </button>
        </div>
      </div>
    );
  }

  /* ---- Main page ---- */
  return (
    <div style={s.page}>
      {!course ? (
        <p style={{ color: "#ef4444", fontSize: 16 }}>Course not found.</p>
      ) : (
        <div style={s.wrapper}>
          {/* ====== LEFT: Course Details ====== */}
          <div style={s.detailsPanel}>
            {/* Header */}
            <div style={s.courseHeader}>
              <span style={s.techBadge}>{course.technology}</span>
              <h1 style={s.courseName}>{course.course_name}</h1>
              <p style={s.instructorText}>by {course.instructor.full_name}</p>
              <p style={s.dateText}>
                Created {new Date(course.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Course Stats */}
            <div style={s.statsRow}>
              <div style={s.statBox}>
                <span style={s.statNum}>{course.modules.length}</span>
                <span style={s.statLabel}>Modules</span>
              </div>
              <div style={s.statBox}>
                <span style={s.statNum}>
                  {course.modules.reduce((n, m) => n + m.sections.length, 0)}
                </span>
                <span style={s.statLabel}>Sections</span>
              </div>
            </div>

            {/* (Enroll button removed from here; moved below course content) */}

            {/* Modules & Sections */}
            <h3 style={s.sectionHeading}>Course Content</h3>

            {course.modules.length === 0 ? (
              <p style={s.emptyText}>No modules added yet.</p>
            ) : (
              course.modules.map((mod, idx) => (
                <div key={mod.module_id} style={s.moduleCard}>
                  <div
                    style={s.moduleHeader}
                    onClick={() => toggleModule(mod.module_id)}
                  >
                    <div>
                      <span style={s.moduleIndex}>Module {idx + 1}</span>
                      <h4 style={s.moduleTitle}>{mod.module_title}</h4>
                      <p style={s.moduleDesc}>{mod.module_description}</p>
                    </div>
                    <span style={s.chevron}>
                      {expandedModules.has(mod.module_id) ? "▲" : "▼"}
                    </span>
                  </div>

                  {expandedModules.has(mod.module_id) && (
                    <div style={s.sectionsWrapper}>
                      {mod.sections.length === 0 ? (
                        <p style={s.emptyText}>No sections yet.</p>
                      ) : (
                        mod.sections.map((sec, si) => (
                          <div key={sec.section_id} style={s.sectionItem}>
                            <span style={s.sectionBullet}>{si + 1}</span>
                            <span style={s.sectionName}>{sec.section_title}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Register button placed below course content */}
            <div style={{ marginTop: 18, textAlign: "center" }}>
              {error && <p style={s.errorText}>{error}</p>}
              <button
                style={{ ...s.primaryBtn, padding: "12px 22px", width: 200 }}
                onClick={handleEnroll}
                disabled={enrolling}
                onMouseEnter={() => { /* optional hover handled by CSS inlined here if needed */ }}
              >
                {enrolling ? "Enrolling..." : "Register"}
              </button>
            </div>
          </div>

          {/* ====== RIGHT: (removed interactive registration form) ====== */}
          {/* Instead, show an Enroll button under the course header/stats */}
        </div>
      )}
    </div>
  );
}

export default EnrollmentPage;

/* ---------- Styles ---------- */
const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 40,
    paddingBottom: 60,
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#f8f7ff",
  },
  wrapper: {
    display: "flex",
    gap: 32,
    maxWidth: 1100,
    width: "100%",
    padding: "0 24px",
    alignItems: "flex-start",
    flexWrap: "wrap" as const,
  },

  /* Left panel — course details */
  detailsPanel: {
    flex: 1,
    minWidth: 340,
  },
  courseHeader: { marginBottom: 24 },
  techBadge: {
    display: "inline-block",
    background: "linear-gradient(90deg,#7c3aed,#4f46e5)",
    color: "#fff",
    padding: "4px 16px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  courseName: {
    margin: "0 0 6px",
    fontSize: 28,
    fontWeight: 800,
    color: "#1e1b4b",
    lineHeight: 1.3,
  },
  instructorText: { margin: 0, fontSize: 15, color: "#6b7280" },
  dateText: { margin: "6px 0 0", fontSize: 13, color: "#9ca3af" },

  statsRow: {
    display: "flex",
    gap: 16,
    marginBottom: 28,
  },
  statBox: {
    background: "#fff",
    border: "1px solid #e0e7ff",
    borderRadius: 14,
    padding: "14px 24px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    minWidth: 90,
    boxShadow: "0 2px 8px rgba(79,70,229,0.06)",
  },
  statNum: { fontSize: 22, fontWeight: 800, color: "#4f46e5" },
  statLabel: { fontSize: 12, color: "#6b7280", fontWeight: 600, marginTop: 2 },

  sectionHeading: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1e1b4b",
    marginBottom: 14,
    borderLeft: "4px solid #7c3aed",
    paddingLeft: 12,
  },

  moduleCard: {
    background: "#fff",
    border: "1px solid #e0e7ff",
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(79,70,229,0.06)",
  },
  moduleHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    cursor: "pointer",
  },
  moduleIndex: {
    fontSize: 11,
    fontWeight: 700,
    color: "#7c3aed",
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  moduleTitle: {
    margin: "4px 0 2px",
    fontSize: 15,
    fontWeight: 700,
    color: "#1e1b4b",
  },
  moduleDesc: { margin: 0, fontSize: 13, color: "#6b7280" },
  chevron: { fontSize: 12, color: "#7c3aed", marginLeft: 12, flexShrink: 0 },

  sectionsWrapper: {
    borderTop: "1px solid #f1f0fb",
    padding: "10px 20px 14px",
    background: "#faf9ff",
  },
  sectionItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "7px 0",
  },
  sectionBullet: {
    width: 22,
    height: 22,
    lineHeight: "22px",
    borderRadius: "50%",
    background: "#ede9fe",
    color: "#7c3aed",
    textAlign: "center" as const,
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
  },
  sectionName: { fontSize: 13, color: "#374151" },
  emptyText: { fontSize: 13, color: "#9ca3af", fontStyle: "italic" as const },

  /* Right panel — enrollment form */
  enrollPanel: {
    width: 360,
    position: "sticky" as const,
    top: 100,
    flexShrink: 0,
  },
  enrollCard: {
    background: "#fff",
    borderRadius: 20,
    padding: "32px 28px",
    boxShadow: "0 8px 30px rgba(79,70,229,0.10)",
    border: "1px solid #e0e7ff",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1e1b4b",
    marginTop: 0,
    marginBottom: 20,
    textAlign: "center" as const,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: 14,
    border: "1.5px solid #d1d5db",
    borderRadius: 10,
    marginBottom: 18,
    outline: "none",
    boxSizing: "border-box" as const,
  },
  primaryBtn: {
    padding: "13px 28px",
    background: "linear-gradient(90deg,#4f46e5,#7c3aed)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(79,70,229,0.3)",
  },
  cancelBtn: {
    width: "100%",
    padding: "11px 0",
    background: "transparent",
    color: "#6b7280",
    border: "1.5px solid #d1d5db",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 12,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 12,
  },

  /* Success screen */
  successCard: {
    background: "#fff",
    borderRadius: 20,
    padding: "48px 40px",
    width: 460,
    textAlign: "center" as const,
    boxShadow: "0 8px 30px rgba(79,70,229,0.10)",
    border: "1px solid #e0e7ff",
  },
  successIcon: {
    width: 64,
    height: 64,
    lineHeight: "64px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#22c55e,#16a34a)",
    color: "#fff",
    fontSize: 32,
    fontWeight: 700,
    margin: "0 auto 20px",
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: "#1e1b4b",
    marginBottom: 8,
  },
  successText: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 28,
  },
};