import React from "react";

export default function AssessmentCompletionHeader({ passed, score, passing_score }: { passed: boolean, score: number, passing_score: number }) {
    return (
        <>
            <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                    { label: "Status", value: passed ? "Passed" : "Failed" },
                    { label: "Marks", value: `${score}/ 100` },
                    { label: "Passing Score", value: passing_score },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-green-500">{stat.value}</p>
                        <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>
        </>
    )
}