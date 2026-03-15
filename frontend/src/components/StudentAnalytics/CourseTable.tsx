import React from 'react';
import { CourseStat } from '../../api';

interface Props {
    data: CourseStat[];
}

const CourseTable: React.FC<Props> = ({ data }) => {
    return (
        <div className="table-section">
            <h2>Course Statistics</h2>
            <table>
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Technology</th>
                        <th>Instructor</th>
                        <th>Modules</th>
                        <th>Avg Score</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((c) => (
                        <tr key={c.courseId}>
                            <td>{c.courseName}</td>
                            <td>{c.technology}</td>
                            <td>{c.instructor}</td>
                            <td>{c.moduleCount}</td>
                            <td>{c.avgScore ?? '—'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CourseTable;
