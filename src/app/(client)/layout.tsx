import { getSession, mustBeLoggedIn } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await mustBeLoggedIn();
  const session = await getSession();

  return <div className="w-full h-full">{children}</div>;
}
