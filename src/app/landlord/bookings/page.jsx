'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useApi } from '@/hooks/useApi';
import toast from 'react-hot-toast';
import { HiCheck, HiX, HiMail, HiPhone } from 'react-icons/hi';

export default function LandlordBookings() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const api = useApi();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !['landlord','admin'].includes(user?.role)) { router.push('/login'); return; }
    fetchBookings();
  }, [isAuthenticated, authLoading]);

  const fetchBookings = async () => {
    setLoading(true);
    let url = '/bookings/landlord';
    if (filter) url += `?status=${filter}`;
    const data = await api.get(url);
    if (data.success) setBookings(data.data);
    setLoading(false);
  };

  useEffect(() => { if (!authLoading && isAuthenticated) fetchBookings(); }, [filter]);

  const handleApprove = async (id) => {
    const data = await api.put(`/bookings/${id}/approve`);
    if (data.success) { toast.success('Booking approved!'); fetchBookings(); } else toast.error(data.message);
  };
  const handleReject = async (id) => {
    const data = await api.put(`/bookings/${id}/reject`, { reason: 'Rejected by landlord' });
    if (data.success) { toast.success('Booking rejected'); fetchBookings(); } else toast.error(data.message);
  };

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Booking Requests</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage tenant booking requests</p>
          </div>
          <div className="flex gap-2">
            {['', 'pending', 'approved', 'rejected'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`btn text-xs ${filter === s ? 'btn-primary' : 'btn-secondary'}`}>
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No Bookings</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No booking requests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b._id} className="p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {b.tenant?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{b.tenant?.name}</p>
                      <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span className="flex items-center gap-1"><HiMail />{b.tenant?.email}</span>
                        {b.tenant?.phone && <span className="flex items-center gap-1"><HiPhone />{b.tenant?.phone}</span>}
                      </div>
                    </div>
                  </div>
                  <span className={`badge text-xs ${
                    b.status === 'pending' ? 'badge-warning' : b.status === 'approved' ? 'badge-success' :
                    b.status === 'rejected' ? 'badge-danger' : 'badge-neutral'
                  }`}>{b.status}</span>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Property:</span> {b.property?.title}</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Room:</span> {b.room?.roomNumber} ({b.room?.roomType})</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Move-in:</span> {new Date(b.moveInDate).toLocaleDateString()}</div>
                </div>
                {b.message && <p className="mt-2 text-sm italic" style={{ color: 'var(--text-muted)' }}>&ldquo;{b.message}&rdquo;</p>}
                {b.status === 'pending' && (
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => handleApprove(b._id)} className="btn btn-success text-sm"><HiCheck /> Approve</button>
                    <button onClick={() => handleReject(b._id)} className="btn btn-danger text-sm"><HiX /> Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
