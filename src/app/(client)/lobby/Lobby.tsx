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
import { CommonSvg } from '@/assets/CommonSvg';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { CiUser } from 'react-icons/ci';
import { IoChatbubbleOutline } from 'react-icons/io5';
import { TfiCup } from 'react-icons/tfi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@nextui-org/react';
import { Spinner } from '@nextui-org/react';
import { AiOutlineFilter } from 'react-icons/ai';
import Friend from './Friend';
import { set } from 'zod';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface Room {
  id: string;
  capacity: number;
  currentCapacity: number;
  topic: string;
  illustrationUrl: string;
}

const Lobby = ({ session }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userSocket, setUserSocket] = useState<Socket | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [onCreateRoom, setOnCreateRoom] = useState(false);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const getRandomAvailableRoomId = (rooms: Room[]): string | null => {
    const availableRooms = rooms.filter(
      (room) => room.currentCapacity < room.capacity
    );
    if (availableRooms.length === 0) {
      return null; // No available rooms
    }
    const randomIndex = Math.floor(Math.random() * availableRooms.length);
    return availableRooms[randomIndex].id;
  };
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

    //Friendlist
    const newUserSocket = io(
      `${process.env.NEXT_PUBLIC_SOCKET_BASE_URL}/user`,
      {
        transports: ['websocket'],
        query: {
          token: accessToken,
        },
      }
    );

    newUserSocket.on('connect', () => {
      console.log('Connected to server');
      newUserSocket.emit('subscribe-user', { user: session?.user });
    });

    setUserSocket(newUserSocket);

    if (newUserSocket) {
      newUserSocket.on('invite-friend-to-room', (data) => {
        if (data.receiver == session.user.username) {
          toast.info(
            <div className="w-full h-full flex flex-row justify-evenly">
              <span>
                {data.sender} invited you to join room {data.roomId}
              </span>
              <Button
                onClick={() => {
                  newUserSocket.emit('response-invite-friend-to-room', {
                    sender: data.sender,
                    receiver: data.receiver,
                    roomId: data.roomId,
                    accept: true,
                  });
                  router.push(`/game/${data.roomId}`);
                }}
              >
                Accept
              </Button>
              <Button
                onClick={() => {
                  newUserSocket.emit('response-invite-friend-to-room', {
                    sender: data.sender,
                    receiver: data.receiver,
                    roomId: data.roomId,
                    accept: false,
                  });
                }}
              >
                Reject
              </Button>
            </div>,
            {
              position: 'bottom-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
        }
      });
    }

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

      if (newUserSocket) {
        newUserSocket.disconnect();
        newUserSocket.off('connect');
      }
    };
  }, [session, router]);

  if (!session) {
    return <div>Loading...</div>; // or any loading indicator
  }
  const goBack = () => {
    router.push('/');
    // console.log('rooms', rooms);
  };
  return (
    <div className="h-4/5 w-4/5 bg-slate-300 relative z-10">
      <ToastContainer />
      <div className="w-full h-[90vh] flex flex-col gap-3">
        <div className="flex flex-row w-full  ">
          <div className="flex flex-1  w-full flex-row gap-8 justify-between items-center content-center ">
            <Button onClick={goBack} className=" w-1/6 flex m-3">
              {CommonSvg.back()}
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
          <div className="flex flex-1  w-full flex-row gap-8 justify-center items-center content-center ">
            <Image
              src="/title.png"
              alt="Draw and Guess"
              width={300}
              height={50}
            />
          </div>
          <Friend user={session.user} userSocket={userSocket}></Friend>
        </div>

        <div className="w-full h-2/3 overflow-y-auto grid grid-cols-4 gap-3 rounded-lg bg-slate-500 p-3">
          {rooms.map((room: Room) => (
            <Card
              aria-disabled={room.currentCapacity === room.capacity}
              key={room.id}
              className="h-full overflow-hidden rounded-sm bg-gray-300 p-3 shadow-md"
            >
              <div
                onClick={() => joinRoom(room.id)}
                className="flex flex-col items-center justify-center"
              >
                <Avatar
                  mr={2}
                  src={room.illustrationUrl}
                  size="lg"
                  className=" w-8 h-8 bg-slate-300"
                ></Avatar>
                <span>
                  {room.topic} {'/#id: '} {room.id}
                </span>
                <div className="grid grid-cols-3 gap-3 p-3 w-full h-full items-center justify-center content-center ">
                  <div className="flex flex-1 justify-center items-center">
                    <CiUser className="text-blue-500 mr-2" size={20} />
                    {room.currentCapacity}/{room.capacity}
                  </div>
                  <div className="flex flex-1 justify-center items-center">
                    <IoChatbubbleOutline
                      className="text-blue-500 mr-2"
                      size={20}
                    />
                    EN
                  </div>
                  <div className="flex flex-1 justify-center items-center">
                    <TfiCup className="text-blue-500 mr-2" size={20} />
                    {100}/{1000}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 p-3 w-1/2 self-center">
          <HostDialog user={session.user} router={router} socket={socket} />

          <Button
            className="self-center bg-orange-400 text-white  hover:bg-orange-500"
            onClick={() => {
              const id = getRandomAvailableRoomId(rooms);
              joinRoom(id);
            }}
          >
            JOIN RANDOM
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
