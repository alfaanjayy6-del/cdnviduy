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

    // 1. FUNGSI UPDATE PENONTON HARIAN
    const updateVisitorStats = async () => {
      const today = new Date().toISOString().split('T')[0];
      await supabase.rpc('increment_visitor', { d_date: today });
    };
    updateVisitorStats();

    // 2. DETEKSI ADBLOCK
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

    // 3. AMBIL DATA VIDEO & TRACKING ADMIN
    const fetchVideoInfo = async () => {
      const { data } = await supabase.from('videos1').select('title').eq('videy_id', id).single();
      if (data) document.title = data.title;
    };
    fetchVideoInfo();

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

    return () => {
      supabase.removeChannel(channel); 
      localStorage.removeItem('download_step');
    };
  }, [id]);

  const handleDownload = () => {
    let currentStep = parseInt(localStorage.getItem('download_step') || '0');
    const linkAdstera = 'https://www.effectivegatecpm.com/u88ksn21bi?key=466e5edc4b150634636ec85f6be789c3';
    const affiliateLinks = ['https://s.shopee.co.id/7fUZHYXISz', 'https://s.shopee.co.id/AUokejQPcI'];

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
    <div className="player-container">
      <style jsx global>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background-color: #000 !important;
          width: 100%;
          height: 100%;
          overflow-x: hidden;
        }
        #__next {
          background-color: #000;
          min-height: 100vh;
        }
      `}</style>

      <Script src="https://pl28763278.effectivegatecpm.com/ee/04/09/ee040951564d0118f9c97849ba692abb.js" strategy="lazyOnload" />

      {adBlockDetected && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.98)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '20px', textAlign: 'center', boxSizing: 'border-box'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '10px' }}>⚠️</div>
          <h2 style={{ color: '#fff', fontFamily: 'sans-serif' }}>Adblock Terdeteksi!</h2>
          <p style={{ color: '#ccc', maxWidth: '400px', lineHeight: '1.6', fontFamily: 'sans-serif' }}>
            Maaf, video tidak bisa diputar. Harap **matikan Adblock** atau gunakan browser biasa agar kami bisa terus menyediakan layanan gratis.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px', padding: '12px 25px', backgroundColor: '#ff0000', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            SAYA SUDAH MATIKAN ADBLOCK
          </button>
        </div>
      )}

      <div style={{ 
        width: '100%', 
        maxWidth: '900px', 
        padding: '15px', 
        filter: adBlockDetected ? 'blur(15px)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box'
      }}>
        {/* TOMBOL KEMBALI KE BERANDA (DI ATAS VIDEO) */}
        <div style={{ width: '100%', marginBottom: '15px', display: 'flex', justifyContent: 'flex-start' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button style={{
              backgroundColor: 'transparent',
              color: '#888',
              border: '1px solid #333',
              padding: '8px 15px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: '0.3s'
            }} className="btn-home">
              🏠 Kembali ke Beranda
            </button>
          </Link>
        </div>

        <video controls controlsList="nodownload" autoPlay style={{ width: '100%', borderRadius: '8px', boxShadow: '0 0 25px rgba(255,0,0,0.15)' }}>
          <source src={`https://cdnvidey.co.in/${id}.mp4`} type="video/mp4" />
        </video>

        <div style={{ marginTop: '30px', textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button 
            onClick={handleDownload}
            style={{ 
              padding: '16px 45px', 
              fontSize: '1.1rem', 
              backgroundColor: '#28a745', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '50px', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(40, 167, 69, 0.4)',
              transition: '0.3s'
            }}
          >
            📥 DOWNLOAD VIDEO SEKARANG
          </button>

          {/* TOMBOL LANJUT NONTON (DI BAWAH TOMBOL DOWNLOAD) */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ color: '#aaa', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' }}>
              Mau nonton video lainnya? Klik di sini
            </span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .player-container {
          background-color: #000;
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 0;
        }
        .btn-home:hover {
          color: #fff !important;
          border-color: #f00 !important;
          background-color: #111 !important;
        }
      `}</style>
    </div>
  );
}
