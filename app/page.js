'use client';

import { useState, useEffect } from 'react';
import { supabase, formatDriveUrl } from '@/lib/supabase';

export default function Home() {
  const [catalogData, setCatalogData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ganti nomor WhatsApp kedua Admin (gunakan format 62...)
  const admin1Number = "6281234567890";
  const admin2Number = "6289876543210";

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

  // Helper merapikan format harga ke Rupiah
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
    <div className="min-h-screen bg-[#FDFBF7] text-[#5A4A42] font-sans selection:bg-[#F2D0C4] selection:text-[#4A3B32]">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EFE6DC] shadow-sm px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xl sm:text-2xl">🌸</span>
          <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[#E89283]">
            Yuri <span className="text-[#685348]">Florist</span>
          </h1>
        </div>
        <nav className="flex items-center gap-3 sm:gap-6 font-medium text-xs sm:text-sm">
          <a href="#home" className="text-[#786356] hover:text-[#E89283] transition-colors">Beranda</a>
          <a href="#katalog" className="text-[#786356] hover:text-[#E89283] transition-colors">Katalog</a>
          <a 
            href="/admin" 
            className="text-[10px] sm:text-xs font-semibold bg-[#F5EBE1] border border-[#E8D9CC] text-[#786356] hover:bg-[#E89283] hover:text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 shadow-sm"
          >
            Admin
          </a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative py-12 sm:py-20 px-4 text-center bg-gradient-to-b from-[#F7EBE1]/80 via-[#FAF3EC]/50 to-[#FDFBF7] overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="inline-block bg-[#F5E6DC] text-[#B86858] text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full mb-3 sm:mb-4 border border-[#E8D3C5] shadow-sm">
            ✨ Hand Bouquet & Premium Flower Arrangement
          </span>
          <h2 className="text-2xl sm:text-5xl font-black text-[#4A3B32] leading-tight mb-3 sm:mb-4 tracking-tight">
            Bunga Indah untuk <br className="hidden sm:inline" />
            <span className="text-[#E89283]">Momen Spesial</span> Anda
          </h2>
          <p className="text-[#786356] max-w-xl mx-auto text-xs sm:text-lg mb-6 sm:mb-8 leading-relaxed">
            Temukan berbagai pilihan buket bunga segar dengan desain estetik dan kualitas terbaik untuk orang tersayang.
          </p>

          {/* TOMBOL KATALOG & CHAT ADMIN 1 & 2 */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <a 
              href="#katalog"
              className="bg-[#E89283] hover:bg-[#D88071] text-white font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-md shadow-[#E89283]/20 hover:-translate-y-0.5 transition-all text-xs sm:text-sm"
            >
              Lihat Katalog Bunga ↓
            </a>
            <a 
              href={`https://wa.me/${admin1Number}?text=Halo%20Admin%201%20Yuri%20Florist,%20saya%20ingin%20bertanya%20mengenai%20katalog%20bunga`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F5D8CE] hover:bg-[#ECC9BD] text-[#5A4A42] font-bold px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-sm hover:-translate-y-0.5 transition-all text-xs sm:text-sm flex items-center gap-1"
            >
              💬 Admin 1
            </a>
            <a 
              href={`https://wa.me/${admin2Number}?text=Halo%20Admin%202%20Yuri%20Florist,%20saya%20ingin%20bertanya%20mengenai%20katalog%20bunga`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F5D8CE] hover:bg-[#ECC9BD] text-[#5A4A42] font-bold px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-sm hover:-translate-y-0.5 transition-all text-xs sm:text-sm flex items-center gap-1"
            >
              💬 Admin 2
            </a>
          </div>
        </div>
      </section>

      {/* KATALOG SECTION */}
      <main id="katalog" className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:py-16">
        <div className="text-center mb-6 sm:mb-12">
          <h3 className="text-xl sm:text-3xl font-extrabold text-[#4A3B32] tracking-tight mb-1.5 sm:mb-2">
            Katalog Bunga
          </h3>
          <div className="w-12 sm:w-16 h-1 bg-[#E89283] mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-[#E89283]"></div>
          </div>
        ) : catalogData.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl sm:rounded-3xl border border-dashed border-[#EFE6DC]">
            <p className="text-[#B86858] text-xs sm:text-sm">Belum ada produk bunga yang ditambahkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-8">
            {catalogData.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-[#EFE6DC] shadow-sm hover:shadow-lg hover:shadow-[#F5EBE1] transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Foto Produk */}
                <div className="relative w-full h-40 sm:h-64 bg-[#FAF3EC] overflow-hidden">
                  <img 
                    src={formatDriveUrl(item.image)} 
                    alt={item.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                {/* Detail Produk */}
                <div className="p-3 sm:p-6 flex flex-col flex-grow justify-between text-left">
                  <div>
                    <h4 className="font-bold text-[#4A3B32] text-sm sm:text-lg mb-0.5 sm:mb-1 group-hover:text-[#E89283] transition-colors line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-[#786356] line-clamp-2 leading-relaxed mb-2 sm:mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Harga Warna Peach Warm */}
                  <div className="text-sm sm:text-xl font-black text-[#D87665]">
                    {formatRupiah(item.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer id="kontak" className="bg-white border-t border-[#EFE6DC] text-center py-6 sm:py-8 px-4 text-xs sm:text-sm text-[#786356]">
        <p className="font-semibold text-[#4A3B32]">Yuri Florist &copy; {new Date().getFullYear()}</p>
        <p className="text-[10px] sm:text-xs text-[#B86858] mt-1">Rangkaian Bunga Segar & Buket Cantik</p>
      </footer>

    </div>
  );
}
