import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Script from 'next/script';

export async function getStaticProps() {
  const { data: initialVideos } = await supabase
    .from('videos1')
    .select('*')
    .order('created_at', { ascending: false });

  return {
    props: { initialVideos: initialVideos || [] },
    revalidate: 60, 
  };
}

export default function Home({ initialVideos }) {
  const [videos, setVideos] = useState(initialVideos);
  const [filter, setFilter] = useState('terbaru');

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

  return (
    <div className="main-wrapper">
      <style jsx global>{`
        html, body {
          margin: 0; padding: 0;
          background-color: #000; color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
          padding: 15px;
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .video-grid { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
        }
        .video-card {
          background: #111;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #222;
        }
        .thumb-container {
          position: relative;
          aspect-ratio: 16/9;
          background: #000;
          cursor: pointer;
        }
        .play-btn {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2.5rem;
          z-index: 2;
          opacity: 0.8;
        }
      `}</style>

      <div style={{ paddingBottom: '50px' }}>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '40px', cursor: 'pointer' }} onClick={() => window.location.href = '/'} />
        </div>

        <Script src="https://pl28763278.effectivegatecpm.com/ee/04/09/ee040951564d0118f9c97849ba692abb.js" strategy="afterInteractive" />

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
          <button onClick={() => handleFilter('terbaru')} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: filter === 'terbaru' ? '#f00' : '#222', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>Terbaru</button>
          <button onClick={() => handleFilter('abjad')} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: filter === 'abjad' ? '#f00' : '#222', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>A-Z</button>
        </div>

        <div className="video-grid">
          {videos.map((vid) => (
            <div key={vid.id} className="video-card">
              <div className="thumb-container" onClick={() => window.location.href = `/${vid.videy_id}`}>
                {/* PRELOAD NONE: Rahasia agar web terasa ringan saat pertama dibuka */}
                <video 
                  width="100%" 
                  preload="none" 
                  poster={`https://cdn.videy.co/${vid.videy_id}.mp4#t=0.5`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                >
                  <source src={`https://cdn.videy.co/${vid.videy_id}.mp4#t=0.5`} type="video/mp4" />
                </video>
                <div className="play-btn">▶️</div>
              </div>
              <div style={{ padding: '10px' }}>
                <h3 style={{ fontSize: '0.85rem', margin: '0 0 8px 0', height: '2.4rem', overflow: 'hidden', lineHeight: '1.2' }}>{vid.title}</h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`${window.location.origin}/${vid.videy_id}`);
                    alert("Salin Berhasil!");
                  }} 
                  style={{ width: '100%', background: '#222', color: '#ccc', border: 'none', padding: '6px', borderRadius: '5px', fontSize: '12px', cursor: 'pointer' }}
                >
                  🔗 Link
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
