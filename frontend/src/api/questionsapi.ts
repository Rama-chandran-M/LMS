import api from "./axios";
import { CreateQuestionDTO } from "../types/lms";


export const createQuestion = async (data: CreateQuestionDTO) => {
  const res = await api.post("/course/questions", data);
  return res.data;
};


export const fetchQuestions = async (assessmentId: string) => {
  const res = await api.get(`/course/questions/assessment/${assessmentId}`);
  return res.data;
};

export const deleteQuestion = async (questionId: string) => {
  const res = await api.delete(`/course/questions/${questionId}`);
  return res.data;
};

export const updateQuestion = async (questionId: string, data: CreateQuestionDTO) => {
  const res = await api.patch(`/course/questions/update/${questionId}`, data);
  return res.data;
}   