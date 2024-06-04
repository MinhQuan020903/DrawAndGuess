import Login from './Login';
import { getProviders } from 'next-auth/react';

const Home = async () => {
  const providers = await getProviders();
  return (
    <div className="dark min-h-screen text-center items-center justify-center flex flex-col text-white p-8 gap-4">
      <div className="h-3/5 w-2/5  bg-white relative z-10 rounded-lg border-4 shadow-inner gap-4">
        <div className="flex-wrap w-full text-5xl text-center ">
          <span className="font-bold flex-wrap ext-5xl text-center text-yellow-400 font-dotGothic16">
            DRAW AND
          </span>
          <span className="font-bold flex-wrap ext-5xl text-center text-blue-500 font-dotGothic16">
            &nbsp;GUESS
          </span>
        </div>
        <Login providers={providers} />
      </div>
    </div>
  );
};
export default Home;
