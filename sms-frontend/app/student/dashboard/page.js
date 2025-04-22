'use client';

import { useState, useEffect } from 'react';
import { getStudentByUserId, getStudentAttendance, getStudentMarks } from '@/lib/api';
import { getUserData } from '@/lib/auth';

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userData = getUserData();

  useEffect(() => {
    const fetchStudentData = async () => {
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
        
        // Get attendance and marks
        const [attendanceData, marksData] = await Promise.all([
          getStudentAttendance(student.id),
          getStudentMarks(student.id)
        ]);
        
        setAttendance(attendanceData);
        setMarks(marksData);
        
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [userData]);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  // Calculate attendance percentage
  const presentDays = attendance.filter(a => a.present).length;
  const totalDays = attendance.length;
  const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
  
  // Calculate average marks
  const totalMarks = marks.reduce((sum, mark) => sum + mark.marks, 0);
  const totalMaxMarks = marks.reduce((sum, mark) => sum + mark.totalMarks, 0);
  const averagePercentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Welcome, {studentData?.name || 'Student'}</h2>
        <p className="text-gray-600 mt-2">Here's your academic overview</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Attendance</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{attendancePercentage.toFixed(2)}%</p>
          <p className="text-sm text-gray-500 mt-1">
            Present: {presentDays} days / Total: {totalDays} days
          </p>
          <div className="mt-4">
            <a href="/student/attendance" className="text-blue-500 hover:underline">
              View Details →
            </a>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Academic Performance</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{averagePercentage.toFixed(2)}%</p>
          <p className="text-sm text-gray-500 mt-1">
            Marks: {totalMarks.toFixed(2)} / {totalMaxMarks.toFixed(2)}
          </p>
          <div className="mt-4">
            <a href="/student/marks" className="text-blue-500 hover:underline">
              View Details →
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a 
            href="/student/profile" 
            className="bg-blue-500 hover:bg-blue-600 text-white text-center py-4 px-6 rounded-lg"
          >
            View Profile
          </a>
          <a 
            href="/student/attendance" 
            className="bg-green-500 hover:bg-green-600 text-white text-center py-4 px-6 rounded-lg"
          >
            View Attendance
          </a>
        </div>
      </div>
    </div>
  );
}