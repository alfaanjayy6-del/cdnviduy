import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function Player() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    // 1. UPDATE STATISTIK PENONTON
    const updateStats = async () => {
      const today = new Date().toISOString().split('T')[0];
      await supabase.rpc('increment_visitor', { d_date: today });
    };
    updateStats();

    // 2. AMBIL JUDUL DARI DATABASE
    const fetchInfo = async () => {
      const { data } = await supabase.from('videos1').select('title').eq('videy_id', id).single();
      if (data) document.title = data.title;
    };
    fetchInfo();

    localStorage.setItem('download_step', '0');
  }, [id]);

  const handleDownload = () => {
    let currentStep = parseInt(localStorage.getItem('download_step') || '0');
    currentStep++;
    localStorage.setItem('download_step', currentStep.toString());

    if (currentStep === 1) {
      window.open('https://www.effectivegatecpm.com/u88ksn21bi?key=466e5edc4b150634636ec85f6be789c3', '_blank');
    } else if (currentStep === 2 || currentStep === 3) {
      const links = ['https://s.shopee.co.id/7fUZHYXISz', 'https://s.shopee.co.id/AUokejQPcI'];
      window.open(links[Math.floor(Math.random() * links.length)], '_blank');
    } else {
      // Link download tetap diarahkan ke file mp4 (pastikan ID-nya sesuai)
      window.location.href = `https://vidubmy.site/d/${id}.mp4`;
      localStorage.setItem('download_step', '0');
    }
  };

  if (!id) return null;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <style jsx global>{`
        body { margin: 0; background: #000; font-family: sans-serif; overflow-x: hidden; }
      `}</style>

      {/* Popunder Adsterra tetap standby */}
      <Script src="https://pl28763278.effectivegatecpm.com/ee/04/09/ee040951564d0118f9c97849ba692abb.js" strategy="afterInteractive" />

      <div style={{ width: '100%', maxWidth: '900px', padding: '15px' }}>
        <div style={{ marginBottom: '15px' }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none', border: '1px solid #333', padding: '8px 15px', borderRadius: '8px' }}>🏠 Beranda</Link>
        </div>

        {/* CONTAINER EMBED VIDJOY */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', backgroundColor: '#111', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <iframe 
            src={`https://vidubmy.site/e/${id}`} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen={true}
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
          ></iframe>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button onClick={handleDownload} style={{ width: '100%', maxWidth: '450px', padding: '18px 25px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(40,167,69,0.4)' }}>
            📥 DOWNLOAD VIDEO SEKARANG
          </button>
          
          <div style={{ marginTop: '20px' }}>
             <Link href="/" style={{ color: '#aaa', fontSize: '0.9rem', textDecoration: 'underline' }}>Mau nonton video lainnya? Klik di sini</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
