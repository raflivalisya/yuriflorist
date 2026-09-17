'use client';

import { useState, useEffect } from 'react';
import { supabase, formatDriveUrl } from '@/lib/supabase';

const CATEGORIES = [
  'Semua',
  'Artificial Flowers',
  'Fresh Flowers',
  'Snack & Chocolate',
  'Money Bouquet',
  'Doll Series',
  'Custom Bouquet',
  'Bloom Box & Vas',
  'Wedding Bouquet',
];

export default function Home() {
  const [catalogData, setCatalogData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [loading, setLoading] = useState(true);

  // Ganti nomor WhatsApp kedua Admin
  const admin1Number = "6281234567890";
  const admin2Number = "6289876543210";

  useEffect(() => {
    async function getProducts() {
      const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
      if (!error && data) {
        setCatalogData(data);
        setFilteredData(data);
      }
      setLoading(false);
    }
    getProducts();
  }, []);

  // Filter Produk berdasarkan Kategori
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    if (cat === 'Semua') {
      setFilteredData(catalogData);
    } else {
      setFilteredData(catalogData.filter((item) => item.category === cat));
    }
  };

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
            className="text-[10px] sm:text-xs font-semibold bg-[#F5ECE3] border border-[#E8DDD1] text-[#6E5B58] hover:bg-[#E8A5C2] hover:text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 shadow-sm"
          >
            Admin
          </a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative py-12 sm:py-20 px-4 text-center bg-gradient-to-b from-[#F7EBE8]/70 via-[#FAF7F2]/50 to-[#FAF7F2] overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="inline-block bg-[#F8E3EC] text-[#B85B84] text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full mb-3 sm:mb-4 border border-[#F0D0E0] shadow-sm">
            ✨ Hand Bouquet & Premium Flower Arrangement
          </span>
          <h2 className="text-2xl sm:text-5xl font-black text-[#4A3E3D] leading-tight mb-3 sm:mb-4 tracking-tight">
            Bunga Indah untuk <br className="hidden sm:inline" />
            <span className="text-[#E8A5C2]">Momen Spesial</span> Anda
          </h2>
          <p className="text-[#6E5B58] max-w-xl mx-auto text-xs sm:text-lg mb-6 sm:mb-8 leading-relaxed">
            Temukan berbagai pilihan buket bunga segar, snack, hingga kado unik dengan kualitas terbaik.
          </p>

          {/* TOMBOL KATALOG & CHAT ADMIN 1 & 2 */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <a 
              href="#katalog"
              className="bg-[#E8A5C2] hover:bg-[#D893B0] text-white font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-md shadow-[#E8A5C2]/30 hover:-translate-y-0.5 transition-all text-xs sm:text-sm"
            >
              Lihat Katalog Bunga ↓
            </a>
            <a 
              href={`https://wa.me/${admin1Number}?text=Halo%20Admin%201%20Yuri%20Florist,%20saya%20ingin%20bertanya%20mengenai%20katalog%20bunga`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F8DCE8] hover:bg-[#F2CCD2] text-[#4A3E3D] font-bold px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-sm hover:-translate-y-0.5 transition-all text-xs sm:text-sm flex items-center gap-1"
            >
              💬 Admin 1
            </a>
            <a 
              href={`https://wa.me/${admin2Number}?text=Halo%20Admin%202%20Yuri%20Florist,%20saya%20ingin%20bertanya%20mengenai%20katalog%20bunga`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F8DCE8] hover:bg-[#F2CCD2] text-[#4A3E3D] font-bold px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-sm hover:-translate-y-0.5 transition-all text-xs sm:text-sm flex items-center gap-1"
            >
              💬 Admin 2
            </a>
          </div>
        </div>
      </section>

      {/* KATALOG SECTION */}
      <main id="katalog" className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:py-16">
        <div className="text-center mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-3xl font-extrabold text-[#4A3E3D] tracking-tight mb-1.5 sm:mb-2">
            Katalog Bunga
          </h3>
          <div className="w-12 sm:w-16 h-1 bg-[#E8A5C2] mx-auto rounded-full mb-6"></div>

          {/* TAB FOLDER / KATEGORI */}
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2.5 max-w-4xl mx-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`text-[11px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 border ${
                  activeCategory === cat
                    ? 'bg-[#E8A5C2] text-white border-[#E8A5C2] shadow-sm'
                    : 'bg-white text-[#6E5B58] border-[#EFE8DE] hover:bg-[#F8E3EC] hover:text-[#B85B84]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-[#E8A5C2]"></div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl sm:rounded-3xl border border-dashed border-[#EFE8DE]">
            <p className="text-[#B85B84] text-xs sm:text-sm">Belum ada produk di kategori {activeCategory}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-8">
            {filteredData.map((item) => (
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
                  {item.category && (
                    <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-md text-[#B85B84] text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#F0D0E0]">
                      {item.category}
                    </span>
                  )}
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

      {/* FOOTER */}
      <footer id="kontak" className="bg-white border-t border-[#EFE8DE] text-center py-6 sm:py-8 px-4 text-xs sm:text-sm text-[#6E5B58]">
        <p className="font-semibold text-[#4A3E3D]">Yuri Florist &copy; {new Date().getFullYear()}</p>
        <p className="text-[10px] sm:text-xs text-[#B85B84] mt-1">Rangkaian Bunga Segar & Buket Cantik</p>
      </footer>

    </div>
  );
}
