import Register from './Register';
import { getProviders } from 'next-auth/react';

const Home = async () => {
  const providers = await getProviders();
  return (
    <div className="dark min-h-screen text-center items-center justify-center flex flex-col text-white">
      <div className="h-2/5 w-2/5 bg-slate-100">
        <h1 className="text-2xl text-orange-400">Draw and Guess</h1>
        <Register />
      </div>
    </div>
  );
};
export default Home;
