import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { menuAPI } from '../services/api';
import MenuCard from '../components/MenuCard';

const CATEGORIES = [
  { value: 'semua', label: 'Semua', icon: '🍽️' },
  { value: 'makanan', label: 'Makanan', icon: '🍛' },
  { value: 'minuman', label: 'Minuman', icon: '🥤' },
  { value: 'nasi', label: 'Nasi', icon: '🍚' },
];

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'semua');

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'semua') params.category = category;
      if (search) params.search = search;
      const res = await menuAPI.getAll(params);
      setMenus(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenus(); }, [category, search]);

  const handleCategoryChange = (val) => {
    setCategory(val);
    if (val !== 'semua') setSearchParams({ category: val });
    else setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-36">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Menu Kami</h1>
        <p className="text-gray-500 text-sm">Pilih menu favoritmu dan pesan sekarang!</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari menu..."
          className="input-field pl-12"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              category === cat.value
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
            }`}
          >
            <span>{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-gray-500 mb-4">
          Menampilkan <span className="font-semibold text-orange-500">{menus.length}</span> menu
          {search && ` untuk "${search}"`}
        </p>
      )}

      {/* Menu Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
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
      ) : menus.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-gray-500 font-medium">Menu tidak ditemukan</p>
          <p className="text-gray-400 text-sm mt-1">Coba kata kunci lain</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {menus.map(menu => <MenuCard key={menu._id} menu={menu} />)}
        </div>
      )}
    </div>
  );
}
