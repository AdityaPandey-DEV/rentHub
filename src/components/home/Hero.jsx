'use client';
import Link from 'next/link';
import { HiSearch, HiLocationMarker, HiArrowRight } from 'react-icons/hi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [roomType, setRoomType] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    let url = '/rooms?';
    if (city) url += `city=${city}&`;
    if (roomType) url += `roomType=${roomType}`;
    router.push(url);
  };

  const stats = [
    { value: '10K+', label: 'Properties', icon: '🏠' },
    { value: '50K+', label: 'Happy Tenants', icon: '😊' },
    { value: '5K+', label: 'Landlords', icon: '🤝' },
    { value: '25+', label: 'Cities', icon: '🌆' },
  ];

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80" alt="Modern home" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
      </div>

      {/* Animated orbs */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 z-10 relative py-20">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md text-sm text-white mb-8 border border-white/20 animate-fadeInUp">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Over 10,000+ verified properties
            <HiArrowRight className="text-xs" />
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.05] text-white tracking-tight animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Find Your Perfect
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
              Rental Home
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Discover thousands of properties, connect with verified landlords, and move into your dream home with RentHub.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto mb-16 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20 shadow-2xl">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <HiLocationMarker className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-xl" style={{ display: 'block' }} />
                  <input type="text" placeholder="Enter city or locality..."
                    value={city} onChange={(e) => setCity(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/50 focus:bg-white/15 focus:border-indigo-400/50 outline-none transition-all text-sm" />
                </div>
                <select value={roomType} onChange={(e) => setRoomType(e.target.value)}
                  className="h-14 px-4 rounded-xl bg-white/10 border border-white/10 text-white focus:bg-white/15 outline-none cursor-pointer text-sm min-w-[140px]">
                  <option value="" className="bg-slate-900">Room Type</option>
                  <option value="single" className="bg-slate-900">Single</option>
                  <option value="double" className="bg-slate-900">Double</option>
                  <option value="triple" className="bg-slate-900">Triple</option>
                </select>
                <button type="submit" className="h-14 px-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <HiSearch className="text-lg" />
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all group">
                <span className="text-2xl mb-2 block">{stat.icon}</span>
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
}
