import type { Metadata } from 'next';
import { Barlow } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Wrench } from 'lucide-react';

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-barlow',
});

export const metadata: Metadata = {
  title: 'SoleToolkit | The UK\'s best tools for sole traders',
  description: 'Independent reviews covering accounting, invoicing, payments, websites and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${barlow.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        <nav className="border-b border-border bg-card sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <Wrench className="w-6 h-6 text-accent group-hover:rotate-12 transition-transform" />
              <span className="text-xl font-bold tracking-tight">SoleToolkit</span>
            </Link>
            <div className="flex items-center">
              {/* Optional dark mode toggle could go here; explicitly leaving out complex interactive logic since default is hard dark mode */}
              <span className="text-sm text-gray-400 hidden sm:inline-block">The UK&apos;s best tools, ranked.</span>
            </div>
          </div>
        </nav>
        
        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-border bg-card py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-400">
            <p className="max-w-xl text-center md:text-left">
              SoleToolkit is reader-supported. We may earn a commission when you click links on our site. This never affects our editorial independence.
            </p>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <Link href="#" className="hover:text-foreground transition-colors">About</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Disclosure Policy</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

