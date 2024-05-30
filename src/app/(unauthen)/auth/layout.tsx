import React from 'react';
import { alreadyLoggedIn } from '@/lib/auth';

async function layout({ children }: { children: React.ReactNode }) {
  await alreadyLoggedIn();
  return <div className="h-screen w-screen">{children}</div>;
}

export default layout;
