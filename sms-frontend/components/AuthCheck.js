'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getRole } from '@/lib/auth';

export default function AuthCheck({ requiredRole, children }) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Check if user has the required role
    const userRole = getRole();
    if (requiredRole && userRole !== requiredRole) {
      // Redirect based on user role
      switch (userRole) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'teacher':
          router.push('/teacher/dashboard');
          break;
        case 'student':
          router.push('/student/dashboard');
          break;
        default:
          router.push('/login');
      }
    }
  }, [router, requiredRole]);

  return children;
}