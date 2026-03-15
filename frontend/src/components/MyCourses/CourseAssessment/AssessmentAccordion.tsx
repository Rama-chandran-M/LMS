import React from 'react'
import { IconCheck } from '../../../assets/icons/course_icons';
import { useNavigate } from 'react-router-dom';

const AssessmentAccordion = ({ best_assessment_attempt }: { best_assessment_attempt: any }) => {


    const navigate = useNavigate()


    const handleAssessmentNavigation = () => {
        navigate('/mycourselayout//mycourse/assessment');
    };
    const handleAssessmentCompletionNavigation = () => {
        sessionStorage.setItem("attempt_id", best_assessment_attempt.attempt_id)
        navigate('/mycourselayout/assessment/completion');
    };



    const allDone = best_assessment_attempt ? true : false

    return (
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.03] backdrop-blur-sm">

            <button
                className="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-white/[0.04] transition-colors"
            >

                <span className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold
                    ${allDone ? "bg-emerald-400/20 text-emerald-400" : "bg-white/10 text-white/60"}`}>
                    {allDone && <IconCheck />}
                </span>
                <span className='text-sm'>
                    {
                        allDone ?
                            <button className='rounded-md px-3 py-2 bg-green-600 hover:bg-green-500'
                                onClick={() => handleAssessmentCompletionNavigation()}
                            >
                                view answers
                            </button> :
                            <div className='text-white/50 text-sm'>
                                Not completed
                            </div>
                    }
                </span>
                <button className='rounded-md px-3 py-2 bg-green-600 hover:bg-green-500 text-sm'
                    onClick={() => handleAssessmentNavigation()}
                >
                    {
                        allDone ? "re attempt" : "assessment"
                    }
                </button>
            </button>



        </div>
    );
};


export default AssessmentAccordion
