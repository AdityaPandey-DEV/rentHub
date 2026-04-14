import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Providers from '@/components/Providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RentHub | Modern Property & Room Rental Management',
  description: 'Manage rentals, properties, and bookings with ease. A modern platform for landlords and tenants.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <footer className="py-12 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
              <div className="container mx-auto px-4 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center font-black">R</div>
                    <span className="text-xl font-black uppercase tracking-tighter">RENTHUB</span>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                    &copy; {new Date().getFullYear()} RentHub Professional. All rights reserved.
                  </div>
                  <div className="flex gap-8 text-xs font-black uppercase tracking-widest">
                    <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Privacy</a>
                    <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Terms</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
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
