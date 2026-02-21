import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [judul, setJudul] = useState('');
  const [url, setUrl] = useState('');

  const simpan = async () => {
    try {
      const videoId = new URL(url).searchParams.get("id");
      if (!videoId) return alert("Link Videy tidak valid!");

      const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const { error } = await supabase
        .from('videos1')
        .insert([{ title: judul, videy_id: videoId, slug: slug }]);

      if (error) throw error;
      alert("Video Berhasil Ditambahkan!");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: 'auto' }}>
      <h2>Tambah Video Baru</h2>
      <input placeholder="Judul Video" onChange={(e) => setJudul(e.target.value)} style={{ display:'block', width:'100%', marginBottom:'10px', padding:'10px' }} />
      <input placeholder="Link Videy (https://videy.co/v?id=...)" onChange={(e) => setUrl(e.target.value)} style={{ display:'block', width:'100%', marginBottom:'10px', padding:'10px' }} />
      <button onClick={simpan} style={{ padding:'10px 20px', cursor:'pointer', backgroundColor:'green', color:'white', border:'none' }}>Simpan Video</button>
      <br/><br/>
      <a href="/">Ke Halaman Depan</a>
    </div>
  );
}
