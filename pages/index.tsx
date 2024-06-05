import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/library');
    } else if (status === 'unauthenticated') {
      router.push('/anime');
    }
  }, [status, router]);

  return null;
}
