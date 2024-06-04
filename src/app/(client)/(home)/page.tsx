'use client'; // Ensure this component is a Client Component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Button, Input, Spinner } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import { Avatar } from '@chakra-ui/react';
import DialogCustom from '@/components/DialogCustom';

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
          <div className="text-center font-semibold text-xs sm:text-sm text-cyan-300">
            Loading
          </div>
        </div>
      </DialogCustom>
    );
  }

  return (
    <div className="relative min-h-screen text-center items-center justify-center flex flex-col text-white gap-5 bg-transparent">
      <div className="flex flex-col w-2/5 justify-between space-x-52">
        <div className="w-full flex flex-row gap-8 justify-center items-center ">
          <div className="flex-wrap w-full text-5xl text-center ">
            <span className="font-bold flex-wrap ext-5xl text-center text-yellow-400 font-dotGothic16">
              DRAW AND
            </span>
            <span className="font-bold flex-wrap ext-5xl text-center text-blue-500 font-dotGothic16">
              &nbsp;GUESS
            </span>
          </div>
        </div>
        <div className="flex flex-1 self-end w-full flex-row justify-center items-center font-dotGothic16 gap-3">
          <div className="w-18 h-18 items-center border rounded-full bg-white">
            <Avatar
              src={`https://api.dicebear.com/5.x/big-smile/svg?seed=Lee`}
              size="lg"
              className="flex justify-center items-center p-1"
            ></Avatar>
          </div>
          <div className="w-full font-bold text-2xl h-full text-left text-blue-500">
            Welcome, {session?.user.username}!
          </div>
        </div>
      </div>
      <div className="h-2/5 w-2/5 px-8 py-12 bg-white relative z-10 rounded-lg border-4  shadow-inner">
        <div className="flex flex-col gap-20">
          <Button
            shadow={'outline'}
            dropShadow={'outline'}
            bgColor={'blue.600'}
            fontWeight={'bold'}
            rounded={'xl'}
            _hover={{
              borderColor: 'slate.300',
              bgColor: 'blue.500',
            }}
            textColor={'white'}
            onClick={handlePublic}
          >
            Public
          </Button>
          <div className="w-full flex flex-row gap-10 justify-between">
            <Button
              shadow={'outline'}
              dropShadow={'outline'}
              borderColor={'white'}
              bgColor={'blue.600'}
              fontWeight={'bold'}
              rounded={'xl'}
              _hover={{
                borderColor: 'slate.300',
                bgColor: 'blue.500',
              }}
              textColor={'white'}
              className=" w-2/5 bg-orange-200"
              onClick={handlePrivate}
            >
              Private
            </Button>
            <Input
              shadow={'outline'}
              dropShadow={'outline'}
              bgColor={'blue.600'}
              fontWeight={'bold'}
              rounded={'xl'}
              _hover={{
                borderColor: 'slate.300',
                bgColor: 'blue.500',
              }}
              _placeholder={{ color: 'white' }}
              textColor={'white'}
              className=" bg-orange-200 w-3/5 text-white"
              type="text"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
          </div>
          <Button
            shadow={'initial'}
            border={'4px'}
            bgColor={'red.400'}
            fontWeight={'bold'}
            rounded={'xl'}
            _hover={{
              bgColor: 'red.500',
            }}
            textColor={'white'}
            onClick={() => signOut({ callbackUrl: '/' })}
            className="border-solid border-t-2 mt-2  gap-2"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
