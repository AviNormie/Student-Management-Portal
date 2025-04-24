
// app/student/marks/page.js
'use client';

import { useState, useEffect } from 'react';
import { getStudentByUserId, getStudentMarks } from '@/lib/api';
import { getUserData } from '@/lib/auth';
import AuthCheck from '@/components/AuthCheck';

export default function StudentMarksPage() {
  const [student, setStudent] = useState(null);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentData();
  }, []);

  useEffect(() => {
    if (student) {
      fetchMarks();
    }
  }, [student]);

  const fetchStudentData = async () => {
    try {
      const userData = getUserData();
      console.log("User data:", userData);
      const studentData = await getStudentByUserId(userData.id);
      console.log("Student data:", studentData);
      setStudent(studentData);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError('Failed to fetch student data');
      setLoading(false);
    }
  };

  const fetchMarks = async () => {
    try {
      const data = await getStudentMarks(student.id);
      console.log("Marks data:", data);
      setMarks(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching marks:", err);
      setError('Failed to fetch marks records');
      setLoading(false);
    }
  };

  const calculateGrade = (obtained, total) => {
    const percentage = (obtained / total) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  return (
    <AuthCheck requiredRole="STUDENT">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Academic Performance</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center p-8">Loading marks data...</div>
        ) : (
          <div className="bg-white shadow-md rounded my-6">
            <h2 className="text-xl font-semibold p-4 border-b">Marks Records</h2>
            {marks.length === 0 ? (
              <p className="p-4 text-gray-500">No marks records found.</p>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Subject</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Exam Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Marks</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((mark, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{mark.subject}</td>
                      <td className="py-3 px-4">{mark.examType}</td>
                      <td className="py-3 px-4">{mark.marks}/{mark.totalMarks}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded ${
                          calculateGrade(mark.marks, mark.totalMarks) === 'F' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {calculateGrade(mark.marks, mark.totalMarks)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </AuthCheck>
  );
}