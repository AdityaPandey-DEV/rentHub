'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { HiUser, HiMail, HiLockClosed, HiPhone, HiArrowRight, HiHome } from 'react-icons/hi';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'tenant' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome, ${user.name}!`);
      router.push(user.role === 'landlord' ? '/landlord/dashboard' : '/tenant/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80" alt="Property" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[var(--bg-primary)] opacity-80 flex items-center justify-center p-12">
          <div className="text-center text-[var(--text-primary)] max-w-md">
            <div className="w-20 h-20 border-2 border-[var(--text-primary)] flex items-center justify-center mx-auto mb-8">
              <HiHome className="text-4xl" />
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 italic">JOIN RENTHUB</h2>
            <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-xs leading-relaxed">
              WHETHER YOU&apos;RE A TENANT OR A LANDLORD, ACCESS THE MOST PROFESSIONAL ECOSYSTEM TODAY.
            </p>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-full max-w-md animate-fadeInUp">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-10 transition-colors hover:text-[var(--text-primary)]" style={{ color: 'var(--text-muted)' }}>
              <HiArrowRight className="rotate-180" /> Back to home
            </Link>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2" style={{ color: 'var(--text-primary)' }}>Create Account</h1>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
              <div className="relative">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: 'var(--text-muted)' }} />
                <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="JOHN DOE" className="input pl-12 h-14 border-2 !rounded-none uppercase text-xs tracking-widest" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <div className="relative">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: 'var(--text-muted)' }} />
                <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="YOU@EXAMPLE.COM" className="input pl-12 h-14 border-2 !rounded-none uppercase text-xs tracking-widest" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>Phone</label>
              <div className="relative">
                <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: 'var(--text-muted)' }} />
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" className="input pl-12 h-14 border-2 !rounded-none uppercase text-xs tracking-widest" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: 'var(--text-muted)' }} />
                <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="••••••••" className="input pl-12 h-14 border-2 !rounded-none" minLength={6} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>I am a</label>
              <div className="grid grid-cols-2 gap-0 border-2 border-[var(--text-primary)]">
                {['tenant', 'landlord'].map(role => (
                  <button key={role} type="button" onClick={() => setForm({ ...form, role })}
                    className={`h-14 text-xs font-black uppercase tracking-widest transition-all text-center ${form.role === role
                      ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                      : 'bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                      }`}>
                    {role === 'tenant' ? 'Tenant' : 'Landlord'}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full h-14 font-black uppercase tracking-widest mt-4">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--text-primary)] underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
