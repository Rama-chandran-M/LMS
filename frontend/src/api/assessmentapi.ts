import { Assessment, CreateAssessmentDTO } from "../types/lms";
import api from "./axios";

export async function createAssessment(data : CreateAssessmentDTO) : Promise<Assessment>{
    const res = await api.post("/course/createassessment",data);
    return res.data;
}

export async function fetchAssessment(course_id : string) : Promise<Assessment>{
    const res = await api.get(`/course/fetchassessment/${course_id}`);
    return res.data;
}

export async function deleteAssessment(assessment_id:string){
    const res = await api.delete(`/course/deleteassessment/${assessment_id}`)
    return res.data;
}