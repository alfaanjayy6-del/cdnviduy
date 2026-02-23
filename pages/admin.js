import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [bulkData, setBulkData] = useState('');
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [totalToday, setTotalToday] = useState(0);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // 1. Ambil data penonton hari ini saat pertama kali buka admin
    fetchTodayStats();

    // 2. Setup Realtime Presence (User Online & Log)
    const channel = supabase.channel('online-users', {
      config: { presence: { key: 'user' } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const presences = Object.values(state).flat();
        
        setOnlineUsers(presences.length);

        const activeLogs = presences
          .filter(p => p.pageTitle)
          .map(p => ({
            time: new Date().toLocaleTimeString(),
            title: p.pageTitle,
            id: p.user_id
          }));
        
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

    // 3. Realtime Update Angka "Today" jika ada perubahan di database
    const statsSub = supabase
      .channel('stats-changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'visitor_stats' }, 
        (payload) => {
          const todayStr = new Date().toISOString().split('T')[0];
          if (payload.new.view_date === todayStr) {
            setTotalToday(payload.new.total_views);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(statsSub);
    };
  }, []);

  const fetchTodayStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('visitor_stats')
      .select('total_views')
      .eq('view_date', today)
      .single();
    
    if (data) setTotalToday(data.total_views);
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
    <div style={{ padding: '20px', maxWidth: '850px', margin: 'auto', fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh', color: '#333' }}>
      
      {/* STATS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '15px', marginBottom: '20px' }}>
        
        {/* CARD LIVE ONLINE */}
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center', borderTop: '4px solid #28a745' }}>
          <h3 style={{ margin: 0, color: '#888', fontSize: '0.7rem' }}>LIVE ONLINE</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#28a745' }}>{onlineUsers}</div>
          <p style={{ fontSize: '0.6rem', color: '#999', margin: 0 }}>Pengunjung Aktif</p>
        </div>

        {/* CARD TOTAL HARI INI */}
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center', borderTop: '4px solid #007bff' }}>
          <h3 style={{ margin: 0, color: '#888', fontSize: '0.7rem' }}>VIEWS TODAY</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#007bff' }}>{totalToday}</div>
          <p style={{ fontSize: '0.6rem', color: '#999', margin: 0 }}>Total Penonton</p>
        </div>

        {/* LOG AKTIVITAS */}
        <div style={{ backgroundColor: '#111', padding: '15px', borderRadius: '15px', color: '#0f0', fontSize: '0.75rem', overflowY: 'auto', maxHeight: '130px', fontFamily: 'monospace' }}>
          <div style={{ borderBottom: '1px solid #333', marginBottom: '8px', paddingBottom: '5px', fontWeight: 'bold' }}>📡 LIVE ACTIVITY LOG</div>
          {logs.length === 0 && <div style={{ color: '#555' }}>Menunggu penonton...</div>}
          {logs.map((log, index) => (
            <div key={index} style={{ marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <span style={{ color: '#888' }}>[{log.time}]</span> <span style={{ color: '#fff' }}>{log.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FORM INPUT BULK */}
      <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>Bulk Add Video</h2>
        <textarea 
          rows="5" 
          placeholder="Judul | Link" 
          value={bulkData} 
          onChange={(e) => setBulkData(e.target.value)}
          style={{ width:'100%', marginBottom:'15px', padding:'12px', borderRadius:'10px', border:'1px solid #ddd', fontSize: '0.9rem' }} 
        />
        <button 
          onClick={simpanBanyak} 
          disabled={loading} 
          style={{ padding:'12px', width: '100%', backgroundColor: '#007bff', color:'white', border:'none', borderRadius:'10px', fontWeight:'bold', cursor: 'pointer' }}
        >
          {loading ? 'Menyimpan...' : 'SIMPAN SEMUA VIDEO'}
        </button>
      </div>
    </div>
  );
}
