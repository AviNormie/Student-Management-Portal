'use client';

import { useState, useEffect } from 'react';
import { getAllStudents, getAllCourses } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch students and courses in parallel
        const [studentsData, coursesData] = await Promise.all([
          getAllStudents(),
          getAllCourses()
        ]);
        
        setStats({
          students: studentsData.length,
          courses: coursesData.length
        });
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Total Students</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.students}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Total Courses</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.courses}</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href="/admin/students/add" 
            className="bg-blue-500 hover:bg-blue-600 text-white text-center py-4 px-6 rounded-lg"
          >
            Add New Student
          </a>
          <a 
            href="/admin/students" 
            className="bg-green-500 hover:bg-green-600 text-white text-center py-4 px-6 rounded-lg"
          >
            Manage Students
          </a>
        </div>
      </div>
    </div>
  );
}