import '../../styles/questionsidebar.css'
import { Questions } from "../../types/lms"

interface Props {
  questions: Questions[],
  onAddQuestion: () => void,
  onDeleteQuestion: (id: string) => void,
  onEditQuestion: (q : Questions) => void
}

const QuestionSidebar = ({questions, onAddQuestion, onDeleteQuestion, onEditQuestion}: Props) => {

  return (
    <aside className="question-sidebar">

      <h3>Questions</h3>

      {questions.map((q) => (
        <div className="question-item" key={q.question_id}>

          <span className="question-text">
            {q.question_text.slice(0, 40)}
          </span>
          <button
            className="edit-btn"
            onClick={() => onEditQuestion(q)}
          >
            ✏
          </button>
          <button
            className="delete-btn"
            onClick={() => onDeleteQuestion(q.question_id)}
          >
            🗑
          </button>

        </div>
      ))}

      <button className="add-question-btn" onClick={onAddQuestion}>Add Question</button>

    </aside>
  )
}

export default QuestionSidebar