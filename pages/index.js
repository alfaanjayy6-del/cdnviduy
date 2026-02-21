import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Script from 'next/script';

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      // Mengambil data dari tabel videos1 yang baru kita buat
      const { data } = await supabase
        .from('videos1')
        .select('*')
        .order('created_at', { ascending: false });
      setVideos(data || []);
    };
    fetchVideos();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#f00', marginBottom: '30px' }}>Video Stream</h1>
      
      {/* --- IKLAN ADSTERRA (Social Bar) --- */}
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
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', height: '2.5rem', overflow: 'hidden' }}>
              {vid.title}
            </h3>
            
            <div style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000' }}>
              <video 
                controls 
                width="100%" 
                style={{ display: 'block' }}
                poster="https://via.placeholder.com/400x225/000/fff?text=Play+Video"
              >
                {/* Link otomatis jadi cdnvidey sesuai rencana kita */}
                <source src={`https://cdnvidey.co.in/${vid.videy_id}.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#888' }}>
              Status: <span style={{ color: '#0f0' }}>Server Aktif</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer sederhana */}
      <footer style={{ textAlign: 'center', marginTop: '50px', padding: '20px', borderTop: '1px solid #333', fontSize: '0.9rem', color: '#666' }}>
        &copy; 2026 Video Stream - Powered by Vercel & Videy
      </footer>
    </div>
  );
}
