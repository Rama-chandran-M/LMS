const BASE_URL = '/api';

export interface OverviewStats {
    coursesEnrolled: number;
    assessmentsAttempted: number;
    moduleCompletions: number;
    avgScore: number | null;
}

export interface CourseStat {
    courseId: string;
    courseName: string;
    technology: string;
    instructor: string;
    moduleCount: number;
    avgScore: number | null;
}

export interface AssessmentStat {
    attemptId: string;
    assessmentId: string;
    title: string;
    courseName: string;
    passingScore: number;
    score: number | null;
    passed: boolean;
    attemptedAt: string;
}

export interface StudentStat {
    userId: string;
    fullName: string;
    email: string;
    coursesEnrolled: number;
    assessmentsAttempted: number;
    avgScore: number | null;
}

export interface RecentAttempt {
    attemptId: string;
    studentName: string;
    assessmentTitle: string;
    score: number | null;
    passed: boolean;
    attemptedAt: string;
}

async function fetchJson<T>(path: string): Promise<T> {
    const token = localStorage.getItem('access_token');
    const headers: Record<string, string> = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${BASE_URL}${path}`, { headers });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}

export const fetchOverview = () => fetchJson<OverviewStats>('/dashboard/overview');
export const fetchCourseStats = () => fetchJson<CourseStat[]>('/dashboard/courses');
export const fetchAssessmentPerformance = () => fetchJson<AssessmentStat[]>('/dashboard/assessments');
export const fetchStudentPerformance = () => fetchJson<StudentStat[]>('/dashboard/students');
export const fetchRecentAttempts = () => fetchJson<RecentAttempt[]>('/dashboard/recent-attempts');
