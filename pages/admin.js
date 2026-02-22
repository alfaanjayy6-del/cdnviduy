import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [bulkData, setBulkData] = useState('');
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);

  // FITUR REALTIME ONLINE USERS
  useEffect(() => {
    const channel = supabase.channel('online-users', {
      config: { presence: { key: 'user' } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        // Menghitung jumlah user yang terkoneksi
        const count = Object.keys(state).length;
        setOnlineUsers(count);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const simpanBanyak = async () => {
    if (!bulkData.trim()) return alert("Masukkan data dulu!");
    setLoading(true);

    const rows = bulkData.split('\n');
    const dataToInsert = [];

    for (let row of rows) {
      if (!row.includes('|')) continue;
      const [judul, url] = row.split('|').map(item => item.trim());
      let videoId = "";
      if (url.includes("?id=")) {
        videoId = new URL(url).searchParams.get("id");
      } else if (url.includes("videy.co/")) {
        videoId = url.split('/').pop().replace('.mp4', '');
      }

      if (videoId) {
        const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        dataToInsert.push({ title: judul, videy_id: videoId, slug: slug });
      }
    }

    if (dataToInsert.length === 0) {
      setLoading(false);
      return alert("Format salah! Gunakan: Judul | Link");
    }

    const { error } = await supabase.from('videos1').insert(dataToInsert);
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert(`${dataToInsert.length} Video Berhasil Ditambahkan!`);
      setBulkData('');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      
      {/* MONITOR REALTIME */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '30px', textAlign: 'center', borderTop: '4px solid #28a745' }}>
        <h3 style={{ margin: 0, color: '#666', fontSize: '1rem' }}>Pengunjung Online Saat Ini</h3>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#28a745', margin: '10px 0' }}>
          {onlineUsers}
        </div>
        <p style={{ fontSize: '0.8rem', color: '#999', margin: 0 }}>● Sedang aktif di website</p>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0 }}>Bulk Add Video</h2>
        <p style={{ fontSize: '0.8rem', color: '#666' }}>Format: <b>Judul | Link</b></p>
        
        <textarea 
          rows="8" 
          placeholder="Contoh:&#10;Video 1 | https://videy.co/v?id=xxx" 
          value={bulkData}
          onChange={(e) => setBulkData(e.target.value)}
          style={{ display:'block', width:'100%', marginBottom:'15px', padding:'10px', borderRadius:'8px', border:'1px solid #ddd' }}
        />

        <button 
          onClick={simpanBanyak} 
          disabled={loading}
          style={{ 
            padding:'12px 24px', 
            width: '100%',
            cursor: loading ? 'not-allowed' : 'pointer', 
            backgroundColor: loading ? '#ccc' : '#007bff', 
            color:'white', 
            border:'none',
            borderRadius:'6px',
            fontWeight:'bold'
          }}
        >
          {loading ? 'Sedang Menyimpan...' : 'Simpan Semua Video'}
        </button>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <a href="/" style={{ color: '#007bff', textDecoration: 'none', fontSize: '0.9rem' }}>← Kembali ke Beranda</a>
      </div>
    </div>
  );
}
