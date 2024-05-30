import HomeComponent from '@/components/homeGame/home';
import { getSession } from '@/lib/auth';
import React from 'react';

export default async function page() {
  const session = await getSession();
  return (
    <div className="w-full h-full flex-row">
      <HomeComponent session={session} />
    </div>
  );
}
