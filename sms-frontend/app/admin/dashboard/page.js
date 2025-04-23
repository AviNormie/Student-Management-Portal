'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Students" 
          description="Manage student records" 
          link="/admin/students" 
        />
        <DashboardCard 
          title="Teachers" 
          description="Manage teacher accounts" 
          link="/admin/teachers" 
        />
        <DashboardCard 
          title="Courses" 
          description="Manage course offerings" 
          link="/admin/courses" 
        />
        <DashboardCard 
          title="Attendance" 
          description="View attendance records" 
          link="/admin/attendance" 
        />
        <DashboardCard 
          title="Register Admin" 
          description="Create new admin accounts" 
          link="/admin/register" 
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, description, link }) {
  const router = useRouter();
  
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => router.push(link)}
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}