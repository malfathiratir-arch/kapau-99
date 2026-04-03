import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { menuAPI } from '../services/api';
import MenuCard from '../components/MenuCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    menuAPI.getAll({ category: 'makanan' })
      .then(res => setFeatured(res.data.slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { icon: '🍛', label: 'Makanan', value: 'makanan', color: 'from-orange-400 to-orange-600' },
    { icon: '🥤', label: 'Minuman', value: 'minuman', color: 'from-blue-400 to-blue-600' },
    { icon: '🍚', label: 'Nasi', value: 'nasi', color: 'from-yellow-400 to-yellow-600' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-6">
              <span>⭐</span> Cita Rasa Autentik Minang
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              Rumah Makan<br />
              <span className="text-yellow-300">Kapau 99</span>
            </h1>
            <p className="text-orange-100 text-lg mb-8 max-w-xl">
              Nikmati kelezatan masakan Minang autentik dengan bumbu rempah pilihan. Pesan sekarang dan rasakan perbedaannya!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu">
                <button className="bg-white text-orange-600 font-bold px-8 py-3.5 rounded-2xl hover:bg-orange-50 transition-colors shadow-lg">
                  Pesan Sekarang 🛒
                </button>
              </Link>
              <Link to="/menu">
                <button className="border-2 border-white/50 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-white/10 transition-colors">
                  Lihat Menu
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-3 gap-4">
            {[{ n: '50+', l: 'Menu Pilihan' }, { n: '1000+', l: 'Pelanggan Puas' }, { n: '5⭐', l: 'Rating Terbaik' }].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-2xl font-extrabold text-yellow-300">{s.n}</p>
                <p className="text-xs text-white/80 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Kategori Menu</h2>
        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link key={cat.value} to={`/menu?category=${cat.value}`}>
              <div className={`bg-gradient-to-br ${cat.color} rounded-2xl p-5 text-white text-center shadow-lg hover:scale-105 transition-transform cursor-pointer`}>
                <div className="text-4xl mb-2">{cat.icon}</div>
                <p className="font-bold text-sm">{cat.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Menu */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900">Menu Favorit</h2>
          <Link to="/menu" className="text-orange-500 font-semibold text-sm hover:text-orange-600">Lihat semua →</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map(menu => <MenuCard key={menu._id} menu={menu} />)}
          </div>
        )}
      </section>

      {/* Why us */}
      <section className="bg-orange-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-center text-gray-900 mb-8">Mengapa Kapau 99?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🌶️', title: 'Bumbu Autentik', desc: 'Rempah pilihan langsung dari Padang' },
              { icon: '⚡', title: 'Cepat & Mudah', desc: 'Pesan online, diantar ke lokasi' },
              { icon: '💰', title: 'Harga Terjangkau', desc: 'Porsi besar, harga bersahabat' },
              { icon: '🏆', title: 'Kualitas Terjamin', desc: 'Bahan segar setiap harinya' },
            ].map(f => (
              <div key={f.title} className="text-center">
                <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-gray-500 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
