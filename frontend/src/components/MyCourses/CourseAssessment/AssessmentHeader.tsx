import React from "react";

export default function AssessmentHeader({ total_questions, answered_questions }: { total_questions: number, answered_questions: number }) {
    return (
        <>
            <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                    { label: "Total Questions", value: total_questions },
                    { label: "Answered", value: answered_questions },
                    { label: "Remaining", value: total_questions - answered_questions },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-white" style={{ color: "#FCA5A5" }}>{stat.value}</p>
                        <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>
        </>
    )
}