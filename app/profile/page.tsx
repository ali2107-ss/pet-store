"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileRootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/profile/orders');
  }, [router]);
  return null;
}