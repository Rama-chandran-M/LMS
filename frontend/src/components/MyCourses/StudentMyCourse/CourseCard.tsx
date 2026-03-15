import React from 'react'
import { badgeStyle } from '../../../utils/badgeStyle';
import { Enrollment } from '../../../types/mycourse_type';


const CourseCard = ({ course, onClick }: { course: Enrollment ; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="group w-full text-left relative rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] overflow-hidden transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30"
  >
    <div className="absolute top-0 left-0 w-full h-1 opacity-60"
      style={{ background: `linear-gradient(90deg, #6EE7B7, transparent)` }} />

    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{ background: `radial-gradient(ellipse at top left, #6EE7B708, transparent 70%)` }} />

    <div className="p-5 relative">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeStyle(course.progress === 100 ? "completed" : course.progress === 0 ? "started" : "" )}`}> 
              {course.progress === 100 ? "Completeds" : course.progress === 0 ? "Started" : "In Progress"}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white/90 leading-snug line-clamp-2 group-hover:text-white transition-colors">
            {course.course.course_name}
          </h3>
          <p className="text-xs text-white/40 mt-0.5">{course.course.instructor.full_name}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-white/40">
          <span> (implement completed lesson ) of {course.course._count.modules} lessons</span>
          <span style={{ color: "#6EE7B7" }} className="font-semibold">{course.progress}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${course.progress}%`, background: `linear-gradient(90deg, #6EE7B7cc, #6EE7B7)` }}
          />
        </div>
      </div>

      <p className="text-[10px] text-white/25 mt-3">entrolled at {course.enrolled_at}</p>
    </div>
  </button>
);


export default CourseCard
