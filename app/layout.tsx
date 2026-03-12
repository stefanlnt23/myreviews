import type { Metadata } from 'next';
import { Barlow, Barlow_Condensed, Lora } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-barlow',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-barlow-condensed',
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
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
    <html lang="en">
      <body className={`${barlow.variable} ${barlowCondensed.variable} ${lora.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        <nav className="border-b-[1.5px] border-[#e8e4de] bg-white sticky top-0 z-50 h-[58px] flex items-center shadow-sm">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-tight text-[#111] font-heading hover:text-accent transition-colors">
                <span className="text-accent text-xl mr-1 inline-block group-hover:rotate-12 transition-transform">🔧</span>
                SoleToolkit
              </span>
            </Link>
            <div className="flex items-center">
              <span className="text-[13px] text-gray-500 font-sans hidden sm:inline-block">The UK&apos;s best tools, ranked.</span>
            </div>
          </div>
        </nav>
        
        <main className="flex-1">
          {children}
        </main>

        <footer className="bg-white border-t-[1.5px] border-[#e8e4de] py-10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="max-w-xl text-center md:text-left text-[12px] text-gray-500 font-sans">
              SoleToolkit is reader-supported. We may earn a commission when you click links on our site. This never affects our editorial independence.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-[13px] font-semibold font-heading text-gray-500 tracking-wide uppercase">
              <Link href="/" className="hover:text-[#111] transition-colors">Home</Link>
              <Link href="#" className="hover:text-[#111] transition-colors">About</Link>
              <Link href="#" className="hover:text-[#111] transition-colors">Contact</Link>
              <Link href="#" className="hover:text-[#111] transition-colors">Disclosure Policy</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

