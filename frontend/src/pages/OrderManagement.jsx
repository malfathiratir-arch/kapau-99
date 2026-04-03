import React, { useEffect, useState } from 'react';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending: { label: 'Menunggu', color: 'badge-pending', icon: '⏳', next: 'diproses', nextLabel: 'Proses' },
  diproses: { label: 'Diproses', color: 'badge-diproses', icon: '👨‍🍳', next: 'selesai', nextLabel: 'Selesai' },
  selesai: { label: 'Selesai', color: 'badge-selesai', icon: '✅', next: null, nextLabel: null },
  dibatalkan: { label: 'Dibatalkan', color: 'badge-dibatalkan', icon: '❌', next: null, nextLabel: null },
};

const PAYMENT_LABEL = { cod: '💵 COD', transfer: '🏦 Transfer', ewallet: '📱 E-Wallet' };

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('semua');
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus !== 'semua') params.status = filterStatus;
      const res = await orderAPI.getAll(params);
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [filterStatus]);

  const formatPrice = (p) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);
  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleUpdateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await orderAPI.updateStatus(id, status);
      toast.success(`Status diupdate ke: ${STATUS_CONFIG[status].label}`);
      fetchOrders();
    } catch (err) {
      toast.error('Gagal mengupdate status');
    } finally {
      setUpdating(null);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Batalkan pesanan ini?')) return;
    await handleUpdateStatus(id, 'dibatalkan');
  };

  const statusFilters = ['semua', 'pending', 'diproses', 'selesai', 'dibatalkan'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Kelola Pesanan</h1>
        <p className="text-gray-500 text-sm">{orders.length} pesanan ditemukan</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {statusFilters.map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all capitalize ${
              filterStatus === s ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
            }`}>
            {s === 'semua' ? '📋 Semua' : `${STATUS_CONFIG[s]?.icon} ${STATUS_CONFIG[s]?.label}`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-3">📭</div>
          <p className="text-gray-500 font-medium">Tidak ada pesanan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const st = STATUS_CONFIG[order.status];
            const isOpen = expanded === order._id;

            return (
              <div key={order._id} className="card overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`badge ${st.color}`}>{st.icon} {st.label}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{PAYMENT_LABEL[order.paymentMethod]}</span>
                      </div>
                      <p className="font-bold text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.phone} • {order.address}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <p className="font-extrabold text-orange-500 text-lg">{formatPrice(order.totalPrice)}</p>
                      <p className="text-sm text-gray-500">{order.items.length} item</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <button onClick={() => setExpanded(isOpen ? null : order._id)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors flex items-center gap-1">
                      {isOpen ? '▲' : '▼'} Detail
                    </button>

                    {st.next && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, st.next)}
                        disabled={updating === order._id}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        {updating === order._id ? (
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        ) : '✓'}
                        {st.nextLabel}
                      </button>
                    )}

                    {order.status === 'pending' && (
                      <button onClick={() => handleCancel(order._id)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-xl transition-colors">
                        ✕ Batalkan
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-xl p-3">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Info Pelanggan</p>
                        <p className="text-sm text-gray-800"><span className="font-semibold">Nama:</span> {order.customerName}</p>
                        <p className="text-sm text-gray-800"><span className="font-semibold">HP:</span> {order.phone}</p>
                        <p className="text-sm text-gray-800"><span className="font-semibold">Alamat:</span> {order.address}</p>
                        {order.notes && <p className="text-sm text-gray-800"><span className="font-semibold">Catatan:</span> <em>"{order.notes}"</em></p>}
                      </div>
                      <div className="bg-white rounded-xl p-3">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Item Pesanan</p>
                        <div className="space-y-1.5">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <div>
                                <span className="text-gray-800">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                                {item.note && <p className="text-xs text-gray-400 italic">"{item.note}"</p>}
                              </div>
                              <span className="font-semibold text-gray-700">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                          <div className="border-t pt-1.5 flex justify-between font-bold text-gray-900">
                            <span>Total</span>
                            <span className="text-orange-500">{formatPrice(order.totalPrice)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Manual status override */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-700">Ubah Status:</span>
                      <select
                        value={order.status}
                        onChange={e => handleUpdateStatus(order._id, e.target.value)}
                        className="input-field py-1.5 text-sm w-40"
                      >
                        {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                          <option key={k} value={k}>{v.icon} {v.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
