'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ items, role }) {
  const pathname = usePathname();

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold capitalize">{role} Dashboard</h2>
      </div>
      <nav className="mt-8">
        <ul>
          {items.map((item) => (
            <li key={item.path} className="mb-2">
              <Link
                href={item.path}
                className={`block px-4 py-2 hover:bg-gray-700 ${
                  pathname === item.path ? 'bg-gray-700' : ''
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}