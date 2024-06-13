'use client';
import { getSession } from '@/lib/auth';
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
} from '@chakra-ui/react';
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
import Friend from './Friend';
import { set } from 'zod';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DialogCustom from '@/components/DialogCustom';
import { FaSearch } from 'react-icons/fa';
import * as ScrollArea from '@radix-ui/react-scroll-area';
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
  const navigateToRoom = (roomId: string) => {
    router.push(`/game/${roomId}`);
  };
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
            <div className="flex flex-row justify-evenly gap-3">
              <span className="w-[70%] font-semibold">
                {data.sender} invited you to join room {data.roomId}
              </span>
              <div className="w-[30%] flex flex-col gap-3">
                <Button
                  dropShadow={'outline'}
                  bgColor={'green.300'}
                  rounded={'xl'}
                  size={'sm'}
                  _hover={{
                    boxShadow: 'outline',
                    shadow: 'outline',
                    bgColor: 'green.500',
                  }}
                  textColor={'white'}
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
                  dropShadow={'outline'}
                  bgColor={'red.400'}
                  rounded={'xl'}
                  size={'sm'}
                  _hover={{
                    boxShadow: 'outline',
                    shadow: 'outline',
                    bgColor: 'red.500',
                  }}
                  textColor={'white'}
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
              </div>
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

  const [isLoadingRoom, setIsLoadingRoom] = useState(false);

  if (!session || isLoadingRoom) {
    return (
      <DialogCustom
        className="w-[90%] lg:w-[50%] h-fit items-center justify-center rounded-lg"
        isModalOpen={!session || isLoadingRoom}
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
    ); // or any loading indicator
  }
  const goBack = () => {
    router.push('/');
    // console.log('rooms', rooms);
  };
  return (
    <div className=" w-4/5 bg-white border-yellow-400 border-4 relative z-10 rounded-3xl p-5 shadow-inner drop-shadow-3xl">
      <ToastContainer />
      <div className="w-full h-auto flex flex-col gap-3">
        <div className="flex flex-row w-full h-20 items-center justify-center px-8">
          <div className="flex flex-1 w-full flex-row gap-8 justify-between items-center content-center ">
            <Button
              dropShadow={'outline'}
              bgColor={'blue.600'}
              rounded={'xl'}
              _hover={{
                boxShadow: 'outline',
                shadow: 'outline',
                bgColor: 'blue.500',
              }}
              className="px-4 py-1"
              onClick={goBack}
            >
              {CommonSvg.back()}
            </Button>
            <form className="h-full items-center justify-center w-5/6 rounded-md">
              <InputGroup>
                <InputLeftElement
                  h="100%"
                  pointerEvents="none"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FaSearch color="gray" />
                </InputLeftElement>
                <Input
                  size={'lg'}
                  shadow={'sm'}
                  value={searchQuery || ''}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault(); // Prevent form submission
                      navigateToRoom(searchQuery);
                    }
                  }}
                  className="h-full px-5 w-2/3 sm:px-5 flex-1 text-zinc-800 bg-zinc-100 focus:bg-white rounded-full focus:outline-none focus:ring-[1px] focus:ring-black placeholder:text-zinc-400"
                  placeholder="Search room..."
                />
              </InputGroup>
            </form>
          </div>
          <div className="flex flex-1  w-full flex-row gap-8 justify-center items-center content-center ">
            <span className="text-7xl font-bold text-yellow-400 font-dotGothic16">
              LOBBY
            </span>
          </div>
          <Friend user={session.user} userSocket={userSocket}></Friend>
        </div>

        <ScrollArea.Root className="w-full h-[55vh] rounded-2xl">
          <ScrollArea.Viewport className="ScrollAreaViewport">
            <div className="w-full h-2/3 p-3 rounded-lg bg-slate-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {rooms.map((room: Room) => (
                  <Card
                    aria-disabled={room.currentCapacity === room.capacity}
                    key={room.id}
                    className="h-full overflow-hidden rounded-lg bg-white p-3 shadow-md hover:bg-slate-200 hover:shadow-lg hover:border-4 hover:border-yellow-500 cursor-pointer transition-all duration-100 ease-in-out"
                  >
                    <div
                      onClick={() => joinRoom(room.id)}
                      className="flex flex-col items-center justify-center"
                    >
                      <div className="w-fit h-fit rounded-full border-4 border-slate-300 shadow-lg p-1">
                        <Avatar
                          boxShadow={'lg'}
                          src={room.illustrationUrl}
                          size="lg"
                          className=" w-8 h-8 bg-slate-300"
                        ></Avatar>
                      </div>

                      <div className="w-full h-fit flex flex-row justify-center items-center gap-4">
                        <span className="font-bold text-md">{room.topic}</span>
                        <span>
                          {'#'} {room.id}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 p-3 w-full h-full items-center justify-center content-center font-semibold">
                        <div
                          className={`flex flex-1 justify-center items-center ${
                            room.currentCapacity === room.capacity
                              ? 'text-red-500'
                              : 'text-green-500'
                          }`}
                        >
                          <CiUser className="mr-2" size={20} />
                          {room.currentCapacity}/{room.capacity}
                        </div>
                        <div className="flex flex-1 justify-center items-center">
                          <IoChatbubbleOutline
                            className="text-blue-500 mr-2"
                            size={20}
                          />
                          EN
                        </div>
                        {/* <div className="flex flex-1 justify-center items-center">
                          <TfiCup className="text-blue-500 mr-2" size={20} />
                          {100}/{}
                        </div> */}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="ScrollAreaScrollbar"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="ScrollAreaThumb" />
          </ScrollArea.Scrollbar>
          <ScrollArea.Scrollbar
            className="ScrollAreaScrollbar"
            orientation="horizontal"
          >
            <ScrollArea.Thumb className="ScrollAreaThumb" />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner className="ScrollAreaCorner" />
        </ScrollArea.Root>

        <div className="h-16 w-full flex flex-row gap-10 justify-center items-center">
          <HostDialog
            user={session.user}
            router={router}
            socket={socket}
            setIsLoadingRoom={setIsLoadingRoom}
          />

          <Button
            dropShadow={'outline'}
            bgColor={'yellow.500'}
            rounded={'xl'}
            _hover={{
              boxShadow: 'outline',
              shadow: 'outline',
              bgColor: 'yellow.400',
            }}
            textColor={'white'}
            onClick={() => {
              setIsLoadingRoom(true);
              const id = getRandomAvailableRoomId(rooms);
              joinRoom(id);
            }}
          >
            Join Random
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
