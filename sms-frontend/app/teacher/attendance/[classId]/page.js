'use client';

import { useParams } from 'next/navigation';
import AttendanceForm from '@/components/AttendanceForm';
import AuthCheck from '@/components/AuthCheck';

export default function AttendancePage() {
  const params = useParams();
  const classId = params.classId;

  return (
    <AuthCheck requiredRole="TEACHER">
      <AttendanceForm classId={classId} />
    </AuthCheck>
  );
}