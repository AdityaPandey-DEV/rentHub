'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';
import { HiLocationMarker, HiSearch, HiOfficeBuilding, HiArrowRight } from 'react-icons/hi';

export default function PropertiesPage() {
  const api = useApi();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const fetchProperties = async () => {
    setLoading(true);
    let url = '/properties?limit=20';
    if (city) url += `&city=${city}`;
    if (propertyType) url += `&propertyType=${propertyType}`;
    const data = await api.get(url);
    if (data.success) setProperties(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchProperties(); };

  const typeImages = {
    apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    house: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    villa: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80',
    pg: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    hostel: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header - Centered & Professional */}
      <div className="py-24 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-6 italic text-[var(--text-primary)]">
            All Properties
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-12">
            Explore the most professional rental ecosystem across the globe.
          </p>

          <form onSubmit={handleSearch} className="mt-12 flex flex-col md:flex-row gap-0 max-w-7xl mx-auto border-[3px] border-[var(--text-primary)] p-2 bg-white shadow-[20px_20px_0px_rgba(0,0,0,0.1)]">
            <div className="flex-[2] relative border-b md:border-b-0 md:border-r-[2px] border-black/10">
              <HiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-black text-xl" />
              <input type="text" placeholder="SEARCH BY CITY..." value={city} onChange={(e) => setCity(e.target.value)} 
                className="w-full h-16 pl-20 pr-6 bg-transparent border-none text-black placeholder-black/40 focus:outline-none font-black uppercase text-xs tracking-[0.2em]" />
            </div>
            <div className="flex-1 relative border-b md:border-b-0 md:border-r-[2px] border-black/10">
              <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} 
                className="w-full h-16 px-8 bg-transparent text-black focus:outline-none cursor-pointer font-black uppercase text-xs tracking-[0.2em] appearance-none">
                <option value="">PROPERTY TYPE</option>
                <option value="apartment">APARTMENT</option>
                <option value="house">HOUSE</option>
                <option value="villa">VILLA</option>
                <option value="pg">PG</option>
                <option value="hostel">HOSTEL</option>
              </select>
            </div>
            <button type="submit" className="h-16 px-12 bg-black text-white font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all duration-300 min-w-[180px]">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Grid - Sharp Cards */}
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
        ) : properties.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-color)] text-center px-6">
            <div className="w-20 h-20 border-2 border-[var(--text-primary)] flex items-center justify-center mb-8">
              <HiOfficeBuilding size={40} className="text-[var(--text-primary)]" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-[var(--text-primary)]">No Properties Found</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Try adjusting your filters to find your perfect space.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-[var(--border-color)]">
            {properties.map((prop) => (
              <Link href={`/properties/${prop._id}`} key={prop._id} className="group border-[0.5px] border-[var(--border-color)] hover:bg-[var(--text-primary)] transition-all duration-500">
                <div className="relative overflow-hidden aspect-[16/10]">
                  <img src={prop.images?.[0] || typeImages[prop.propertyType] || typeImages.apartment}
                    alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-0 left-0">
                    <span className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-4 py-2 border-r border-b border-black">
                      {prop.propertyType}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2 group-hover:text-[var(--bg-primary)] line-clamp-1 italic">{prop.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-[var(--text-secondary)] group-hover:text-[var(--bg-primary)]/80">
                    <HiLocationMarker />
                    {prop.address?.city}, {prop.address?.state}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest leading-relaxed mb-8 line-clamp-2 text-[var(--text-muted)] group-hover:text-[var(--bg-primary)]/70">
                    {prop.description}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-[var(--border-color)] group-hover:border-[var(--bg-primary)]/20">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] group-hover:text-[var(--bg-primary)]/90">
                      <span className="text-[var(--text-primary)] group-hover:text-[var(--bg-primary)] font-black text-sm">{prop.availableRooms}</span> / {prop.totalRooms} ROOMS
                    </span>
                    <span className="w-10 h-10 border border-[var(--border-color)] group-hover:border-[var(--bg-primary)] flex items-center justify-center text-[var(--text-primary)] group-hover:text-[var(--bg-primary)] group-hover:translate-x-1 transition-all"><HiArrowRight /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
