'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUsername, getRole, logout } from '@/lib/auth';

export default function NavBar() {
  const router = useRouter();
  const username = getUsername();
  const role = getRole();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Student Management System
        </Link>
        {username && (
          <div className="flex items-center space-x-4">
            <span className="capitalize">
              {role}: {username}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}