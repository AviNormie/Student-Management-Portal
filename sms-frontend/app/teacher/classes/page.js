'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClassManagement from '@/components/ClassManagement';
import AuthCheck from '@/components/AuthCheck';

export default function ClassesPage() {
  return (
    <AuthCheck requiredRole="TEACHER">
      <ClassManagement />
    </AuthCheck>
  );
}