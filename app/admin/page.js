'use client';

import { useState, useEffect } from 'react';
import { supabase, formatDriveUrl } from '@/lib/supabase';

const CATEGORIES = [
  'Artificial Flowers',
  'Fresh Flowers',
  'Snack & Chocolate',
  'Money Bouquet',
  'Doll Series',
  'Custom Bouquet',
  'Bloom Box & Vas',
  'Wedding Bouquet',
];

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]); // Default kategori pertama
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  }

  // Simpan / Edit Produk
  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !price || !image) {
      alert('Mohon isi Nama, Harga, Kategori, dan Link Gambar!');
      return;
    }

    const payload = {
      name,
      description,
      price,
      image,
      category,
    };

    if (editingId) {
      // Update produk
      const { error } = await supabase.from('products').update(payload).eq('id', editingId);
      if (error) alert('Gagal mengupdate produk');
    } else {
      // Tambah produk baru
      const { error } = await supabase.from('products').insert([payload]);
      if (error) alert('Gagal menambahkan produk');
    }

    resetForm();
    fetchProducts();
  }

  // Handle Edit Klik
  function handleEdit(item) {
    setEditingId(item.id);
    setName(item.name || '');
    setDescription(item.description || '');
    setPrice(item.price || '');
    setImage(item.image || '');
    setCategory(item.category || CATEGORIES[0]);
  }

  // Handle Hapus
  async function handleDelete(id) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        alert('Gagal menghapus produk');
      } else {
        fetchProducts();
      }
    }
  }

  function resetForm() {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setImage('');
    setCategory(CATEGORIES[0]);
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4A3E3D] p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 sm:p-6 rounded-2xl border border-[#EFE8DE] shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#4A3E3D]">
              Panel Admin <span className="text-[#E8A5C2]">Yuri Florist</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#6E5B58]">Kelola katalog bunga dan produk kamu di sini.</p>
          </div>
          <a 
            href="/" 
            className="text-xs font-semibold bg-[#FAF7F2] border border-[#E8DDD1] text-[#6E5B58] hover:bg-[#E8A5C2] hover:text-white px-3 sm:px-4 py-2 rounded-full transition-all"
          >
            ← Kembali ke Web
          </a>
        </div>

        {/* FORM INPUT / EDIT */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#EFE8DE] shadow-sm mb-8">
          <h2 className="text-lg font-bold text-[#4A3E3D] mb-4">
            {editingId ? '✏️ Edit Produk' : '➕ Tambah Produk Baru'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama Produk */}
              <div>
                <label className="block text-xs font-bold text-[#6E5B58] mb-1">Nama Produk *</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Buket Mawar Pink"
                  className="w-full px-3 py-2 text-sm border border-[#E8DDD1] rounded-xl focus:outline-none focus:border-[#E8A5C2] bg-[#FAF7F2]"
                  required
                />
              </div>

              {/* Harga */}
              <div>
                <label className="block text-xs font-bold text-[#6E5B58] mb-1">Harga (Rp) *</label>
                <input 
                  type="text" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Contoh: 105000"
                  className="w-full px-3 py-2 text-sm border border-[#E8DDD1] rounded-xl focus:outline-none focus:border-[#E8A5C2] bg-[#FAF7F2]"
                  required
                />
              </div>
            </div>

            {/* Pilihan Kategori */}
            <div>
              <label className="block text-xs font-bold text-[#6E5B58] mb-1">Kategori / Folder *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E8DDD1] rounded-xl focus:outline-none focus:border-[#E8A5C2] bg-[#FAF7F2] text-[#4A3E3D] font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Link Gambar Google Drive */}
            <div>
              <label className="block text-xs font-bold text-[#6E5B58] mb-1">Link Foto (Google Drive) *</label>
              <input 
                type="text" 
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Tempelkan link share foto Google Drive di sini"
                className="w-full px-3 py-2 text-sm border border-[#E8DDD1] rounded-xl focus:outline-none focus:border-[#E8A5C2] bg-[#FAF7F2]"
                required
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-xs font-bold text-[#6E5B58] mb-1">Deskripsi Singkat</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Bunga palsu dengan nuansa warna pink soft..."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-[#E8DDD1] rounded-xl focus:outline-none focus:border-[#E8A5C2] bg-[#FAF7F2]"
              />
            </div>

            {/* Tombol Action */}
            <div className="flex gap-2 pt-2">
              <button 
                type="submit"
                className="bg-[#E8A5C2] hover:bg-[#D893B0] text-white font-bold px-5 py-2.5 rounded-full text-xs transition-all shadow-sm"
              >
                {editingId ? 'Simpan Perubahan' : 'Tambah Produk'}
              </button>
              {editingId && (
                <button 
                  type="button"
                  onClick={resetForm}
                  className="bg-[#EFE8DE] text-[#6E5B58] font-bold px-4 py-2.5 rounded-full text-xs hover:bg-[#E8DDD1] transition-all"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* DAFTAR PRODUK (TABLE/LIST) */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#EFE8DE] shadow-sm">
          <h2 className="text-lg font-bold text-[#4A3E3D] mb-4">Daftar Produk ({products.length})</h2>

          {loading ? (
            <p className="text-xs text-center py-8 text-[#B85B84]">Memuat data...</p>
          ) : products.length === 0 ? (
            <p className="text-xs text-center py-8 text-[#B85B84]">Belum ada produk tersimpan.</p>
          ) : (
            <div className="space-y-3">
              {products.map((item) => (
                <div 
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-[#EFE8DE] rounded-xl bg-[#FAF7F2] gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={formatDriveUrl(item.image)} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-lg object-cover bg-white"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-[#4A3E3D]">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-[#D878A0] font-extrabold">Rp {item.price}</span>
                        <span className="bg-[#F8E3EC] text-[#B85B84] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#F0D0E0]">
                          {item.category || 'Belum ada kategori'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-xs bg-[#E8DDD1] text-[#4A3E3D] hover:bg-[#E8A5C2] hover:text-white px-3 py-1.5 rounded-lg transition-all font-semibold"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-xs bg-red-100 text-red-600 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg transition-all font-semibold"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
