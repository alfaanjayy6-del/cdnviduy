import { useRouter } from 'next/router';
import Script from 'next/script';

export default function Player() {
  const router = useRouter();
  const { id } = router.query;

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
      overflow: 'hidden'
    }}>
      
      {/* IKLAN ADSTERRA (Tetap Jalan di Background) */}
      <Script 
        src="https://pl27333728.effectivegatecpm.com/e4/6a/bf/e46abf385099c2b5d894dbb1c522e30c.js" 
        strategy="lazyOnload" 
      />

      <div style={{ width: '100%', maxWidth: '100vw', maxHeight: '100vh' }}>
        <video 
          controls 
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
