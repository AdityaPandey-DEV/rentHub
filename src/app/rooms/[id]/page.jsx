'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import toast from 'react-hot-toast';
import { HiLocationMarker, HiArrowLeft, HiPhone, HiMail, HiCalendar, HiCurrencyRupee } from 'react-icons/hi';

export default function RoomDetailPage({ params }) {
  const { id } = use(params);
  const api = useApi();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await api.get(`/rooms/${id}`);
      if (data.success) setRoom(data.data);
      setLoading(false);
    })();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { router.push('/login'); return; }
    setBooking(true);
    try {
      const data = await api.post('/bookings', { roomId: id, moveInDate: bookingDate, message: bookingMessage });
      if (data.success) {
        toast.success('Booking request sent!');
        setBookingDate('');
        setBookingMessage('');
      } else {
        toast.error(data.message);
      }
    } catch { toast.error('Failed to send booking request'); }
    finally { setBooking(false); }
  };

  const amenityLabels = { attached_bathroom: '🚿 Bathroom', balcony: '🌅 Balcony', ac: '❄️ AC', fan: '🌀 Fan', wardrobe: '👔 Wardrobe', bed: '🛏️ Bed', table: '📝 Table', chair: '💺 Chair', tv: '📺 TV', geyser: '🔥 Geyser', wifi: '📶 WiFi' };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!room) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Room Not Found</h2>
        <Link href="/rooms" className="btn btn-primary">Back to Rooms</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="container mx-auto px-4 py-8">
        <Link href="/rooms" className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-indigo-400" style={{ color: 'var(--text-muted)' }}>
          <HiArrowLeft /> Back to Rooms
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden aspect-[16/9]" style={{ border: '1px solid var(--border-color)' }}>
              <img src={room.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80'}
                alt={`Room ${room.roomNumber}`} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className={`badge ${room.status === 'vacant' ? 'badge-success' : 'badge-danger'}`}>{room.status}</span>
                    <span className="badge badge-info capitalize">{room.roomType}</span>
                  </div>
                  <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Room {room.roomNumber}</h1>
                  {room.property && <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{room.property.title}</p>}
                  {room.property?.address && (
                    <div className="flex items-center gap-1 text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                      <HiLocationMarker className="text-indigo-400" />
                      {room.property.address.city}, {room.property.address.state}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-indigo-400">₹{room.rent?.toLocaleString()}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>per month</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Deposit: ₹{room.deposit?.toLocaleString()}</p>
                </div>
              </div>
              {room.description && <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{room.description}</p>}
            </div>

            {/* Amenities */}
            {room.amenities?.length > 0 && (
              <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Room Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {room.amenities.map(a => (
                    <div key={a} className="px-4 py-3 rounded-xl text-sm" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {amenityLabels[a] || a}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Form */}
            {room.status === 'vacant' && user?.role !== 'landlord' && (
              <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Book This Room</h3>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Move-in Date</label>
                    <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Message (optional)</label>
                    <textarea value={bookingMessage} onChange={(e) => setBookingMessage(e.target.value)}
                      className="input" rows={3} placeholder="Introduce yourself to the landlord..." />
                  </div>
                  <button type="submit" disabled={booking} className="btn btn-primary w-full">
                    {booking ? 'Sending...' : 'Send Booking Request'}
                  </button>
                </form>
              </div>
            )}

            {/* Owner */}
            {room.property?.owner && (
              <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Landlord</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {room.property.owner.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{room.property.owner.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Property Owner</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <div className="flex items-center gap-2"><HiMail className="text-indigo-400" />{room.property.owner.email}</div>
                  {room.property.owner.phone && <div className="flex items-center gap-2"><HiPhone className="text-indigo-400" />{room.property.owner.phone}</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
