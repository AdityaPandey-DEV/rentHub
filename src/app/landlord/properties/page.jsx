'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import toast from 'react-hot-toast';
import { HiPlus, HiTrash, HiPencil, HiLocationMarker, HiCloudUpload, HiX, HiPhotograph } from 'react-icons/hi';
import Link from 'next/link';
import { upload } from '@vercel/blob/client';

export default function LandlordProperties() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const api = useApi();
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    propertyType: 'apartment', 
    address: { street: '', city: '', state: '', pincode: '' }, 
    amenities: [],
    images: [] // To store uploaded blob URLs
  });

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !['landlord', 'admin'].includes(user?.role)) { 
      router.push('/login'); 
      return; 
    }
    fetchProperties();
  }, [isAuthenticated, authLoading]);

  const fetchProperties = async () => {
    setLoading(true);
    const data = await api.get('/properties/me');
    if (data.success) setProperties(data.data);
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Limit to 5 images
    if (form.images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setIsUploading(true);
    const uploadToast = toast.loading('Uploading images...');

    try {
      const uploadPromises = files.map(async (file) => {
        const newBlob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        return newBlob.url;
      });

      const urls = await Promise.all(uploadPromises);
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...urls]
      }));
      toast.success('Images uploaded successfully', { id: uploadToast });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images', { id: uploadToast });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (urlToRemove) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter(url => url !== urlToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    const data = await api.post('/properties', form);
    if (data.success) { 
      toast.success('Property created!'); 
      setShowForm(false); 
      setForm({ 
        title: '', 
        description: '', 
        propertyType: 'apartment', 
        address: { street: '', city: '', state: '', pincode: '' }, 
        amenities: [],
        images: []
      }); 
      fetchProperties(); 
    }
    else toast.error(data.message);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this property and all its rooms?')) return;
    const data = await api.del(`/properties/${id}`);
    if (data.success) { toast.success('Property deleted'); fetchProperties(); }
    else toast.error(data.message);
  };

  const allAmenities = ['wifi', 'parking', 'laundry', 'security', 'gym', 'power_backup', 'water_supply', 'lift', 'garden', 'cctv', 'ac', 'furnished'];

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="w-12 h-12 border-4 border-black border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 border-b-2 border-black pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-[var(--text-primary)] mb-2 italic">My Portfolio</h1>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-secondary)]">Manage and expand your property network.</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className={`px-8 py-3 font-black uppercase text-xs tracking-[0.2em] transition-all duration-300 border-2 ${
              showForm 
              ? 'bg-transparent border-black text-black hover:bg-black hover:text-white' 
              : 'bg-black border-black text-white hover:bg-transparent hover:text-black'
            }`}
          >
            {showForm ? 'CLOSE EDITOR' : 'ADD PROPERTY'}
          </button>
        </div>

        {/* Add Form - High Contrast Redesign */}
        {showForm && (
          <div className="mb-16 animate-fadeInUp">
            <div className="bg-white border-[4px] border-black p-8 md:p-12 shadow-[20px_20px_0px_rgba(0,0,0,0.1)]">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-10 italic">Property Details</h2>
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black">Property Title</label>
                    <input className="w-full h-14 px-6 border-2 border-black focus:outline-none font-bold uppercase text-xs tracking-widest" 
                      value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="E.G. THE MONOLITH APARTMENTS" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black">Property Type</label>
                    <select className="w-full h-14 px-6 border-2 border-black focus:outline-none font-bold uppercase text-xs tracking-widest appearance-none cursor-pointer" 
                      value={form.propertyType} onChange={e => setForm({...form, propertyType: e.target.value})}>
                      <option value="apartment">APARTMENT</option>
                      <option value="house">HOUSE</option>
                      <option value="villa">VILLA</option>
                      <option value="pg">PG</option>
                      <option value="hostel">HOSTEL</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black">Description</label>
                  <textarea className="w-full p-6 border-2 border-black focus:outline-none font-bold text-xs tracking-widest" 
                    rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required placeholder="DESCRIBE THE SPACE..." />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black">Address Architecture</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input className="h-12 px-6 border-2 border-black focus:outline-none font-bold uppercase text-[10px] tracking-widest" placeholder="STREET" value={form.address.street} onChange={e => setForm({...form, address:{...form.address, street: e.target.value}})} required />
                    <input className="h-12 px-6 border-2 border-black focus:outline-none font-bold uppercase text-[10px] tracking-widest" placeholder="CITY" value={form.address.city} onChange={e => setForm({...form, address:{...form.address, city: e.target.value}})} required />
                    <input className="h-12 px-6 border-2 border-black focus:outline-none font-bold uppercase text-[10px] tracking-widest" placeholder="STATE" value={form.address.state} onChange={e => setForm({...form, address:{...form.address, state: e.target.value}})} required />
                    <input className="h-12 px-6 border-2 border-black focus:outline-none font-bold uppercase text-[10px] tracking-widest" placeholder="PINCODE" value={form.address.pincode} onChange={e => setForm({...form, address:{...form.address, pincode: e.target.value}})} required pattern="[0-9]{6}" />
                  </div>
                </div>

                {/* Professional Image Upload Zone */}
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black">Visual Assets (Max 5)</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {form.images.map((url, index) => (
                      <div key={index} className="relative aspect-square border-2 border-black overflow-hidden group">
                        <img src={url} alt="Uploaded" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <button 
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute top-2 right-2 w-8 h-8 bg-black text-white flex items-center justify-center border border-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <HiX className="text-lg" />
                        </button>
                      </div>
                    ))}
                    {form.images.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="aspect-square border-2 border-black border-dashed flex flex-col items-center justify-center gap-3 hover:bg-black hover:text-white transition-all group disabled:opacity-50"
                      >
                        <HiCloudUpload className="text-4xl group-hover:animate-bounce" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Upload Image</span>
                      </button>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                    onChange={handleFileUpload}
                  />
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black">Premium Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {allAmenities.map(a => (
                      <button key={a} type="button" className={`px-4 py-2 border-2 font-black uppercase text-[10px] tracking-widest transition-all ${
                        form.amenities.includes(a) ? 'bg-black border-black text-white' : 'border-black/10 text-black/40 hover:border-black hover:text-black'
                      }`}
                      onClick={() => setForm({...form, amenities: form.amenities.includes(a) ? form.amenities.filter(x=>x!==a) : [...form.amenities, a]})}>
                        {a.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={isUploading} className="w-full md:w-auto px-16 py-5 bg-black text-white font-black uppercase text-sm tracking-[0.4em] hover:bg-transparent hover:text-black border-2 border-black transition-all duration-300 disabled:opacity-50">
                  Deploy Property
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Properties List - Grid Overhaul */}
        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-black/20 text-center">
            <div className="w-24 h-24 border-2 border-black flex items-center justify-center mb-10">
              <HiPhotograph size={40} className="text-black/20" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-black">No Assets Found</h3>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/40">Your portfolio is currently architectural silence.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-black">
            {properties.map(p => (
              <div key={p._id} className="group border-[0.5px] border-black hover:bg-black transition-all duration-500">
                <div className="relative overflow-hidden aspect-[16/10] border-b border-black group-hover:border-white/20">
                  <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80'}
                    alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-0 left-0">
                    <span className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-4 py-2 border-r border-b border-black tracking-[0.2em]">{p.propertyType}</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 group-hover:text-white line-clamp-1 italic">{p.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-black/40 group-hover:text-white/60">
                    <HiLocationMarker />
                    {p.address?.city}, {p.address?.state}
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-black/10 group-hover:border-white/10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/60 group-hover:text-white/80">
                      <span className="text-black group-hover:text-white font-black text-base">{p.availableRooms}</span> / {p.totalRooms} ROOMS
                    </span>
                    <div className="flex gap-2">
                      <Link href={`/properties/${p._id}`} className="w-10 h-10 border border-black group-hover:border-white flex items-center justify-center text-black group-hover:text-white hover:bg-white hover:text-black transition-all"><HiPencil /></Link>
                      <button onClick={() => handleDelete(p._id)} className="w-10 h-10 border border-black group-hover:border-white flex items-center justify-center text-black group-hover:text-white hover:bg-red-500 hover:border-red-500 transition-all"><HiTrash /></button>
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
