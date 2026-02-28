import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Script from 'next/script';

// 1. DATA FETCHING SISI SERVER (IRIT REQUEST VERCEL)
export async function getStaticProps() {
  const { data: initialVideos } = await supabase
    .from('videos1')
    .select('*')
    .order('created_at', { ascending: false });

  return {
    props: {
      initialVideos: initialVideos || [],
    },
    // Update data setiap 60 detik (Sangat menghemat Edge Requests)
    revalidate: 60, 
  };
}

export default function Home({ initialVideos }) {
  const [videos, setVideos] = useState(initialVideos);
  const [filter, setFilter] = useState('terbaru');

  // 2. FUNGSI FILTER (TANPA REQUEST DATABASE LAGI)
  const handleFilter = (tipe) => {
    setFilter(tipe);
    const sorted = [...videos];
    if (tipe === 'terbaru') {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    setVideos(sorted);
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
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
          padding: 15px;
          max-width: 1300px;
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .video-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
        }
        .video-card {
          background: #0f0f0f;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #222;
          position: relative;
          transition: transform 0.2s;
        }
        .video-card:active { transform: scale(0.98); }
        .thumb-container {
          position: relative;
          aspect-ratio: 16/9;
          background: #000;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .play-icon {
          position: absolute;
          z-index: 2;
          font-size: 2.5rem;
          opacity: 0.9;
          text-shadow: 0 0 15px rgba(0,0,0,0.7);
        }
        .badge-new {
          position: absolute;
          top: 10px; left: 10px;
          background: #f00;
          color: #fff;
          padding: 3px 8px;
          border-radius: 5px;
          font-size: 0.7rem;
          font-weight: bold;
          z-index: 5;
        }
      `}</style>

      <div style={{ paddingBottom: '60px' }}>
        
        {/* LOGO */}
        <div style={{ textAlign: 'center', padding: '25px 0' }}>
          <img 
            src="/logo.png" 
            alt="CDNVIDUY" 
            style={{ height: '45px', cursor: 'pointer' }} 
            onClick={() => window.location.href = '/'} 
          />
        </div>

        {/* IKLAN ADSTERRA */}
        <Script src="https://pl28763278.effectivegatecpm.com/ee/04/09/ee040951564d0118f9c97849ba692abb.js" strategy="lazyOnload" />

        {/* TAB FILTER */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          <button onClick={() => handleFilter('terbaru')} style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', backgroundColor: filter === 'terbaru' ? '#f00' : '#222', color: '#fff', fontWeight: 'bold', fontSize: '14px' }}> ✨ Terbaru </button>
          <button onClick={() => handleFilter('abjad')} style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', backgroundColor: filter === 'abjad' ? '#f00' : '#222', color: '#fff', fontWeight: 'bold', fontSize: '14px' }}> 🔠 A-Z </button>
        </div>

        {/* GRID VIDEO */}
        <div className="video-grid">
          {videos.map((vid) => (
            <div key={vid.id} className="video-card">
              {isNew(vid.created_at) && <div className="badge-new">BARU</div>}

              <div className="thumb-container" onClick={() => window.location.href = `/${vid.videy_id}`}>
                {/* THUMBNAIL OTOMATIS (METADATA ONLY AGAR IRIT & MUNCUL GAMBAR) */}
                <video 
                  width="100%" 
                  preload="metadata" 
                  poster={`https://cdn.videy.co/${vid.videy_id}.mp4#t=0.5`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                >
                  <source src={`https://cdn.videy.co/${vid.videy_id}.mp4#t=0.5`} type="video/mp4" />
                </video>
                <div className="play-icon">▶️</div>
              </div>

              <div style={{ padding: '12px' }}>
                <h3 style={{ fontSize: '0.9rem', margin: '0 0 10px 0', height: '2.4rem', overflow: 'hidden', color: '#efefef', lineHeight: '1.2' }}>{vid.title}</h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`${window.location.origin}/${vid.videy_id}`);
                    alert("Link Berhasil Disalin!");
                  }} 
                  style={{ width: '100%', padding: '8px', backgroundColor: '#1e1e1e', color: '#888', border: '1px solid #333', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}
                >
                  🔗 Salin Link
                </button>
              </div>
            </div>
          ))}
        </div>

        <footer style={{ textAlign: 'center', marginTop: '60px', padding: '20px', borderTop: '1px solid #111', fontSize: '0.8rem', color: '#444' }}>
          <p>&copy; 2026 CDNVIDUY | Streaming Cepat & Irit Kuota</p>
        </footer>
      </div>
    </div>
  );
}
