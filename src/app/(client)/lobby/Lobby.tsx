'use client';
import { getSession } from '@/lib/auth';
import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import HostDialog from './HostDialog';
import { Avatar } from '@chakra-ui/react';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';

interface Room {
  id: string;
  capacity: number;
  currentCapacity: number;
  topic: string;
}

const Lobby = ({ session }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [onCreateRoom, setOnCreateRoom] = useState(false);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);

  React.useEffect(() => {
    const encodedSearchQuery = encodeURI(debouncedSearch);

    // refetchData();
  }, [debouncedSearch]);
  const joinRoom = useCallback(
    (roomId: string) => {
      if (socket) {
        socket.emit('join-room', { roomId: roomId, user: session?.user });
      }
    },
    [socket, session]
  );

  useEffect(() => {
    if (!session) return;
    const accessToken = session?.user?.access_token;

    const newSocket = io(`${process.env.NEXT_PUBLIC_SOCKET_BASE_URL}/lobby`, {
      transports: ['websocket'],
      query: {
        token: accessToken,
      },
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('subscribe-lobby', { user: session?.user });
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection Error:', err);
    });

    newSocket.on('error', (err) => {
      console.error('Socket Error:', err);
    });

    newSocket.on('disconnect', (reason) => {
      console.warn('Socket disconnected:', reason);
    });

    newSocket.on('rooms-list', (roomsList: string) => {
      console.log('🚀 ~ newSocket.on ~ roomsList:', roomsList);
      setRooms(JSON.parse(roomsList));
    });

    newSocket.on('room-joined', (roomId: string) => {
      router.push(`/game/${roomId}`);
    });

    newSocket.on('room-full', (roomId: string) => {
      alert(`Room ${roomId} is full`);
    });

    if (onCreateRoom) {
      newSocket.emit('create-room', {
        user: session.user,
        capacity: 10,
        maxScore: 300,
        topic: 'General Knowledge',
      });
      router.push('/game');
    }

    setSocket(newSocket);

    // Cleanup function
    return () => {
      if (newSocket) {
        newSocket.disconnect();
        newSocket.off('connect');
        newSocket.off('connect_error');
        newSocket.off('error');
        newSocket.off('disconnect');
        newSocket.off('rooms-list');
        newSocket.off('room-joined');
        newSocket.off('room-full');
      }
    };
  }, [session, router]);

  if (!session) {
    return <div>Loading...</div>; // or any loading indicator
  }
  const goBack = () => {
    router.push('/');
  };
  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="flex flex-row w-full justify-between space-x-52 ">
        <div className="flex flex-1  w-full flex-row gap-8 justify-center items-center content-center">
          <Button onClick={goBack} className="bg-orange-200">
            Back
          </Button>
          <form className="flex justify-center w-5/6 h-8 rounded-md px-3">
            <input
              value={searchQuery || ''}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="px-5 py-1 w-2/3 sm:px-5 sm:py-3 flex-1 text-zinc-800 bg-zinc-100 focus:bg-white rounded-full focus:outline-none focus:ring-[1px] focus:ring-black placeholder:text-zinc-400"
              placeholder="search"
            />
          </form>
        </div>
        <div className="flex flex-1  w-full flex-row gap-8 justify-center items-center content-center">
          <Image
            src="/title.png"
            alt="Draw and Guess"
            width={400}
            height={50}
          />
        </div>
        <div className="flex flex-1 self-end w-full flex-row justify-center items-center content-center "></div>
      </div>
      <div className="w-full h-full grid grid-cols-3 gap-3">
        {rooms.map((room: Room) => (
          <div key={room.id} className="bg-gray-300 p-3">
            <div>
              {' '}
              {room.id} - {room.currentCapacity}/{room.capacity}
            </div>
            <span>{room.topic}</span>
            <Button
              onClick={() => joinRoom(room.id)}
              disabled={room.currentCapacity === room.capacity}
            >
              Join Room
            </Button>
          </div>
        ))}
      </div>{' '}
      <HostDialog user={session.user} router={router} socket={socket} />
    </div>
  );
};

export default Lobby;
