'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Login from './Login';
import { getProviders } from 'next-auth/react';
const LoginComponent = async () => {
  const providers = await getProviders();

  function CreateGame() {
    fetch('/api/CreateGame')
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  }
  const router = useRouter();
  return (
    <div className="flex flex-col grow  gap-4">
      <div className="h-[100%] w-[100%] lg:w-1/2 overflow-auto">
        <div className="flex flex-row gap-2">
          <span>Username: </span>
          <input className="p-2 text-black" placeholder="boby"></input>
        </div>
        <div className="flex flex-row gap-2">
          <span>Game Code: </span>
          <input className="p-2 text-black" placeholder="SJKHNQ"></input>
        </div>
        <Button onClick={() => router.push('game/1')}>Join Game</Button>
      </div>
      <div className="h-[100%] w-[100%] lg:w-1/2 overflow-auto">
        <Login providers={providers} />
      </div>
    </div>
  );
};
