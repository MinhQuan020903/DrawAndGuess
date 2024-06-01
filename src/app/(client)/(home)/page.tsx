'use client'; // Ensure this component is a Client Component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Button } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import HostDialog from '../lobby/HostDialog';

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
    <div className="dark min-h-screen text-center items-center justify-center flex flex-col text-white">
      <div className="h-4/5 w-4/5 bg-gray-700">
        <h1 className="text-2xl">Draw and Guess</h1>
        {session?.user ? (
          <div>
            <h1>Welcome, {session.user?.username}</h1>
            <div className="flex flex-col gap-10 p-10">
              <Button className="m-10 bg-orange-200" onClick={handlePublic}>
                Public
              </Button>
              <div className="flex flex-row gap-10 p-10">
                <Button className="m-10 bg-orange-200" onClick={handlePrivate}>
                  Private
                </Button>
                <input
                  className="m-10 bg-orange-200"
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
        ) : (
          <div className="flex flex-col gap-10 p-10">
            <Button
              className="m-10 bg-orange-200"
              onClick={() => router.push('/auth/login')}
            >
              Login
            </Button>
            <Button
              className="m-10 bg-orange-200"
              onClick={() => router.push('/auth/register')}
            >
              Register
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
