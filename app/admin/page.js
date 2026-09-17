'use client';

import { useState, useEffect } from 'react';
import { supabase, formatDriveUrl } from '@/lib/supabase';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', description: '', price: '', image: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedImage = formatDriveUrl(formData.image);

    if (isEditing) {
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          image: formattedImage,
        })
        .eq('id', formData.id);

      if (error) alert("Gagal memperbarui produk: " + error.message);
    } else {
      const { error } = await supabase.from('products').insert([
        {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          image: formattedImage,
        },
      ]);

      if (error) alert("Gagal menambah produk: " + error.message);
    }

    setFormData({ id: '', name: '', description: '', price: '', image: '' });
    setIsEditing(false);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus produk ini?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) alert('Gagal menghapus produk: ' + error.message);
      else fetchProducts();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard Admin Yuri Florist</h1>
          <a href="/" className="text-sm bg-white px-4 py-2 border rounded-full hover:bg-gray-100 transition-colors">
            ← Kembali ke Website Utama
          </a>
        </div>

        {/* FORM TAMBAH / EDIT PRODUK */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md mb-8 space-y-4">
          <h2 className="text-xl font-bold">{isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Nama Produk</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded-md"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
              required
              rows={3}
              className="w-full p-2 border rounded-md"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Harga</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-md"
                placeholder="Rp 150.000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Link Gambar / Google Drive</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-md"
                placeholder="https://drive.google.com/file/d/..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
              <p className="text-[11px] text-gray-500 mt-1">
                *Akses link Google Drive wajib diset ke <b>&quot;Siapa saja yang memiliki link&quot;</b>.
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Memproses...' : isEditing ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ id: '', name: '', description: '', price: '', image: '' });
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Batal
              </button>
            )}
          </div>
        </form>

        {/* DAFTAR PRODUK */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Daftar Produk Aktif</h2>
          {loading && <p className="text-sm text-gray-500">Memuat data produk...</p>}
          <div className="space-y-4">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-4">
                  <img
                    src={formatDriveUrl(p.image)}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-cover rounded-md bg-gray-200"
                  />
                  <div>
                    <h3 className="font-bold">{p.name}</h3>
                    <p className="text-xs text-gray-600">{p.price}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(p)} className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-sm transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors">
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}