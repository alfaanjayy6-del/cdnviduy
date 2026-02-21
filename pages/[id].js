import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';

export default function Player() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // Fungsi untuk mematikan klik kanan
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Fungsi untuk mematikan tombol keyboard tertentu (F12, Ctrl+Shift+I, dll)
    const handleKeyDown = (e) => {
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
        (e.ctrlKey && e.keyCode === 85) // Ctrl+U (Lihat Source)
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!id) return null;

  return (
    <div style={{ 
      backgroundColor: '#000', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      userSelect: 'none' // Agar teks/video tidak bisa di-highlight
    }}>
      
      {/* IKLAN ADSTERRA */}
      <Script 
        src="https://pl27333728.effectivegatecpm.com/e4/6a/bf/e46abf385099c2b5d894dbb1c522e30c.js" 
        strategy="lazyOnload" 
      />

      <div style={{ width: '100%', maxWidth: '100vw', maxHeight: '100vh' }}>
        <video 
          controls 
          controlsList="nodownload" // Menghilangkan tombol download bawaan browser
          autoPlay 
          style={{ 
            width: '100%', 
            height: 'auto', 
            maxHeight: '100vh',
            display: 'block' 
          }}
        >
          <source src={`https://cdnvidey.co.in/${id}.mp4`} type="video/mp4" />
          Browser tidak mendukung video tag.
        </video>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background-color: #000;
        }
      `}</style>
    </div>
  );
}
