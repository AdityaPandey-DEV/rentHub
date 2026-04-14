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
      {/* Background with B&W focus */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80" alt="Modern home" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[var(--bg-primary)] opacity-70" />
      </div>

      <div className="container mx-auto px-4 z-10 relative py-20">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-2 border border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-black uppercase tracking-[0.2em] mb-10 animate-fadeInUp">
            <HiArrowRight className="text-xs" />
            Over 10,000+ verified properties
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-8 leading-[0.9] text-[var(--text-primary)] tracking-tighter uppercase animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Find Your <br />
            <span className="text-outline-white">Next Space.</span>
          </h1>

          <p className="text-sm md:text-base text-[var(--text-secondary)] mb-12 max-w-xl mx-auto font-bold uppercase tracking-widest leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Discover verified properties and connect with trusted landlords on the most professional rental platform.
          </p>

          {/* Search Box - Professional B&W */}
          <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto mb-20 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="bg-[var(--bg-primary)] border-2 border-[var(--text-primary)] p-2">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-[2] relative">
                  <HiLocationMarker className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-primary)] text-xl" />
                  <input type="text" placeholder="CITY OR LOCALITY"
                    value={city} onChange={(e) => setCity(e.target.value)}
                    className="w-full h-16 pl-12 pr-4 bg-transparent border-none text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none font-black uppercase text-xs tracking-widest" />
                </div>
                <div className="hidden md:block w-px bg-[var(--border-color)] my-2" />
                <select value={roomType} onChange={(e) => setRoomType(e.target.value)}
                  className="flex-1 h-16 px-4 bg-transparent text-[var(--text-primary)] focus:outline-none cursor-pointer font-black uppercase text-xs tracking-widest decoration-none">
                  <option value="" className="bg-[var(--bg-primary)]">ROOM TYPE</option>
                  <option value="single" className="bg-[var(--bg-primary)]">SINGLE</option>
                  <option value="double" className="bg-[var(--bg-primary)]">DOUBLE</option>
                  <option value="triple" className="bg-[var(--bg-primary)]">TRIPLE</option>
                </select>
                <button type="submit" className="h-16 px-12 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-transparent hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--text-primary)] transition-all">
                  <HiSearch className="text-lg" />
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Stats - Sharp and Defined */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 w-full animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat, i) => (
              <div key={i} className="border border-[var(--border-color)] p-8 hover:bg-[var(--text-primary)] group transition-colors">
                <p className="text-4xl md:text-5xl font-black text-[var(--text-primary)] group-hover:text-[var(--bg-primary)] mb-2">{stat.value}</p>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] group-hover:text-[var(--bg-primary)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
