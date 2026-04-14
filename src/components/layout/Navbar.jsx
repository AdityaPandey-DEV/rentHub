'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HiHome, 
  HiOutlineMenu, 
  HiX, 
  HiLogin, 
  HiUserAdd, 
  HiViewGrid 
} from 'react-icons/hi';

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Mock authentication state for initial deployment
  // In a real app, this would come from a context or session
  const isAuthenticated = false; 

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => pathname === path;

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-2 shadow-lg' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <HiHome className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold gradient-text tracking-tight">RentHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-semibold transition-all duration-200 border-b-2 ${
                isActive('/') 
                ? 'text-[var(--accent-primary)] border-[var(--accent-primary)]' 
                : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:translate-y-[-1px]'
              }`}
            >
              Home
            </Link>
            <Link
              href="/properties"
              className={`text-sm font-semibold transition-all duration-200 border-b-2 ${
                isActive('/properties') 
                ? 'text-[var(--accent-primary)] border-[var(--accent-primary)]' 
                : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:translate-y-[-1px]'
              }`}
            >
              Properties
            </Link>
            <Link
              href="/rooms"
              className={`text-sm font-semibold transition-all duration-200 border-b-2 ${
                isActive('/rooms') 
                ? 'text-[var(--accent-primary)] border-[var(--accent-primary)]' 
                : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:translate-y-[-1px]'
              }`}
            >
              Find Rooms
            </Link>

            <div className="h-6 w-[1px] bg-[var(--border-color)] mx-2"></div>

            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/20 transition-all duration-300 font-bold"
              >
                <HiViewGrid />
                <span>Dashboard</span>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  href="/login" 
                  className="text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-4 py-2"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="btn btn-primary text-sm px-6 shadow-[0_8px_20px_rgba(79,70,229,0.3)]"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-primary)]"
          >
            {isOpen ? <HiX className="text-2xl" /> : <HiOutlineMenu className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100 py-6 border-t border-[var(--border-color)] mt-2' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-4">
            <Link href="/" className="px-4 py-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/properties" className="px-4 py-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium" onClick={() => setIsOpen(false)}>Properties</Link>
            <Link href="/rooms" className="px-4 py-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium" onClick={() => setIsOpen(false)}>Find Rooms</Link>
            {!isAuthenticated && (
              <div className="flex flex-col gap-3 pt-4 border-t border-[var(--border-color)]">
                <Link href="/login" className="px-4 py-2 text-center text-[var(--text-primary)] font-medium" onClick={() => setIsOpen(false)}>Login</Link>
                <Link href="/register" className="btn btn-primary w-full" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
