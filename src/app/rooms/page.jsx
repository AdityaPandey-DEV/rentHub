'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { HiLocationMarker, HiSearch, HiFilter } from 'react-icons/hi';

export default function RoomsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-12 h-12 border-4 border-black border-t-transparent animate-spin" />
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
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header - Centered & Professional */}
      <div className="py-24 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-6 italic text-[var(--text-primary)]">
            Find Rooms
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-12">
            Search vacant rooms with advanced professional filters.
          </p>

          <form onSubmit={handleSearch} className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-0 max-w-7xl mx-auto border-[3px] border-[var(--text-primary)] p-2 bg-white shadow-[20px_20px_0px_rgba(0,0,0,0.1)]">
            <div className="relative md:col-span-1 border-b md:border-b-0 md:border-r-[2px] border-black/10">
              <HiSearch className="absolute left-8 top-1/2 -translate-y-1/2 text-black text-xl" />
              <input type="text" placeholder="CITY..." value={filters.city} onChange={(e) => setFilters({...filters, city: e.target.value})} 
                className="w-full h-16 pl-24 pr-6 bg-transparent border-none text-black placeholder-black/40 focus:outline-none font-black uppercase text-xs tracking-[0.2em]" />
            </div>
            <div className="relative border-b md:border-b-0 md:border-r-[2px] border-black/10">
              <select value={filters.roomType} onChange={(e) => setFilters({...filters, roomType: e.target.value})} 
                className="w-full h-16 px-8 bg-transparent text-black focus:outline-none cursor-pointer font-black uppercase text-xs tracking-[0.2em] appearance-none">
                <option value="">ROOM TYPE</option>
                <option value="single">SINGLE</option>
                <option value="double">DOUBLE</option>
                <option value="triple">TRIPLE</option>
                <option value="dormitory">DORMITORY</option>
              </select>
            </div>
            <div className="border-b md:border-b-0 md:border-r-[2px] border-black/10">
              <input type="number" placeholder="MIN ₹" value={filters.minRent} onChange={(e) => setFilters({...filters, minRent: e.target.value})} 
                className="w-full h-16 px-6 bg-transparent border-none text-black placeholder-black/40 focus:outline-none font-black uppercase text-xs tracking-[0.2em]" />
            </div>
            <div className="border-b md:border-b-0 md:border-r-[2px] border-black/10">
              <input type="number" placeholder="MAX ₹" value={filters.maxRent} onChange={(e) => setFilters({...filters, maxRent: e.target.value})} 
                className="w-full h-16 px-6 bg-transparent border-none text-black placeholder-black/40 focus:outline-none font-black uppercase text-xs tracking-[0.2em]" />
            </div>
            <button type="submit" className="h-16 px-12 bg-black text-white font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all duration-300">
              Filter
            </button>
          </form>
        </div>
      </div>

      {/* Results - Sharp Grid */}
      <div className="container mx-auto px-4 lg:px-8 py-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-[var(--border-color)]">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="border-[0.5px] border-[var(--border-color)]">
                <div className="skeleton h-64 !rounded-none" />
                <div className="p-8 space-y-4 bg-[var(--bg-card)]">
                  <div className="skeleton h-6 w-3/4 !rounded-none" />
                  <div className="skeleton h-4 w-1/2 !rounded-none" />
                  <div className="skeleton h-20 w-full !rounded-none" />
                </div>
              </div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-color)] text-center px-6">
            <div className="w-20 h-20 border-2 border-[var(--text-primary)] flex items-center justify-center mb-8">
              <HiSearch size={40} className="text-[var(--text-primary)]" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-[var(--text-primary)]">No Rooms Found</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Try different criteria to find your space.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-12 border-b-2 border-black pb-4">
              <p className="text-xs font-black uppercase tracking-[0.4em] text-[var(--text-primary)]">
                {rooms.length} RESULT{rooms.length !== 1 ? 'S' : ''} FOUND
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-[var(--border-color)]">
              {rooms.map(room => (
                <Link href={`/rooms/${room._id}`} key={room._id} className="group border-[0.5px] border-[var(--border-color)] hover:bg-[var(--text-primary)] transition-all duration-500">
                  <div className="relative overflow-hidden aspect-[4/3] border-b border-[var(--border-color)] group-hover:border-[var(--bg-primary)]/20">
                    <img src={room.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'}
                      alt={`Room ${room.roomNumber}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-0 left-0">
                      <div className="flex flex-col">
                        <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 border-r border-b border-black">VACANT</span>
                        <span className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-4 py-2 border-r border-b border-black">{room.roomType}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-0">
                      <div className="bg-black text-white font-black px-6 py-4 border-l border-t border-white/20">
                        <span className="text-sm tracking-tighter italic">₹{room.rent?.toLocaleString()}</span>
                        <span className="text-[10px] uppercase tracking-widest opacity-60 ml-1">/mo</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-1 group-hover:text-[var(--bg-primary)] italic">Room {room.roomNumber}</h3>
                    {room.property && (
                      <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] group-hover:text-[var(--bg-primary)]/80 mb-3 line-clamp-1 italic">{room.property.title}</p>
                    )}
                    {room.property?.address && (
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] group-hover:text-[var(--bg-primary)]/70 mb-8">
                        <HiLocationMarker />
                        {room.property.address.city}, {room.property.address.state}
                      </div>
                    )}
                    {room.amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-6 border-t border-[var(--border-color)] group-hover:border-[var(--bg-primary)]/20">
                        {room.amenities.slice(0, 4).map(a => (
                          <span key={a} className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-[var(--bg-tertiary)] text-[var(--text-muted)] group-hover:bg-[var(--bg-primary)]/20 group-hover:text-[var(--bg-primary)]">
                            {a.replace('_', ' ')}
                          </span>
                        ))}
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
