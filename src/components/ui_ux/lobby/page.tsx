'use client';

import React, { FC, useEffect, useState } from 'react';
import Lobby from './Lobby';
import { getSession } from '@/lib/auth';
import Loader from '@/components/Loader';
import HostDialog from './HostDialog';
import { useRouter } from 'next/navigation';
import { Avatar, Spinner } from '@chakra-ui/react';
import DialogCustom from '@/components/DialogCustom';

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
    return (
      <DialogCustom
        className="w-[90%] lg:w-[50%] h-fit items-center justify-center rounded-lg"
        isModalOpen={loading}
        notShowClose={true}
      >
        <div className="flex flex-col gap-3 items-center justify-center">
          <Spinner
            className="w-full h-full flex justify-center items-center"
            color="cyan"
          />
          <div className="text-center font-semibold text-xs sm:text-sm text-blue-300">
            Loading
          </div>
        </div>
      </DialogCustom>
    );
  }

  return (
    <div className="relative min-h-screen text-center items-center justify-center flex flex-col text-white gap-3 py-2">
      <div className="flex flex-row w-4/5 justify-between space-x-52 gap-3">
        <div className="flex flex-1"></div>
        <div className="flex flex-1  w-full flex-row gap-8 justify-center items-center content-center font-dotGothic16">
          <div className="flex-wrap w-full text-xl text-center ">
            <span className="font-bold flex-wrap text-center text-yellow-400 font-dotGothic16">
              DRAW AND
            </span>
            <span className="font-bold flex-wrap text-center text-blue-500 font-dotGothic16">
              &nbsp;GUESS
            </span>
          </div>
        </div>
        <div className="flex flex-1 self-end w-full flex-row justify-center items-center content-center ">
          <div className="flex justify-end items-center w-2/3">
            <div className="font-bold text-xl w-full h-full text-center font-dotGothic16">
              {session?.user.username}
            </div>
          </div>
          <div className="w-18 h-18 items-center border rounded-full bg-white">
            <Avatar
              src={`https://api.dicebear.com/5.x/big-smile/svg?seed=Lee`}
              size="lg"
              className="flex justify-center items-center p-1"
            ></Avatar>
          </div>
        </div>
      </div>
      <Lobby session={session} />
    </div>
  );
};

export default Page;
