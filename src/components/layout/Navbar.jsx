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
      className={`sticky top-0 z-50 transition-all duration-300 border-b border-[var(--border-color)] ${
        scrolled ? 'bg-[var(--bg-glass)] backdrop-blur-md' : 'bg-[var(--bg-primary)]'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 border-2 border-[var(--text-primary)] bg-[var(--text-primary)] flex items-center justify-center transition-transform duration-300">
              <HiHome className="text-[var(--bg-primary)] text-2xl" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase">RENTHUB</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/"
              className={`text-xs font-black uppercase tracking-[0.2em] transition-all duration-200 border-b-2 ${
                isActive('/') 
                ? 'text-[var(--text-primary)] border-[var(--text-primary)]' 
                : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]'
              }`}
            >
              Home
            </Link>
            <Link
              href="/properties"
              className={`text-xs font-black uppercase tracking-[0.2em] transition-all duration-200 border-b-2 ${
                isActive('/properties') 
                ? 'text-[var(--text-primary)] border-[var(--text-primary)]' 
                : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]'
              }`}
            >
              Properties
            </Link>
            <Link
              href="/rooms"
              className={`text-xs font-black uppercase tracking-[0.2em] transition-all duration-200 border-b-2 ${
                isActive('/rooms') 
                ? 'text-[var(--text-primary)] border-[var(--text-primary)]' 
                : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]'
              }`}
            >
              Find Rooms
            </Link>

            <div className="h-6 w-[1px] bg-[var(--border-color)] mx-2"></div>

            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-6 py-2 border border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-transparent hover:text-[var(--text-primary)] transition-all duration-300 font-black uppercase text-xs tracking-widest"
              >
                <HiViewGrid />
                <span>Dashboard</span>
              </Link>
            ) : (
              <div className="flex items-center gap-6">
                <Link 
                  href="/login" 
                  className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-6 py-2 border border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-transparent hover:text-[var(--text-primary)] transition-all duration-300 font-black uppercase text-xs tracking-widest"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-3 border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-primary)]"
          >
            {isOpen ? <HiX className="text-2xl" /> : <HiOutlineMenu className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100 py-6 border-t border-[var(--border-color)] mt-0' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-6">
            <Link href="/" className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/properties" className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]" onClick={() => setIsOpen(false)}>Properties</Link>
            <Link href="/rooms" className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]" onClick={() => setIsOpen(false)}>Find Rooms</Link>
            {!isAuthenticated && (
              <div className="flex flex-col gap-4 pt-6 border-t border-[var(--border-color)]">
                <Link href="/login" className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]" onClick={() => setIsOpen(false)}>Login</Link>
                <Link href="/register" className="px-6 py-3 border border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)] text-center font-black uppercase text-xs tracking-widest" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
