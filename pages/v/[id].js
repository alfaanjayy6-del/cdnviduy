import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Redirector() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    // Menghasilkan kode acak agar URL selalu terlihat unik bagi robot Facebook
    const salt = Math.random().toString(36).substring(7);
    
    // Melempar pengunjung ke halaman player video asli
    // t=${salt} berfungsi agar link tidak terbaca sebagai spam yang sama berulang kali
    router.replace(`/${id}?from=v&t=${salt}`);
  }, [id, router]);

  return (
    <div style={{ 
      backgroundColor: '#000', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      color: '#fff',
      fontFamily: 'sans-serif' 
    }}>
      {/* Animasi Loading Merah Hitam */}
      <div className="loader"></div>
      <p style={{ marginTop: '20px', color: '#888', letterSpacing: '2px', fontSize: '0.8rem' }}>
        MEMUAT VIDEO...
      </p>

      <style jsx>{`
        .loader {
          border: 3px solid #111;
          border-top: 3px solid #ff0000;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Redirector() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    const salt = Math.random().toString(36).substring(7);
    // Melempar ke halaman player asli
    router.replace(`/${id}?from=v&t=${salt}`);
  }, [id, router]);

  return (
    <div style={{ backgroundColor: '#000', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      <p>Loading Video...</p>
    </div>
  );
}
