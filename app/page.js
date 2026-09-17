'use client';

import { useState, useEffect } from 'react';
import { supabase, formatDriveUrl } from '@/lib/supabase';

export default function Home() {
  const [catalogData, setCatalogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const phoneNumber = "6281234567890"; // Ganti dengan nomor WA Toko

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

  return (
    <div className="min-h-screen bg-rose-50/30 text-gray-800 font-sans">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wider text-pink-600">
          Yuri <span className="text-gray-800">Florist</span>
        </h1>
        <nav className="flex items-center gap-6 font-medium text-sm">
          <a href="#home" className="hover:text-pink-600 transition-colors">Beranda</a>
          <a href="#katalog" className="hover:text-pink-600 transition-colors">Katalog</a>
          <a href="/admin" className="text-xs bg-pink-50 border border-pink-200 text-pink-600 hover:bg-pink-100 px-3 py-1.5 rounded-full transition-colors">
            Panel Admin
          </a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="py-16 px-4 text-center bg-gradient-to-b from-pink-100/50 to-transparent">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">
          Bunga Indah untuk Momen Spesial Anda
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base mb-6">
          Temukan berbagai pilihan buket bunga segar dengan desain cantik dan kualitas terbaik.
        </p>
      </section>

      {/* KATALOG SECTION */}
      <main id="katalog" className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-bold inline-block relative after:content-[''] after:block after:w-12 after:h-1 after:bg-pink-500 after:mx-auto after:mt-2 after:rounded">
            Katalog Bunga
          </h3>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-12">Memuat katalog bunga...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {catalogData.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative w-full h-60 bg-gray-100">
                  <img 
                    src={formatDriveUrl(item.image)} 
                    alt={item.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-5 flex flex-col flex-grow justify-between text-center">
                  <div>
                    <h4 className="font-bold text-lg mb-2">{item.name}</h4>
                    <p className="text-xs text-gray-600 mb-4">{item.description}</p>
                  </div>

                  <div>
                    <div className="font-semibold text-base mb-3 text-pink-600">{item.price}</div>
                    <a
                      href={`https://wa.me/${phoneNumber}?text=Halo%20Yuri%20Florist,%20saya%20mau%20pesan%20${encodeURIComponent(item.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors"
                    >
                      Pesan via WA
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer id="kontak" className="bg-white border-t text-center py-8 px-4 mt-12 text-sm">
        <p className="font-semibold">Yuri Florist &copy; {new Date().getFullYear()} - All Rights Reserved</p>
      </footer>

    </div>
  );
}