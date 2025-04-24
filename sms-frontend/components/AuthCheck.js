'use client';

// This component now simply renders children without any authentication checks
export default function AuthCheck({ requiredRole, children }) {
  // Always render children without any checks
  return children;
}