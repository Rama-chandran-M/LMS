import { Section, CreateSectionDto } from "../types/lms";
import api from "./axios";
export async function fetchSections(moduleId: string) {
    const res = await api.get(`/section/${moduleId}`);
    return res.data;
}

export async function createSection(data: CreateSectionDto): Promise<Section> {
    const res = await api.post(`/section/${data.module_id}`, data);
    return res.data;
}

export async function deleteSection(id: string) {
    const res = await api.delete(`/section/deletesection/${id}`);
    return res.data;
}

export async function updateSection(id: string, data: CreateSectionDto) {
    const res = await api.patch(`/section/updatesection/${id}`, data);
    return res.data;
}
