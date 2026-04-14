import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RentHub | Modern Property & Room Rental Management',
  description: 'Manage rentals, properties, and bookings with ease. A modern platform for landlords and tenants.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen mesh-gradient`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="py-8 border-t border-[var(--border-color)] text-center text-[var(--text-muted)] text-sm">
            <p>&copy; {new Date().getFullYear()} RentHub. All rights reserved.</p>
          </footer>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              backdropFilter: 'blur(10px)',
            },
            success: {
              iconTheme: { primary: 'var(--accent-success)', secondary: '#fff' }
            },
            error: {
              iconTheme: { primary: 'var(--accent-danger)', secondary: '#fff' }
            }
          }}
        />
      </body>
    </html>
  );
}
