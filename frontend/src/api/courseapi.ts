import { Course, CreateCourseDTO } from "../types/lms";
import api from "./axios";


export async function createCourse(data: CreateCourseDTO): Promise<Course> {
  const res = await api.post("/course", data);
  return res.data;
}


export async function getInstructorCourses(instructorId: string) {
  const res = await api.get(`/courses/instructor/${instructorId}`);
  return res.data;
}


export async function deleteCourse(courseId: string) {
  const res = await api.delete(`/courses/${courseId}`);
  return res.data;
}


export async function getCourseStats(courseId: string) {
  const res = await api.get(`/courses/stats/${courseId}`);
  return res.data;
}