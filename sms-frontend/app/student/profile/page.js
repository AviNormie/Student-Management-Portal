'use client';

import { useState, useEffect } from 'react';
import { getStudentByUserId, getStudentAttendance, getStudentMarks } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch student data
        const studentData = await getStudentByUserId(user.id);
        setStudent(studentData);

        // Only fetch attendance and marks if we have student data
        if (studentData && studentData.id) {
          try {
            const attendanceData = await getStudentAttendance(studentData.id);
            setAttendance(attendanceData);
          } catch (err) {
            console.error('Error fetching attendance:', err);
            // Don't set error state to prevent UI disruption
          }

          try {
            const marksData = await getStudentMarks(studentData.id);
            setMarks(marksData);
          } catch (err) {
            console.error('Error fetching marks:', err);
            // Don't set error state to prevent UI disruption
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load student profile');
        setLoading(false);
      }
    };

    fetchData();
  }, [router]); // Only run once on component mount

  if (loading) {
    return <div className="text-center p-8">Loading student profile...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (!student) {
    return <div className="text-center p-8">No student data found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Student Profile</h1>
      
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><span className="font-medium">Name:</span> {student.name}</p>
            <p><span className="font-medium">Roll Number:</span> {student.rollNumber}</p>
            <p><span className="font-medium">Email:</span> {student.email}</p>
          </div>
          <div>
            <p><span className="font-medium">Phone:</span> {student.phone || 'N/A'}</p>
            <p><span className="font-medium">Year:</span> {student.year}</p>
            <p><span className="font-medium">Address:</span> {student.address || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Attendance Section */}
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Attendance</h2>
        {attendance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No attendance records found</p>
        )}
      </div>

      {/* Marks Section */}
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Academic Performance</h2>
        {marks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Subject</th>
                  <th className="py-2 px-4 border-b">Exam Type</th>
                  <th className="py-2 px-4 border-b">Marks</th>
                  <th className="py-2 px-4 border-b">Total</th>
                  <th className="py-2 px-4 border-b">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((mark, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">{mark.subject}</td>
                    <td className="py-2 px-4 border-b">{mark.examType}</td>
                    <td className="py-2 px-4 border-b">{mark.marks}</td>
                    <td className="py-2 px-4 border-b">{mark.totalMarks}</td>
                    <td className="py-2 px-4 border-b">
                      {((mark.marks / mark.totalMarks) * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No marks records found</p>
        )}
      </div>
    </div>
  );
}