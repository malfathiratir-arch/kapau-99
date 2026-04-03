import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, removeItem, updateQuantity, updateNote, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (p) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Keranjang Kosong</h2>
        <p className="text-gray-500 mb-8">Belum ada item di keranjangmu. Yuk mulai pesan!</p>
        <Link to="/menu">
          <button className="btn-primary">Lihat Menu</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-36">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Keranjang</h1>
        <button onClick={clearCart} className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors">
          Kosongkan
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {items.map((item, idx) => (
          <div key={`${item.menuId}-${item.note}-${idx}`} className="card p-4">
            <div className="flex gap-3">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  onError={(e) => { e.target.style.display = 'none'; }} />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                  <button onClick={() => removeItem(item.menuId, item.note)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="text-orange-500 font-semibold text-sm">{formatPrice(item.price)}</p>

                {/* Note */}
                <input
                  type="text"
                  value={item.note}
                  onChange={e => updateNote(item.menuId, item.note, e.target.value)}
                  placeholder="Tambah catatan..."
                  className="mt-2 w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-400"
                />

                {/* Qty controls */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.menuId, item.note, item.quantity - 1)}
                      className="w-7 h-7 border border-gray-300 rounded-lg flex items-center justify-center text-sm hover:border-orange-400 transition-colors"
                    >−</button>
                    <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuId, item.note, item.quantity + 1)}
                      className="w-7 h-7 bg-orange-500 text-white rounded-lg flex items-center justify-center text-sm hover:bg-orange-600 transition-colors"
                    >+</button>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="card p-4 mb-6">
        <h3 className="font-bold text-gray-900 mb-3">Ringkasan Pesanan</h3>
        <div className="space-y-2 text-sm">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between text-gray-600">
              <span>{item.name} x{item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span className="text-orange-500 text-lg">{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>

      <button onClick={() => navigate('/checkout')} className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4">
        Lanjut Checkout
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
