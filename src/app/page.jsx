import Link from 'next/link';
import { HiArrowRight, HiShieldCheck, HiStar, HiHome, HiLightningBolt } from 'react-icons/hi';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden section-padding min-h-[90vh] flex items-center">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fadeInUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold text-sm mb-8 border border-[var(--accent-primary)]/20 shadow-glow">
              <HiStar className="animate-pulse" />
              <span>Next Generation Rental Management</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
              Rent Smart, <br />
              <span className="gradient-text">Live Better.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed">
              RentHub simplifies the property management journey for both landlords and tenants. 
              Secure, transparent, and beautiful.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/properties" className="btn btn-primary px-10 py-5 text-lg w-full sm:w-auto flex items-center gap-3">
                Explore Properties
                <HiArrowRight />
              </Link>
              <Link href="/register" className="btn btn-secondary px-10 py-5 text-lg w-full sm:w-auto">
                List Your Property
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24">
              {[
                { label: 'Active Rentals', value: '1,200+' },
                { label: 'Verified Owners', value: '450+' },
                { label: 'Happy Tenants', value: '3,000+' },
                { label: 'Cities Covered', value: '50+' }
              ].map((stat, i) => (
                <div key={i} className="animate-fadeIn" style={{ animationDelay: `${i * 0.1}s` }}>
                  <p className="text-3xl font-black text-[var(--text-primary)] mb-1">{stat.value}</p>
                  <p className="text-sm text-[var(--text-muted)] font-medium uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Background Decorations */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[var(--accent-primary)] opacity-10 blur-[120px] rounded-full animate-float"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[var(--accent-secondary)] opacity-10 blur-[150px] rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-[var(--bg-secondary)]/50 border-y border-[var(--border-color)]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Why Choose <span className="text-[var(--accent-primary)]">RentHub</span>?</h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              We leverage modern technology to make renting seamless and secure for everyone involved.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 group">
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] mb-6 group-hover:scale-110 transition-transform">
                <HiShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Secure Payments</h3>
              <p className="text-[var(--text-secondary)]">Integrated payment orchestration with automatic receipts and rental history tracking.</p>
            </div>

            <div className="card p-8 group">
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-success)]/10 flex items-center justify-center text-[var(--accent-success)] mb-6 group-hover:scale-110 transition-transform">
                <HiHome size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Verified Listings</h3>
              <p className="text-[var(--text-secondary)]">Every property and room listed undergoes a rigorous verification process for your peace of mind.</p>
            </div>

            <div className="card p-8 group">
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-warning)]/10 flex items-center justify-center text-[var(--accent-warning)] mb-6 group-hover:scale-110 transition-transform">
                <HiLightningBolt size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Instant Chat</h3>
              <p className="text-[var(--text-secondary)]">Direct communication between owners and renters through our built-in real-time messaging system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="glass p-12 md:p-20 rounded-[var(--radius-xl)] text-center overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to find your <span className="gradient-text">dream space</span>?</h2>
              <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
                Join thousands of happy users and experience the future of rental management today.
              </p>
              <Link href="/register" className="btn btn-primary px-12 py-5 text-lg shadow-glow">
                Get Started for Free
              </Link>
            </div>
            
            {/* Visual fluff */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent-primary)] opacity-[0.05] rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
