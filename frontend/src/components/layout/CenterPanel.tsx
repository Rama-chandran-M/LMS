import "../../styles/centerpanel.css";

import { CourseModule, Section } from "../../types/lms";
import ModuleForm from "../forms/ModuleForm";
import SectionForm from "../forms/SectionForm";

interface Props {
  activeForm: "addModule" | "addSection" | null;
  courseId: string;
  selectedModule: CourseModule | null;
  onSuccess: () => void;
  editingModule : CourseModule | null;
  updateModule : (m : CourseModule) => void;
  clearEditingModule : () => void;
  editingSection : Section | null;
  updateSection : (s : Section) => void;
  clearEditingSection : () => void;
}

const CenterPanel = ({
  activeForm,
  courseId,
  selectedModule,
  onSuccess,
  editingModule,
  updateModule,
  clearEditingModule,
  editingSection,
  updateSection,
  clearEditingSection
}: Props) => {
  return (
    <main className="center-panel">
      {!activeForm && (
        <div className="placeholder">
          <h2 style={{ textAlign: "center", marginBottom: "8px", color: "#374151" }}>Select an action</h2>
          <p style={{ textAlign: "center", color: "#6b7280", fontSize: "15px" }}>Add a module or select a module to add sections</p>
        </div>
      )}

      {activeForm === "addModule" && (
        <ModuleForm courseId={courseId} onSuccess={onSuccess} editingModule={editingModule} onUpdate={updateModule} clearEditing={clearEditingModule}/>
      )}

      {activeForm === "addSection" && !selectedModule && (
        <div className="placeholder">
          <h2>Select a module first</h2>
        </div>
      )}

      {activeForm === "addSection" && selectedModule && (
        <SectionForm
          moduleId={selectedModule.module_id}
          onSuccess={onSuccess}
          editingSection={editingSection}
          onUpdate={updateSection}
          clearEditing={clearEditingSection}
        />
      )}
    </main>
  );
};

export default CenterPanel;