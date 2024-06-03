import Login from './Login';
import { getProviders } from 'next-auth/react';

const Home = async () => {
  const providers = await getProviders();
  return (
    <div className="dark min-h-screen text-center items-center justify-center flex flex-col text-white">
      <div className="h-2/5 w-2/5 bg-slate-300">
        <h1 className="text-2xl text-orange-400">Draw and Guess</h1>
        <Login providers={providers} />
      </div>
    </div>
  );
};
export default Home;
