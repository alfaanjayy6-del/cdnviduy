import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [bulkData, setBulkData] = useState('');
  const [loading, setLoading] = useState(false);

  const simpanBanyak = async () => {
    if (!bulkData.trim()) return alert("Masukkan data dulu!");
    setLoading(true);

    const rows = bulkData.split('\n'); // Membagi per baris
    const dataToInsert = [];

    for (let row of rows) {
      if (!row.includes('|')) continue; // Format: Judul | Link

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
    <div style={{ padding: '40px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2>Bulk Add Video (Tambah Banyak)</h2>
      <p style={{ fontSize: '0.8rem', color: '#666' }}>
        Format: <b>Judul Video | Link Videy</b> (Satu video per baris)
      </p>
      
      <textarea 
        rows="10" 
        placeholder="Contoh:&#10;Video Lucu 1 | https://videy.co/v?id=xxx&#10;Film Keren 2 | https://videy.co/v?id=yyy" 
        value={bulkData}
        onChange={(e) => setBulkData(e.target.value)}
        style={{ display:'block', width:'100%', marginBottom:'15px', padding:'10px', borderRadius:'8px', border:'1px solid #ccc' }}
      />

      <button 
        onClick={simpanBanyak} 
        disabled={loading}
        style={{ 
          padding:'12px 24px', 
          cursor: loading ? 'not-allowed' : 'pointer', 
          backgroundColor: loading ? '#ccc' : '#28a745', 
          color:'white', 
          border:'none',
          borderRadius:'6px',
          fontWeight:'bold'
        }}
      >
        {loading ? 'Sedang Menyimpan...' : 'Simpan Semua Video'}
      </button>

      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ color: '#007bff', textDecoration: 'none' }}>← Kembali ke Halaman Depan</a>
      </div>
    </div>
  );
}
