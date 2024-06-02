'use client';
import { use, useEffect, useState } from 'react';
import CustomCanvas from '@/components/CustomCanvas';
import { BsEraser } from 'react-icons/bs';
import { IoMdColorFill } from 'react-icons/io';
import { Slider } from '@/components/ui/slider';
import PlayHeader from '@/components/headers/playHeader';
import LeaderBoardComponent from '@/components/leaderboard/LeaderBoardComponent';
import { getSession } from 'next-auth/react';
import Loader from '@/components/Loader';
import { io } from 'socket.io-client';
import Chat from '../Chat';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Timer from '../Timer';
import { Player } from '@/types/types';

export default function Page({ params }: { params: { slug: string } }) {
  const [color, setColor] = useState('#000000'); // Brush color
  const [clear, setClear] = useState(false); // Clear Mode 0 or 1
  const [selected, setSelected] = useState(0); // Color mode 0 to 5
  const [fillMode, setFillMode] = useState(false); // Paint/fill mode
  const [brushSize, setBrushSize] = useState(10);

  const [socket, setSocket] = useState<any>(null);
  const [room, setRoom] = useState<any>(null); // Room
  const [keyword, setKeyword] = useState(''); // Game keyword
  const [maxScore, setMaxScore] = useState(0); // Max score
  const [isPlaying, setIsPlaying] = useState(false); // Game status [playing or not playing]
  const [isPlayer, setIsPlayer] = useState(false); // Player status [player or not player]
  const [newGame, setNewGame] = useState(true); // New game [true or false]

  const totalTimer = 15000;
  const [timer, setTimer] = useState(totalTimer); // Timer [15 seconds]
  const [players, setPlayers] = useState<Player[]>([]);

  const colors = {
    black: '#000000',
    brown: '#732620',
    red: '#e61e10',
    yellow: '#e6c510',
    green: '#65e610',
    'dark green': '#2d5c0e',
    cyan: '#00FFFF',
    blue: ' #000080',
    eraser: '#ffffff',
  }; // Players in the game [leaderboard]

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  //Get session
  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
      setLoading(false);
    };

    fetchSession();
  }, []);

  //Connect socket
  useEffect(() => {
    if (session && !socket) {
      const accessToken = session?.user?.access_token;
      const newSocket = io(`${process.env.NEXT_PUBLIC_SOCKET_BASE_URL}/draw`, {
        transports: ['websocket'],
        query: {
          token: accessToken,
        },
      });
      setSocket(newSocket);
    }
  }, [session, socket]);

  //Start game
  useEffect(() => {
    if (socket) {
      //Subscribe to room
      socket.emit('subscribe-room', {
        roomId: params.slug,
        user: session?.user,
      });

      const handleSubscribed = (data) => {
        setPlayers(data);
      };

      socket.on('subscribed', handleSubscribed);

      //Get room detail
      socket.emit('get-room-detail', { roomId: params.slug });

      socket.on('room-detail', (data) => {
        console.log('Room Detail', data);
        setRoom(data);
        setMaxScore(data.maxScore);
      });

      //Start game
      const handleStartGame = (data: any) => {
        setNewGame(false);
        setIsPlaying(true);

        console.log('Game Started', data);

        //Check if you are the player
        if (data.userId === session?.user?.id) {
          setIsPlayer(true);
          console.log('You are the player!');
        } else {
          setIsPlayer(false);
        }
      };

      socket.on('server-start-game', handleStartGame);

      if (isPlayer) {
        console.log('getting keyword...');
        socket.emit('get-keyword', {
          roomId: params.slug,
          userId: session?.user?.id,
        });
      }
      socket.on('keyword', (data: any) => {
        console.log('Keyword Received', data);
        setKeyword(data.message);
        toast.info('You are the drawer! The keyword is: ' + data.message);
      });

      socket.on('player-disconnect', (data) => {
        console.log('some player disconnected', data);
        setPlayers(data);
      });

      // Clean up event listeners
      return () => {
        socket.off('subscribe-room');
        socket.off('subscribed', handleSubscribed);
        socket.off('player-disconnect');
        socket.off('server-start-game', handleStartGame);
        socket.off('get-room-detail');
        socket.off('room-detail');
        socket.off('get-keyword');
        socket.off('keyword');
      };
    }
  }, [socket, session, params.slug, isPlayer]);

  //Check timer, if timer is 0, end game
  useEffect(() => {
    if (!socket) return;
    const handleDrawerScore = (data) => {
      console.log('🚀 ~ socket.on drawerscore~ data:', data);
      setPlayers((prevPlayers: Player[]) => {
        return prevPlayers.map((player) => {
          if (player.id == data.userId) {
            return {
              ...player,
              points: player.points + data.guessPoint,
            };
          }
          return player;
        });
      });
    };

    socket.on('drawer-score', handleDrawerScore);

    if (timer === 0) {
      setIsPlaying(false);

      if (isPlayer) socket.emit('end-game', { roomId: params.slug });

      setIsPlayer(false);
    }

    //Listen to end game event (when there is a winner)
    //(The winner is the player who reaches the maxScore first and has the highest score)
    socket.on('found-winner', (data) => {
      console.log('🚀 ~ socket.on found-winner~ data:', data);
      if (data.id == session?.user?.id) {
        toast.success('Congratulations, you are the winner!');
      } else {
        toast.info('Game Ended, The winner is: ' + data.detail.username);
      }
      setNewGame(true);
    });

    return () => {
      socket.off('end-game');
      socket.off('drawer-score', handleDrawerScore);
      socket.off('found-winner');
    };
  }, [socket, timer]);

  //Handle start game when click button
  const startGame = () => {
    if (players.length < 2) {
      toast.error('You need at least 2 players to start the game!');
      return;
    }
    console.log('Starting game..fsdafsdfaf.');
    socket.emit('start-game', { roomId: params.slug, newGame: newGame });
  };

  if (loading || !socket || !session) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-4 min-h-screen text-white p-24">
      <ToastContainer />
      <PlayHeader socket={socket} user={session?.user} roomId={params.slug} />
      {/* Body */}
      <div className="flex flex-row grow gap-4">
        <div className="w-[25%] flex">
          <LeaderBoardComponent
            socket={socket}
            isPlaying={isPlaying}
            players={players}
            setPlayers={setPlayers}
          />
        </div>
        <div className="w-[75%] flex flex-row rounded-md gap-3 justify-between">
          <div className="flex flex-col gap-3">
            <CustomCanvas
              fillMode={fillMode}
              brushSize={brushSize}
              clear={clear}
              setClear={setClear}
              color={color}
              session={session}
              roomId={params.slug}
              socket={socket}
              isPlayer={isPlayer}
              isPlaying={isPlaying}
              className={`${isPlaying ? 'h-[90%]' : 'h-full'} w-full bg-white`}
            ></CustomCanvas>
            <div className="w-full h-[10%]">
              {isPlaying && (
                <Timer
                  timer={timer}
                  setTimer={setTimer}
                  totalTimer={totalTimer}
                />
              )}
            </div>
          </div>

          {isPlaying && (
            <Chat
              socket={socket}
              user={session?.user}
              roomId={params.slug}
              isPlayer={isPlayer}
              keyword={keyword}
              timer={timer}
              totalTimer={totalTimer}
              setPlayers={setPlayers}
              className="w-[30%] h-full border-3 bg-white rounded-md"
            ></Chat>
          )}
        </div>
        {/* <div className="basis-1/4 flex bg-green-400 rounded-full">
          <ChatComponent />
        </div> */}
      </div>
      <div className="flex flex-row grow gap-4">
        <div className="basis-1/4 flex "></div>
        <div className="basis-3/4 flex flex-col ">
          <div className="flex flex-row grow gap-2 justify-center items-center">
            {isPlayer && (
              <div className="flex flex-row grow gap-2 justify-center items-center">
                <div>{keyword}</div>
                {Object.entries(colors).map(([key, value], index) => (
                  <button
                    key={key}
                    className={
                      selected === index
                        ? ' border-white border-2 text-white'
                        : 'border-black border-2'
                    }
                    onClick={() => {
                      setColor(value);
                      setSelected(index);
                    }}
                  >
                    <div
                      className="color-square w-8 h-8"
                      style={{ backgroundColor: value }}
                    ></div>
                  </button>
                ))}

                <button
                  onClick={() => {
                    setClear(true);
                  }}
                >
                  <div
                    className="color-square w-8 h-8 border-1 border-white items-center justify-center flex"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <BsEraser fill="black" />
                  </div>
                </button>

                <button
                  className="flex flex-row gap-2 items-center"
                  onClick={() => {
                    setFillMode(!fillMode);
                  }}
                >
                  <div style={{}} className="h-4 w-4 rounded-full">
                    <IoMdColorFill fill={fillMode ? 'lime' : 'red'} />
                  </div>
                </button>
                <div className="flex w-[75%] h-10 bg-gray-500 rounded-full">
                  <Slider
                    defaultValue={[5]}
                    onValueChange={(value: number[]) => {
                      setBrushSize(value[0]);
                    }}
                    max={20}
                    min={1}
                    step={1}
                  />
                </div>
              </div>
            )}

            {!isPlaying && (
              <button
                onClick={() => {
                  startGame();
                }}
              >
                <div className="color-square w-16 h-16 p-2 rounded-lg border-1 bg-yellow-400 border-white items-center justify-center flex">
                  Play
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
