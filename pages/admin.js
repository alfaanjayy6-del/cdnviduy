
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [judul, setJudul] = useState('');
  const [url, setUrl] = useState('');

  const simpan = async () => {
    // Potong link otomatis: ambil ID setelah id=
    const videoId = new URL(url).searchParams.get("id");

    const { error } = await supabase
      .from('videos1')
      .insert([{ title: judul, videy_id: videoId, slug: judul.replace(/\s+/g, '-').toLowerCase() }]);

    if (error) alert("Gagal: " + error.message);
    else alert("Berhasil simpan video!");
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Panel Admin Video</h1>
      <input placeholder="Judul Video" onChange={(e) => setJudul(e.target.value)} /><br/>
      <input placeholder="Link Videy (Contoh: https://videy.co/v?id=xxx)" onChange={(e) => setUrl(e.target.value)} style={{ width: '300px' }} /><br/>
      <button onClick={simpan}>Simpan ke Database</button>
    </div>
  );
}
