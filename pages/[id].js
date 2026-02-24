import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function Player() {
  const router = useRouter();
  const { id } = router.query;
  const [adBlockDetected, setAdBlockDetected] = useState(false);

  useEffect(() => {
    if (!id) return;

    // 1. Hitung Penonton Harian
    const updateStats = async () => {
      const today = new Date().toISOString().split('T')[0];
      await supabase.rpc('increment_visitor', { d_date: today });
    };
    updateStats();

    // 2. Deteksi Adblock
    const checkAdBlock = async () => {
      const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      try {
        await fetch(new Request(googleAdUrl, { mode: 'no-cors' }));
        setAdBlockDetected(false);
      } catch (e) {
        setAdBlockDetected(true);
      }
    };
    checkAdBlock();

    // 3. Ambil Judul Video
    const fetchVideoInfo = async () => {
      const { data } = await supabase.from('videos1').select('title').eq('videy_id', id).single();
      if (data) document.title = data.title;
    };
    fetchVideoInfo();

    // 4. Tracking Realtime Admin
    const channel = supabase.channel('online-users');
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ 
          online_at: new Date().toISOString(), 
          page: id,
          user_id: Math.random().toString(36).substring(7) 
        });
      }
    });

    localStorage.setItem('download_step', '0');
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const handleDownload = () => {
    let currentStep = parseInt(localStorage.getItem('download_step') || '0');
    const linkAdstera = 'https://www.effectivegatecpm.com/u88ksn21bi?key=466e5edc4b150634636ec85f6be789c3';
    const affiliateLinks = [
      'https://s.shopee.co.id/7fUZHYXISz', 
      'https://s.shopee.co.id/AUokejQPcI'
    ];

    currentStep++;
    localStorage.setItem('download_step', currentStep.toString());

    if (currentStep === 1) {
      window.open(linkAdstera, '_blank');
    } else if (currentStep === 2 || currentStep === 3) {
      const randomIndex = Math.floor(Math.random() * affiliateLinks.length);
      window.open(affiliateLinks[randomIndex], '_blank');
    } else {
      window.location.href = `https://cdnvidey.co.in/${id}.mp4`;
      localStorage.setItem('download_step', '0');
    }
  };

  if (!id) return null;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <style jsx global>{`
        body { margin: 0; background: #000; overflow-x: hidden; font-family: sans-serif; }
      `}</style>

      <Script src="https://pl28763278.effectivegatecpm.com/ee/04/09/ee040951564d0118f9c97849ba692abb.js" strategy="lazyOnload" />

      {adBlockDetected && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
          <h2 style={{ color: '#fff' }}>⚠️ Adblock Terdeteksi</h2>
          <p style={{ color: '#ccc' }}>Harap matikan Adblock agar video bisa diputar.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: '#f00', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>SAYA SUDAH MATIKAN</button>
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '800px', padding: '15px', filter: adBlockDetected ? 'blur(10px)' : 'none' }}>
        <div style={{ marginBottom: '15px' }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none', border: '1px solid #333', padding: '5px 10px', borderRadius: '5px' }}>🏠 Beranda</Link>
        </div>

        {/* Video Player */}
        <video controls autoPlay preload="auto" style={{ width: '100%', borderRadius: '10px', boxShadow: '0 0 20px rgba(255,0,0,0.2)' }}>
          <source src={`https://cdnvidey.co.in/${id}.mp4`} type="video/mp4" />
        </video>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button onClick={handleDownload} style={{ padding: '15px 35px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(40,167,69,0.4)' }}>
            📥 DOWNLOAD VIDEO SEKARANG
          </button>
          <div style={{ marginTop: '20px' }}>
            <Link href="/" style={{ color: '#aaa', fontSize: '0.9rem' }}>Nonton video lainnya? Klik di sini</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
