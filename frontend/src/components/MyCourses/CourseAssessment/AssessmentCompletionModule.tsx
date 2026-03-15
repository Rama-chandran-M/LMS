import React from "react";
import { IconBack } from "../../../assets/icons/course_icons";
import AssessmentCard from "./QuestionCard";
import AssessmentCompletionHeader from "./AssessmentCompletionHeader";
import { useEffect, useState } from "react";
import { useAssessment } from "../../../api/hooks/useAssessments";
import { useSubmitAssessment } from "../../../api/hooks/useAssessments";
import { useNavigate } from "react-router-dom";
import { useAttemptDetails } from "../../../api/hooks/useAssessments";
import QuestionCompletionCard from "./QuestionCompletionCard";



export default function AssessmentCompletionModule() {


    const [assessmentDetails, setAssessmentDetails] = useState<any | null>();

    const [answers, setAnswers] = useState<{ question_id: string; choice_id: string }[]>([]);


    const handleAnswerChange = (question_id: string, choice_id: string) => {
        setAnswers(prev => {
            const filtered = prev.filter(a => a.question_id !== question_id);
            return [...filtered, { question_id, choice_id }];
        });
    };


    useEffect(() => {
        const attempt_id = sessionStorage.getItem("attempt_id")
        attempt_id && setAssessmentDetails(() => ({
            attempt_id: attempt_id
        }))
    }, [])

    const { data: attempt, isLoading } = useAttemptDetails(assessmentDetails?.attempt_id ?? "")

    if (!isLoading) {
        console.log(attempt)
    }


    const navigate = useNavigate();
    const handleExitNavigation = () => {
        navigate('/mycourselayout/mycourse')
    }

    return (
        <>
            <div className="animate-slideIn">
                <div className="relative rounded-3xl overflow-hidden mb-6 p-6 sm:p-8"
                    style={{ background: `linear-gradient(135deg, #FCA5A5 22 0%, #0f172a 70%)` }}>

                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
                        style={{ background: "#FCA5A5", transform: "translate(30%, -30%)" }} />

                    <button
                        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/90 transition-colors mb-4 group"
                    >
                        <span className="group-hover:-translate-x-0.5 transition-transform"><IconBack /></span>
                        <button onClick={() => handleExitNavigation()}>
                            Exit
                        </button>
                    </button>

                    {
                        assessmentDetails &&
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                            <div className="flex-1 min-w-0">

                                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-1"> {attempt && attempt.assessment.title}</h2>
                            </div>
                        </div>
                    }

                    {assessmentDetails && attempt &&
                        <AssessmentCompletionHeader passed={attempt.passed} score={attempt.score} passing_score={attempt.assessment.passing_score} />}
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest px-1 mb-4">
                        Question #1
                    </h3>
                    {
                        attempt ?
                            <div className="">
                                {
                                    attempt.answers && attempt.answers.map((question: any, index: any) => (
                                        < QuestionCompletionCard key={index} question={question} index={index} />
                                    ))

                                }
                            </div> :
                            <h1>No Assessment found !</h1>
                    }
                </div>

            </div>
        </>
    )
}