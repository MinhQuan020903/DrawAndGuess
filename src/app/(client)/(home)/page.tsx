'use client'; // Ensure this component is a Client Component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Button } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import { Avatar } from '@chakra-ui/react';

const HomePage = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
      setLoading(false);
    };

    fetchSession();
  }, []);

  const handleHost = () => {
    // Logic to create a game
    console.log('Creating a game...');
  };

  const handlePublic = () => {
    // Navigate to public games page
    router.push('/lobby');
  };

  const handlePrivate = () => {
    // Check if room exists and navigate to the room
    if (roomCode) {
      console.log(`Navigating to room: ${roomCode}`);
      router.push(`/game/${roomCode}`);
    } else {
      alert('Please enter a room code');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative min-h-screen text-center items-center justify-center flex flex-col text-white">
      <div className="flex flex-row w-2/5 justify-between space-x-52 ">
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
      <div className="h-2/5 w-2/5 bg-slate-300 relative z-10">
        <div>
          <div className="flex flex-col gap-10 p-10">
            <Button className="m-5 bg-orange-200" onClick={handlePublic}>
              Public
            </Button>
            <div className=" m-5 flex flex-row gap-10 p-10">
              <Button className=" w-2/5 bg-orange-200" onClick={handlePrivate}>
                Private
              </Button>
              <input
                className=" bg-orange-200 w-2/5"
                type="text"
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
              />
            </div>
            <Button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="border-solid border-t-2 mt-2  gap-2"
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
