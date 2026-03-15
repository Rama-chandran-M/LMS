import React, { useEffect, useState } from 'react';
import {
  fetchOverview,
  fetchCourseStats,
  fetchAssessmentPerformance,
  fetchStudentPerformance,
  fetchRecentAttempts,
  OverviewStats,
  CourseStat,
  AssessmentStat,
  StudentStat,
  RecentAttempt,
} from '../api';
import OverviewCards from '../components/StudentAnalytics/OverviewCards';
import CourseTable from '../components/StudentAnalytics/CourseTable';
import AssessmentTable from '../components/StudentAnalytics/AssessmentTable';

import RecentAttempts from '../components/StudentAnalytics/RecentAttempts';

export default function StudentAnalytics() {
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [courses, setCourses] = useState<CourseStat[]>([]);
  const [assessments, setAssessments] = useState<AssessmentStat[]>([]);
  const [students, setStudents] = useState<StudentStat[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<RecentAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchOverview(),
      fetchCourseStats(),
      fetchAssessmentPerformance(),
      fetchStudentPerformance(),
      fetchRecentAttempts(),
    ])
      .then(([ov, co, as, st, ra]) => {
        setOverview(ov);
        setCourses(co);
        setAssessments(as);
        setStudents(st);
        setRecentAttempts(ra);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
      <h1>Student Analytics</h1>
      {overview && <OverviewCards data={overview} />}
      <CourseTable data={courses} />
      <AssessmentTable data={assessments} />
     
      <RecentAttempts data={recentAttempts} />
    </div>
  );
}