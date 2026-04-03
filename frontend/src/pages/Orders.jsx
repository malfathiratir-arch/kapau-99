import React, { useEffect, useState } from 'react';
import { orderAPI } from '../services/api';

const STATUS_CONFIG = {
  pending: { label: 'Menunggu', color: 'badge-pending', icon: '⏳' },
  diproses: { label: 'Diproses', color: 'badge-diproses', icon: '👨‍🍳' },
  selesai: { label: 'Selesai', color: 'badge-selesai', icon: '✅' },
  dibatalkan: { label: 'Dibatalkan', color: 'badge-dibatalkan', icon: '❌' },
};

const PAYMENT_LABEL = { cod: 'COD', transfer: 'Transfer Bank', ewallet: 'E-Wallet' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (p) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);
  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Riwayat Pesanan</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">📋</div>
          <p className="text-gray-500 font-medium text-lg">Belum ada pesanan</p>
          <p className="text-gray-400 text-sm mt-1">Yuk pesan makanan favoritmu!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const st = STATUS_CONFIG[order.status];
            const isOpen = expanded === order._id;

            return (
              <div key={order._id} className="card overflow-hidden">
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : order._id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`badge ${st.color}`}>
                          {st.icon} {st.label}
                        </span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {PAYMENT_LABEL[order.paymentMethod]}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{formatDate(order.createdAt)}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-extrabold text-orange-500">{formatPrice(order.totalPrice)}</p>
                      <svg className={`w-4 h-4 text-gray-400 ml-auto mt-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4 animate-fade-in">
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs mb-0.5">Penerima</p>
                        <p className="font-semibold text-gray-800">{order.customerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-0.5">Nomor HP</p>
                        <p className="font-semibold text-gray-800">{order.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-400 text-xs mb-0.5">Alamat</p>
                        <p className="font-semibold text-gray-800">{order.address}</p>
                      </div>
                      {order.notes && (
                        <div className="col-span-2">
                          <p className="text-gray-400 text-xs mb-0.5">Catatan</p>
                          <p className="font-semibold text-gray-800 italic">"{order.notes}"</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-xl p-3">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Detail Item</p>
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                            <div>
                              <p className="font-medium text-gray-800">{item.name} <span className="text-gray-400">x{item.quantity}</span></p>
                              {item.note && <p className="text-xs text-gray-400 italic">"{item.note}"</p>}
                            </div>
                            <p className="font-semibold text-gray-700">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        ))}
                        <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between">
                          <span className="font-bold text-gray-900">Total</span>
                          <span className="font-extrabold text-orange-500">{formatPrice(order.totalPrice)}</span>
                        </div>
                      </div>
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
