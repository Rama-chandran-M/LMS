import React from 'react';
import { RecentAttempt } from '../../api';

interface Props {
    data: RecentAttempt[];
}

const RecentAttempts: React.FC<Props> = ({ data }) => {
    return (
        <div className="table-section">
            <h2>Recent Attempts</h2>
            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Assessment</th>
                        <th>Score</th>
                        <th>Passed</th>
                        <th>Attempted At</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((a) => (
                        <tr key={a.attemptId}>
                            <td>{a.studentName}</td>
                            <td>{a.assessmentTitle}</td>
                            <td>{a.score ?? '—'}</td>
                            <td>{a.passed ? 'Yes' : 'No'}</td>
                            <td>{new Date(a.attemptedAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecentAttempts;
