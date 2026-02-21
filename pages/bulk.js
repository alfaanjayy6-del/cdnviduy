import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function BulkShare() {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [baseUrl, setBaseUrl] = useState('');
  const [resultText, setResultText] = useState('');
  const [includeTitle, setIncludeTitle] = useState(true);
  
  const [sortBy, setSortBy] = useState('terbaru');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setBaseUrl(window.location.origin);
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase
      .from('videos1')
      .select('*');
    setVideos(data || []);
    setFilteredVideos(data || []);
  };

  useEffect(() => {
    let result = [...videos];

    if (searchTerm) {
      result = result.filter(v => v.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // LOGIKA SORTING BARU (Termasuk Angka Terbesar/Terkecil)
    if (sortBy === 'terbaru') {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'id_besar') {
      result.sort((a, b) => b.id - a.id); // Angka Besar ke Kecil
    } else if (sortBy === 'id_kecil') {
      result.sort((a, b) => a.id - b.id); // Angka Kecil ke Besar
    } else if (sortBy === 'az') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'za') {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }

    setFilteredVideos(result);
  }, [sortBy, searchTerm, videos]);

  const toggleSelect = (videy_id) => {
    if (selectedIds.includes(videy_id)) {
      setSelectedIds(selectedIds.filter(id => id !== videy_id));
    } else {
      setSelectedIds([...selectedIds, videy_id]);
    }
  };

  const selectAll = () => {
    if (selectedIds.length === filteredVideos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVideos.map(v => v.videy_id));
    }
  };

  const generateLinks = () => {
    const selectedVideos = videos.filter(v => selectedIds.includes(v.videy_id));
    const text = selectedVideos.map(v => {
      return includeTitle ? `${v.title}\n${baseUrl}/${v.videy_id}` : `${baseUrl}/${v.videy_id}`;
    }).join('\n\n');
    setResultText(text);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resultText);
    alert("Berhasil disalin!");
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
      <h2 style={{ color: '#f00', textAlign: 'center' }}>Bulk Share Link</h2>
      
      <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #333' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>🔍 Cari Video:</label>
          <input 
            type="text" 
            placeholder="Ketik judul video..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#000', color: '#fff' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>📂 Urutkan:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#000', color: '#fff', border: '1px solid #444' }}
            >
              <option value="terbaru">Terbaru Diupload</option>
              <option value="id_besar">Angka ID Terbesar (Paling Baru)</option>
              <option value="id_kecil">Angka ID Terkecil (Paling Lama)</option>
              <option value="az">Nama A - Z</option>
              <option value="za">Nama Z - A</option>
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '150px', display: 'flex', alignItems: 'flex-end' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px', backgroundColor: '#333', padding: '10px', borderRadius: '6px', width: '100%' }}>
              <input type="checkbox" checked={includeTitle} onChange={(e) => setIncludeTitle(e.target.checked)} />
              Sertakan Judul
            </label>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <p style={{ fontSize: '0.8rem', color: '#888' }}>{selectedIds.length} dipilih</p>
        <button onClick={selectAll} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '0.8rem' }}>
          {selectedIds.length === filteredVideos.length ? "Batal Pilih Semua" : "Pilih Semua Hasil Filter"}
        </button>
      </div>

      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #333', padding: '10px', borderRadius: '8px', backgroundColor: '#000', marginBottom: '20px' }}>
        {filteredVideos.map((vid) => (
          <div key={vid.id} style={{ display: 'flex', alignItems: 'center', padding: '12px', borderBottom: '1px solid #222' }}>
            <input 
              type="checkbox" 
              checked={selectedIds.includes(vid.videy_id)} 
              onChange={() => toggleSelect(vid.videy_id)}
              style={{ width: '20px', height: '20px', marginRight: '15px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.9rem' }}>
              <small style={{ color: '#555', marginRight: '8px' }}>#{vid.id}</small> 
              {vid.title}
            </span>
          </div>
        ))}
      </div>

      <button onClick={generateLinks} style={{ width: '100%', padding: '15px', backgroundColor: '#f00', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
        GENERATE LIST LINK
      </button>

      {resultText && (
        <div style={{ marginTop: '20px' }}>
          <textarea readOnly value={resultText} style={{ width: '100%', height: '150px', backgroundColor: '#000', color: '#0f0', padding: '10px', borderRadius: '8px', border: '1px solid #333', fontSize: '0.85rem' }} />
          <button onClick={copyToClipboard} style={{ width: '100%', marginTop: '10px', padding: '15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            📋 SALIN SEMUA LINK
          </button>
        </div>
      )}
    </div>
  );
}
