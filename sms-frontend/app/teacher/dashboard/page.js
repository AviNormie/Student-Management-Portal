'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getUserData } from '@/lib/auth';
import AuthCheck from '@/components/AuthCheck';

export default function TeacherDashboard() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = getUserData();
    setUserData(user);
  }, []);

  return (
    <AuthCheck requiredRole="TEACHER">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>
        
        {userData && (
          <div className="bg-white shadow-md rounded p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {userData.name}!</h2>
            <p className="text-gray-600">Manage your classes and student attendance from here.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/teacher/classes">
            <div className="bg-blue-100 hover:bg-blue-200 p-6 rounded-lg shadow-md transition duration-300">
              <h3 className="text-lg font-semibold mb-2">Manage Classes</h3>
              <p className="text-gray-600">Create and manage your classes</p>
            </div>
          </Link>
          
          <Link href="/teacher/students">
            <div className="bg-green-100 hover:bg-green-200 p-6 rounded-lg shadow-md transition duration-300">
              <h3 className="text-lg font-semibold mb-2">View Students</h3>
              <p className="text-gray-600">View and manage your students</p>
            </div>
          </Link>
          
          <Link href="/teacher/marks">
            <div className="bg-purple-100 hover:bg-purple-200 p-6 rounded-lg shadow-md transition duration-300">
              <h3 className="text-lg font-semibold mb-2">Manage Marks</h3>
              <p className="text-gray-600">Add and update student marks</p>
            </div>
          </Link>
        </div>
      </div>
    </AuthCheck>
  );
}