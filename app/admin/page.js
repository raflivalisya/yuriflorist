'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
  // --- STATE AUTENTIKASI & PASSWORD ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('admin123'); // Password bawaan
  const [loginError, setLoginError] = useState('');

  // State Form Ganti Password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // --- STATE MANAGEMENT PRODUK ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    subcategory: '',
    price: '',
    description: '',
    image: '',
  });

  // Load password dari localStorage jika ada
  useEffect(() => {
    const savedPassword = localStorage.getItem('admin_password');
    if (savedPassword) {
      setCurrentPassword(savedPassword);
    }
  }, []);

  // Fetch Produk jika sudah login
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  }

  // --- HANDLER LOGIN ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (inputPassword === currentPassword) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Password salah! Silakan coba lagi.');
    }
  };

  // --- HANDLER RESET PASSWORD SAYA ---
// --- HANDLER RESET PASSWORD ---
  const handleResetPassword = () => {
    if (confirm('Yakin ingin mereset password kembali ke admin123?')) {
      localStorage.removeItem('admin_password');
      setCurrentPassword('admin123');
      setInputPassword('');
      setLoginError('');
      alert('Password berhasil direset ke password default: admin123');
    }
  };

  // --- HANDLER GANTI PASSWORD ---
  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordMsg({ text: '', type: '' });

    if (oldPassword !== currentPassword) {
      setPasswordMsg({ text: 'Password lama salah!', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ text: 'Password baru minimal 6 karakter!', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'Konfirmasi password baru tidak cocok!', type: 'error' });
      return;
    }

    // Simpan password baru ke localStorage
    localStorage.setItem('admin_password', newPassword);
    setCurrentPassword(newPassword);
    setPasswordMsg({ text: 'Password berhasil diperbarui!', type: 'success' });

    // Reset Form
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => {
      setShowChangePasswordModal(false);
      setPasswordMsg({ text: '', type: '' });
    }, 1500);
  };

  // --- HANDLER PRODUK (TAMBAH / EDIT / HAPUS) ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (editingId) {
      await supabase.from('products').update(formData).eq('id', editingId);
      setEditingId(null);
    } else {
      await supabase.from('products').insert([formData]);
    }

    setFormData({
      name: '',
      category: CATEGORIES[0],
      subcategory: '',
      price: '',
      description: '',
      image: '',
    });

    fetchProducts();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || '',
      category: item.category || CATEGORIES[0],
      subcategory: item.subcategory || '',
      price: item.price || '',
      description: item.description || '',
      image: item.image || '',
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus produk ini?')) {
      setLoading(true);
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: CATEGORIES[0],
      subcategory: '',
      price: '',
      description: '',
      image: '',
    });
  };

  // ==========================================
  // TAMPILAN 1: HALAMAN LOGIN ADMIN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#EFE8DE] w-full max-w-md text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="text-2xl font-black text-[#4A3E3D] mb-1">Login Admin</h2>
          <p className="text-xs text-[#6E5B58] mb-6">Masukkan password untuk mengelola katalog Yuri Florist</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Masukkan Password Admin"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8DDD1] focus:outline-none focus:border-[#E8A5C2] text-sm text-center"
                required
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-500 font-semibold">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#E8A5C2] hover:bg-[#D893B0] text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm"
            >
              Masuk Dashboard
            </button>
          </form>

          {/* TOMBOL BANTUAN RESET LUPA PASSWORD */}
          <div className="mt-6 pt-4 border-t border-[#EFE8DE]">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-[11px] text-[#B85B84] hover:underline font-semibold"
            >
              ❓ Lupa Password? Reset ke Default ()
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN 2: DASHBOARD UTAMA ADMIN
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4A3E3D] p-4 sm:p-8">
      {/* HEADER DASHBOARD */}
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4 mb-8 bg-white p-4 sm:p-6 rounded-2xl border border-[#EFE8DE] shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A3E3D] flex items-center gap-2">
            ⚙️ Panel Kelola Produk
          </h1>
          <p className="text-xs text-[#6E5B58]">Tambah, ubah, atau hapus produk di Yuri Florist</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowChangePasswordModal(true)}
            className="bg-[#F8E3EC] text-[#B85B84] hover:bg-[#E8A5C2] hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-[#F0D0E0]"
          >
            🔑 Ganti Password
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORM TAMBAH / EDIT PRODUK */}
        <div className="bg-white p-6 rounded-2xl border border-[#EFE8DE] shadow-sm h-fit">
          <h2 className="text-lg font-bold text-[#4A3E3D] mb-4 flex items-center gap-2">
            {editingId ? '✏️ Edit Produk' : '➕ Tambah Produk Baru'}
          </h2>

          <form onSubmit={handleSubmitProduct} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold mb-1">Nama Produk</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Contoh: Buket Mawar Merah"
                className="w-full px-3 py-2 border border-[#E8DDD1] rounded-xl focus:outline-none focus:border-[#E8A5C2]"
                required
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Kategori (Folder Utama)</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#E8DDD1] rounded-xl focus:outline-none focus:border-[#E8A5C2]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1">Jenis Bunga / Sub-Folder</label>
              <input
                type="text"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                placeholder="Contoh: Mawar / Tulip / Snack"
                className="w-full px-3 py-2 border border-[#E8DDD1] rounded-xl focus:outline-none focus:border-[#E8A5C2]"
                required
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Harga (Rp)</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Contoh: 150000"
                className="w-full px-3 py-2 border border-[#E8DDD1] rounded-xl focus:outline-none focus:border-[#E8A5C2]"
                required
              />
            </div>

            <div>
              <label className="block font-bold mb-1">URL Foto (Google Drive/Lainnya)</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="Paste link gambar disini"
                className="w-full px-3 py-2 border border-[#E8DDD1] rounded-xl focus:outline-none focus:border-[#E8A5C2]"
                required
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Deskripsi Produk</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Penjelasan ringkas produk"
                className="w-full px-3 py-2 border border-[#E8DDD1] rounded-xl focus:outline-none focus:border-[#E8A5C2]"
              ></textarea>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-[#E8A5C2] hover:bg-[#D893B0] text-white font-bold py-2.5 rounded-xl transition-all"
              >
                {editingId ? 'Update Produk' : 'Simpan Produk'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-xl hover:bg-gray-300"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* TABEL DAFTAR PRODUK */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#EFE8DE] shadow-sm">
          <h2 className="text-lg font-bold text-[#4A3E3D] mb-4">📦 Daftar Produk Terpasang</h2>

          {loading ? (
            <div className="text-center py-12 text-xs text-[#B85B84]">Memuat data produk...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-xs text-gray-400">Belum ada produk yang ditambahkan.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EFE8DE] text-[#B85B84] bg-[#FAF7F2]">
                    <th className="p-2.5">Produk</th>
                    <th className="p-2.5">Kategori</th>
                    <th className="p-2.5">Harga</th>
                    <th className="p-2.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE8DE]">
                  {products.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FAF7F2]/50">
                      <td className="p-2.5 font-bold">{item.name}</td>
                      <td className="p-2.5 text-[11px] text-[#6E5B58]">
                        <span className="bg-[#F8E3EC] text-[#B85B84] px-2 py-0.5 rounded-full font-semibold">
                          {item.category}
                        </span>
                        <div className="text-[10px] mt-0.5">{item.subcategory}</div>
                      </td>
                      <td className="p-2.5 font-semibold text-[#D878A0]">
                        Rp {Number(item.price).toLocaleString('id-ID')}
                      </td>
                      <td className="p-2.5 text-center">
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-2.5 py-1 rounded-lg text-[10px] font-bold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-100 text-red-600 hover:bg-red-200 px-2.5 py-1 rounded-lg text-[10px] font-bold"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* ========================================== */}
      {/* MODAL / POPUP GANTI PASSWORD */}
      {/* ========================================== */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EFE8DE] shadow-xl">
            <h3 className="text-lg font-bold text-[#4A3E3D] mb-1 flex items-center gap-2">
              🔑 Ganti Password Admin
            </h3>
            <p className="text-xs text-[#6E5B58] mb-4">
              Ubah password login kamu agar akun tetap aman.
            </p>

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Password Lama</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Masukkan password saat ini"
                  className="w-full px-3 py-2 border border-[#E8DDD1] rounded-xl focus:outline-none focus:border-[#E8A5C2]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Password Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3 py-2 border border-[#E8DDD1] rounded-xl focus:outline-none focus:border-[#E8A5C2]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru"
                  className="w-full px-3 py-2 border border-[#E8DDD1] rounded-xl focus:outline-none focus:border-[#E8A5C2]"
                  required
                />
              </div>

              {passwordMsg.text && (
                <p className={`text-xs font-semibold ${passwordMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                  {passwordMsg.text}
                </p>
              )}

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#E8A5C2] hover:bg-[#D893B0] text-white font-bold py-2.5 rounded-xl transition-all"
                >
                  Simpan Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePasswordModal(false);
                    setPasswordMsg({ text: '', type: '' });
                  }}
                  className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-2.5 rounded-xl font-bold"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
