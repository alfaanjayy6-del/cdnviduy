import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [bulkData, setBulkData] = useState('');
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);

  // FITUR MONITORING REALTIME
  useEffect(() => {
    const channel = supabase.channel('online-users', {
      config: { presence: { key: 'user' } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        // Menghitung semua koneksi aktif secara mendalam
        const totalConnections = Object.values(state).flat().length;
        setOnlineUsers(totalConnections);
        console.log('Update Presence:', state);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Admin ikut masuk ke sistem pelacakan dengan ID unik
          await channel.track({ 
            online_at: new Date().toISOString(),
            user_id: 'admin-' + Math.random().toString(36).substring(7),
            role: 'admin'
          });
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
    <div style={{ padding: '40px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh', color: '#333' }}>
      
      {/* KOTAK MONITOR ONLINE */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', marginBottom: '30px', textAlign: 'center', borderTop: '5px solid #28a745' }}>
        <h3 style={{ margin: 0, color: '#888', fontSize: '0.9rem', uppercase: 'true' }}>LIVE STREAMING MONITOR</h3>
        <div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#28a745', lineHeight: '1' }}>
          {onlineUsers}
        </div>
        <p style={{ fontSize: '0.8rem', color: '#28a745', margin: '10px 0 0', fontWeight: 'bold' }}>● USER SEDANG ONLINE</p>
      </div>

      {/* FORM INPUT BULK */}
      <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.2rem' }}>Tambah Video Masal</h2>
        <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '15px' }}>Format penulisan: <b>Judul Video | Link Videy</b></p>
        
        <textarea 
          rows="8" 
          placeholder="Contoh:&#10;Video Viral 1 | https://videy.co/v?id=abc&#10;Video Viral 2 | https://videy.co/v?id=xyz" 
          value={bulkData}
          onChange={(e) => setBulkData(e.target.value)}
          style={{ display:'block', width:'100%', marginBottom:'20px', padding:'12px', borderRadius:'10px', border:'1px solid #ddd', fontSize: '0.9rem', outline: 'none' }}
        />

        <button 
          onClick={simpanBanyak} 
          disabled={loading}
          style={{ 
            padding:'15px', 
            width: '100%',
            cursor: loading ? 'not-allowed' : 'pointer', 
            backgroundColor: loading ? '#ccc' : '#007bff', 
            color:'white', 
            border:'none',
            borderRadius:'10px',
            fontWeight:'bold',
            fontSize: '1rem',
            transition: '0.3s'
          }}
        >
          {loading ? 'Menyimpan ke Database...' : 'SIMPAN SEMUA VIDEO'}
        </button>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <a href="/" style={{ color: '#007bff', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold' }}>← Kembali ke Dashboard Utama</a>
      </div>
    </div>
  );
}
