'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MarksManagement from '@/components/MarksManagement';
import { getUserData } from '@/lib/auth';

export default function MarksPage() {
  const router = useRouter();
  
  useEffect(() => {
    const user = getUserData();
    if (!user || user.role !== 'TEACHER') {
      router.push('/login');
    }
  }, [router]);

  return (
    <div>
      <MarksManagement />
    </div>
  );
}