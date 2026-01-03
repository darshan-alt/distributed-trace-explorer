import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Distributed Trace Explorer",
  description: "Visualize request flow and latency across your services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="glass sticky-nav">
          <div className="container nav-content">
            <Link href="/" className="logo">
              Trace<span>Explorer</span>
            </Link>
            <div className="nav-links">
              <Link href="/traces">Traces</Link>
              <Link href="/about">About</Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        
        <style dangerouslySetInnerHTML={{ __html: `
          .sticky-nav {
            position: sticky;
            top: 0;
            z-index: 100;
            height: 64px;
            display: flex;
            align-items: center;
          }
          .nav-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }
          .logo {
            font-size: 1.25rem;
            font-weight: 700;
            letter-spacing: -0.03em;
          }
          .logo span {
            font-weight: 400;
            color: var(--secondary);
          }
          .nav-links {
            display: flex;
            gap: 2rem;
          }
          .nav-links a {
            font-size: 0.9375rem;
            font-weight: 500;
            color: var(--secondary);
            transition: var(--transition);
          }
          .nav-links a:hover {
            color: var(--foreground);
          }
        `}} />
      </body>
    </html>
  );
}
