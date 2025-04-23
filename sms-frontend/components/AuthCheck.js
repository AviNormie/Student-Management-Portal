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

    // Only check role if requiredRole is provided
    if (requiredRole) {
      const userRole = getRole();
      console.log('AuthCheck - Comparing roles:', { userRole, requiredRole });
      
      // Convert both roles to uppercase for comparison
      if (userRole.toUpperCase() !== requiredRole.toUpperCase()) {
        console.log('AuthCheck - Role mismatch, redirecting to login');
        router.push('/login');
        return;
      }
    }
  }, [router, requiredRole]);

  return children;
}