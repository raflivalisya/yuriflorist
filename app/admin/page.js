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
  // --- STATE AUTENTIKASI ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('admin123');
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

  // STATE FILTER KATEGORI & SUB-FOLDER
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('ALL');
  const [selectedFilterSubcategory, setSelectedFilterSubcategory] = useState('ALL');

  // Form Input
  const [formData, setFormData] = useState({
    category: CATEGORIES[0],
    subcategory: '',
    imageLinks: '', // Mengampung banyak link dipisah enter
    price: '0',
    description: '',
  });

  // Load password dari localStorage
  useEffect(() => {
    const savedPassword = localStorage.getItem('admin_password');
    if (savedPassword) {
      setCurrentPassword(savedPassword);
    }
  }, []);

  // Fetch Produk
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

  // --- HANDLER LOGIN & RESET ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (inputPassword === currentPassword) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Password salah! Silakan coba lagi.');
    }
  };

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

    localStorage.setItem('admin_password', newPassword);
    setCurrentPassword(newPassword);
    setPasswordMsg({ text: 'Password berhasil diperbarui!', type: 'success' });

    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => {
      setShowChangePasswordModal(false);
      setPasswordMsg({ text: '', type: '' });
    }, 1500);
  };

  // --- HANDLER PRODUK ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (editingId) {
      // MODE EDIT (Satu Item)
      const payload = {
        category: formData.category,
        subcategory: formData.subcategory,
        image: formData.imageLinks.trim(),
        price: formData.price,
        description: formData.description,
        name: formData.subcategory || 'Katalog',
      };
      await supabase.from('products').update(payload).eq('id', editingId);
      setEditingId(null);
    } else {
      // MODE TAMBAH BANYAK (Bulk Upload)
      // Memisah tautan berdasarkan baris baru (enter)
      const urls = formData.imageLinks
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      if (urls.length === 0) {
        alert('Masukkan minimal satu link foto!');
        setLoading(false);
        return;
      }

      // Format data masal
      const payloadArray = urls.map((url) => ({
        category: formData.category,
        subcategory: formData.subcategory,
        image: url,
        price: formData.price,
        description: formData.description,
        name: formData.subcategory || 'Katalog',
      }));

      await supabase.from('products').insert(payloadArray);
    }

    // Reset Form
    setFormData({
      category: formData.category, // Tetap simpan kategori terakhir biar cepat
      subcategory: formData.subcategory, // Tetap simpan sub-folder terakhir
      imageLinks: '',
      price: '0',
      description: '',
    });

    fetchProducts();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      category: item.category || CATEGORIES[0],
      subcategory: item.subcategory || '',
      imageLinks: item.image || '',
      price: item.price || '0',
      description: item.description || '',
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus foto katalog ini?')) {
      setLoading(true);
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      category: CATEGORIES[0],
      subcategory: '',
      imageLinks: '',
      price: '0',
      description: '',
    });
  };

  // Filter Sub-Folder
  const availableSubcategoriesForFilter = Array.from(
    new Set(
      products
        .filter((p) => (selectedFilterCategory === 'ALL' ? true : p.category === selectedFilterCategory))
        .map((p) => p.subcategory)
        .filter(Boolean)
    )
  );

  const categoriesToDisplay = selectedFilterCategory === 'ALL'
    ? CATEGORIES
    : [selectedFilterCategory];

  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedFilterCategory === 'ALL' || p.category === selectedFilterCategory;
    const matchSubcategory = selectedFilterSubcategory === 'ALL' || p.subcategory === selectedFilterSubcategory;
    return matchCategory && matchSubcategory;
  });

  const handleCategoryFilterChange = (cat) => {
    setSelectedFilterCategory(cat);
    setSelectedFilterSubcategory('ALL');
  };

  // ==========================================
  // TAMPILAN 1: HALAMAN LOGIN
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
            ⚙️ Panel Kelola Foto Katalog
          </h1>
          <p className="text-xs text-[#6E5B58]">Upload sekaligus banyak foto per kategori & sub-folder</p>
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
        
        {/* FORM UPLOAD (SUPPORT MASSAL) */}
        <div className="bg-white p-6 rounded-2xl border border-[#EFE8DE] shadow-sm h-fit">
          <h2 className="text-lg font-bold text-[#4A3E3D] mb-4 flex items-center gap-2">
            {editingId ? '✏️ Edit Foto Katalog' : '⚡ Upload Massal Foto'}
          </h2>

          <form onSubmit={handleSubmitProduct} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold mb-1">Kategori (Folder Utama)</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#E8DDD1] rounded-xl focus:outline-none focus:border-[#E8A5C2] font-semibold text-[#4A3E3D]"
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
                placeholder="Contoh: Pink Series / Mawar / Tulips"
                className="w-full px-3 py-2 border border-[#E8DDD1] rounded-xl focus:outline-none focus:border-[#E8A5C2]"
                required
              />
            </div>

            <div>
              <label className="block font-bold mb-1">
                {editingId ? 'URL Foto' : 'URL Foto Massal (1 Link per Baris)'}
              </label>
              <textarea
                name="imageLinks"
                rows={editingId ? 3 : 6}
                value={formData.imageLinks}
                onChange={handleInputChange}
                placeholder={
                  editingId
                    ? 'Paste link gambar baru'
                    : 'Paste link gambar di sini.\nJika lebih dari 1, pisahkan dengan tekan Enter:\nhttps://drive.google.com/...\nhttps://drive.google.com/...'
                }
                className="w-full px-3 py-2 border border-[#E8DDD1] rounded-xl focus:outline-none focus:border-[#E8A5C2] font-mono text-[11px]"
                required
              />
              {!editingId && (
                <p className="text-[10px] text-gray-400 mt-1">
                  💡 Kamu bisa **paste banyak link** sekaligus. Tekan **Enter** untuk setiap link baru.
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-[#E8A5C2] hover:bg-[#D893B0] text-white font-bold py-2.5 rounded-xl transition-all"
              >
                {editingId ? 'Update Foto' : '🚀 Simpan Semua Foto'}
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

        {/* DAFTAR PRODUK */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* HEADER DAFTAR + DOUBLE DROPDOWN FILTER */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EFE8DE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#4A3E3D] flex items-center gap-2">
                📦 Daftar Foto Terpasang
              </h2>
              <p className="text-[11px] text-[#6E5B58] mt-0.5">
                Menampilkan: <strong className="text-[#B85B84]">{filteredProducts.length} foto</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedFilterCategory}
                onChange={(e) => handleCategoryFilterChange(e.target.value)}
                className="px-3 py-2 text-xs font-semibold bg-[#FAF7F2] border border-[#E8DDD1] rounded-xl focus:outline-none focus:border-[#E8A5C2] text-[#4A3E3D]"
              >
                <option value="ALL">🌟 Semua Kategori ({products.length})</option>
                {CATEGORIES.map((cat) => {
                  const count = products.filter(p => p.category === cat).length;
                  return (
                    <option key={cat} value={cat}>
                      📁 {cat} ({count})
                    </option>
                  );
                })}
              </select>

              <select
                value={selectedFilterSubcategory}
                onChange={(e) => setSelectedFilterSubcategory(e.target.value)}
                className="px-3 py-2 text-xs font-semibold bg-[#FAF7F2] border border-[#E8DDD1] rounded-xl focus:outline-none focus:border-[#E8A5C2] text-[#4A3E3D]"
              >
                <option value="ALL">📄 Semua Sub-Folder</option>
                {availableSubcategoriesForFilter.map((sub) => {
                  const count = products.filter(
                    (p) =>
                      p.subcategory === sub &&
                      (selectedFilterCategory === 'ALL' || p.category === selectedFilterCategory)
                  ).length;
                  return (
                    <option key={sub} value={sub}>
                      📄 {sub} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* TABEL LISTING */}
          {loading ? (
            <div className="text-center py-12 text-xs text-[#B85B84] bg-white rounded-2xl border border-[#EFE8DE]">
              Memuat data katalog...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-xs text-gray-400 bg-white rounded-2xl border border-[#EFE8DE]">
              Tidak ditemukan foto katalog yang sesuai dengan filter.
            </div>
          ) : (
            categoriesToDisplay.map((cat) => {
              const catProducts = filteredProducts.filter((p) => p.category === cat);
              if (catProducts.length === 0) return null;

              return (
                <div key={cat} className="bg-white rounded-2xl border border-[#EFE8DE] shadow-sm overflow-hidden mb-4">
                  <div className="bg-[#FAF7F2] px-4 py-3 border-b border-[#EFE8DE] flex justify-between items-center">
                    <h3 className="font-extrabold text-xs sm:text-sm text-[#B85B84] flex items-center gap-2">
                      📁 {cat}
                    </h3>
                    <span className="text-[10px] bg-white px-2.5 py-0.5 rounded-full border border-[#EFE8DE] text-[#6E5B58] font-bold">
                      {catProducts.length} foto
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#EFE8DE] text-gray-400 text-[11px]">
                          <th className="p-3 w-20 text-center">Preview</th>
                          <th className="p-3">Jenis / Sub-Folder</th>
                          <th className="p-3 text-center w-28">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EFE8DE]">
                        {catProducts.map((item) => (
                          <tr key={item.id} className="hover:bg-[#FAF7F2]/50">
                            {/* Preview Gambar */}
                            <td className="p-2 text-center">
                              <img
                                src={formatDriveUrl(item.image)}
                                alt={item.subcategory}
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 object-cover rounded-lg border border-[#EFE8DE] mx-auto bg-[#FAF7F2]"
                              />
                            </td>

                            {/* Nama Sub-Folder */}
                            <td className="p-3 font-bold text-[#B85B84]">
                              📄 {item.subcategory || '-'}
                            </td>

                            {/* Tombol Akses */}
                            <td className="p-3 text-center">
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
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* MODAL GANTI PASSWORD */}
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
