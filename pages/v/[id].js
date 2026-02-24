import { useRouter } from 'next/router';
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
