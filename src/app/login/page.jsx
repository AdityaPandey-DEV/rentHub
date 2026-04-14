'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import toast from 'react-hot-toast';
import { HiMail, HiLockClosed, HiArrowRight, HiHome } from 'react-icons/hi';

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
      toast.success(`Welcome back, ${user.name}!`);
      router.push(user.role === 'landlord' ? '/landlord/dashboard' : '/tenant/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80" alt="Home" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-purple-900/90 flex items-center justify-center p-12">
          <div className="text-center text-white max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-6">
              <HiHome className="text-3xl" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Welcome Back to RentHub</h2>
            <p className="text-white/70 leading-relaxed">
              Access your dashboard to manage bookings, payments, and properties all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-full max-w-md animate-fadeInUp">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-indigo-400" style={{ color: 'var(--text-muted)' }}>
              <HiArrowRight className="rotate-180" /> Back to home
            </Link>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Sign In</h1>
            <p style={{ color: 'var(--text-muted)' }}>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <div className="relative">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: 'var(--text-muted)' }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="you@example.com" className="input pl-12" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: 'var(--text-muted)' }} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="••••••••" className="input pl-12" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full h-12 text-base">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-indigo-400 font-semibold hover:text-indigo-300">Sign Up</Link>
          </p>

          {/* Demo Accounts */}
          <div className="mt-8 p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Demo Accounts</p>
            <div className="space-y-2">
              {[
                { email: 'rajesh@landlord.com', pass: 'landlord123', role: 'Landlord' },
                { email: 'amit@tenant.com', pass: 'tenant123', role: 'Tenant' },
              ].map((acc, i) => (
                <button key={i} onClick={() => { setEmail(acc.email); setPassword(acc.pass); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs transition-colors hover:bg-[var(--bg-tertiary)] flex items-center justify-between"
                  style={{ color: 'var(--text-secondary)' }}>
                  <span>{acc.email}</span>
                  <span className="badge badge-info text-[10px]">{acc.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
