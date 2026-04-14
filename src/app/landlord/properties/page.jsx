'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import toast from 'react-hot-toast';
import { HiPlus, HiTrash, HiPencil, HiLocationMarker } from 'react-icons/hi';
import Link from 'next/link';

export default function LandlordProperties() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const api = useApi();
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', propertyType:'apartment', address: { street:'', city:'', state:'', pincode:'' }, amenities: [] });

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !['landlord','admin'].includes(user?.role)) { router.push('/login'); return; }
    fetchProperties();
  }, [isAuthenticated, authLoading]);

  const fetchProperties = async () => {
    setLoading(true);
    const data = await api.get('/properties/me');
    if (data.success) setProperties(data.data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await api.post('/properties', form);
    if (data.success) { toast.success('Property created!'); setShowForm(false); setForm({ title:'', description:'', propertyType:'apartment', address:{street:'',city:'',state:'',pincode:''}, amenities:[] }); fetchProperties(); }
    else toast.error(data.message);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this property and all its rooms?')) return;
    const data = await api.del(`/properties/${id}`);
    if (data.success) { toast.success('Property deleted'); fetchProperties(); }
    else toast.error(data.message);
  };

  const allAmenities = ['wifi','parking','laundry','security','gym','power_backup','water_supply','lift','garden','cctv','ac','furnished'];

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>My Properties</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage your property portfolio</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            <HiPlus /> {showForm ? 'Cancel' : 'Add Property'}
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="p-6 rounded-2xl mb-8 animate-fadeInUp" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>New Property</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Title</label>
                  <input className="input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="Property name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Type</label>
                  <select className="input" value={form.propertyType} onChange={e => setForm({...form, propertyType: e.target.value})}>
                    <option value="apartment">Apartment</option><option value="house">House</option>
                    <option value="villa">Villa</option><option value="pg">PG</option><option value="hostel">Hostel</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Description</label>
                <textarea className="input" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required placeholder="Describe your property" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <input className="input" placeholder="Street" value={form.address.street} onChange={e => setForm({...form, address:{...form.address, street: e.target.value}})} required />
                <input className="input" placeholder="City" value={form.address.city} onChange={e => setForm({...form, address:{...form.address, city: e.target.value}})} required />
                <input className="input" placeholder="State" value={form.address.state} onChange={e => setForm({...form, address:{...form.address, state: e.target.value}})} required />
                <input className="input" placeholder="Pincode" value={form.address.pincode} onChange={e => setForm({...form, address:{...form.address, pincode: e.target.value}})} required pattern="[0-9]{6}" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {allAmenities.map(a => (
                    <button key={a} type="button" className={`text-xs px-3 py-1.5 rounded-lg border capitalize transition-all ${
                      form.amenities.includes(a) ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : ''
                    }`}
                    style={!form.amenities.includes(a) ? { borderColor: 'var(--border-color)', color: 'var(--text-muted)' } : {}}
                    onClick={() => setForm({...form, amenities: form.amenities.includes(a) ? form.amenities.filter(x=>x!==a) : [...form.amenities, a]})}>
                      {a.replace('_',' ')}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Create Property</button>
            </form>
          </div>
        )}

        {/* Properties List */}
        {properties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><HiPlus className="text-3xl" style={{ color: 'var(--text-muted)' }} /></div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No Properties Yet</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Add your first property to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => (
              <div key={p._id} className="card">
                <div className="relative overflow-hidden aspect-[16/10]">
                  <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80'}
                    alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3"><span className="badge badge-info capitalize">{p.propertyType}</span></div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{p.title}</h3>
                  <div className="flex items-center gap-1 text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
                    <HiLocationMarker className="text-indigo-400" />{p.address?.city}
                  </div>
                  <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{p.availableRooms}/{p.totalRooms} rooms</span>
                    <div className="flex gap-2">
                      <Link href={`/properties/${p._id}`} className="btn btn-ghost p-2"><HiPencil /></Link>
                      <button onClick={() => handleDelete(p._id)} className="btn btn-ghost p-2 text-red-400 hover:bg-red-500/10"><HiTrash /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
