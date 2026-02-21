import { useRouter } from 'next/router';
import Script from 'next/script';

export default function Player() {
  const router = useRouter();
  const { id } = router.query; // Ini akan mengambil ID dari URL

  if (!id) return <p style={{color: 'white', textAlign: 'center'}}>Loading...</p>;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* IKLAN ADSTERRA (Social Bar) */}
      <Script 
        src="https://pl27333728.effectivegatecpm.com/e4/6a/bf/e46abf385099c2b5d894dbb1c522e30c.js" 
        strategy="lazyOnload" 
      />

      <div style={{ width: '100%', maxWidth: '800px', padding: '10px' }}>
        <video controls autoPlay width="100%" style={{ borderRadius: '8px', boxShadow: '0 0 20px rgba(255,0,0,0.2)' }}>
          <source src={`https://cdnvidey.co.in/${id}.mp4`} type="video/mp4" />
          Browser tidak mendukung.
        </video>
        
        <h2 style={{ color: '#fff', marginTop: '20px', fontFamily: 'sans-serif' }}>Sedang Memutar Video...</h2>
        
        {/* TEMPAT IKLAN BANNER (Opsional) */}
        <div style={{ marginTop: '20px', width: '100%', height: '100px', backgroundColor: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
          Space Iklan Banner
        </div>
      </div>
    </div>
  );
}
