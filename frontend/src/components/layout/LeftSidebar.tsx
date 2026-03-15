import { CourseModule, Assessment } from "../../types/lms";
import '../../styles/leftsidebar.css'

interface props {
    modules : CourseModule[];
    onSelectModule : (module : CourseModule) => void;
    selectedModuleId : string | null;
    onAddModule : () => void
    assessment : null | Assessment;
    onCreateAssessment: ()=>void;
    onDeleteAssessment: (id:string) => void;
    onEditModule : (module : CourseModule) => void;
    onDeleteModule : (id : string) => void;
    onEditAssessment : (id : string) => void;
}

const LeftSidebar = ({
  modules,
  onSelectModule,
  onAddModule,
  assessment,
  onCreateAssessment,
  onDeleteAssessment,
  onEditModule,
  onDeleteModule,
  selectedModuleId,
  onEditAssessment
}: props) => {

    return(
        <aside className="left-sidebar">

            <h3>Modules</h3>

            {modules.map((m) => (
                <div
                  key={m.module_id}
                  className={`module-row ${selectedModuleId === m.module_id ? "active-module" : ""}`}
                >
                    <span onClick={() => onSelectModule(m)}>
                        {m.module_title}
                    </span>

                    <button
                      className="edit-btn"
                      onClick={() => onEditModule(m)}
                    >
                      ✏
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => onDeleteModule(m.module_id)}
                    >
                      🗑
                    </button>

                </div>
            ))}

            {/* ADD MODULE BUTTON */}
            <button
              className="add-module-btn"
              onClick={onAddModule}
            >
              Add Module
            </button>

            <hr/>

            <h3>Assessments</h3>

            {assessment ? (
                <div className="assessment-row">
                    <span>{assessment.title}</span>
                    <button
                      className="delete-btn"
                      onClick={() => onEditAssessment(assessment.assessment_id)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => onDeleteAssessment(assessment.assessment_id)}
                    >
                      Delete
                    </button>

                </div>
            ) : (

                <button
                  className="create-btn"
                  onClick={onCreateAssessment}
                >
                  Create Assessment
                </button>

            )}

        </aside>
    )
}

export default LeftSidebar