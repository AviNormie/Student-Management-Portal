'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getStudentById } from '@/lib/api';
import StudentForm from '@/components/StudentForm';

export default function EditStudentPage() {
  const params = useParams();
  const studentId = params.id;
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const data = await getStudentById(studentId);
        setStudent(data);
      } catch (err) {
        console.error('Error fetching student:', err);
        setError('Failed to load student');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  if (loading) {
    return <div className="text-center py-10">Loading student data...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return <StudentForm student={student} />;
}