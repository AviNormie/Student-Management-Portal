'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllCourses, getAllStudents, getStudentMarks, addMarks } from '@/lib/api';
import { getUserData } from '@/lib/auth';

export default function MarksManagement() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [marks, setMarks] = useState([]);
  const [newMark, setNewMark] = useState({
    examName: '',
    totalMarks: 100,
    obtainedMarks: 0,
    remarks: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentMarks(selectedStudent);
    }
  }, [selectedStudent]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await getAllCourses();
      setCourses(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch courses');
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getAllStudents();
      setStudents(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch students');
      setLoading(false);
    }
  };

  const fetchStudentMarks = async (studentId) => {
    try {
      setLoading(true);
      const data = await getStudentMarks(studentId);
      setMarks(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch student marks');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMark({
      ...newMark,
      [name]: name === 'totalMarks' || name === 'obtainedMarks' ? parseInt(value, 10) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const teacher = getUserData();
      const markData = {
        studentId: selectedStudent,
        courseId: selectedCourse,
        teacherId: teacher.id,
        examName: newMark.examName,
        totalMarks: newMark.totalMarks,
        obtainedMarks: newMark.obtainedMarks,
        remarks: newMark.remarks || ''
      };

      console.log('Submitting mark data:', markData);
      await addMarks(markData);
      setSuccess('Marks added successfully!');
      setNewMark({
        examName: '',
        totalMarks: 100,
        obtainedMarks: 0,
        remarks: ''
      });
      fetchStudentMarks(selectedStudent);
    } catch (err) {
      console.error('Error details:', err);
      setError(err.message || 'Failed to add marks');
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (obtained, total) => {
    return ((obtained / total) * 100).toFixed(2);
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Marks Management</h1>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Marks</h2>
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="student">
                Select Student
              </label>
              <select
                id="student"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="course">
                Select Course
              </label>
              <select
                id="course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="examName">
                Exam Name
              </label>
              <input
                type="text"
                id="examName"
                name="examName"
                value={newMark.examName}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Midterm, Final, Quiz, etc."
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalMarks">
                Total Marks
              </label>
              <input
                type="number"
                id="totalMarks"
                name="totalMarks"
                value={newMark.totalMarks}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="1"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="obtainedMarks">
                Obtained Marks
              </label>
              <input
                type="number"
                id="obtainedMarks"
                name="obtainedMarks"
                value={newMark.obtainedMarks}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="0"
                max={newMark.totalMarks}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remarks">
                Remarks
              </label>
              <textarea
                id="remarks"
                name="remarks"
                value={newMark.remarks}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Optional remarks"
                rows="3"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? 'Submitting...' : 'Add Marks'}
              </button>
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Student Marks</h2>
          {selectedStudent ? (
            marks.length > 0 ? (
              <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Course</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Exam</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Marks</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Percentage</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Grade</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((mark, index) => {
                      const percentage = calculatePercentage(mark.obtainedMarks, mark.totalMarks);
                      const grade = getGrade(percentage);
                      return (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4">{mark.courseName || 'N/A'}</td>
                          <td className="py-3 px-4">{mark.examName}</td>
                          <td className="py-3 px-4">{mark.obtainedMarks} / {mark.totalMarks}</td>
                          <td className="py-3 px-4">{percentage}%</td>
                          <td className="py-3 px-4">{grade}</td>
                          <td className="py-3 px-4">{mark.remarks || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-100 p-4 rounded">No marks found for this student.</div>
            )
          ) : (
            <div className="bg-gray-100 p-4 rounded">Select a student to view their marks.</div>
          )}
        </div>
      </div>
    </div>
  );
}