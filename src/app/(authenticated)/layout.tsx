import { getSession, mustBeLoggedIn } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await mustBeLoggedIn();
  const session = await getSession();
  console.log('🚀 ~ session:', session);

  return (
    <div className="">
      <div className="w-full h-full">{children}</div>
    </div>
  );
}
