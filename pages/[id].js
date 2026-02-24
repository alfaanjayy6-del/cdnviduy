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

    // 1. Update Penonton Harian
    const updateVisitorStats = async () => {
      const today = new Date().toISOString().split('T')[0];
      await supabase.rpc('increment_visitor', { d_date: today });
    };
    updateVisitorStats();

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

    // 4. Tracking Admin Panel
    const channel = supabase.channel('online-users', { config: { presence: { key: 'user' } } });
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ 
          online_at: new Date().toISOString(), 
          page: id,
          pageTitle: document.title || "Watching Video",
          user_id: Math.random().toString(36).substring(7) 
        });
      }
    });

    localStorage.setItem('download_step', '0');
    return () => { supabase.removeChannel(channel); };
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
      <style jsx global>{` body { margin: 0; background: #000; overflow-x: hidden; } `}</style>
      <Script src="https://pl28763278.effectivegatecpm.com/ee/04/09/ee040951564d0118f9c97849ba692abb.js" strategy="lazyOnload" />

      {adBlockDetected && <div style={{ background: 'red', color: 'white', padding: '10px', width: '100%', textAlign: 'center', position: 'fixed', top: 0, zIndex: 999 }}>Harap matikan Adblock!</div>}

      <div style={{ width: '100%', maxWidth: '900px', padding: '15px', filter: adBlockDetected ? 'blur(15px)' : 'none' }}>
        <div style={{ marginBottom: '15px' }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none', border: '1px solid #333', padding: '8px 15px', borderRadius: '8px' }}>🏠 Beranda</Link>
        </div>

        <video controls autoPlay preload="auto" style={{ width: '100%', borderRadius: '8px', boxShadow: '0 0 25px rgba(255,0,0,0.2)' }}>
          <source src={`https://cdnvidey.co.in/${id}.mp4`} type="video/mp4" />
        </video>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button onClick={handleDownload} style={{ padding: '16px 45px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>
            📥 DOWNLOAD VIDEO SEKARANG
          </button>
        </div>
      </div>
    </div>
  );
}
