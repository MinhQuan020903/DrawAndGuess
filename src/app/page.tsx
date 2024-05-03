import LoginComponent from '@/components/LoginComponent';
export default function Home() {
  return (
    <div className="dark min-h-screen text-center items-center justify-center flex flex-col text-white">
      <div className="h-96 bg-gray-700">
        <h1 className="text-2xl">Draw and Guess</h1>
        <LoginComponent />
      </div>
    </div>
  );
}
