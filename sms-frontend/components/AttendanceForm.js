'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClassById, getAllStudents, markAttendance } from '@/lib/api';
import { getUserData } from '@/lib/auth';

export default function AttendanceForm({ classId }) {
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (classId) {
      fetchClassData();
      fetchStudents();
    }
  }, [classId]);

  const fetchClassData = async () => {
    try {
      setLoading(true);
      const data = await getClassById(classId);
      setClassData(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch class data');
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getAllStudents();
      setStudents(data);
      
      // Initialize attendance records
      const initialRecords = data.map(student => ({
        studentId: student.id,
        present: false,
        remarks: ''
      }));
      setAttendanceRecords(initialRecords);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch students');
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, present) => {
    setAttendanceRecords(prevRecords => 
      prevRecords.map(record => 
        record.studentId === studentId 
          ? { ...record, present } 
          : record
      )
    );
  };

  const handleRemarksChange = (studentId, remarks) => {
    setAttendanceRecords(prevRecords => 
      prevRecords.map(record => 
        record.studentId === studentId 
          ? { ...record, remarks } 
          : record
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
  
    try {
      const teacher = getUserData();
      const presentStudents = attendanceRecords.filter(record => record.present);
      
      // Process each student's attendance individually
      const promises = attendanceRecords.map(async (record) => {
        const attendanceData = {
          studentId: record.studentId,
          courseId: classData.courseId,
          classId: classId,
          date: new Date().toISOString().split('T')[0],
          present: record.present,
          remarks: record.remarks || ''
        };
        
        try {
          return await markAttendance(attendanceData);
        } catch (err) {
          console.error(`Error marking attendance for student ${record.studentId}:`, err);
          throw err;
        }
      });
      
      await Promise.all(promises);
      setSuccess('Attendance marked successfully!');
      router.push('/teacher/classes');
    } catch (err) {
      console.error('Error marking attendance:', err);
      setError(err.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  if (!classData) {
    return <div className="text-center p-8">Loading class data...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Mark Attendance</h1>
      <h2 className="text-xl mb-6">
        {classData.name} - {new Date(classData.date).toLocaleDateString()} ({classData.startTime} - {classData.endTime})
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Student Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Attendance</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b">
                <td className="py-3 px-4">{student.name}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        onChange={() => handleAttendanceChange(student.id, true)}
                        className="form-radio h-5 w-5 text-green-600"
                      />
                      <span className="ml-2 text-green-600">Present</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        onChange={() => handleAttendanceChange(student.id, false)}
                        className="form-radio h-5 w-5 text-red-600"
                        defaultChecked
                      />
                      <span className="ml-2 text-red-600">Absent</span>
                    </label>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    placeholder="Add remarks (optional)"
                    onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => router.push('/teacher/classes')}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Submitting...' : 'Submit Attendance'}
        </button>
      </div>
    </div>
  );
}