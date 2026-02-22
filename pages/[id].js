import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Tambahkan import ini

export default function Player() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // 1. FITUR TRACKING REALTIME (Agar muncul di Admin)
    const channel = supabase.channel('online-users', {
      config: { presence: { key: 'user' } },
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ online_at: new Date().toISOString(), page: id });
      }
    });

    // 2. Fitur Keamanan: Anti Klik Kanan & Inspect
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
      supabase.removeChannel(channel); // Tutup koneksi saat pindah halaman
    };
  }, [id]);

  if (!id) return null;

  const handleDownload = () => {
    window.open('https://www.effectivegatecpm.com/u88ksn21bi?key=466e5edc4b150634636ec85f6be789c3', '_blank');
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* IKLAN ADSTERRA (Social Bar) */}
      <Script 
        src="https://pl28763278.effectivegatecpm.com/ee/04/09/ee040951564d0118f9c97849ba692abb.js" 
        strategy="lazyOnload" 
      />

      <div style={{ width: '100%', maxWidth: '900px', padding: '10px' }}>
        {/* PLAYER VIDEO */}
        <video 
          controls 
          controlsList="nodownload" 
          autoPlay 
          style={{ width: '100%', borderRadius: '8px', boxShadow: '0 0 20px rgba(255,0,0,0.2)' }}
        >
          <source src={`https://cdnvidey.co.in/${id}.mp4`} type="video/mp4" />
        </video>

        {/* TOMBOL DOWNLOAD DI BAWAH VIDEO */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
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
          
          <p style={{ color: '#555', fontSize: '0.8rem', marginTop: '10px' }}>
            Klik tombol di atas untuk mengunduh dengan kecepatan tinggi
          </p>
        </div>
      </div>

      <style jsx global>{`
        body { margin: 0; background-color: #000; font-family: sans-serif; }
        button:hover { transform: scale(1.05); background-color: #218838 !important; }
      `}</style>
    </div>
  );
}
