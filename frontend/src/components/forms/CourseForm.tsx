import '../../styles/courseform.css';
import { useState } from "react";
import { Course, CreateCourseDTO } from "../../types/lms";
import { createCourse } from "../../api/courseapi";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from '../enrollment/Navbar';
import InstructorNavbar from '../InstructorManageCourses/InstructorNavbar';


const CourseForm = () => {

    const {instructorId} = useParams<{instructorId:string}>();
    const[course_name, setCourseName] = useState("");
    const[technology,setTechnology] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async(e : React.FormEvent) => {
        e.preventDefault();
        if (!instructorId) {
            alert("Instructor ID missing in URL");
            return;
        }
        console.log(`Instructor Id : ${instructorId}`);
        const data : CreateCourseDTO = {
            course_name,
            technology,
            fk_instructor_id : instructorId,
        }
        const res = await createCourse(data)
        console.log(`Course Id : ${res.course_id}`);
        navigate(`/coursemodule/${res.course_id}`)
    }
    return(
        <>
        <InstructorNavbar/>
        <div className="course-form-wrapper">
            <form className="course-form" onSubmit={handleSubmit}>
                <h2>Create Course</h2>
                <label>Enter the Course Name here...</label>
                <input placeholder="Course Name" value={course_name} onChange={(e) => setCourseName(e.target.value)}/>
                <label>Specify the Technology Tag...</label>
                <input placeholder="Technology" value={technology} onChange={(e) => setTechnology(e.target.value)}/>
                <button type="submit">Create</button>
            </form>
        </div>
        </>
    )
}

export default CourseForm;

