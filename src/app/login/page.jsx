'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { HiMail, HiLockClosed, HiArrowRight, HiHome, HiChevronLeft } from 'react-icons/hi';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      // Fixed crash: AuthContext.login now returns the user object
      if (user && user.name) {
        toast.success(`Welcome back, ${user.name}!`);
        router.push(user.role === 'landlord' ? '/landlord/dashboard' : '/tenant/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col lg:flex-row">
      {/* Left Panel - Branding Impact */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden border-r-4 border-black">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80" alt="Architecture" className="w-full h-full object-cover grayscale" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center p-16 text-center">
          <div className="w-24 h-24 border-4 border-white flex items-center justify-center mb-10 shadow-[10px_10px_0px_white]">
            <HiHome className="text-5xl text-white" />
          </div>
          <h2 className="text-6xl font-black uppercase tracking-tighter text-white italic mb-6">RENTHUB</h2>
          <p className="text-white/80 font-bold uppercase tracking-[0.4em] text-[10px] leading-loose max-w-xs">
            THE WORLD'S MOST PROFESSIONAL RENTAL ECOSYSTEM FOR GLOBAL SCALE MANAGEMENT.
          </p>
        </div>
      </div>

      {/* Right Panel - Centered Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 bg-[var(--bg-primary)]">
        <div className="w-full max-w-lg">
          {/* Navigation */}
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-black mb-16 transition-all group">
            <HiChevronLeft className="text-lg group-hover:-translate-x-1 transition-transform" /> 
            BACK TO HOME
          </Link>

          <header className="mb-12">
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-black mb-4 italic">Sign In.</h1>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-secondary)]">ENTER YOUR CREDENTIALS TO ACCESS YOUR SECURE DASHBOARD.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Identification</label>
              <div className="relative group">
                <HiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-black/20 group-focus-within:text-black transition-colors" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                  placeholder="USERNAME@RENTHUB.COM" 
                  className="w-full h-16 pl-16 pr-6 bg-white border-[3px] border-black focus:outline-none font-bold uppercase text-xs tracking-[0.2em] shadow-[10px_10px_0px_rgba(0,0,0,0.05)] focus:shadow-[10px_10px_0px_rgba(0,0,0,0.1)] transition-all" 
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Security Pin</label>
              <div className="relative group">
                <HiLockClosed className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-black/20 group-focus-within:text-black transition-colors" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                  placeholder="••••••••" 
                  className="w-full h-16 pl-16 pr-6 bg-white border-[3px] border-black focus:outline-none font-bold uppercase text-xs tracking-[0.2em] shadow-[10px_10px_0px_rgba(0,0,0,0.05)] focus:shadow-[10px_10px_0px_rgba(0,0,0,0.1)] transition-all" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full h-16 bg-black text-white font-black uppercase tracking-[0.4em] text-sm hover:bg-transparent hover:text-black border-[3px] border-black transition-all duration-300 shadow-[15px_15px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              {loading ? 'AUTHENTICATING...' : 'AUTHORIZE ACCESS'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t-2 border-black/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              NEW TO THE SYSTEM? {' '}
              <Link href="/register" className="text-black underline underline-offset-4 hover:decoration-2 transition-all">CREATE ACCOUNT</Link>
            </p>
          </div>

          {/* Demo Accounts - High Contrast Style */}
          <div className="mt-12 p-8 bg-black/5 border-2 border-black border-dashed">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 mb-6">DEMO CREDENTIALS</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { email: 'rajesh@landlord.com', pass: 'landlord123', role: 'LANDLORD' },
                { email: 'amit@tenant.com', pass: 'tenant123', role: 'TENANT' },
              ].map((acc, i) => (
                <button 
                  key={i} 
                  type="button"
                  onClick={() => { setEmail(acc.email); setPassword(acc.pass); }}
                  className="flex flex-col items-start p-4 bg-white border-2 border-black hover:bg-black group transition-all"
                >
                  <span className="text-[9px] font-black uppercase tracking-widest text-black/40 group-hover:text-white/40 mb-1">{acc.role}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-black group-hover:text-white">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
