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
    <div className="min-h-screen bg-pink-50/40 text-pink-950 font-sans selection:bg-pink-200 selection:text-pink-900">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌸</span>
          <h1 className="text-2xl font-extrabold tracking-tight text-pink-400">
            Yuri <span className="text-pink-900">Florist</span>
          </h1>
        </div>
        <nav className="flex items-center gap-6 font-medium text-sm">
          <a href="#home" className="text-pink-800 hover:text-pink-500 transition-colors">Beranda</a>
          <a href="#katalog" className="text-pink-800 hover:text-pink-500 transition-colors">Katalog</a>
          <a 
            href="/admin" 
            className="text-xs font-semibold bg-pink-100/70 border border-pink-200 text-pink-600 hover:bg-pink-300 hover:text-pink-950 px-4 py-2 rounded-full transition-all duration-200 shadow-sm"
          >
            Panel Admin
          </a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative py-20 px-4 text-center bg-gradient-to-b from-pink-100/80 via-pink-50/50 to-pink-50/10 overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="inline-block bg-pink-100 text-pink-600 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4 border border-pink-200/60 shadow-sm">
            ✨ Hand Bouquet & Premium Flower Arrangement
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-pink-950 leading-tight mb-4 tracking-tight">
            Bunga Indah untuk <br className="hidden sm:inline" />
            <span className="text-pink-400">Momen Spesial</span> Anda
          </h2>
          <p className="text-pink-800/80 max-w-xl mx-auto text-base sm:text-lg mb-8 leading-relaxed">
            Temukan berbagai pilihan buket bunga segar dengan desain estetik dan kualitas terbaik untuk orang tersayang.
          </p>

          {/* TOMBOL KATALOG & CHAT ADMIN 1 & 2 */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a 
              href="#katalog"
              className="bg-pink-400 hover:bg-pink-500 text-white font-bold px-6 py-3 rounded-full shadow-md shadow-pink-200 hover:-translate-y-0.5 transition-all text-sm"
            >
              Lihat Katalog Bunga ↓
            </a>
            <a 
              href={`https://wa.me/${admin1Number}?text=Halo%20Admin%201%20Yuri%20Florist,%20saya%20ingin%20bertanya%20mengenai%20katalog%20bunga`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-200 hover:bg-pink-300 text-pink-950 font-bold px-5 py-3 rounded-full shadow-sm hover:-translate-y-0.5 transition-all text-sm flex items-center gap-1.5"
            >
              💬 Admin 1
            </a>
            <a 
              href={`https://wa.me/${admin2Number}?text=Halo%20Admin%202%20Yuri%20Florist,%20saya%20ingin%20bertanya%20mengenai%20katalog%20bunga`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-200 hover:bg-pink-300 text-pink-950 font-bold px-5 py-3 rounded-full shadow-sm hover:-translate-y-0.5 transition-all text-sm flex items-center gap-1.5"
            >
              💬 Admin 2
            </a>
          </div>
        </div>
      </section>

      {/* KATALOG SECTION */}
      <main id="katalog" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-extrabold text-pink-950 tracking-tight mb-2">
            Katalog Bunga
          </h3>
          <div className="w-16 h-1 bg-pink-300 mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-400"></div>
          </div>
        ) : catalogData.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-pink-200">
            <p className="text-pink-400 text-sm">Belum ada produk bunga yang ditambahkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {catalogData.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-xl hover:shadow-pink-100 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Foto Produk */}
                <div className="relative w-full h-64 bg-pink-50 overflow-hidden">
                  <img 
                    src={formatDriveUrl(item.image)} 
                    alt={item.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                {/* Detail Produk (Tampilan Murni Katalog) */}
                <div className="p-6 flex flex-col flex-grow justify-between text-left">
                  <div>
                    <h4 className="font-bold text-pink-950 text-lg mb-1 group-hover:text-pink-400 transition-colors line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-pink-700/70 line-clamp-2 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Harga */}
                  <div className="text-xl font-black text-pink-400">
                    {formatRupiah(item.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer id="kontak" className="bg-white border-t border-pink-100 text-center py-8 px-4 text-sm text-pink-800/70">
        <p className="font-semibold text-pink-950">Yuri Florist &copy; {new Date().getFullYear()}</p>
        <p className="text-xs text-pink-400 mt-1">Rangkaian Bunga Segar & Buket Cantik</p>
      </footer>

    </div>
  );
}
