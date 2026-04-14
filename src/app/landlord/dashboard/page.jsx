'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useApi } from '@/hooks/useApi';
import toast from 'react-hot-toast';
import { HiOfficeBuilding, HiKey, HiClipboardCheck, HiCurrencyRupee, HiPlus, HiEye, HiCheck, HiX, HiArrowRight } from 'react-icons/hi';

export default function LandlordDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const api = useApi();
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !['landlord', 'admin'].includes(user?.role)) { router.push('/login'); return; }
    fetchData();
  }, [isAuthenticated, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    const [propData, bookData] = await Promise.all([
      api.get('/properties/me'),
      api.get('/bookings/landlord')
    ]);
    if (propData.success) setProperties(propData.data);
    if (bookData.success) setBookings(bookData.data);
    setLoading(false);
  };

  const handleApprove = async (id) => {
    const data = await api.put(`/bookings/${id}/approve`);
    if (data.success) { toast.success('Booking approved!'); fetchData(); }
    else toast.error(data.message);
  };

  const handleReject = async (id) => {
    const data = await api.put(`/bookings/${id}/reject`, { reason: 'Rejected by landlord' });
    if (data.success) { toast.success('Booking rejected'); fetchData(); }
    else toast.error(data.message);
  };

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const totalRooms = properties.reduce((s, p) => s + (p.totalRooms || 0), 0);
  const availableRooms = properties.reduce((s, p) => s + (p.availableRooms || 0), 0);
  const pendingBookings = bookings.filter(b => b.status === 'pending');

  const stats = [
    { icon: HiOfficeBuilding, label: 'Properties', value: properties.length, color: 'from-indigo-500 to-purple-600' },
    { icon: HiKey, label: 'Total Rooms', value: totalRooms, color: 'from-emerald-500 to-teal-600' },
    { icon: HiClipboardCheck, label: 'Pending Bookings', value: pendingBookings.length, color: 'from-amber-500 to-orange-600' },
    { icon: HiCurrencyRupee, label: 'Available Rooms', value: availableRooms, color: 'from-cyan-500 to-blue-600' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Welcome back, <span className="gradient-text">{user?.name}</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Here&apos;s an overview of your property portfolio</p>
          </div>
          <Link href="/landlord/properties" className="btn btn-primary">
            <HiPlus /> Add Property
          </Link>
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
          {/* Recent Properties */}
          <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>My Properties</h2>
              <Link href="/landlord/properties" className="text-indigo-400 text-sm hover:text-indigo-300 flex items-center gap-1">
                View all <HiArrowRight />
              </Link>
            </div>
            {properties.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No properties yet</p>
                <Link href="/landlord/properties" className="btn btn-primary mt-3 text-sm"><HiPlus /> Add First Property</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {properties.slice(0, 5).map(p => (
                  <Link href={`/properties/${p._id}`} key={p._id}
                    className="flex items-center justify-between p-3 rounded-xl transition-all hover:bg-[var(--bg-secondary)]">
                    <div>
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{p.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.address?.city} • {p.availableRooms}/{p.totalRooms} rooms</p>
                    </div>
                    <span className="badge badge-info capitalize text-xs">{p.propertyType}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pending Bookings */}
          <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Pending Bookings</h2>
              <Link href="/landlord/bookings" className="text-indigo-400 text-sm hover:text-indigo-300 flex items-center gap-1">
                View all <HiArrowRight />
              </Link>
            </div>
            {pendingBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No pending bookings</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingBookings.slice(0, 5).map(b => (
                  <div key={b._id} className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{b.tenant?.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          Room {b.room?.roomNumber} • ₹{b.room?.rent?.toLocaleString()}/mo
                        </p>
                      </div>
                      <span className="badge badge-warning text-xs">Pending</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleApprove(b._id)} className="btn btn-success text-xs py-1.5 px-3 flex-1">
                        <HiCheck /> Approve
                      </button>
                      <button onClick={() => handleReject(b._id)} className="btn btn-danger text-xs py-1.5 px-3 flex-1">
                        <HiX /> Reject
                      </button>
                    </div>
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
