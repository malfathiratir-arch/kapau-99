import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI, menuAPI, petugasAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { isAdmin, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [menuCount, setMenuCount] = useState(0);
  const [petugasCount, setPetugasCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersRes, menusRes] = await Promise.all([
          orderAPI.getAll(),
          menuAPI.getAll(),
        ]);
        setRecentOrders(ordersRes.data.slice(0, 5));
        setMenuCount(menusRes.data.length);

        if (isAdmin) {
          const [statsRes, petugasRes] = await Promise.all([
            orderAPI.getStats(),
            petugasAPI.getAll(),
          ]);
          setStats(statsRes.data);
          setPetugasCount(petugasRes.data.length);
        } else {
          const pending = ordersRes.data.filter(o => o.status === 'pending').length;
          const diproses = ordersRes.data.filter(o => o.status === 'diproses').length;
          const selesai = ordersRes.data.filter(o => o.status === 'selesai').length;
          setStats({ totalOrders: ordersRes.data.length, pendingOrders: pending, diprosesOrders: diproses, selesaiOrders: selesai, totalRevenue: 0 });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAdmin]);

  const formatPrice = (p) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);
  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  const STATUS_CONFIG = {
    pending: { label: 'Menunggu', color: 'badge-pending' },
    diproses: { label: 'Diproses', color: 'badge-diproses' },
    selesai: { label: 'Selesai', color: 'badge-selesai' },
    dibatalkan: { label: 'Dibatalkan', color: 'badge-dibatalkan' },
  };

  const statCards = stats ? [
    { label: 'Total Pesanan', value: stats.totalOrders, icon: '📦', color: 'from-blue-500 to-blue-600', sub: 'semua waktu' },
    { label: 'Menunggu', value: stats.pendingOrders, icon: '⏳', color: 'from-yellow-400 to-yellow-500', sub: 'perlu diproses' },
    { label: 'Diproses', value: stats.diprosesOrders, icon: '👨‍🍳', color: 'from-orange-400 to-orange-500', sub: 'sedang berjalan' },
    { label: 'Selesai', value: stats.selesaiOrders, icon: '✅', color: 'from-green-500 to-green-600', sub: 'berhasil' },
    ...(isAdmin ? [{ label: 'Total Pendapatan', value: formatPrice(stats.totalRevenue), icon: '💰', color: 'from-purple-500 to-purple-600', sub: 'dari pesanan selesai' }] : []),
    { label: 'Total Menu', value: menuCount, icon: '🍛', color: 'from-red-400 to-red-500', sub: 'menu tersedia' },
    ...(isAdmin ? [{ label: 'Total Petugas', value: petugasCount, icon: '👥', color: 'from-indigo-500 to-indigo-600', sub: 'aktif' }] : []),
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Selamat datang kembali, <span className="font-semibold text-orange-500">{user?.name}</span>!
          <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
            {isAdmin ? '👑 Admin' : '👨‍🍳 Petugas'}
          </span>
        </p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <div key={i} className={`bg-gradient-to-br ${card.color} text-white rounded-2xl p-5 shadow-lg`}>
              <div className="text-3xl mb-2">{card.icon}</div>
              <p className="text-2xl font-extrabold">{card.value}</p>
              <p className="text-sm font-semibold opacity-90">{card.label}</p>
              <p className="text-xs opacity-70 mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { to: '/menu-management', icon: '🍽️', label: 'Kelola Menu', color: 'border-orange-200 hover:bg-orange-50' },
          { to: '/order-management', icon: '📦', label: 'Kelola Pesanan', color: 'border-blue-200 hover:bg-blue-50' },
          ...(isAdmin ? [
            { to: '/petugas-management', icon: '👥', label: 'Kelola Petugas', color: 'border-purple-200 hover:bg-purple-50' },
          ] : []),
          { to: '/menu-management', icon: '➕', label: 'Tambah Menu', color: 'border-green-200 hover:bg-green-50' },
        ].map((action, i) => (
          <Link key={i} to={action.to}>
            <div className={`card border-2 ${action.color} p-4 text-center cursor-pointer transition-colors`}>
              <div className="text-3xl mb-2">{action.icon}</div>
              <p className="text-sm font-semibold text-gray-700">{action.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Pesanan Terbaru</h2>
          <Link to="/order-management" className="text-orange-500 font-semibold text-sm hover:text-orange-600">Lihat semua →</Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">📭</div>
            <p>Belum ada pesanan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-semibold">Pelanggan</th>
                  <th className="pb-3 font-semibold">Item</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-medium text-gray-900">{order.customerName}</td>
                    <td className="py-3 text-gray-500">{order.items.length} item</td>
                    <td className="py-3 font-bold text-orange-500">{formatPrice(order.totalPrice)}</td>
                    <td className="py-3">
                      <span className={`badge ${STATUS_CONFIG[order.status]?.color}`}>
                        {STATUS_CONFIG[order.status]?.label}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400 text-xs">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
