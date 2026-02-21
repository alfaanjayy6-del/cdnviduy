import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function BulkShare() {
  const [videos, setVideos] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [baseUrl, setBaseUrl] = useState('');
  const [resultText, setResultText] = useState('');
  
  // State baru untuk opsi format
  const [includeTitle, setIncludeTitle] = useState(true);

  useEffect(() => {
    setBaseUrl(window.location.origin);
    const fetchVideos = async () => {
      const { data } = await supabase
        .from('videos1')
        .select('*')
        .order('created_at', { ascending: false });
      setVideos(data || []);
    };
    fetchVideos();
  }, []);

  const toggleSelect = (videy_id) => {
    if (selectedIds.includes(videy_id)) {
      setSelectedIds(selectedIds.filter(id => id !== videy_id));
    } else {
      setSelectedIds([...selectedIds, videy_id]);
    }
  };

  const generateLinks = () => {
    const selectedVideos = videos.filter(v => selectedIds.includes(v.videy_id));
    
    // Logika format: Judul+Link atau Link saja
    const text = selectedVideos.map(v => {
      return includeTitle ? `${v.title}\n${baseUrl}/${v.videy_id}` : `${baseUrl}/${v.videy_id}`;
    }).join('\n\n');
    
    setResultText(text);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resultText);
    alert("Berhasil disalin ke clipboard!");
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
      <h2 style={{ color: '#f00' }}>Bulk Share Link Generator</h2>
      
      {/* OPSI FORMAT */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #333' }}>
        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Opsi Format:</p>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
          <input 
            type="checkbox" 
            checked={includeTitle} 
            onChange={(e) => setIncludeTitle(e.target.checked)}
            style={{ width: '18px', height: '18px' }}
          />
          Sertakan Judul Video
        </label>
        <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '5px' }}>
          {includeTitle ? "Hasil: Judul + Link" : "Hasil: Hanya Link saja"}
        </p>
      </div>

      <p style={{ color: '#ccc' }}>Pilih video ({selectedIds.length} terpilih):</p>

      <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid #333', padding: '10px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#000' }}>
        {videos.map((vid) => (
          <div key={vid.id} style={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #222' }}>
            <input 
              type="checkbox" 
              checked={selectedIds.includes(vid.videy_id)} 
              onChange={() => toggleSelect(vid.videy_id)}
              style={{ width: '20px', height: '20px', marginRight: '15px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.9rem' }}>{vid.title}</span>
          </div>
        ))}
      </div>

      <button onClick={generateLinks} style={{ width: '100%', padding: '15px', backgroundColor: '#f00', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
        GENERATE LIST LINK
      </button>

      {resultText && (
        <div style={{ marginTop: '20px', borderTop: '2px dashed #333', paddingTop: '20px' }}>
          <textarea 
            readOnly 
            value={resultText} 
            style={{ width: '100%', height: '180px', backgroundColor: '#000', color: '#0f0', padding: '10px', borderRadius: '8px', border: '1px solid #333', fontSize: '0.85rem', marginBottom: '10px' }}
          />
          <button onClick={copyToClipboard} style={{ width: '100%', padding: '15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            📋 SALIN SEMUA ({selectedIds.length} Link)
          </button>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <a href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>← Kembali ke Beranda</a>
      </div>
    </div>
  );
}
