'use client';

import React, { FC, useEffect, useState } from 'react';
import Lobby from './Lobby';
import { getSession } from '@/lib/auth';
import Loader from '@/components/Loader';
import HostDialog from './HostDialog';
import { useRouter } from 'next/navigation';
import { Avatar } from '@chakra-ui/react';

const Page: FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    <div className="relative min-h-screen text-center items-center justify-center flex flex-col text-white">
      <div className="flex flex-row w-4/5 justify-between space-x-52 ">
        <div className="flex flex-1"></div>
        <div className="flex flex-1  w-full flex-row gap-8 justify-center items-center content-center ">
          <div className="font-bold flex-wrap text-xl text-center text-orange-300">
            DRAW AND GUESS
          </div>
        </div>
        <div className="flex flex-1 self-end w-full flex-row justify-center items-center content-center ">
          <div className="flex justify-end items-center w-2/3">
            <div className="font-bold text-xl w-full h-full text-center">
              {session?.user.username}
            </div>
          </div>
          <div className="w-18 h-18 items-center  border rounded-full bg-slate-100">
            <Avatar
              mr={2}
              src={`https://api.dicebear.com/5.x/big-smile/svg?seed=Lee`}
              size="lg"
              className=" w-8 h-8 bg-slate-300"
            ></Avatar>
          </div>
        </div>
      </div>
      <Lobby session={session} />
    </div>
  );
};

export default Page;
