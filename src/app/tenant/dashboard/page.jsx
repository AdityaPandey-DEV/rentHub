'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useApi } from '@/hooks/useApi';
import toast from 'react-hot-toast';
import { HiClipboardCheck, HiHome, HiCurrencyRupee, HiBell, HiArrowRight, HiX } from 'react-icons/hi';

export default function TenantDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const api = useApi();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push('/login'); return; }
    fetchData();
  }, [isAuthenticated, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    const [bookData, rentalData] = await Promise.all([
      api.get('/bookings/tenant'),
      api.get('/rentals')
    ]);
    if (bookData.success) setBookings(bookData.data);
    if (rentalData.success) setRentals(rentalData.data);
    setLoading(false);
  };

  const handleCancel = async (id) => {
    const data = await api.put(`/bookings/${id}/cancel`);
    if (data.success) { toast.success('Booking cancelled'); fetchData(); }
    else toast.error(data.message);
  };

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const activeRentals = rentals.filter(r => r.status === 'active');
  const pendingBookings = bookings.filter(b => b.status === 'pending');

  const stats = [
    { icon: HiHome, label: 'Active Rentals', value: activeRentals.length, color: 'from-emerald-500 to-teal-600' },
    { icon: HiClipboardCheck, label: 'Pending Bookings', value: pendingBookings.length, color: 'from-amber-500 to-orange-600' },
    { icon: HiCurrencyRupee, label: 'Monthly Rent', value: `₹${activeRentals.reduce((s, r) => s + (r.monthlyRent || 0), 0).toLocaleString()}`, color: 'from-indigo-500 to-purple-600' },
    { icon: HiBell, label: 'Total Bookings', value: bookings.length, color: 'from-cyan-500 to-blue-600' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Welcome, <span className="gradient-text">{user?.name}</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage your rentals and bookings</p>
          </div>
          <Link href="/rooms" className="btn btn-primary">Find Rooms</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="stat-card">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="text-white text-xl" />
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Rentals */}
          <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Active Rentals</h2>
            {activeRentals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>No active rentals</p>
                <Link href="/rooms" className="btn btn-primary text-sm">Browse Rooms</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeRentals.map(r => (
                  <div key={r._id} className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{r.property?.title}</p>
                      <span className="badge badge-success text-xs">Active</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Room {r.room?.roomNumber} • ₹{r.monthlyRent?.toLocaleString()}/mo
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      Since {new Date(r.startDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bookings */}
          <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>My Bookings</h2>
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map(b => (
                  <div key={b._id} className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{b.property?.title}</p>
                      <span className={`badge text-xs ${
                        b.status === 'pending' ? 'badge-warning' : b.status === 'approved' ? 'badge-success' :
                        b.status === 'rejected' ? 'badge-danger' : 'badge-neutral'
                      }`}>{b.status}</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Room {b.room?.roomNumber} • ₹{b.room?.rent?.toLocaleString()}/mo
                    </p>
                    {b.status === 'pending' && (
                      <button onClick={() => handleCancel(b._id)} className="btn btn-ghost text-xs text-red-400 mt-2 p-0">
                        <HiX /> Cancel
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
