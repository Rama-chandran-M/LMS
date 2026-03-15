import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCourse, getCourseStats } from "../../api/courseapi";
import CourseStatsModal from "./CourseStatsModal";

export default function CourseCard({ course, onDelete }: any) {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);

  const handleDelete = async () => {
    await deleteCourse(course.course_id);
    onDelete(course.course_id);
  };

  const handleStats = async () => {
    const data = await getCourseStats(course.course_id);
    setStats(data);
  };

  const handleEdit = () => {
    navigate(`/coursemodule/${course.course_id}`);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg hover:border-indigo-300 transition">

      {/* Course Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {course.course_name}
      </h3>

      {/* Course Technology */}
      <p className="text-gray-600 text-sm">
        <span className="font-medium">Technology:</span> {course.technology}
      </p>

      {/* Students Count */}
      <p className="text-gray-600 text-sm mt-1">
        <span className="font-medium">Students:</span>{" "}
        {course.enrolled_students?.length || 0}
      </p>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">

        <button
          onClick={handleEdit}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm"
        >
          ✏️ Edit
        </button>

        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
        >
          🗑 Delete
        </button>

        <button
          onClick={handleStats}
          className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm"
        >
          📊 Statistics
        </button>

      </div>

      {/* Statistics Modal */}
      {stats && (
        <CourseStatsModal
          stats={stats}
          onClose={() => setStats(null)}
        />
      )}

    </div>
  );
}