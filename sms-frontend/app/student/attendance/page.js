'use client';

import { useState, useEffect } from 'react';
import { getStudentByUserId, getStudentAttendance } from '@/lib/api';
import { getUserData } from '@/lib/auth';
import AuthCheck from '@/components/AuthCheck';

export default function StudentAttendancePage() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentData();
  }, []);

  useEffect(() => {
    if (student) {
      fetchAttendance();
    }
  }, [student]);

  const fetchStudentData = async () => {
    try {
      const userData = getUserData();
      const studentData = await getStudentByUserId(userData.id);
      setStudent(studentData);
    } catch (err) {
      setError('Failed to fetch student data');
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const data = await getStudentAttendance(student.id);
      setAttendance(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch attendance records');
      setLoading(false);
    }
  };

  const calculateAttendanceStats = () => {
    if (!attendance.length) return { present: 0, absent: 0, percentage: 0 };
    
    const present = attendance.filter(record => record.present).length;
    const total = attendance.length;
    const percentage = Math.round((present / total) * 100);
    
    return {
      present,
      absent: total - present,
      percentage
    };
  };

  const stats = calculateAttendanceStats();

  return (
    <AuthCheck requiredRole="STUDENT">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Attendance</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center p-8">Loading attendance data...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white shadow-md rounded p-4">
                <h3 className="font-semibold text-lg mb-2">Present</h3>
                <p className="text-3xl text-green-600">{stats.present}</p>
              </div>
              <div className="bg-white shadow-md rounded p-4">
                <h3 className="font-semibold text-lg mb-2">Absent</h3>
                <p className="text-3xl text-red-600">{stats.absent}</p>
              </div>
              <div className="bg-white shadow-md rounded p-4">
                <h3 className="font-semibold text-lg mb-2">Attendance Rate</h3>
                <p className="text-3xl text-blue-600">{stats.percentage}%</p>
              </div>
            </div>

            <div className="bg-white shadow-md rounded my-6">
              <h2 className="text-xl font-semibold p-4 border-b">Attendance Records</h2>
              {attendance.length === 0 ? (
                <p className="p-4 text-gray-500">No attendance records found.</p>
              ) : (
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Class</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((record) => (
                      <tr key={record.id} className="border-b">
                        <td className="py-3 px-4">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{record.className}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded ${record.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {record.present ? 'Present' : 'Absent'}
                          </span>
                        </td>
                        <td className="py-3 px-4">{record.remarks || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </AuthCheck>
  );
}