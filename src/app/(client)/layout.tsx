import { getSession } from '@/lib/auth';

interface ProductsLayoutProps {
  children: React.ReactNode;
}

export default async function ProductsLayout({
  children,
}: ProductsLayoutProps) {
  const session = await getSession();
  console.log('🚀 ~ file: layout.tsx:9 ~ session:', session);
  return (
    <div className="w-full h-full items-center justify-center">{children}</div>
  );
}
