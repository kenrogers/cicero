import Link from "next/link";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="py-6 px-6 border-b border-foreground/10">
        <Link href="/" className="wordmark text-2xl">
          CICERO
        </Link>
      </header>
      <main className="min-h-screen">{children}</main>
      <footer className="py-8 text-center border-t border-foreground/10">
        <p className="text-sm text-muted-foreground">Fort Collins, Colorado</p>
      </footer>
    </>
  );
}
