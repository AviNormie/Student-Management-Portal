'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getRole, getUserData } from '@/lib/auth';

export default function AuthCheck({ requiredRole, children }) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      console.log('AuthCheck - Not authenticated, redirecting to login');
      router.push('/login');
      return;
    }

    // Check if user data is valid (not HTML)
    const userData = getUserData();
    if (typeof userData === 'string' && userData.includes('<!DOCTYPE html>')) {
      console.log('AuthCheck - Invalid user data (HTML content), clearing and redirecting to login');
      localStorage.removeItem('user');
      router.push('/login');
      return;
    }

    // Only check role if requiredRole is provided
    if (requiredRole) {
      const userRole = getRole();
      console.log('AuthCheck - Comparing roles:', { userRole, requiredRole });
      
      // Check if userRole is null or undefined
      if (!userRole) {
        console.log('AuthCheck - User role is null, redirecting to login');
        router.push('/login');
        return;
      }
      
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