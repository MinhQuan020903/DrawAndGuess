import { getSession, mustBeLoggedIn } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return <div className="w-full h-full">{children}</div>;
}
