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
    // Bagian Realtime Channel sudah dihapus total agar irit kuota
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
      <style jsx global>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background-color: #000 !important;
          color: #fff;
          overflow-x: hidden;
        }
        .video-card:hover {
          transform: translateY(-5px);
          transition: 0.3s;
          border-color: #f00 !important;
        }
        .play-overlay {
          background: rgba(0,0,0,0.4);
          transition: 0.3s;
        }
        .video-card:hover .play-overlay {
          background: rgba(0,0,0,0.1);
        }
      `}</style>

      <div style={{ padding: '20px', fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#000' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img 
            src="/logo.png" 
            alt="CDNVIDUY" 
            style={{ maxWidth: '200px', cursor: 'pointer' }} 
            onClick={() => window.location.href = '/'} 
          />
        </div>

        {/* Iklan Adsterra tetap jalan */}
        <Script src="https://pl28763278.effectivegatecpm.com/ee/04/09/ee040951564d0118f9c97849ba692abb.js" strategy="lazyOnload" />

        <div style={{ textAlign: 'center', marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button onClick={() => fetchVideos('terbaru')} style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', backgroundColor: filter === 'terbaru' ? '#f00' : '#222', color: '#fff', fontWeight: 'bold', transition: '0.3s' }}> ✨ Terbaru </button>
          <button onClick={() => fetchVideos('abjad')} style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', backgroundColor: filter === 'abjad' ? '#f00' : '#222', color: '#fff', fontWeight: 'bold', transition: '0.3s' }}> 🔠 A-Z </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', maxWidth: '1300px', margin: '0 auto' }}>
          {videos.map((vid) => (
            <div key={vid.id} className="video-card" style={{ border: '1px solid #222', padding: '12px', borderRadius: '15px', backgroundColor: '#0f0f0f', position: 'relative' }}>
              
              {isNew(vid.created_at) && (
                <span style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: '#f00', color: '#fff', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 10, boxShadow: '0 0 10px rgba(255,0,0,0.5)' }}> BARU </span>
              )}

              <div 
                style={{ 
                  borderRadius: '10px', 
                  overflow: 'hidden', 
                  backgroundColor: '#000', 
                  cursor: 'pointer', 
                  position: 'relative',
                  aspectRatio: '16/9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={() => window.location.href = `/${vid.videy_id}`}
              >
                <video 
                  width="100%" 
                  preload="metadata" 
                  muted
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
                >
                  <source src={`https://cdn.videy.co/${vid.videy_id}.mp4#t=0.5`} type="video/mp4" />
                </video>

                <div className="play-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '3.5rem', textShadow: '0 0 20px rgba(0,0,0,0.8)' }}>▶️</div>
                </div>
              </div>

              <h3 style={{ fontSize: '1rem', marginTop: '12px', marginBottom: '10px', height: '2.4rem', overflow: 'hidden', color: '#efefef', padding: '0 5px' }}>{vid.title}</h3>

              <button onClick={() => shareLink(vid.videy_id)} style={{ width: '100%', padding: '12px', backgroundColor: '#1e1e1e', color: '#aaa', border: '1px solid #333', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', transition: '0.3s' }}>
                🔗 Salin Link
              </button>
            </div>
          ))}
        </div>

        <footer style={{ textAlign: 'center', marginTop: '100px', padding: '40px', borderTop: '1px solid #111', fontSize: '0.85rem', color: '#444' }}>
          <div style={{ marginBottom: '15px' }}>
            <a href="/dmca" style={{ color: '#666', margin: '0 15px', textDecoration: 'none' }}>DMCA</a>
            <a href="/privacy" style={{ color: '#666', margin: '0 15px', textDecoration: 'none' }}>Privacy Policy</a>
          </div>
          <p>&copy; 2026 CDNVIDUY | Streaming Video Cepat & Gratis</p>
        </footer>
      </div>
    </div>
  );
}
