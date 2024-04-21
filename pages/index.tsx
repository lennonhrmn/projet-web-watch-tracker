import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const {data: session} = useSession();
  const router = useRouter();

  useEffect(() => {
      if (session) {
        router.push('/library');
      } else {
        router.push('/auth');
      }
  }, [session, router]);

  return null;
}
