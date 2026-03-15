import '../../styles/assessmentform.css';
import { useState } from "react";
import { CreateAssessmentDTO } from "../../types/lms";
import { createAssessment } from "../../api/assessmentapi";
import { useNavigate, useParams } from "react-router-dom";
import InstructorNavbar from '../InstructorManageCourses/InstructorNavbar';


const CourseForm = () => {

    const {courseId} = useParams<{courseId:string}>();
    const[title, setTitle] = useState("");
    const[description,setDescription] = useState("");
    const[passingscore,setPassingScore] = useState<number>(50);
    const navigate = useNavigate();
    const handleSubmit = async(e : React.FormEvent) => {
        e.preventDefault();
        if (!courseId) {
            alert("Course ID missing in URL");
            return;
        }
        console.log(`Course Id : ${courseId}`);
        const data : CreateAssessmentDTO = {
            title,
            description,
            passing_score: passingscore,
            fk_course_id : courseId,
        }
        const res = await createAssessment(data)
        console.log(`Assessment Id : ${res.assessment_id}`);
        navigate(`/assessment/${res.assessment_id}`)
    }
    return(
      <>
      <InstructorNavbar/>
  <div className="assessment-form-wrapper">

  <form className="assessment-form" onSubmit={handleSubmit}>

    <h2>Create Assessment</h2>

    <div className="form-group">
      <label>Enter the assessment title</label>
      <input
        placeholder="Assessment Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>

    <div className="form-group">
      <label>Provide a brief description about the assessment</label>
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>

    <div className="form-group">
      <div className="label-row">
        <label>Provide total marks for the assessment</label>
        <span className="note">Each MCQ carries 1 mark</span>
      </div>

      <input
        placeholder="Passing Score"
        value={passingscore}
        onChange={(e) => setPassingScore(Number(e.target.value))}
      />
    </div>

    <button type="submit">Create</button>

  </form>

</div>
</>
)
}

export default CourseForm;