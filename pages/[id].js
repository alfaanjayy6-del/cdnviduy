import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Player() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    // 1. Reset Urutan Klik setiap kali ganti video (pindah ID) agar cuan mulai dari awal
    localStorage.setItem('download_step', '0');

    // 2. Ambil Judul Video untuk Metadata (Admin Log)
    const fetchVideoInfo = async () => {
      const { data } = await supabase
        .from('videos1')
        .select('title')
        .eq('videy_id', id)
        .single();
      
      if (data) {
        document.title = data.title;
      }
    };

    fetchVideoInfo();

    // 3. Fitur Tracking Realtime ke Admin
    const channel = supabase.channel('online-users', {
      config: { presence: { key: 'user' } },
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ 
          online_at: new Date().toISOString(), 
          page: id,
          pageTitle: document.title || "Watching Video",
          user_id: Math.random().toString(36).substring(7) 
        });
      }
    });

    // 4. Fitur Keamanan: Anti Klik Kanan & Inspect
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || (e.ctrlKey && e.keyCode === 85)) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      supabase.removeChannel(channel); 
      // Bersihkan data saat meninggalkan halaman
      localStorage.removeItem('download_step');
    };
  }, [id]);

  if (!id) return null;

  // 5. Logika Download 4 Tahap
  const handleDownload = () => {
    // Ambil langkah klik saat ini dari memori browser
    let currentStep = parseInt(localStorage.getItem('download_step') || '0');
    
    const linkAdsterra = 'https://www.effectivegatecpm.com/u88ksn21bi?key=466e5edc4b150634636ec85f6be789c3';
    
    const affiliateLinks = [
      'https://s.shopee.co.id/7fUZHYXISz', 
      'https://s.shopee.co.id/AUokejQPcI'
    ];

    // Tambah hitungan klik
    currentStep++;
    localStorage.setItem('download_step', currentStep.toString());

    if (currentStep === 1) {
      // KLIK PERTAMA: Adsterra
      window.open(linkAdsterra, '_blank');
    } 
    else if (currentStep === 2 || currentStep === 3) {
      // KLIK KEDUA & KETIGA: Acak Shopee
      const randomIndex = Math.floor(Math.random() * affiliateLinks.length);
      window.open(affiliateLinks[randomIndex], '_blank');
    } 
    else {
      // KLIK KEEMPAT: Download Video Asli
      window.location.href = `https://cdnvidey.co.in/${id}.mp4`;
      // Reset ke 0 jika ingin pengunjung bisa mendownload ulang dengan proses yang sama
      localStorage.setItem('download_step', '0');
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Script Iklan Adsterra */}
      <Script 
        src="https://pl28763278.effectivegatecpm.com/ee/04/09/ee040951564d0118f9c97849ba692abb.js" 
        strategy="lazyOnload" 
      />

      <div style={{ width: '100%', maxWidth: '900px', padding: '10px' }}>
        <video 
          controls 
          controlsList="nodownload" 
          autoPlay 
          style={{ width: '100%', borderRadius: '8px', boxShadow: '0 0 20px rgba(255,0,0,0.1)' }}
        >
          <source src={`https://cdnvidey.co.in/${id}.mp4`} type="video/mp4" />
        </video>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button 
            onClick={handleDownload}
            style={{
              padding: '15px 40px',
              fontSize: '1.1rem',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(40, 167, 69, 0.4)',
              transition: '0.3s'
            }}
          >
            📥 DOWNLOAD VIDEO SEKARANG
          </button>
        </div>
      </div>

      <style jsx global>{`
        body { margin: 0; background-color: #000; font-family: sans-serif; }
        button:hover { transform: scale(1.05); background-color: #218838 !important; }
      `}</style>
    </div>
  );
}
