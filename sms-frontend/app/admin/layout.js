import Sidebar from '@/components/Sidebar';
import AuthCheck from '@/components/AuthCheck';

const adminNavItems = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Students', path: '/admin/students' },
  { label: 'Add Student', path: '/admin/students/add' },
];

export default function AdminLayout({ children }) {
  return (
    <AuthCheck requiredRole="admin">
      <div className="flex">
        <Sidebar items={adminNavItems} role="admin" />
        <div className="flex-1 p-8">{children}</div>
      </div>
    </AuthCheck>
  );
}