'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useApi } from '@/hooks/useApi';
import toast from 'react-hot-toast';
import { HiBell, HiCheck, HiTrash } from 'react-icons/hi';

export default function NotificationsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const api = useApi();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push('/login'); return; }
    fetchNotifications();
  }, [isAuthenticated, authLoading]);

  const fetchNotifications = async () => {
    setLoading(true);
    const data = await api.get('/notifications');
    if (data.success) setNotifications(data.data);
    setLoading(false);
  };

  const markRead = async (id) => {
    await api.put(`/notifications/${id}`, {});
    fetchNotifications();
  };

  const markAllRead = async () => {
    await api.put('/notifications', {});
    toast.success('All marked as read');
    fetchNotifications();
  };

  const clearAll = async () => {
    await api.del('/notifications');
    toast.success('Cleared read notifications');
    fetchNotifications();
  };

  const typeColors = { booking: 'text-indigo-400', payment: 'text-emerald-400', rental: 'text-amber-400', system: 'text-cyan-400' };

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{notifications.length} notification{notifications.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={markAllRead} className="btn btn-secondary text-xs"><HiCheck /> Mark all read</button>
            <button onClick={clearAll} className="btn btn-ghost text-xs text-red-400"><HiTrash /> Clear</button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><HiBell className="text-3xl" style={{ color: 'var(--text-muted)' }} /></div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No Notifications</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>You&apos;re all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n._id} onClick={() => !n.isRead && markRead(n._id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:border-indigo-500/30 ${!n.isRead ? 'border-l-4 border-l-indigo-500' : ''}`}
                style={{ background: n.isRead ? 'var(--bg-secondary)' : 'var(--bg-card)', borderColor: n.isRead ? 'var(--border-color)' : undefined }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`text-sm font-semibold ${n.isRead ? '' : ''}`} style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-xs font-medium capitalize ${typeColors[n.type] || 'text-gray-400'}`}>{n.type}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  {!n.isRead && <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
