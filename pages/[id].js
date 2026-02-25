import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function Player() {
  const router = useRouter();
  const { id } = router.query;
  const [useIframe, setUseIframe] = useState(false);

  useEffect(() => {
    if (!id) return;

    // 1. UPDATE STATISTIK
    const updateStats = async () => {
      const today = new Date().toISOString().split('T')[0];
      await supabase.rpc('increment_visitor', { d_date: today });
    };
    updateStats();

    // 2. AMBIL JUDUL
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
      window.location.href = `https://cdnvidey.co.in/${id}.mp4`;
      localStorage.setItem('download_step', '0');
    }
  };

  if (!id) return null;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <style jsx global>{`
        body { margin: 0; background: #000; font-family: sans-serif; overflow-x: hidden; }
      `}</style>

      {/* SCRIPT ADSTERRA:afterInteractive agar popunder galak */}
      <Script src="https://pl28763278.effectivegatecpm.com/ee/04/09/ee040951564d0118f9c97849ba692abb.js" strategy="afterInteractive" />

      <div style={{ width: '100%', maxWidth: '900px', padding: '15px' }}>
        <div style={{ marginBottom: '15px' }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none', border: '1px solid #333', padding: '8px 15px', borderRadius: '8px' }}>🏠 Beranda</Link>
        </div>

        <div style={{ position: 'relative', width: '100%', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#111', boxShadow: '0 0 25px rgba(255,0,0,0.2)' }}>
          
          {!useIframe ? (
            /* VERSI 1: PLAYER ASLI (DENGAN DETEKSI ERROR) */
            <video 
              controls 
              autoPlay 
              preload="auto"
              style={{ width: '100%', display: 'block' }}
              onError={() => setUseIframe(true)} // JIKA BLOKIR/EROR, PINDAH KE IFRAME
            >
              <source 
                src={`https://cdnvidey.co.in/${id}.mp4`} 
                type="video/mp4" 
                referrerPolicy="no-referrer" 
              />
            </video>
          ) : (
            /* VERSI 2: IFRAME (CADANGAN JIKA VERSI 1 DIBLOKIR) */
            <div style={{ paddingTop: '56.25%', position: 'relative' }}>
              <iframe 
                src={`https://videy.co/v?id=${id}`} 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allowFullScreen
              ></iframe>
            </div>
          )}

        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button onClick={handleDownload} style={{ padding: '16px 45px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(40,167,69,0.4)' }}>
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
