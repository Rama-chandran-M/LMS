import React from "react";

export default function AssessmentCard({ question, index, onAnswerChange, view }: { question: any, index: number, onAnswerChange: (qId: string, cId: string) => void, view: boolean }) {

    console.log(question)
    return (
        <>
            <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.03] backdrop-blur-sm mb-2">
                <div className="mx-10 my-7">
                    <div>{index + 1} {question.question_text} ?</div>
                    <div className="mt-2">
                        {
                            question.choices.map((choice: any, index: number) => (
                                < div className="flex gap-4">
                                    <input type="radio" name={question.question_text} value={choice.choice_id} id="option1" onChange={() => onAnswerChange(question.question_id, choice.choice_id)} />
                                    <label htmlFor="option1">{choice.choice_text}</label>
                                </div>
                            ))

                        }
                    </div>


                </div>
            </div >
        </>
    );
}