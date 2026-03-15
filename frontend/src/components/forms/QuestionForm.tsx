import "../../styles/questionform.css";
import { useState, useEffect } from "react";
import { CreateQuestionDTO, CreateQuestionChoiceDTO, Questions } from "../../types/lms";
import { updateQuestion } from "../../api/questionsapi";
import InstructorNavbar from "../InstructorManageCourses/InstructorNavbar";
interface Props {
  onAdd: (q: CreateQuestionDTO) => void;
  assessmentId: string;
  editingQuestion?: any;
  clearEditing : ()=>void;
  onUpdate : (q : Questions) => void
}

const QuestionForm = ({ onAdd, assessmentId,editingQuestion,clearEditing,onUpdate }: Props) => {

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);

  const handleSubmit = async () => {

  if (!questionText.trim()) {
    alert("Enter question text");
    return;
  }

  if (options.some(opt => opt.trim() === "")) {
    alert("All options must be filled");
    return;
  }

  const choices: CreateQuestionChoiceDTO[] = options.map((opt, i) => ({
    choice_text: opt,
    is_correct: i === correctIndex
  }));

  const newQuestion: CreateQuestionDTO = {
    question_text: questionText,
    question_type: "MULTIPLE_CHOICE",
    points: 1,
    fk_assessment_id: assessmentId,
    choices
  };

  if (editingQuestion) {
    const updated = await updateQuestion(editingQuestion.question_id, newQuestion);
    onUpdate(updated);
    clearEditing();
  } else {
    onAdd(newQuestion);
  }

  setQuestionText("");
  setOptions(["", "", "", ""]);
  setCorrectIndex(0);
};
  useEffect(() => {

    if(!editingQuestion) return;

    setQuestionText(editingQuestion.question_text);

    const opts = editingQuestion.choices.map((c:any)=>c.choice_text);
    setOptions(opts);

    const correct = editingQuestion.choices.findIndex((c:any)=>c.is_correct);
    setCorrectIndex(correct);

  }, [editingQuestion]);
  return (
    <>
    <main className="question-form">

      <h2>Add Question</h2>
      <label>Enter the Question here...</label>
      <input
        placeholder="Question Text"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
      />
      <label>Provide all 4 oprions for the question below ...</label>
      <div className="options-grid">
        {options.map((opt, i) => (
          <input
          key={i}
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={(e) => {const newOptions = [...options]; newOptions[i] = e.target.value; setOptions(newOptions);}}/>))
        }
      </div>
      <h2>Select Correct Option</h2>
      <select
        value={correctIndex}
        onChange={(e) => setCorrectIndex(Number(e.target.value))}
      >
        <option value={0}>Correct: Option 1</option>
        <option value={1}>Correct: Option 2</option>
        <option value={2}>Correct: Option 3</option>
        <option value={3}>Correct: Option 4</option>
      </select>

      <button onClick={handleSubmit}>{editingQuestion ? "Save Changes" : "Add Question"}</button>

    </main>
    </>
  );
};

export default QuestionForm;