import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Player() {
  const router = useRouter();
  const { id } = router.query;
  const [adBlockDetected, setAdBlockDetected] = useState(false);

  useEffect(() => {
    if (!id) return;

    // 1. DETEKSI ADBLOCK
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
    localStorage.setItem('download_step', '0');

    // 2. Metadata & Admin Tracking
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

    return () => {
      supabase.removeChannel(channel); 
      localStorage.removeItem('download_step');
    };
  }, [id]);

  const handleDownload = () => {
    let currentStep = parseInt(localStorage.getItem('download_step') || '0');
    const linkAdsterra = 'https://www.effectivegatecpm.com/u88ksn21bi?key=466e5edc4b150634636ec85f6be789c3';
    const affiliateLinks = ['https://s.shopee.co.id/7fUZHYXISz', 'https://s.shopee.co.id/AUokejQPcI'];

    currentStep++;
    localStorage.setItem('download_step', currentStep.toString());

    if (currentStep === 1) {
      window.open(linkAdsterra, '_blank');
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
    <div className="main-container">
      {/* Script Iklan Adsterra */}
      <Script src="https://pl28763278.effectivegatecpm.com/ee/04/09/ee040951564d0118f9c97849ba692abb.js" strategy="lazyOnload" />

      {/* OVERLAY ANTI ADBLOCK */}
      {adBlockDetected && (
        <div className="adblock-overlay">
          <div style={{ fontSize: '4rem', marginBottom: '10px' }}>⚠️</div>
          <h2 style={{ color: '#fff', margin: '10px 0' }}>Adblock Terdeteksi!</h2>
          <p style={{ color: '#ccc', maxWidth: '350px', fontSize: '0.9rem', marginBottom: '20px' }}>
            Harap **Matikan Adblock** atau gunakan browser biasa agar video bisa diputar. Iklan membantu kami tetap gratis!
          </p>
          <button onClick={() => window.location.reload()} className="btn-reload">
            SAYA SUDAH MATIKAN
          </button>
        </div>
      )}

      {/* VIDEO PLAYER CONTAINER */}
      <div className={`video-wrapper ${adBlockDetected ? 'blur' : ''}`}>
        <video controls controlsList="nodownload" autoPlay className="video-element">
          <source src={`https://cdnvidey.co.in/${id}.mp4`} type="video/mp4" />
        </video>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button onClick={handleDownload} className="btn-download">
            📥 DOWNLOAD VIDEO SEKARANG
          </button>
        </div>
      </div>

      <style jsx global>{`
        /* Menghilangkan semua sisa bingkai putih */
        html, body {
          margin: 0;
          padding: 0;
          background-color: #000 !important;
          overflow-x: hidden;
        }

        .main-container {
          background-color: #000;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0;
          margin: 0;
        }

        .video-wrapper {
          width: 100%;
          max-width: 900px;
          padding: 15px;
          box-sizing: border-box;
          transition: filter 0.3s;
        }

        .video-wrapper.blur {
          filter: blur(15px);
          pointer-events: none;
        }

        .video-element {
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 0 25px rgba(255,0,0,0.15);
          outline: none;
        }

        .adblock-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0,0,0,0.98);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-family: sans-serif;
        }

        .btn-reload {
          padding: 12px 30px;
          background-color: #ff0000;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
        }

        .btn-download {
          padding: 15px 40px;
          font-size: 1.1rem;
          background-color: #28a745;
          color: #fff;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
          transition: 0.3s;
        }

        .btn-download:hover {
          transform: scale(1.05);
          background-color: #218838;
        }
      `}</style>
    </div>
  );
}
