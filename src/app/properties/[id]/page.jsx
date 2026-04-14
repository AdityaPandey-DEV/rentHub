'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';
import { HiLocationMarker, HiArrowLeft, HiPhone, HiMail, HiUser } from 'react-icons/hi';

export default function PropertyDetailPage({ params }) {
  const { id } = use(params);
  const api = useApi();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await api.get(`/properties/${id}`);
      if (data.success) setProperty(data.data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!property) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Property Not Found</h2>
        <Link href="/properties" className="btn btn-primary">Back to Properties</Link>
      </div>
    </div>
  );

  const amenityLabels = { wifi: '📶 WiFi', parking: '🅿️ Parking', laundry: '🧺 Laundry', security: '🔒 Security', gym: '💪 Gym', power_backup: '⚡ Power Backup', water_supply: '💧 Water', lift: '🛗 Lift', garden: '🌿 Garden', cctv: '📹 CCTV', ac: '❄️ AC', furnished: '🛋️ Furnished' };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="container mx-auto px-4 py-8">
        <Link href="/properties" className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-indigo-400" style={{ color: 'var(--text-muted)' }}>
          <HiArrowLeft /> Back to Properties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden aspect-[16/9]" style={{ border: '1px solid var(--border-color)' }}>
              <img src={property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80'}
                alt={property.title} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <span className="badge badge-info capitalize mb-2">{property.propertyType}</span>
                  <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{property.title}</h1>
                  <div className="flex items-center gap-1 mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <HiLocationMarker className="text-indigo-400" />
                    {property.address?.street}, {property.address?.city}, {property.address?.state} - {property.address?.pincode}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Available Rooms</p>
                  <p className="text-2xl font-bold text-emerald-400">{property.availableRooms}<span className="text-base" style={{ color: 'var(--text-muted)' }}>/{property.totalRooms}</span></p>
                </div>
              </div>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map(a => (
                    <div key={a} className="px-4 py-3 rounded-xl text-sm" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {amenityLabels[a] || a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rooms List */}
            {property.rooms?.length > 0 && (
              <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Rooms</h2>
                <div className="space-y-3">
                  {property.rooms.map(room => (
                    <Link href={`/rooms/${room._id}`} key={room._id}
                      className="flex items-center justify-between p-4 rounded-xl border transition-all hover:border-indigo-500/30"
                      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
                      <div>
                        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Room {room.roomNumber}</p>
                        <p className="text-sm capitalize" style={{ color: 'var(--text-muted)' }}>{room.roomType} • {room.area ? `${room.area} sq.ft` : 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-indigo-400">₹{room.rent?.toLocaleString()}<span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>/mo</span></p>
                        <span className={`badge text-xs ${room.status === 'vacant' ? 'badge-success' : room.status === 'occupied' ? 'badge-danger' : 'badge-warning'}`}>
                          {room.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner */}
            <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Property Owner</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {property.owner?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{property.owner?.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Property Owner</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <HiMail className="text-indigo-400" /> {property.owner?.email}
                </div>
                {property.owner?.phone && (
                  <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <HiPhone className="text-indigo-400" /> {property.owner?.phone}
                  </div>
                )}
              </div>
            </div>

            <Link href="/rooms" className="btn btn-primary w-full">
              Find Available Rooms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
