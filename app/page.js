'use client';

import { useState, useEffect } from 'react';
import { supabase, formatDriveUrl } from '@/lib/supabase';

// Pemetaan Ikon Emoji Sesuai Kategori
const CATEGORY_ICONS = {
  'Artificial Flowers': '🌺',
  'Fresh Flowers': '🌹',
  'Snack & Chocolate': '🍫',
  'Money Bouquet': '💵',
  'Doll Series': '🧸',
  'Custom Bouquet': '✨',
  'Bloom Box & Vas': '🪴',
  'Wedding Bouquet': '💍',
};

const CATEGORIES = Object.keys(CATEGORY_ICONS);

export default function Home() {
  const [catalogData, setCatalogData] = useState([]);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Nomor WhatsApp Admin Yuri Florist
  const admin1Number = "6282183486092";
  const admin2Number = "6282178889350";

  // Pesan Otomatis WhatsApp
  const waMessage = encodeURIComponent("haloo kak, bagaimana cara ordernya ya? apakah bisa same day/ dadakan?");

  // URL Google Maps Yuri Florist
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=yuri+florist";

  useEffect(() => {
    async function getProducts() {
      const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
      if (!error && data) {
        setCatalogData(data);
      }
      setLoading(false);
    }
    getProducts();
  }, []);

  // Filter jenis bunga (Sub-Folder) setiap kali Folder Utama berganti
  useEffect(() => {
    const availableSubs = Array.from(
      new Set(
        catalogData
          .filter((item) => item.category === activeCategory && item.subcategory)
          .map((item) => item.subcategory)
      )
    );
    setSubcategories(availableSubs);
    setActiveSubcategory(availableSubs.length > 0 ? availableSubs[0] : null);
  }, [activeCategory, catalogData]);

  const displayedProducts = catalogData.filter(
    (item) => item.category === activeCategory && item.subcategory === activeSubcategory
  );

  const formatRupiah = (price) => {
    if (!price) return 'Rp 0';
    const numberOnly = price.toString().replace(/[^0-9]/g, '');
    if (!numberOnly) return price;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(numberOnly);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4A3E3D] font-sans selection:bg-[#F3C5D8] selection:text-[#4A3E3D]">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EFE8DE] shadow-sm px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xl sm:text-2xl">🌸</span>
          <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[#E8A5C2]">
            Yuri <span className="text-[#5C4A48]">Florist</span>
          </h1>
        </div>
        <nav className="flex items-center gap-3 sm:gap-6 font-medium text-xs sm:text-sm">
          <a href="#home" className="text-[#6E5B58] hover:text-[#E8A5C2] transition-colors">Beranda</a>
          <a href="#katalog" className="text-[#6E5B58] hover:text-[#E8A5C2] transition-colors">Katalog</a>
          <a 
            href="/admin" 
            className="text-[10px] sm:text-xs font-semibold bg-[#F5ECE3] border border-[#E8DDD1] text-[#6E5B58] hover:bg-[#E8A5C2] hover:text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all shadow-sm"
          >
            Admin
          </a>
        </nav>
      </header>

      {/* HERO SECTION PERCANTIK */}
      <section id="home" className="relative py-12 sm:py-20 px-4 text-center bg-gradient-to-b from-[#F7EBE8] via-[#FAF7F2]/60 to-[#FAF7F2] overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          
          {/* BADGE TOP */}
          <span className="inline-flex items-center gap-1.5 bg-white/90 text-[#B85B84] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-4 border border-[#F0D0E0] shadow-sm">
            Premium Flowers 🌷
          </span>

          {/* JUDUL UTAMA */}
          <h2 className="text-3xl sm:text-5xl font-black text-[#4A3E3D] leading-tight mb-3 tracking-tight">
            Special Gift For <br />
            <span className="text-[#E8A5C2] drop-shadow-sm">Special People</span>
          </h2>

          {/* DESKRIPSI & INSTRUKSI ORDER */}
          <p className="text-[#6E5B58] max-w-xl mx-auto text-xs sm:text-base mb-6 leading-relaxed bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-[#EFE8DE] shadow-xs">
            Silakan cek dan pilih referensi di katalog yang tersedia di bawah ini, lalu <strong>screenshoot</strong> dan tanyakan stock pada admin 🥰
          </p>

          {/* BADGE LOKASI ALAMAT */}
          <div className="inline-flex items-center gap-2 bg-white border border-[#EFE8DE] px-4 py-2 rounded-full shadow-sm mb-8 max-w-md mx-auto hover:border-[#E8A5C2] transition-colors">
            <span className="text-sm">📍</span>
            <span className="text-xs text-[#6E5B58] font-medium truncate">
              Jl Cirebon No 64, Sukarame II, Teluk Betung Barat
            </span>
            <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-[#B85B84] font-bold underline hover:text-[#E8A5C2] shrink-0"
            >
              Maps ↗
            </a>
          </div>

          {/* TOMBOL KATALOG & CHAT ADMIN */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <a 
              href="#katalog"
              className="bg-[#E8A5C2] hover:bg-[#D893B0] text-white font-bold px-5 sm:px-7 py-3 rounded-full shadow-md shadow-[#E8A5C2]/30 transition-all text-xs sm:text-sm flex items-center gap-1.5"
            >
              Lihat Folder Katalog ↓
            </a>
            <a 
              href={`https://wa.me/${admin1Number}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-[#F8E3EC] text-[#4A3E3D] font-bold px-4 sm:px-5 py-3 rounded-full text-xs sm:text-sm flex items-center gap-1.5 border border-[#EFE8DE] shadow-xs transition-all"
            >
              💬 Admin 1
            </a>
            <a 
              href={`https://wa.me/${admin2Number}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-[#F8E3EC] text-[#4A3E3D] font-bold px-4 sm:px-5 py-3 rounded-full text-xs sm:text-sm flex items-center gap-1.5 border border-[#EFE8DE] shadow-xs transition-all"
            >
              💬 Admin 2
            </a>
          </div>

        </div>
      </section>

      {/* KATALOG SECTION */}
      <main id="katalog" className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:py-16">
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-3xl font-extrabold text-[#4A3E3D] tracking-tight mb-2">
            Katalog Bunga
          </h3>
          <div className="w-12 sm:w-16 h-1 bg-[#E8A5C2] mx-auto rounded-full mb-6"></div>

          {/* LEVEL 1: FOLDER UTAMA DENGAN IKON SESUAI KATEGORI */}
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2.5 max-w-4xl mx-auto mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[11px] sm:text-xs font-bold px-3.5 sm:px-4 py-2 rounded-2xl transition-all border flex items-center gap-1.5 ${
                  activeCategory === cat
                    ? 'bg-[#E8A5C2] text-white border-[#E8A5C2] shadow-md'
                    : 'bg-white text-[#6E5B58] border-[#EFE8DE] hover:bg-[#F8E3EC]'
                }`}
              >
                <span>{CATEGORY_ICONS[cat] || '📁'}</span>
                <span>{cat}</span>
              </button>
            ))}
          </div>

          {/* LEVEL 2: SUB-FOLDER (FILE JENIS BUNGA) */}
          {subcategories.length > 0 && (
            <div className="bg-white/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-[#EFE8DE] max-w-3xl mx-auto shadow-sm">
              <span className="block text-[10px] sm:text-xs font-bold text-[#B85B84] mb-2 uppercase tracking-wider">
                📄 Pilih Jenis Bunga di Folder "{activeCategory}":
              </span>
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                {subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubcategory(sub)}
                    className={`text-[11px] sm:text-xs font-medium px-3 py-1.5 rounded-xl transition-all border ${
                      activeSubcategory === sub
                        ? 'bg-[#F8E3EC] text-[#B85B84] border-[#F0D0E0] font-bold shadow-sm'
                        : 'bg-[#FAF7F2] text-[#6E5B58] border-[#E8DDD1] hover:bg-white'
                    }`}
                  >
                    📄 {sub}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* LEVEL 3: KATALOG FOTO */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-[#E8A5C2]"></div>
          </div>
        ) : !activeSubcategory || displayedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl sm:rounded-3xl border border-dashed border-[#EFE8DE] max-w-2xl mx-auto">
            <p className="text-[#B85B84] text-xs sm:text-sm">
              Belum ada foto produk untuk jenis bunga ini di folder <strong>{activeCategory}</strong>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-8">
            {displayedProducts.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-[#EFE8DE] shadow-sm hover:shadow-lg hover:shadow-[#F8E3EC] transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Foto Produk */}
                <div className="relative w-full h-40 sm:h-64 bg-[#FAF7F2] overflow-hidden">
                  <img 
                    src={formatDriveUrl(item.image)} 
                    alt={item.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-md text-[#B85B84] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#F0D0E0]">
                    {item.subcategory}
                  </span>
                </div>
                
                {/* Detail Produk */}
                <div className="p-3 sm:p-6 flex flex-col flex-grow justify-between text-left">
                  <div>
                    <h4 className="font-bold text-[#4A3E3D] text-sm sm:text-lg mb-0.5 sm:mb-1 group-hover:text-[#E8A5C2] transition-colors line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-[#6E5B58] line-clamp-2 leading-relaxed mb-2 sm:mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Harga */}
                  <div className="text-sm sm:text-xl font-black text-[#D878A0]">
                    {formatRupiah(item.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER & INFORMASI LOKASI */}
      <footer id="kontak" className="bg-white border-t border-[#EFE8DE] text-center py-6 sm:py-10 px-4 text-xs sm:text-sm text-[#6E5B58]">
        <div className="max-w-md mx-auto mb-4">
          <p className="font-bold text-[#4A3E3D] text-sm sm:text-base">📍 Alamat Outlet / Store:</p>
          <p className="text-xs text-[#6E5B58] mt-1 leading-relaxed">
            Jl Cirebon No 64, Sukarame II, Teluk Betung Barat
          </p>
          <a 
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 bg-[#F8E3EC] text-[#B85B84] hover:bg-[#E8A5C2] hover:text-white text-xs font-bold px-4 py-1.5 rounded-full transition-all shadow-sm"
          >
            🗺️ Buka di Google Maps (yuri florist)
          </a>
        </div>
        
        <div className="border-t border-[#EFE8DE] pt-4 max-w-xs mx-auto">
          <p className="font-semibold text-[#4A3E3D]">Yuri Florist &copy; {new Date().getFullYear()}</p>
          <p className="text-[10px] sm:text-xs text-[#B85B84] mt-0.5">Rangkaian Bunga Segar & Buket Cantik</p>
        </div>
      </footer>

    </div>
  );
}
