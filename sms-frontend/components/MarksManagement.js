'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllStudents, getAllCourses, addMarks } from '@/lib/api';
import { getUserData } from '@/lib/auth';

export default function MarksManagement() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    teacherId: '',
    examName: '',
    subject: '',  // Added missing required field
    examType: '',  // Added missing required field
    marks: null,   // Changed from undefined to null
    totalMarks: 100,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchStudents();
    fetchCourses();
    
    // Set teacher ID from logged in user
    const teacher = getUserData();
    if (teacher && teacher.id) {
      setFormData(prev => ({
        ...prev,
        teacherId: teacher.id
      }));
    }
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (err) {
      setError('Failed to fetch students');
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (err) {
      setError('Failed to fetch courses');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert marks to integer if it's a number field
    if (name === 'marks' || name === 'totalMarks') {
      setFormData({
        ...formData,
        [name]: value ? parseInt(value) : null
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.subject) {
        throw new Error('Subject is required');
      }
      
      if (!formData.examType) {
        throw new Error('Exam type is required');
      }
      
      if (formData.marks === null) {
        throw new Error('Marks are required');
      }
      
      // Create the marks data object
      const marksData = {
        studentId: formData.studentId,
        courseId: formData.courseId,
        teacherId: formData.teacherId,
        examName: formData.examName,
        subject: formData.subject,
        examType: formData.examType,
        marks: formData.marks,
        totalMarks: formData.totalMarks
      };

      console.log('Submitting marks data:', marksData);
      await addMarks(marksData);
      
      setSuccess('Marks added successfully!');
      // Reset form
      setFormData({
        studentId: '',
        courseId: '',
        teacherId: formData.teacherId, // Keep the teacher ID
        examName: '',
        subject: '',
        examType: '',
        marks: null,
        totalMarks: 100
      });
    } catch (err) {
      console.error('Error details:', err.response?.data || err);
      setError(err.message || 'Failed to add marks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Student Marks</h1>

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

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentId">
              Student*
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
            >
              <option value="">Select Student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.rollNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courseId">
              Course*
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              required
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
              Subject*
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="subject"
              name="subject"
              type="text"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="examName">
              Exam Name*
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="examName"
              name="examName"
              type="text"
              placeholder="Midterm, Final, etc."
              value={formData.examName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="examType">
              Exam Type*
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="examType"
              name="examType"
              value={formData.examType}
              onChange={handleChange}
              required
            >
              <option value="">Select Exam Type</option>
              <option value="MIDTERM">Midterm</option>
              <option value="FINAL">Final</option>
              <option value="QUIZ">Quiz</option>
              <option value="ASSIGNMENT">Assignment</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="marks">
              Marks Obtained*
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="marks"
              name="marks"
              type="number"
              min="0"
              placeholder="Marks"
              value={formData.marks === null ? '' : formData.marks}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalMarks">
              Total Marks*
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="totalMarks"
              name="totalMarks"
              type="number"
              min="1"
              placeholder="Total Marks"
              value={formData.totalMarks}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={() => router.push('/teacher/dashboard')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? 'Saving...' : 'Add Marks'}
          </button>
        </div>
      </form>
    </div>
  );
}