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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[var(--border-color)]">
      {/* Background with stronger B&W focus */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80" alt="Modern home" className="w-full h-full object-cover" />
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/60 z-[1]" />
        <div className="absolute inset-0 bg-[var(--bg-primary)] opacity-40 z-[2]" />
      </div>

      <div className="container mx-auto px-4 z-10 relative py-24">
        <div className="flex flex-col items-center text-center max-w-6xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-2 border border-white bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] mb-12 animate-fadeInUp shadow-2xl">
            <HiArrowRight className="text-xs" />
            Over 10,000+ verified properties
          </div>

          {/* Title - Optimized for huge impact */}
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black mb-10 leading-[0.8] text-white tracking-tighter uppercase animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Find Your <br />
            <span className="text-transparent" style={{ webkitTextStroke: '2px white' }}>Next Space.</span>
          </h1>

          <p className="text-xs md:text-sm text-white/80 mb-16 max-w-2xl mx-auto font-bold uppercase tracking-[0.4em] lg:tracking-[0.6em] leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            The most professional rental ecosystem for global space management.
          </p>

          {/* Search Box - Ultra Solid B&W */}
          <form onSubmit={handleSearch} className="w-full max-w-7xl mx-auto mb-24 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white border-[4px] border-black p-2 flex flex-col md:flex-row gap-0 shadow-[30px_30px_0px_rgba(0,0,0,0.15)]">
              <div className="flex-[2] relative border-b md:border-b-0 md:border-r-[2px] border-black/10">
                <HiLocationMarker className="absolute left-8 top-1/2 -translate-y-1/2 text-black text-xl" />
                <input type="text" placeholder="CITY OR LOCALITY"
                  value={city} onChange={(e) => setCity(e.target.value)}
                  className="w-full h-20 pl-24 pr-6 bg-transparent border-none text-black placeholder-black/40 focus:outline-none font-black uppercase text-sm tracking-[0.2em]" />
              </div>
              <div className="flex-1 relative border-b md:border-b-0 md:border-r-[2px] border-black/10">
                <select value={roomType} onChange={(e) => setRoomType(e.target.value)}
                  className="w-full h-20 px-8 bg-transparent text-black focus:outline-none cursor-pointer font-black uppercase text-sm tracking-[0.2em] appearance-none">
                  <option value="">ROOM TYPE</option>
                  <option value="single">SINGLE</option>
                  <option value="double">DOUBLE</option>
                  <option value="triple">TRIPLE</option>
                </select>
              </div>
              <button type="submit" className="h-20 px-12 bg-black text-white font-black uppercase text-sm tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all duration-300 group min-w-[200px]">
                <HiSearch className="text-2xl group-hover:scale-125 transition-transform" />
                Search
              </button>
            </div>
          </form>

          {/* Stats - Massive and Bold */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 w-full animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat, i) => (
              <div key={i} className="border border-white/20 p-12 md:p-16 hover:bg-white group transition-all duration-500 cursor-default backdrop-blur-sm bg-black/20">
                <p className="text-5xl md:text-7xl font-black text-white group-hover:text-black mb-4 tracking-tighter">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 group-hover:text-black">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
