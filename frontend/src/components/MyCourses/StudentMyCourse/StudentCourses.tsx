import { useState } from "react";

import CourseCard from "./CourseCard";
import CourseDetail from "./CourseDetail";


import { useMyEnrolledCourses } from "../../../api/hooks/useCourses";

export default function StudentCourses() {
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [filter, setFilter] = useState<"all" | "in-progress" | "completed">(
    "all"
  );



  const { data, isLoading } = useMyEnrolledCourses();
  if (!isLoading) {
    console.log(data)
  }

  const avg_progress =
    (data?.enrollments ?? []).reduce(
      (sum, course) => sum + course.progress,
      0
    ) / (data?.enrollments?.length || 1);
  const in_progress =
    (data?.enrollments ?? []).reduce(
      (sum, course) => course.progress < 100 ? sum + 1 : sum,
      0
    );

  const filteredCourses = data?.enrollments.filter((c) => {
    if (filter === "completed") return c.progress === 100;
    if (filter === "in-progress") return c.progress > 0 && c.progress < 100;
    return true;
  });


  return (
    <>
      {selectedCourse ? (
        <CourseDetail
          course={selectedCourse}
          onBack={() => setSelectedCourse(null)}
        />
      ) : (
        <div className="animate-slideIn">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
              My Courses
            </h1>
            <p className="text-sm text-white/40">Track your learning journey</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: "Enrolled", value: data?.total, accent: "#6EE7B7" },
              {
                label: "In Progress",
                value: in_progress,
                accent: "#93C5FD",
              },
              { label: "Completed", value: (data?.total ?? 0) - in_progress, accent: "#FCA5A5" },
              {
                label: "Avg Progress",
                value: `${avg_progress.toFixed(2)}%`,
                accent: "#FDE68A",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <p
                  className="text-2xl font-extrabold"
                  style={{ color: s.accent, fontFamily: "Syne, sans-serif" }}
                >
                  {s.value}
                </p>
                <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-6">
            {(["all", "in-progress", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all
                      ${filter === f
                    ? "bg-white text-[#080c14]"
                    : "bg-white/[0.06] text-white/50 hover:bg-white/10 hover:text-white/80"
                  }`}
              >
                {f === "all" ? "All Courses" : f.replace("-", " ")}
              </button>
            ))}
          </div>

          {filteredCourses && filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.entrollment_id}
                  course={course}
                  onClick={() => setSelectedCourse(course)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-white/30">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-sm">No courses in this category.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
