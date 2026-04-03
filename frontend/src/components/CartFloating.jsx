import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartFloating() {
  const { totalItems, totalPrice } = useCart();
  const { user } = useAuth();

  if (!user || totalItems === 0) return null;

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="fixed bottom-24 left-4 right-4 z-30 max-w-lg mx-auto">
      <Link to="/cart">
        <div className="bg-orange-500 text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between animate-slide-up hover:bg-orange-600 transition-colors">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium opacity-90">{totalItems} item</p>
              <p className="font-bold">{formatPrice(totalPrice)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Lihat Keranjang</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
}
