import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center animate-fadeInUp">
        <h1 className="text-8xl font-black gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Page Not Found</h2>
        <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn btn-primary text-base px-8 py-3">
          Go Home
        </Link>
      </div>
    </div>
  );
}
