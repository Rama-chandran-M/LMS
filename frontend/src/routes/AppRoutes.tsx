import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import InstructorDashboard from "../pages/InstructorDashboard";
import StudentDashboard from "../pages/StudentDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import UsersPage from "../pages/UsersPage";
import CourseForm from "../components/forms/CourseForm";
import CourseBuilder from "../pages/CourseBuilder";
import AssessmentForm from "../components/forms/Assessmentform"
import QuestionForm from "../components/forms/QuestionForm";
import AssessmentBuilder from "../pages/AssessmentBuilder";
import InstructorManageDashboard from "../components/InstructorManageCourses/InstructorDashboard";
import MyCourseLayout from "../components/MyCourseLayout";
import StudentCourses from "../components/MyCourses/StudentMyCourse/StudentCourses";
import AssessmentModule from "../components/MyCourses/CourseAssessment/AssessmentModule";
import AssessmentCompletionModule from "../components/MyCourses/CourseAssessment/AssessmentCompletionModule";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/user" element={<UsersPage />} />

      <Route
        path="/instructor/manage-courses"
        element={
          <ProtectedRoute user_role="INSTRUCTOR">
            <InstructorManageDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/*"
        element={
          <ProtectedRoute user_role="STUDENT">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* analytics is now handled inside StudentDashboard's nested routes */}
      <Route
        path="/instructor/:instructorId/course/create"
        element={<CourseForm />}
      />
      <Route
        path="/coursemodule/:courseId"
        element={<CourseBuilder />}
      />
      <Route
        path="/:courseId/assessment/create"
        element={<AssessmentForm />}
      />
      <Route
        path="/assessment/:assessmentId"
        element={<AssessmentBuilder />}
      />


      <Route path="/mycourselayout" element={<MyCourseLayout />}>
        <Route path='mycourse' element={<StudentCourses />} />
        <Route path="mycourse/assessment" element={<AssessmentModule />} />
        <Route path="assessment/completion" element={<AssessmentCompletionModule />} />
      </Route>

    </Routes>
  );
}