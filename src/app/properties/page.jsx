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
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="py-12 border-b" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>All Properties</h1>
          <p style={{ color: 'var(--text-muted)' }}>Explore verified rental properties across India</p>

          <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Search by city..." value={city} onChange={(e) => setCity(e.target.value)} className="input pl-11" />
            </div>
            <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="input sm:w-48">
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="pg">PG</option>
              <option value="hostel">Hostel</option>
            </select>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
                <div className="skeleton h-48" />
                <div className="p-4 space-y-3" style={{ background: 'var(--bg-card)' }}>
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><HiOfficeBuilding className="text-3xl" style={{ color: 'var(--text-muted)' }} /></div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No Properties Found</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <Link href={`/properties/${prop._id}`} key={prop._id} className="card group">
                <div className="relative overflow-hidden aspect-[16/10]">
                  <img src={prop.images?.[0] || typeImages[prop.propertyType] || typeImages.apartment}
                    alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="badge badge-info capitalize">{prop.propertyType}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-1 line-clamp-1" style={{ color: 'var(--text-primary)' }}>{prop.title}</h3>
                  <div className="flex items-center gap-1 text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
                    <HiLocationMarker className="text-indigo-400" />
                    {prop.address?.city}, {prop.address?.state}
                  </div>
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{prop.description}</p>
                  <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span className="text-emerald-400 font-bold">{prop.availableRooms}</span> / {prop.totalRooms} rooms
                    </span>
                    <span className="text-indigo-400 group-hover:translate-x-1 transition-transform"><HiArrowRight /></span>
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
