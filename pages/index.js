import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Script from 'next/script';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Mengambil URL dasar website otomatis
    setBaseUrl(window.location.origin);

    const fetchVideos = async () => {
      const { data } = await supabase
        .from('videos1')
        .select('*')
        .order('created_at', { ascending: false });
      setVideos(data || []);
    };
    fetchVideos();
  }, []);

  const shareLink = (videy_id) => {
    const fullLink = `${baseUrl}/${videy_id}`;
    navigator.clipboard.writeText(fullLink);
    alert("Link Video Berhasil Disalin! Siap dibagikan.");
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#f00', marginBottom: '30px', fontWeight: 'bold' }}>VIDEO STREAM</h1>
      
      {/* SCRIPT IKLAN ADSTERRA */}
      <Script 
        src="https://pl27333728.effectivegatecpm.com/e4/6a/bf/e46abf385099c2b5d894dbb1c522e30c.js" 
        strategy="lazyOnload" 
      />

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {videos.map((vid) => (
          <div key={vid.id} style={{ 
            border: '1px solid #333', 
            padding: '15px', 
            borderRadius: '12px', 
            backgroundColor: '#1a1a1a',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', height: '2.5rem', overflow: 'hidden' }}>
              {vid.title}
            </h3>
            
            <div style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000' }}>
              <video controls width="100%" poster="https://via.placeholder.com/400x225/000/fff?text=Nonton+Disini">
                <source src={`https://cdnvidey.co.in/${vid.videy_id}.mp4`} type="video/mp4" />
              </video>
            </div>

            {/* TOMBOL SHARE */}
            <button 
              onClick={() => shareLink(vid.videy_id)}
              style={{
                marginTop: '15px',
                padding: '10px',
                backgroundColor: '#f00',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>🔗</span> Salin Link Share
            </button>
          </div>
        ))}
      </div>

      {/* FOOTER BARU (DMCA & PRIVACY) */}
      <footer style={{ 
        textAlign: 'center', 
        marginTop: '80px', 
        padding: '30px', 
        borderTop: '1px solid #333', 
        fontSize: '0.85rem', 
        color: '#666' 
      }}>
        <div style={{ marginBottom: '15px' }}>
          <a href="/dmca" style={{ color: '#888', marginRight: '20px', textDecoration: 'none' }}>DMCA</a>
          <a href="/privacy" style={{ color: '#888', textDecoration: 'none' }}>Privacy Policy</a>
        </div>
        <p>&copy; 2026 Video Stream - Platform Streaming Masa Kini</p>
        <p style={{ fontSize: '0.7rem', marginTop: '5px' }}>Web ini tidak menyimpan file di server sendiri.</p>
      </footer>
    </div>
  );
}
