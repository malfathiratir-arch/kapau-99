import React, { useEffect, useState } from 'react';
import { menuAPI } from '../services/api';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', price: '', category: 'makanan', description: '', isAvailable: true };
const CATEGORIES = ['makanan', 'minuman', 'nasi'];

export default function MenuManagement() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('semua');
  const [deleteId, setDeleteId] = useState(null);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterCat !== 'semua') params.category = filterCat;
      if (search) params.search = search;
      const res = await menuAPI.getAll(params);
      setMenus(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenus(); }, [filterCat, search]);

  const formatPrice = (p) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setImage(null); setImagePreview(''); setShowModal(true); };
  const openEdit = (menu) => {
    setForm({ name: menu.name, price: menu.price, category: menu.category, description: menu.description, isAvailable: menu.isAvailable });
    setEditId(menu._id);
    setImagePreview(menu.image);
    setImage(null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Ukuran gambar max 5MB'); return; }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) { toast.error('Nama, harga, dan kategori wajib diisi'); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('price', form.price);
      fd.append('category', form.category);
      fd.append('description', form.description);
      fd.append('isAvailable', form.isAvailable);
      if (image) fd.append('image', image);

      if (editId) {
        await menuAPI.update(editId, fd);
        toast.success('Menu berhasil diupdate!');
      } else {
        await menuAPI.create(fd);
        toast.success('Menu berhasil ditambahkan!');
      }
      setShowModal(false);
      fetchMenus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan menu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await menuAPI.delete(id);
      toast.success('Menu berhasil dihapus!');
      setDeleteId(null);
      fetchMenus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus menu');
    }
  };

  const catColors = { makanan: 'bg-orange-100 text-orange-700', minuman: 'bg-blue-100 text-blue-700', nasi: 'bg-yellow-100 text-yellow-700' };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Kelola Menu</h1>
          <p className="text-gray-500 text-sm">{menus.length} menu tersedia</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Menu
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari menu..." className="input-field pl-11" />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="input-field sm:w-40">
          <option value="semua">Semua</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
      </div>

      {/* Menu table */}
      {loading ? (
        <div className="grid grid-cols-1 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />)}
        </div>
      ) : menus.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-gray-500 font-medium">Tidak ada menu</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Menu</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Harga</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {menus.map(menu => (
                  <tr key={menu._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {menu.image ? (
                          <img src={menu.image} alt={menu.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                            onError={e => e.target.src = 'https://via.placeholder.com/48'} />
                        ) : (
                          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">🍽️</span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{menu.name}</p>
                          <p className="text-gray-400 text-xs line-clamp-1">{menu.description || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${catColors[menu.category]}`}>{menu.category}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-orange-500">{formatPrice(menu.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${menu.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {menu.isAvailable ? '✅ Tersedia' : '❌ Habis'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(menu)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors">
                          Edit
                        </button>
                        <button onClick={() => setDeleteId(menu._id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-3xl">
              <h2 className="font-bold text-gray-900 text-lg">{editId ? 'Edit Menu' : 'Tambah Menu Baru'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image upload */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Gambar Menu</label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center relative">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="preview" className="w-full h-40 object-cover rounded-xl" />
                      <button type="button" onClick={() => { setImage(null); setImagePreview(''); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">✕</button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      <div className="text-gray-400">
                        <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-medium">Klik untuk upload gambar</p>
                        <p className="text-xs text-gray-300 mt-1">JPG, PNG, WebP (max 5MB)</p>
                      </div>
                    </label>
                  )}
                  {!imagePreview && (
                    <label className="absolute inset-0 cursor-pointer">
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Nama Menu *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Contoh: Rendang Daging Sapi" className="input-field" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Harga (Rp) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                    placeholder="25000" className="input-field" min="0" required />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Kategori *</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-field">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Deskripsi</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Deskripsi singkat menu..." rows={3} className="input-field resize-none" />
              </div>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={form.isAvailable} onChange={e => setForm(p => ({ ...p, isAvailable: e.target.checked }))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
                <span className="text-sm font-medium text-gray-700">Menu tersedia</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Batal</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {submitting ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> : null}
                  {submitting ? 'Menyimpan...' : editId ? 'Update Menu' : 'Tambah Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-bounce-in" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">🗑️</div>
              <h3 className="font-bold text-gray-900 text-lg">Hapus Menu?</h3>
              <p className="text-gray-500 text-sm mt-1">Tindakan ini tidak dapat dibatalkan</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-outline flex-1 py-2.5">Batal</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition-colors">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
