import { CourseModule, CreateModuleDto } from "../types/lms";
import api from "./axios";

export async function fetchModules( course_id : string) : Promise<CourseModule[]>{
    const res = await api.get(`/coursemodule/${course_id}`);
    return res.data;
}

export async function createModule(data: CreateModuleDto){
    const res = await api.post(`/coursemodule/${data.course_id}`,data);
    return res.data;
}

export async function deleteModule(id : string){
    const res = await api.delete(`/coursemodule/deletemodule/${id}`);
    return res.data;
}

export async function updateModule(id : string , data : CreateModuleDto){
    const res = await api.patch(`/coursemodule/updatemodule/${id}`,data);
    return res.data;
}