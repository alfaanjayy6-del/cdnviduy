import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Script from 'next/script';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [baseUrl, setBaseUrl] = useState('');
  const [filter, setFilter] = useState('terbaru');

  useEffect(() => {
    setBaseUrl(window.location.origin);
    fetchVideos('terbaru');

    // --- FITUR TRACKING REALTIME ---
    const channel = supabase.channel('online-users', {
      config: { presence: { key: 'user' } },
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ 
          online_at: new Date().toISOString(), 
          page: 'home',
          pageTitle: 'Beranda'
        });
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchVideos = async (tipe) => {
    let query = supabase.from('videos1').select('*');
    
    if (tipe === 'terbaru') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('title', { ascending: true });
    }

    const { data } = await query;
    setVideos(data || []);
    setFilter(tipe);
  };

  const shareLink = (videy_id) => {
    const fullLink = `${baseUrl}/${videy_id}`;
    navigator.clipboard.writeText(fullLink);
    alert("Link Video Berhasil Disalin!");
  };

  const isNew = (timestamp) => {
    const now = new Date();
    const uploaded = new Date(timestamp);
    const diffInHours = (now - uploaded) / (1000 * 60 * 60);
    return diffInHours < 24;
  };

  return (
    <div className="main-wrapper">
      {/* CSS GLOBAL UNTUK HAPUS BINGKAI PUTIH */}
      <style jsx global>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background-color: #000 !important;
          color: #fff;
          overflow-x: hidden;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>

      <div style={{ padding: '20px', fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#000' }}>
        
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img 
            src="/logo.png" 
            alt="CDNVIDUY" 
            style={{ maxWidth: '200px', cursor: 'pointer' }} 
            onClick={() => window.location.href = '/'} 
          />
        </div>

        <Script src="https://pl28763278.effectivegatecpm.com/ee/04/09/ee040951564d0118f9c97849ba692abb.js" strategy="lazyOnload" />

        {/* Tombol Filter */}
        <div style={{ textAlign: 'center', marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button 
            onClick={() => fetchVideos('terbaru')}
            style={{ 
              padding: '8px 15px', 
              borderRadius: '20px', 
              border: 'none', 
              cursor: 'pointer', 
              backgroundColor: filter === 'terbaru' ? '#f00' : '#333', 
              color: '#fff',
              fontWeight: 'bold' 
            }}
          >
            ✨ Terbaru
          </button>
          <button 
            onClick={() => fetchVideos('abjad')}
            style={{ 
              padding: '8px 15px', 
              borderRadius: '20px', 
              border: 'none', 
              cursor: 'pointer', 
              backgroundColor: filter === 'abjad' ? '#f00' : '#333', 
              color: '#fff',
              fontWeight: 'bold' 
            }}
          >
            🔠 A-Z
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          {videos.map((vid) => (
            <div key={vid.id} style={{ border: '1px solid #333', padding: '15px', borderRadius: '12px', backgroundColor: '#1a1a1a', position: 'relative' }}>
              
              {isNew(vid.created_at) && (
                <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#f00', color: '#fff', padding: '2px 8px', borderRadius: '5px', fontSize: '0.7rem', fontWeight: 'bold', zIndex: 1 }}>
                  NEW
                </span>
              )}

              <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', height: '2.5rem', overflow: 'hidden', color: '#fff' }}>{vid.title}</h3>
              
              <div 
                style={{ borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000', cursor: 'pointer' }}
                onClick={() => window.location.href = `/${vid.videy_id}`}
              >
                {/* Kita pakai video preview tanpa autoplay agar tidak berat */}
                <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', backgroundColor: '#000' }}>
                   <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '3rem', zIndex: 1 }}>▶️</div>
                </div>
              </div>

              <button onClick={() => shareLink(vid.videy_id)} style={{ marginTop: '15px', width: '100%', padding: '10px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                🔗 Salin Link Share
              </button>
            </div>
          ))}
        </div>

        <footer style={{ textAlign: 'center', marginTop: '80px', padding: '30px', borderTop: '1px solid #333', fontSize: '0.85rem', color: '#666' }}>
          <a href="/dmca" style={{ color: '#888', marginRight: '20px', textDecoration: 'none' }}>DMCA</a>
          <a href="/privacy" style={{ color: '#888', textDecoration: 'none' }}>Privacy Policy</a>
          <p>&copy; 2026 CDNVIDUY</p>
        </footer>
      </div>

      <style jsx>{`
        .main-wrapper {
          background-color: #000;
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}
