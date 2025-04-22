import Sidebar from '@/components/Sidebar';
import AuthCheck from '@/components/AuthCheck';

const studentNavItems = [
  { label: 'Dashboard', path: '/student/dashboard' },
  { label: 'Profile', path: '/student/profile' },
  { label: 'Attendance', path: '/student/attendance' },
  { label: 'Marks', path: '/student/marks' },
];

export default function StudentLayout({ children }) {
  return (
    <AuthCheck requiredRole="student">
      <div className="flex">
        <Sidebar items={studentNavItems} role="student" />
        <div className="flex-1 p-8">{children}</div>
      </div>
    </AuthCheck>
  );
}