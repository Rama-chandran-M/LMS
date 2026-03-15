import '../styles/coursebuilder.css';

import { useNavigate } from 'react-router-dom';

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Assessment } from '../types/lms';

import { CourseModule, Section } from "../types/lms";
import { fetchModules,deleteModule } from "../api/moduleapi";
import { fetchSections, deleteSection } from "../api/sectionapi";
import { deleteAssessment, fetchAssessment } from "../api/assessmentapi"



import LeftSidebar from "../components/layout/LeftSidebar";
import RightSidebar from "../components/layout/RightSideBar";
import CenterPanel from "../components/layout/CenterPanel";
import Navbar from '../components/enrollment/Navbar';
import InstructorNavbar from '../components/InstructorManageCourses/InstructorNavbar';

type ActiveForm = "addModule" | "addSection" | null;

const CourseBuilder = () => {
  const { courseId } = useParams<{ courseId: string }>();
  console.log(courseId);

  const [modules, setModules] = useState<CourseModule[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);
  const [editingModule , setEditingModule] = useState<CourseModule|null>(null);
  const [editingSection, setEditingSection] = useState<Section|null>(null);

  useEffect(() => {
    if (!courseId) return;
    fetchModules(courseId).then(setModules);
  }, [courseId]);
    
  useEffect(() => {
    if(!courseId) return;
    fetchAssessment(courseId).then(setAssessment);
  },[courseId])

  useEffect(() => {
    if (!selectedModule) {
      setSections([]);
      return;
    }
    fetchSections(selectedModule.module_id).then(setSections);
  }, [selectedModule]);

  const refresh = async () => {
    if (!courseId) return;
    const mods = await fetchModules(courseId);
    setModules(mods);

    if (selectedModule) {
      const secs = await fetchSections(selectedModule.module_id);
      setSections(secs);
    }
  };
  const handledeleteAssessment = async (id : string) => {
      await deleteAssessment(id);
      setAssessment(null);
  }
  const handleDeleteModule = async(id : string) => {
    await deleteModule(id);
    setModules(prev => prev.filter(m => m.module_id != id))

  }
  const handleDeleteSection = async(id : string) => {
    await deleteSection(id);
    setSections(prev => prev.filter(s => s.section_id != id))
  }
  const handleEditModule = (mod : CourseModule) => {
    setEditingModule(mod);
    setActiveForm("addModule");
  }
  const handleEditSection = (section : Section) => {
    setEditingSection(section);
    setActiveForm("addSection");
  }
  const clearEditingModule = () => {
    setEditingModule(null);
    setActiveForm(null);
  }
  const clearEditingSection = () => {
    setEditingSection(null);
    setActiveForm(null);
  }
  const handleUpdateModule = (updated : CourseModule) => {
    setModules(prev => prev.map(m => m.module_id == updated.module_id ? updated : m));
  }
  const handleUpdateSection = (updated : Section) => {
    setSections(prev => prev.map(s => s.section_id==updated.section_id ? updated : s));
  }
  const handleEditAssessment = (id : string) => {
    navigate(`/assessment/${id}`);
  }
  const navigate = useNavigate();
  return (
    <>
      <InstructorNavbar/>
      <div className="flex flex-col h-screen w-full overflow-hidden">
        <div className="layout flex flex-1 overflow-hidden">
          <LeftSidebar
            modules={modules}
            onSelectModule={setSelectedModule}
            onAddModule={() => setActiveForm("addModule")}
            assessment={assessment}
            onCreateAssessment={() => {
              navigate(`/${courseId}/assessment/create`)
            }}
            onDeleteAssessment={handledeleteAssessment}
            onEditModule={handleEditModule}
            onDeleteModule={handleDeleteModule}
            selectedModuleId={selectedModule?.module_id ?? null}
            onEditAssessment={handleEditAssessment}
          />

          <CenterPanel
            activeForm={activeForm}
            courseId={courseId!}
            selectedModule={selectedModule}
            onSuccess={() => {
              setActiveForm(null);
              refresh();
            }}
            editingModule={editingModule}
            updateModule={handleUpdateModule}
            clearEditingModule={clearEditingModule}
            editingSection={editingSection}
            updateSection={handleUpdateSection}
            clearEditingSection={clearEditingSection}
          />

          <RightSidebar
            sections={sections}
            onAddSection={() => setActiveForm("addSection")}
            onEditSection={handleEditSection}
            onDeleteSection={handleDeleteSection}
          />
        </div>
      </div>
    </>
  );
};

export default CourseBuilder;