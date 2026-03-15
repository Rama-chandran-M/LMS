import '../../styles/form.css';
import { useState, useEffect } from "react";
import { CourseModule, CreateModuleDto } from "../../types/lms";
import { createModule,deleteModule,updateModule } from "../../api/moduleapi";

interface Props {
  courseId: string;
  onSuccess: () => void;
  editingModule ?: CourseModule | null;
  onUpdate : (module : CourseModule) => void;
  clearEditing : () => void;
}

const ModuleForm = ({ courseId, onSuccess,editingModule,onUpdate,clearEditing }: Props) => {
    console.log(courseId);
     
  const [module_title, setTitle] = useState("");
  const [module_description, setDesc] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: CreateModuleDto = {
      module_title,
      module_description,
      course_id : courseId
    };
    if(editingModule){
      const updated = await updateModule(editingModule.module_id,data);
      onUpdate(updated);
      clearEditing();
    }
    else{
      await createModule(data);
      onSuccess();
    }
  };
  useEffect(() => {
      if(!editingModule) return;

      setTitle(editingModule.module_title);
      setDesc(editingModule.module_description);
    }, [editingModule]);
  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Module</h2>
      <label>Provide Module Title ...</label>
      <input
        placeholder="Module Title"
        value={module_title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Provide a brief description about the module ...</label>
      <textarea
        placeholder="Module Description"
        value={module_description}
        onChange={(e) => setDesc(e.target.value)}
      />
      <button>{editingModule ? "Save Changes" : "Add"}</button>
    </form>
  );
};

export default ModuleForm;