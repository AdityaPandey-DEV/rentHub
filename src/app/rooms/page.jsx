'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { HiLocationMarker, HiSearch, HiFilter, HiCurrencyRupee } from 'react-icons/hi';

export default function RoomsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <RoomsContent />
    </Suspense>
  );
}

function RoomsContent() {
  const api = useApi();
  const searchParams = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '', roomType: searchParams.get('roomType') || '',
    minRent: '', maxRent: ''
  });

  const fetchRooms = async () => {
    setLoading(true);
    let url = '/rooms?limit=20';
    if (filters.city) url += `&city=${filters.city}`;
    if (filters.roomType) url += `&roomType=${filters.roomType}`;
    if (filters.minRent) url += `&minRent=${filters.minRent}`;
    if (filters.maxRent) url += `&maxRent=${filters.maxRent}`;
    const data = await api.get(url);
    if (data.success) setRooms(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchRooms(); };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="py-12 border-b" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Find Rooms</h1>
          <p style={{ color: 'var(--text-muted)' }}>Search vacant rooms with advanced filters</p>

          <form onSubmit={handleSearch} className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type="text" placeholder="City..." value={filters.city} onChange={(e) => setFilters({...filters, city: e.target.value})} className="input pl-11" />
            </div>
            <select value={filters.roomType} onChange={(e) => setFilters({...filters, roomType: e.target.value})} className="input">
              <option value="">All Types</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="triple">Triple</option>
              <option value="dormitory">Dormitory</option>
            </select>
            <input type="number" placeholder="Min ₹" value={filters.minRent} onChange={(e) => setFilters({...filters, minRent: e.target.value})} className="input" />
            <input type="number" placeholder="Max ₹" value={filters.maxRent} onChange={(e) => setFilters({...filters, maxRent: e.target.value})} className="input" />
            <button type="submit" className="btn btn-primary"><HiFilter /> Filter</button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
                <div className="skeleton h-48" />
                <div className="p-4 space-y-3" style={{ background: 'var(--bg-card)' }}>
                  <div className="skeleton h-5 w-2/3" />
                  <div className="skeleton h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><HiSearch className="text-3xl" style={{ color: 'var(--text-muted)' }} /></div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No Rooms Found</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try different search criteria</p>
          </div>
        ) : (
          <>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{rooms.length} room{rooms.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => (
                <Link href={`/rooms/${room._id}`} key={room._id} className="card group">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img src={room.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'}
                      alt={`Room ${room.roomNumber}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="badge badge-success">Vacant</span>
                      <span className="badge badge-info capitalize">{room.roomType}</span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="bg-black/70 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                        ₹{room.rent?.toLocaleString()}<span className="text-xs font-normal opacity-70">/mo</span>
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Room {room.roomNumber}</h3>
                    {room.property && (
                      <p className="text-sm mb-1 line-clamp-1" style={{ color: 'var(--text-secondary)' }}>{room.property.title}</p>
                    )}
                    {room.property?.address && (
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <HiLocationMarker className="text-indigo-400 flex-shrink-0" />
                        {room.property.address.city}, {room.property.address.state}
                      </div>
                    )}
                    {room.amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                        {room.amenities.slice(0, 4).map(a => (
                          <span key={a} className="text-[10px] px-2 py-1 rounded-md capitalize" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                            {a.replace('_', ' ')}
                          </span>
                        ))}
                        {room.amenities.length > 4 && (
                          <span className="text-[10px] px-2 py-1 rounded-md" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                            +{room.amenities.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
