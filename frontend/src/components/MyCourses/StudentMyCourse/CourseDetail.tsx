import React from 'react'
import { IconBack } from '../../../assets/icons/course_icons';
import { badgeStyle } from '../../../utils/badgeStyle';
import ModuleAccordion from './ModuleAccordion';
import { useCourseModules } from '../../../api/hooks/useModules';
import { Enrollment } from '../../../types/mycourse_type';
import AssessmentAccordion from '../CourseAssessment/AssessmentAccordion';

const CourseDetail = ({ course, onBack }: { course: Enrollment; onBack: () => void }) => {



  const { data, isLoading } = useCourseModules(course.course.course_id)
  if (!isLoading && data && data.assessment_details) {
    sessionStorage.setItem("assessment_id", data.assessment_details.assessment_id)
    sessionStorage.setItem("assessment_description", data.assessment_details.description)
    sessionStorage.setItem("assessment_title", data.assessment_details.title)
  }

  if (!isLoading) {
    console.log(data)
  }

  const totalLessons = data?.total_modules;
  const doneLessons = data?.completed_count;

  return (
    <div className="animate-slideIn">
      <div className="relative rounded-3xl overflow-hidden mb-6 p-6 sm:p-8"
        style={{ background: `linear-gradient(135deg, #6EE7B722 0%, #0f172a 70%)` }}>

        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "#6EE7B7", transform: "translate(30%, -30%)" }} />

        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/90 transition-colors mb-4 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform"><IconBack /></span>
          My Courses
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start gap-4">

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full border"
                style={{ borderColor: `#6EE7B750`, color: "#6EE7B7", background: `#6EE7B715` }}>
                {data?.technology}
              </span>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${badgeStyle(course.progress === 100 ? "completed" : course.progress === 0 ? "started" : "")}`}>
                {course.progress === 100 ? "Completeds" : course.progress === 0 ? "Started" : "In Progress"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-1">{data?.course_name}</h2>
            <p className="text-sm text-white/50">by {course.course.instructor.full_name}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { label: "Progress", value: `${course.progress}%` },
            { label: "Completed", value: `${doneLessons} / ${totalLessons}` },
            { label: "Modules", value: data?.total_modules },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-white" style={{ color: "#6EE7B7" }}>{stat.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${course.progress}%`, background: "#6EE7B7" }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest px-1 mb-4">
          Course Modules
        </h3>
        {data?.modules.map((mod, i) => {

          return <ModuleAccordion key={mod.module_id} module={mod} defaultOpen={i === 0} course_id={course.course.course_id} />
        })}
        <AssessmentAccordion best_assessment_attempt={course.best_assessment_attempt} />
      </div>
    </div>
  );
};

export default CourseDetail
