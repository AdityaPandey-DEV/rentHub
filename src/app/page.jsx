import Link from 'next/link';
import { HiArrowRight, HiShieldCheck, HiHome, HiLightningBolt } from 'react-icons/hi';
import Hero from '@/components/home/Hero';

export default function Home() {
  return (
    <div className="flex flex-col bg-[var(--bg-primary)]">
      {/* Hero Section Container */}
      <section className="border-b border-[var(--border-color)]">
        <Hero />
      </section>

      {/* Features Section - Sharp and Structured */}
      <section className="py-24 bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
          <div className="text-center max-w-4xl mx-auto mb-24">
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-6 italic">
              Structured <br />
              <span className="text-[var(--text-secondary)]">Management.</span>
            </h2>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[var(--text-secondary)]">
              THE MOST PROFESSIONAL RENTAL ECOSYSTEM FOR MODERN LIVING.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-0 border border-[var(--border-color)]">
            <div className="p-10 md:p-16 border-b md:border-b-0 md:border-r border-[var(--border-color)] group hover:bg-[var(--text-primary)] transition-colors">
              <div className="w-16 h-16 border-2 border-[var(--text-primary)] flex items-center justify-center text-[var(--text-primary)] group-hover:bg-[var(--bg-primary)] group-hover:border-[var(--bg-primary)] group-hover:text-[var(--text-primary)] mb-10 transition-colors">
                <HiShieldCheck size={32} />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight mb-6 group-hover:text-[var(--bg-primary)]">Secure</h3>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] group-hover:text-[var(--bg-primary)]/80 leading-relaxed max-w-[280px]">
                Integrated payment orchestration with strict rental history tracking and encryption for total asset protection.
              </p>
            </div>

            <div className="p-10 md:p-16 border-b md:border-b-0 md:border-r border-[var(--border-color)] group hover:bg-[var(--text-primary)] transition-colors">
              <div className="w-16 h-16 border-2 border-[var(--text-primary)] flex items-center justify-center text-[var(--text-primary)] group-hover:bg-[var(--bg-primary)] group-hover:border-[var(--bg-primary)] group-hover:text-[var(--text-primary)] mb-10 transition-colors">
                <HiHome size={32} />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight mb-6 group-hover:text-[var(--bg-primary)]">Verified</h3>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] group-hover:text-[var(--bg-primary)]/80 leading-relaxed max-w-[280px]">
                Every property and room listed undergoes a manual verification process for absolute peace of mind and quality assurance.
              </p>
            </div>

            <div className="p-10 md:p-16 group hover:bg-[var(--text-primary)] transition-colors">
              <div className="w-16 h-16 border-2 border-[var(--text-primary)] flex items-center justify-center text-[var(--text-primary)] group-hover:bg-[var(--bg-primary)] group-hover:border-[var(--bg-primary)] group-hover:text-[var(--text-primary)] mb-10 transition-colors">
                <HiLightningBolt size={32} />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight mb-6 group-hover:text-[var(--bg-primary)]">Instant</h3>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] group-hover:text-[var(--bg-primary)]/80 leading-relaxed max-w-[280px]">
                Direct communication between owners and renters through our built-in real-time messaging system for rapid leasing.
              </p>
            </div>
          </div>
      </section>

      {/* Final CTA - High Contrast */}
      <section className="py-24 relative overflow-hidden bg-[var(--bg-primary)]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="border-[4px] border-[var(--text-primary)] p-12 md:p-24 text-center relative z-10">
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-8 italic">
              Ready to find <br />
              your next space?
            </h2>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
              JOIN THOUSANDS OF PROFESSIONALS ALREADY USING RENTHUB.
            </p>
            <Link href="/register" className="inline-block px-12 py-4 border-2 border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-[0.2em] hover:bg-transparent hover:text-[var(--text-primary)] transition-all">
              Join Now
            </Link>
          </div>
        </div>

        {/* Decorative elements - Monochrome */}
        <div className="absolute top-0 right-0 w-1/3 h-full border-l border-[var(--border-color)] opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-0 w-1/3 h-full border-r border-[var(--border-color)] opacity-10 pointer-events-none" />
      </section>
    </div>
  );
}
