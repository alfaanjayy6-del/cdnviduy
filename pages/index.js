import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Script from 'next/script';

// 1. Ambil data di sisi Server (Hanya jalan sekali-kali, bukan tiap orang datang)
export async function getStaticProps() {
  const { data: initialVideos } = await supabase
    .from('videos1')
    .select('*')
    .order('created_at', { ascending: false });

  return {
    props: {
      initialVideos: initialVideos || [],
    },
    // REVALIDATE: Web cuma update data tiap 60 detik (Sangat menghemat Request!)
    revalidate: 60, 
  };
}

export default function Home({ initialVideos }) {
  const [videos, setVideos] = useState(initialVideos);
  const [filter, setFilter] = useState('terbaru');

  // Fungsi filter di sisi client (Tanpa Request Database lagi kalau datanya sudah ada)
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

  const shareLink = (videy_id) => {
    const fullLink = `${window.location.origin}/${videy_id}`;
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
      `}</style>

      <div style={{ padding: '20px', fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#000' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src="/logo.png" alt="CDNVIDUY" style={{ maxWidth: '200px', cursor: 'pointer' }} onClick={() => window.location.href = '/'} />
        </div>

        <Script src="https://pl28763278.effectivegatecpm.com/ee/04/09/ee040951564d0118f9c97849ba692abb.js" strategy="lazyOnload" />

        <div style={{ textAlign: 'center', marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button onClick={() => handleFilter('terbaru')} style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', backgroundColor: filter === 'terbaru' ? '#f00' : '#222', color: '#fff', fontWeight: 'bold' }}> ✨ Terbaru </button>
          <button onClick={() => handleFilter('abjad')} style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', backgroundColor: filter === 'abjad' ? '#f00' : '#222', color: '#fff', fontWeight: 'bold' }}> 🔠 A-Z </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', maxWidth: '1300px', margin: '0 auto' }}>
          {videos.map((vid) => (
            <div key={vid.id} className="video-card" style={{ border: '1px solid #222', padding: '12px', borderRadius: '15px', backgroundColor: '#0f0f0f', position: 'relative' }}>
              {isNew(vid.created_at) && (
                <span style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: '#f00', color: '#fff', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 10 }}> BARU </span>
              )}

              <div style={{ borderRadius: '10px', overflow: 'hidden', backgroundColor: '#000', cursor: 'pointer', position: 'relative', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => window.location.href = `/${vid.videy_id}`}>
                <video width="100%" preload="metadata" muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}>
                  <source src={`https://cdn.videy.co/${vid.videy_id}.mp4#t=0.5`} type="video/mp4" />
                </video>
                <div style={{ position: 'absolute', zIndex: 2, fontSize: '3.5rem' }}>▶️</div>
              </div>

              <h3 style={{ fontSize: '1rem', marginTop: '12px', marginBottom: '10px', height: '2.4rem', overflow: 'hidden', color: '#efefef' }}>{vid.title}</h3>

              <button onClick={() => shareLink(vid.videy_id)} style={{ width: '100%', padding: '12px', backgroundColor: '#1e1e1e', color: '#aaa', border: '1px solid #333', borderRadius: '10px', cursor: 'pointer' }}>
                🔗 Salin Link
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
