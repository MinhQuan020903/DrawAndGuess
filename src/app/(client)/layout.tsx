interface ProductsLayoutProps {
  children: React.ReactNode;
}

export default async function ProductsLayout({
  children,
}: ProductsLayoutProps) {
  return (
    <div className="w-full h-full items-center justify-center">{children}</div>
  );
}
