import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await supabase.from('videos1').select('*').order('created_at', { ascending: false });
      setVideos(data || []);
    };
    fetchVideos();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#f00' }}>My Streaming Video</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {videos.map((vid) => (
          <div key={vid.id} style={{ border: '1px solid #333', padding: '10px', borderRadius: '8px' }}>
            <h3>{vid.title}</h3>
            <video controls width="100%" poster="https://via.placeholder.com/400x225/000/fff?text=Loading+Video...">
              <source src={`https://cdnvidey.co.in/${vid.videy_id}.mp4`} type="video/mp4" />
              Browser tidak mendukung video.
            </video>
            {/* Iklan Adsterra Social Bar bisa ditaruh di bawah sini nanti */}
          </div>
        ))}
      </div>
    </div>
  );
}
