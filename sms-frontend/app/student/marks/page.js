
// app/student/marks/page.js
'use client';

import { useState, useEffect } from 'react';
import { getStudentByUserId, getStudentMarks } from '@/lib/api';
import { getUserData } from '@/lib/auth';

export default function StudentMarksPage() {
  const [studentData, setStudentData] = useState(null);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userData = getUserData();

  useEffect(() => {
    const fetchMarksData = async () => {
      if (!userData || !userData.id) {
        setError('User data not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get student data
        const student = await getStudentByUserId(userData.id);
        setStudentData(student);
        
        // Get marks data
        const marksData = await getStudentMarks(student.id);
        setMarks(marksData);
        
      } catch (err) {
        console.error('Error fetching marks data:', err);
        setError('Failed to load marks data');
      } finally {
        setLoading(false);
      }
    };

    fetchMarksData();
  }, [userData]);

  if (loading) {
    return <div className="text-center py-10">Loading marks data...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  // Group marks by subject
  const marksBySubject = marks.reduce((acc, record) => {
    if (!acc[record.subject]) {
      acc[record.subject] = [];
    }
    
    acc[record.subject].push(record);
    return acc;
  }, {});

  // Calculate overall performance
  const totalMarksObtained = marks.reduce((sum, record) => sum + record.marks, 0);
  const totalMaxMarks = marks.reduce((sum, record) => sum + record.totalMarks, 0);
  const overallPercentage = totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100 : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Academic Performance</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700">Overall Performance</h2>
        <p className="text-3xl font-bold text-blue-600 mt-2">{overallPercentage.toFixed(2)}%</p>
        <p className="text-sm text-gray-500 mt-1">
          Total Marks: {totalMarksObtained.toFixed(2)} / {totalMaxMarks.toFixed(2)}
        </p>
      </div>
      
      {Object.keys(marksBySubject).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(marksBySubject).map(([subject, subjectMarks]) => {
            // Calculate subject performance
            const subjectTotal = subjectMarks.reduce((sum, record) => sum + record.marks, 0);
            const subjectMaxTotal = subjectMarks.reduce((sum, record) => sum + record.totalMarks, 0);
            const subjectPercentage = (subjectTotal / subjectMaxTotal) * 100;
            
            return (
              <div key={subject} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">{subject}</h3>
                  <p className="text-sm text-gray-600">
                    Overall: {subjectPercentage.toFixed(2)}% ({subjectTotal.toFixed(2)} / {subjectMaxTotal.toFixed(2)})
                  </p>
                </div>
                
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exam Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Marks
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Marks
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subjectMarks.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {record.examType}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{record.marks.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{record.totalMarks.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {((record.marks / record.totalMarks) * 100).toFixed(2)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-500">No marks data available yet.</p>
        </div>
      )}
    </div>
  );
}