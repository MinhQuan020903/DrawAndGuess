'use client';
import { getSession } from '@/lib/auth';
import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import HostDialog from './HostDialog';

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

  return (
    <div className="w-full h-full flex flex-col gap-3">
      {' '}
      <HostDialog
        user={session.user}
        router={router}
        socket={socket}
      />
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
      </div>
    </div>
  );
};

export default Lobby;
