import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [bulkData, setBulkData] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalToday, setTotalToday] = useState(0);

  useEffect(() => {
    // Ambil stats hari ini saat buka admin
    fetchTodayStats();
    
    // Interval refresh stats setiap 1 menit (Irit Request daripada Realtime)
    const interval = setInterval(fetchTodayStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchTodayStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    // Mengambil dari tabel daily_stats (sesuai SQL yang kita jalankan tadi)
    const { data } = await supabase
      .from('daily_stats')
      .select('v_count')
      .eq('d_date', today)
      .single();
    
    if (data) setTotalToday(data.v_count);
  };

  const simpanBanyak = async () => {
    if (!bulkData.trim()) return alert("Masukkan data dulu!");
    setLoading(true);
    const rows = bulkData.split('\n');
    const dataToInsert = [];
    
    for (let row of rows) {
      if (!row.includes('|')) continue;
      const [judul, url] = row.split('|').map(item => item.trim());
      let videoId = "";
      
      // Deteksi ID dari berbagai link Videy
      if (url.includes("?id=")) videoId = new URL(url).searchParams.get("id");
      else if (url.includes("videy.co/")) videoId = url.split('/').pop().replace('.mp4', '');
      
      if (videoId) {
        const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        dataToInsert.push({ 
          title: judul, 
          videy_id: videoId, 
          slug: slug,
          kategori: 'umum' // Default kategori
        });
      }
    }

    const { error } = await supabase.from('videos1').insert(dataToInsert);
    
    if (error) {
      alert("Error: " + error.message);
    } else { 
      alert("Berhasil simpan " + dataToInsert.length + " video!"); 
      setBulkData(''); 
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '850px', margin: 'auto', fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh', color: '#333' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
         <h1 style={{ fontSize: '1.5rem', color: '#007bff' }}>CDNVIDUY ADMIN PANEL</h1>
         <p style={{ fontSize: '0.8rem', color: '#888' }}>Rumah Baru - Versi Irit Request</p>
      </div>

      {/* STATS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        
        {/* CARD TOTAL HARI INI */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center', borderTop: '4px solid #007bff' }}>
          <h3 style={{ margin: 0, color: '#888', fontSize: '0.8rem', letterSpacing: '1px' }}>VIEWS TODAY</h3>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#007bff', margin: '10px 0' }}>{totalToday}</div>
          <p style={{ fontSize: '0.7rem', color: '#999', margin: 0 }}>Berdasarkan Database Baru</p>
        </div>

        {/* INFO CARD */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center', borderTop: '4px solid #ffc107' }}>
          <h3 style={{ margin: 0, color: '#888', fontSize: '0.8rem', letterSpacing: '1px' }}>STATUS SERVER</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745', margin: '20px 0' }}>● ONLINE</div>
          <p style={{ fontSize: '0.7rem', color: '#999', margin: 0 }}>Realtime Disabled (Hemat Kuota)</p>
        </div>
      </div>

      {/* FORM INPUT BULK */}
      <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.1rem', marginBottom: '15px' }}>🚀 Tambah Banyak Video Sekaligus</h2>
        <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '10px' }}>Format: <b>Judul Video | Link Videy</b> (Gunakan baris baru untuk video berikutnya)</p>
        <textarea 
          rows="8" 
          placeholder="Contoh:&#10;Video Mantap 1 | https://videy.co/v?id=abcd&#10;Video Mantap 2 | https://cdn.videy.co/xyz.mp4" 
          value={bulkData} 
          onChange={(e) => setBulkData(e.target.value)}
          style={{ width:'100%', marginBottom:'15px', padding:'15px', borderRadius:'10px', border:'1px solid #ddd', fontSize: '0.9rem', outlineColor: '#007bff', boxSizing: 'border-box' }} 
        />
        <button 
          onClick={simpanBanyak} 
          disabled={loading} 
          style={{ padding:'15px', width: '100%', backgroundColor: '#007bff', color:'white', border:'none', borderRadius:'10px', fontWeight:'bold', cursor: 'pointer', fontSize: '1rem', transition: '0.3s' }}
        >
          {loading ? 'Sedang Memproses...' : 'PROSES & SIMPAN KE DATABASE'}
        </button>
      </div>

      <footer style={{ textAlign: 'center', marginTop: '40px', color: '#bbb', fontSize: '0.75rem' }}>
        Monitoring via Histats lebih akurat untuk trafik tinggi.
      </footer>
    </div>
  );
}
