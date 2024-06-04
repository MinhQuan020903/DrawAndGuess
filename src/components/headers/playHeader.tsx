import { Button } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function PlayHeader({ socket, user, roomId }) {
  const router = useRouter();

  const exitGame = () => {
    if (!socket) return;
    socket.emit('exit-room', {
      roomId: roomId,
      id: user.id,
      username: user.username,
    });
    router.push('/');
  };
  return (
    <h1 className="w-full  md:px-8 mx-auto flex justify-between flex-row gap-[50px] md:gap-[50px]">
      <div className="flex flex-col gap-3 shrink-0">
        {/* <Image
        src={'/images/logo.png'}
        alt={'Draw and Guess'}
        width={300}
        height={100}
        className="start-0 float-start"
      /> */}
        <div className="flex-wrap w-full text-5xl text-center justify-center items-center flex">
          <span className="font-bold flex-wrap ext-5xl text-center text-yellow-400 font-dotGothic16">
            DRAW AND
          </span>
          <span className="font-bold flex-wrap ext-5xl text-center text-blue-500 font-dotGothic16">
            &nbsp;GUESS
          </span>
        </div>
      </div>

      {/* MENU END */}
      <div className="flex flex-col gap-3 shrink-0 justify-center align-middle"></div>

      <div className="flex flex-col gap-3 shrink-0 justify-center align-middle">
        <Button
          shadow={'outline'}
          bgColor={'red.400'}
          fontWeight={'bold'}
          rounded={'xl'}
          _hover={{
            bgColor: 'red.500',
          }}
          textColor={'white'}
          className="w-full"
          onClick={exitGame}
        >
          X
        </Button>
      </div>
    </h1>
  );
}
