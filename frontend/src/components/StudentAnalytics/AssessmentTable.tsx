import React from 'react';
import { AssessmentStat } from '../../api';

interface Props {
    data: AssessmentStat[];
}

const AssessmentTable: React.FC<Props> = ({ data }) => {
    return (
        <div className="table-section">
            <h2>Assessment Performance</h2>
            <table>
                <thead>
                    <tr>
                        <th>Assessment</th>
                        <th>Course</th>
                        <th>Passing Score</th>
                        <th>Score</th>
                        <th>Passed</th>
                        <th>Attempted At</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((a) => (
                        <tr key={a.attemptId}>
                            <td>{a.title}</td>
                            <td>{a.courseName}</td>
                            <td>{a.passingScore}</td>
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

export default AssessmentTable;
