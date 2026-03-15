import { useNavigate } from "react-router-dom";

export default function CreateCourseButton({ instructorId }: any) {

  const navigate = useNavigate();

  return (

    <div className="flex justify-end">

      <button
        onClick={() =>
          navigate(`/instructor/${instructorId}/course/create`)
        }
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-indigo-700 transition"
      >
        + Create Course
      </button>

    </div>

  );
}