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
      // Mencoba memanggil file yang biasanya diblokir oleh Adblock
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

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      
      <Script src="https://pl28763278.effectivegatecpm.com/ee/04/09/ee040951564d0118f9c97849ba692abb.js" strategy="lazyOnload" />

      {/* OVERLAY ANTI ADBLOCK */}
      {adBlockDetected && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '20px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ color: '#fff' }}>Adblock Terdeteksi!</h2>
          <p style={{ color: '#ccc', maxWidth: '400px', lineHeight: '1.6' }}>
            Maaf, untuk menonton video di website ini, harap **matikan Adblock** atau gunakan browser biasa. Iklan membantu kami menjaga server tetap aktif.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px', padding: '12px 25px', backgroundColor: '#ff0000', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            SAYA SUDAH MATIKAN ADBLOCK
          </button>
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '900px', padding: '10px', filter: adBlockDetected ? 'blur(10px)' : 'none' }}>
        <video controls controlsList="nodownload" autoPlay style={{ width: '100%', borderRadius: '8px', boxShadow: '0 0 20px rgba(255,0,0,0.1)' }}>
          <source src={`https://cdnvidey.co.in/${id}.mp4`} type="video/mp4" />
        </video>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button 
            onClick={handleDownload}
            style={{ padding: '15px 40px', fontSize: '1.1rem', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            📥 DOWNLOAD VIDEO SEKARANG
          </button>
        </div>
      </div>
    </div>
  );
}
