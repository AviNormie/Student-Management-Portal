import Sidebar from '@/components/Sidebar';
import AuthCheck from '@/components/AuthCheck';

const teacherNavItems = [
  { label: 'Dashboard', path: '/teacher/dashboard' },
  { label: 'Mark Attendance', path: '/teacher/attendance' },
  { label: 'Add Marks', path: '/teacher/marks' },
];

export default function TeacherLayout({ children }) {
  return (
    <AuthCheck requiredRole="teacher">
      <div className="flex">
        <Sidebar items={teacherNavItems} role="teacher" />
        <div className="flex-1 p-8">{children}</div>
      </div>
    </AuthCheck>
  );
}