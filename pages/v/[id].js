import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Redirector() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    // Membuat kode unik acak untuk mengelabui bot Facebook
    const salt = Math.random().toString(36).substring(7);
    
    // Mengalihkan pengunjung ke halaman player video asli
    // Kita tambahkan parameter ?from=v agar kamu bisa melacak trafik ini di log admin
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
      {/* Animasi Loading Sederhana agar terlihat profesional */}
      <div className="loader"></div>
      <p style={{ marginTop: '20px', color: '#888', letterSpacing: '1px', fontSize: '0.9rem' }}>
        MEMUAT VIDEO...
      </p>

      <style jsx>{`
        .loader {
          border: 3px solid #111;
          border-top: 3px solid #ff0000;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
