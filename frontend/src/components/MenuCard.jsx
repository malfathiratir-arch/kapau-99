import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function MenuCard({ menu }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');
  const [showDetail, setShowDetail] = useState(false);

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const handleAdd = () => {
    if (!user) {
      toast.error('Login dulu untuk memesan!');
      navigate('/login');
      return;
    }
    addItem(menu, qty, note);
    toast.success(`${menu.name} ditambahkan ke keranjang! 🛒`);
    setQty(1);
    setNote('');
    setShowDetail(false);
  };

  const categoryColors = {
    makanan: 'bg-orange-100 text-orange-700',
    minuman: 'bg-blue-100 text-blue-700',
    nasi: 'bg-yellow-100 text-yellow-700',
  };

  const categoryLabels = {
    makanan: '🍛 Makanan',
    minuman: '🥤 Minuman',
    nasi: '🍚 Nasi',
  };

  return (
    <>
      <div className="card overflow-hidden cursor-pointer group" onClick={() => setShowDetail(true)}>
        {/* Image */}
        <div className="relative overflow-hidden h-44">
          {menu.image ? (
            <img
              src={menu.image}
              alt={menu.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1512058556646-c4da40fba323?w=400&h=300&fit=crop'; }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
              <span className="text-5xl">🍽️</span>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <span className={`badge text-xs ${categoryColors[menu.category]}`}>
              {categoryLabels[menu.category]}
            </span>
          </div>
          {!menu.isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Habis</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-1">{menu.name}</h3>
          <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">{menu.description || 'Menu lezat khas Kapau 99'}</p>
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-orange-500 text-base">{formatPrice(menu.price)}</span>
            {menu.isAvailable && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowDetail(true); }}
                className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowDetail(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
            {/* Image */}
            <div className="relative h-52 rounded-t-3xl overflow-hidden">
              {menu.image ? (
                <img src={menu.image} alt={menu.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1512058556646-c4da40fba323?w=400&h=300&fit=crop'; }} />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <span className="text-7xl">🍽️</span>
                </div>
              )}
              <button onClick={() => setShowDetail(false)} className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute top-3 left-3">
                <span className={`badge ${categoryColors[menu.category]}`}>{categoryLabels[menu.category]}</span>
              </div>
            </div>

            <div className="p-6">
              <h2 className="font-bold text-xl text-gray-900 mb-1">{menu.name}</h2>
              <p className="text-gray-500 text-sm mb-4">{menu.description}</p>
              <p className="font-extrabold text-2xl text-orange-500 mb-5">{formatPrice(menu.price)}</p>

              {menu.isAvailable && (
                <>
                  {/* Quantity */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-700">Jumlah</span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-orange-400 transition-colors font-bold">−</button>
                      <span className="w-8 text-center font-bold text-lg">{qty}</span>
                      <button onClick={() => setQty(qty + 1)} className="w-9 h-9 bg-orange-500 text-white rounded-xl flex items-center justify-center hover:bg-orange-600 transition-colors font-bold">+</button>
                    </div>
                  </div>

                  {/* Note */}
                  <div className="mb-5">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Catatan (opsional)</label>
                    <input
                      type="text"
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="Contoh: tidak pedas, ekstra sambal..."
                      className="input-field text-sm"
                    />
                  </div>

                  {/* Subtotal */}
                  <div className="bg-orange-50 rounded-xl p-3 mb-5 flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total ({qty} item)</span>
                    <span className="font-bold text-orange-600">{formatPrice(menu.price * qty)}</span>
                  </div>

                  <button onClick={handleAdd} className="btn-primary w-full flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Tambah ke Keranjang
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
