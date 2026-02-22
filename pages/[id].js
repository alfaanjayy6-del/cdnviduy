import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Player() {
  const router = useRouter();
  const { id } = router.query;
  const [videoTitle, setVideoTitle] = useState('Loading...');

  useEffect(() => {
    if (!id) return;

    // 1. AMBIL JUDUL VIDEO DARI DATABASE
    const fetchVideoInfo = async () => {
      const { data } = await supabase
        .from('videos1')
        .select('title')
        .eq('videy_id', id)
        .single();
      
      if (data) {
        setVideoTitle(data.title);
        // Set document title agar bisa dibaca oleh sistem tracking
        document.title = data.title;
      }
    };

    fetchVideoInfo();

    // 2. FITUR TRACKING REALTIME (Kirim Judul ke Admin)
    const channel = supabase.channel('online-users', {
      config: { presence: { key: 'user' } },
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Mengirim metadata ke panel admin termasuk judul video
        await channel.track({ 
          online_at: new Date().toISOString(), 
          page: id,
          pageTitle: document.title || "Watching Video",
          user_id: Math.random().toString(36).substring(7) 
        });
      }
    });

    // 3. Fitur Keamanan: Anti Klik Kanan & Inspect
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
    };
  }, [id]);

  if (!id) return null;

  const handleDownload = () => {
    window.open('https://www.effectivegatecpm.com/u88ksn21bi?key=466e5edc4b150634636ec85f6be789c3', '_blank');
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      
      {/* IKLAN ADSTERRA */}
      <Script 
        src="https://pl28763278.effectivegatecpm.com/ee/04/09/ee040951564d0118f9c97849ba692abb.js" 
        strategy="lazyOnload" 
      />

      <div style={{ width: '100%', maxWidth: '900px', padding: '10px' }}>
        <h1 style={{ fontSize: '1.2rem', marginBottom: '15px', textAlign: 'center' }}>{videoTitle}</h1>
        
        {/* PLAYER VIDEO */}
        <video 
          controls 
          controlsList="nodownload" 
          autoPlay 
          style={{ width: '100%', borderRadius: '8px', boxShadow: '0 0 20px rgba(255,0,0,0.2)' }}
        >
          <source src={`https://cdnvidey.co.in/${id}.mp4`} type="video/mp4" />
        </video>

        {/* TOMBOL DOWNLOAD */}
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
