import React from 'react';
import { OverviewStats } from '../../api';

interface Props {
    data: OverviewStats;
}

const OverviewCards: React.FC<Props> = ({ data }) => {
    const cards = [
        { label: 'Courses Enrolled', value: data.coursesEnrolled, color: '#4f46e5' },
        { label: 'Assessments Attempted', value: data.assessmentsAttempted, color: '#059669' },
        { label: 'Modules Completed', value: data.moduleCompletions, color: '#d97706' },
        { label: 'Avg Score', value: data.avgScore ?? '—', color: '#dc2626' },
    ];

    return (
        <div className="overview-cards">
            {cards.map((card) => (
                <div key={card.label} className="card" style={{ borderTop: `4px solid ${card.color}` }}>
                    <h3>{card.value}</h3>
                    <p>{card.label}</p>
                </div>
            ))}
        </div>
    );
};

export default OverviewCards;
