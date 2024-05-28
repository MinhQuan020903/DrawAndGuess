import Login from '@/components/logins/Login';
import { getProviders } from 'next-auth/react';

const Home = async () => {
  const providers = await getProviders();
  return (
    <div className="dark min-h-screen text-center items-center justify-center flex flex-col text-white">
      <div className="h-4/5 w-4/5 bg-gray-700">
        <h1 className="text-2xl">Draw and Guess</h1>
        <Login providers={providers} />
      </div>
    </div>
  );
};
export default Home;
