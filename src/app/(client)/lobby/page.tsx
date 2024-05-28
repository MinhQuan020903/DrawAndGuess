'use client';

import React, { FC, useEffect, useState } from 'react';
import Lobby from './Lobby';
import { getSession } from '@/lib/auth';
import Loader from '@/components/Loader';

const Page: FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      console.log('🚀 ~ Page ~ session:', sessionData);
      setSession(sessionData);
      setLoading(false);
    };

    fetchSession();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <p>LOBBY</p>
      <Lobby session={session} />
    </div>
  );
};

export default Page;
