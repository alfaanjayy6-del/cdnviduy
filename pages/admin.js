import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [bulkData, setBulkData] = useState('');
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const channel = supabase.channel('online-users', {
      config: { presence: { key: 'user' } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const presences = Object.values(state).flat();
        
        // Update jumlah user online
        setOnlineUsers(presences.length);

        // Update Log Aktivitas (mengambil info dari metadata presence)
        const activeLogs = presences
          .filter(p => p.pageTitle) // Hanya ambil yang ada judul videonya
          .map(p => ({
            time: new Date().toLocaleTimeString(),
            title: p.pageTitle,
            id: p.user_id
          }));
        
        // Simpan 10 log terbaru agar tidak penuh
        setLogs(activeLogs.slice(-10).reverse());
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
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
      if (url.includes("?id=")) videoId = new URL(url).searchParams.get("id");
      else if (url.includes("videy.co/")) videoId = url.split('/').pop().replace('.mp4', '');
      if (videoId) {
        const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        dataToInsert.push({ title: judul, videy_id: videoId, slug: slug });
      }
    }
    const { error } = await supabase.from('videos1').insert(dataToInsert);
    if (error) alert("Error: " + error.message);
    else { alert("Berhasil!"); setBulkData(''); }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto', fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh', color: '#333' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '20px' }}>
        {/* ANGKA ONLINE */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#888', fontSize: '0.8rem' }}>LIVE</h3>
          <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#28a745' }}>{onlineUsers}</div>
          <p style={{ fontSize: '0.7rem', color: '#999', margin: 0 }}>User Online</p>
        </div>

        {/* LOG AKTIVITAS */}
        <div style={{ backgroundColor: '#111', padding: '15px', borderRadius: '15px', color: '#0f0', fontSize: '0.8rem', overflowY: 'auto', maxHeight: '160px', fontFamily: 'monospace' }}>
          <div style={{ borderBottom: '1px solid #333', marginBottom: '10px', paddingBottom: '5px', fontWeight: 'bold' }}>📡 LIVE ACTIVITY LOG</div>
          {logs.length === 0 && <div style={{ color: '#555' }}>Menunggu penonton...</div>}
          {logs.map((log, index) => (
            <div key={index} style={{ marginBottom: '4px' }}>
              <span style={{ color: '#888' }}>[{log.time}]</span> Seseorang menonton: <span style={{ color: '#fff' }}>{log.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FORM INPUT BULK */}
      <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.2rem' }}>Bulk Add Video</h2>
        <textarea rows="5" placeholder="Judul | Link" value={bulkData} onChange={(e) => setBulkData(e.target.value)}
          style={{ width:'100%', marginBottom:'15px', padding:'12px', borderRadius:'10px', border:'1px solid #ddd' }} />
        <button onClick={simpanBanyak} disabled={loading} style={{ padding:'12px', width: '100%', backgroundColor: '#007bff', color:'white', border:'none', borderRadius:'10px', fontWeight:'bold', cursor: 'pointer' }}>
          {loading ? 'Menyimpan...' : 'SIMPAN VIDEO'}
        </button>
      </div>
    </div>
  );
}
