import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { value: 'cod', label: 'COD (Bayar di Tempat)', icon: '💵', desc: 'Bayar tunai saat pesanan tiba' },
  { value: 'transfer', label: 'Transfer Bank', icon: '🏦', desc: 'BCA, Mandiri, BNI, BRI' },
  { value: 'ewallet', label: 'E-Wallet', icon: '📱', desc: 'GoPay, OVO, DANA, LinkAja' },
];

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: user?.name || '',
    address: '',
    phone: '',
    paymentMethod: 'cod',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const formatPrice = (p) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName || !form.address || !form.phone) {
      toast.error('Semua field wajib diisi!');
      return;
    }
    if (items.length === 0) {
      toast.error('Keranjang kosong!');
      return;
    }

    setLoading(true);
    try {
      await orderAPI.create({
        ...form,
        items: items.map(i => ({
          menuId: i.menuId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          note: i.note,
          image: i.image,
        })),
        totalPrice,
      });
      clearCart();
      toast.success('Pesanan berhasil dibuat! 🎉');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-12">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Customer Info */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-orange-500 text-white rounded-lg flex items-center justify-center text-sm">1</span>
            Informasi Pengiriman
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Nama Penerima</label>
              <input name="customerName" value={form.customerName} onChange={handleChange}
                placeholder="Nama lengkap" className="input-field" required />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Nomor HP</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                placeholder="08xxxxxxxxxx" className="input-field" type="tel" required />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Alamat Lengkap</label>
              <textarea name="address" value={form.address} onChange={handleChange}
                placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan..." rows={3}
                className="input-field resize-none" required />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Catatan Pesanan (opsional)</label>
              <input name="notes" value={form.notes} onChange={handleChange}
                placeholder="Contoh: jangan terlalu pedas, tambah kerupuk..." className="input-field" />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-orange-500 text-white rounded-lg flex items-center justify-center text-sm">2</span>
            Metode Pembayaran
          </h2>
          <div className="space-y-3">
            {PAYMENT_METHODS.map(pm => (
              <label key={pm.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                form.paymentMethod === pm.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'
              }`}>
                <input type="radio" name="paymentMethod" value={pm.value}
                  checked={form.paymentMethod === pm.value} onChange={handleChange} className="hidden" />
                <span className="text-2xl">{pm.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{pm.label}</p>
                  <p className="text-gray-500 text-xs">{pm.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  form.paymentMethod === pm.value ? 'border-orange-500' : 'border-gray-300'
                }`}>
                  {form.paymentMethod === pm.value && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-orange-500 text-white rounded-lg flex items-center justify-center text-sm">3</span>
            Ringkasan Pesanan
          </h2>
          <div className="space-y-2 mb-4">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-gray-500 ml-1">x{item.quantity}</span>
                  {item.note && <p className="text-xs text-gray-400 italic">"{item.note}"</p>}
                </div>
                <span className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">Total Pembayaran</span>
              <span className="font-extrabold text-orange-500 text-xl">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Memproses...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Konfirmasi Pesanan
            </>
          )}
        </button>
      </form>
    </div>
  );
}
