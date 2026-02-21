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
        src="https://pl28763278.effectivegatecpm.com/ee/04/09/ee040951564d0118f9c97849ba692abb.js" 
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
