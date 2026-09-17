'use client';

import { useState, useEffect } from 'react';
import { supabase, formatDriveUrl } from '@/lib/supabase';

export default function Home() {
  const [catalogData, setCatalogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const phoneNumber = "6281234567890"; // Ganti dengan nomor WhatsApp Yuri Florist

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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-500 selection:text-white">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌸</span>
          <h1 className="text-2xl font-extrabold tracking-tight text-rose-600">
            Yuri <span className="text-slate-800">Florist</span>
          </h1>
        </div>
        <nav className="flex items-center gap-6 font-medium text-sm">
          <a href="#home" className="text-slate-600 hover:text-rose-600 transition-colors">Beranda</a>
          <a href="#katalog" className="text-slate-600 hover:text-rose-600 transition-colors">Katalog</a>
          <a 
            href="/admin" 
            className="text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white px-4 py-2 rounded-full transition-all duration-200 shadow-sm"
          >
            Panel Admin
          </a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative py-20 px-4 text-center bg-gradient-to-b from-rose-100/60 via-rose-50/30 to-slate-50 overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="inline-block bg-rose-100 text-rose-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            ✨ Hand Bouquet & Premium Flower Arrangement
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
            Bunga Indah untuk <br className="hidden sm:inline" />
            <span className="text-rose-600">Momen Spesial</span> Anda
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-base sm:text-lg mb-8 leading-relaxed">
            Temukan berbagai pilihan buket bunga segar dengan desain estetik dan kualitas terbaik untuk orang tersayang.
          </p>
          <a 
            href="#katalog"
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 hover:-translate-y-0.5 transition-all"
          >
            Lihat Katalog Bunga ↓
          </a>
        </div>
      </section>

      {/* KATALOG SECTION */}
      <main id="katalog" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Katalog Bunga
          </h3>
          <div className="w-16 h-1 bg-rose-500 mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-600"></div>
          </div>
        ) : catalogData.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-500 text-sm">Belum ada produk bunga yang ditambahkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {catalogData.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Foto Produk */}
                <div className="relative w-full h-64 bg-slate-100 overflow-hidden">
                  <img 
                    src={formatDriveUrl(item.image)} 
                    alt={item.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                {/* Detail Produk */}
                <div className="p-6 flex flex-col flex-grow justify-between text-left">
                  <div className="mb-4">
                    <h4 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-rose-600 transition-colors line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div>
                    <div className="text-xl font-black text-rose-600 mb-4">
                      {formatRupiah(item.price)}
                    </div>
                    <a
                      href={`https://wa.me/${phoneNumber}?text=Halo%20Yuri%20Florist,%20saya%20mau%20pesan%20${encodeURIComponent(item.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-emerald-500/10 transition-all duration-200"
                    >
                      💬 Pesan via WA
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer id="kontak" className="bg-white border-t border-slate-100 text-center py-8 px-4 text-sm text-slate-500">
        <p className="font-medium text-slate-700">Yuri Florist &copy; {new Date().getFullYear()}</p>
        <p className="text-xs text-slate-400 mt-1">Rangkaian Bunga Segar & Buket Cantik</p>
      </footer>

    </div>
  );
}
