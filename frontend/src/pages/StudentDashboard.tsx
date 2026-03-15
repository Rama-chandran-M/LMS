import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from '../components/enrollment/Navbar';
import ProfilePage from '../components/enrollment/ProfilePage';
import CourseList from '../components/enrollment/course_enrolled/CourseList';
import EnrollmentPage from '../components/enrollment/enrollement_frontend/Enrollmentpage';
import StudentAnalytics from './StudentAnalytics';
import MyCourseLayout from '../components/MyCourseLayout';
import StudentCourses from '../components/MyCourses/StudentMyCourse/StudentCourses';

export default function StudentDashboard() {
  return (
    <>
      <Navbar />

      {/* nested routing for student-specific pages */}
      <Routes>
        <Route index element={<Navigate to="my-courses" replace />} />
        <Route path="my-courses" element={<CourseList />} />
        <Route path="enroll" element={<MyCourseLayout />}>
          <Route index element={<StudentCourses />} />
        </Route>
        <Route path="enrollment/:courseId" element={<EnrollmentPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="analytics" element={<StudentAnalytics />} />
        <Route path="*" element={<div style={{ padding: 24 }}><h2>Welcome to your dashboard</h2></div>} />
      </Routes>
    </>
  );
}