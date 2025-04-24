import './globals.css';
import NavBar from '@/components/NavBar';

export const metadata = {
  title: 'Student Management Portal',
  description: 'A simple student management system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
