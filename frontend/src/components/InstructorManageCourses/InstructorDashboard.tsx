import { useEffect, useState } from "react";
import { getInstructorCourses } from "../../api/courseapi";
import CreateCourseButton from "./CreateCourseButton";
import SearchBar from "./SearchBar";
import CourseCard from "./CourseCard";
import InstructorNavbar from "./InstructorNavbar";

export default function InstructorDashboard() {

  const [courses, setCourses] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const instructorId = localStorage.getItem("userId");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    if (!instructorId) return;

    const data = await getInstructorCourses(instructorId);
    setCourses(data);
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses((prev) =>
      prev.filter((course) => course.course_id !== courseId)
    );
  };

  const filtered = courses.filter((c) =>
    c.course_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <InstructorNavbar/>
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <h1 className="text-2xl font-bold text-gray-800">
          Manage Courses
        </h1>

        <div className="flex gap-4 items-center">

          <SearchBar search={search} setSearch={setSearch} />

          <CreateCourseButton instructorId={instructorId} />

        </div>

      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filtered.map((course) => (
          <CourseCard
            key={course.course_id}
            course={course}
            onDelete={handleDeleteCourse}
          />
        ))}

      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No courses found
        </div>
      )}

    </div>
    </>
  );
}