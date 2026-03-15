import React from "react";
 
interface CourseStats {
  students: number;
  attempts: number;
  passRate: number;
  avgProgress: number;
}
 
interface CourseStatsModalProps {
  stats: CourseStats;
  onClose: () => void;
}
 
export default function CourseStatsModal({ stats, onClose }: CourseStatsModalProps) {
 
  const statsData = [
    {
      label: "Students Enrolled",
      value: stats.students,
      max: 100,
      color: "bg-blue-500"
    },
    {
      label: "Total Attempts",
      value: stats.attempts,
      max: 100,
      color: "bg-purple-500"
    },
    {
      label: "Pass Rate",
      value: stats.passRate,
      max: 100,
      color: "bg-green-500",
      suffix: "%"
    },
    {
      label: "Average Progress",
      value: stats.avgProgress,
      max: 100,
      color: "bg-orange-500",
      suffix: "%"
    }
  ];
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
 
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[420px] relative">
 
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-lg"
          onClick={onClose}
        >
          ✕
        </button>
 
        <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">
          Course Statistics
        </h3>
 
        <div className="space-y-5">
 
          {statsData.map((item, index) => {
            const percentage = Math.min((item.value / item.max) * 100, 100);
 
            return (
              <div key={index}>
 
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{item.label}</span>
                  <span className="font-semibold text-gray-800">
                    {item.value}{item.suffix || ""}
                  </span>
                </div>
 
                <div className="w-full bg-gray-200 rounded-full h-3">
 
                  <div
                    className={`${item.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
 
                </div>
 
              </div>
            );
          })}
 
        </div>
 
      </div>
 
    </div>
  );
}
 