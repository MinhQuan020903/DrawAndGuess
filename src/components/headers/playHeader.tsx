import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function PlayHeader() {
  const router = useRouter();
  return (
    <h1 className="w-full  px-5 md:px-10 mx-auto flex justify-between flex-col md:flex-row gap-[50px] md:gap-[50px]">
      <div className="flex flex-col gap-3 shrink-0">
        {/* <Image
        src={'/images/logo.png'}
        alt={'Draw and Guess'}
        width={300}
        height={100}
        className="start-0 float-start"
      /> */}
        <div className="font-oswald font-extrabold uppercase text-5xl cursor-pointer justify-center align-middle ">
          <span className="text-cyan-600">Draw and </span>
          <span className="text-orange-300">Guess</span>
        </div>
      </div>

      {/* MENU END */}
      <div className="flex flex-col gap-3 shrink-0 justify-center align-middle"></div>

      <div className="flex flex-col gap-3 shrink-0 justify-center align-middle">
        <Button className="w-full" onClick={() => router.push('/')}>
          X
        </Button>
      </div>
    </h1>
  );
}
