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
        <nav className="border-b-[1.5px] border-[#e8e4de] bg-white/95 backdrop-blur sticky top-0 z-50 min-h-[58px] flex items-center shadow-sm">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2 group relative">
              <span className="text-2xl font-black tracking-tight text-[#111] font-heading hover:text-accent transition-colors flex items-center">
                <span className="text-accent text-xl mr-1 inline-block group-hover:rotate-12 transition-transform">🔧</span>
                SoleToolkit
                <span className="ml-2 text-xl" title="UK Only" aria-label="United Kingdom">🇬🇧</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-[13px] text-gray-500 font-sans hidden md:inline-block">The UK&apos;s best tools, ranked.</span>
              <Link href="/privacy-policy" className="text-xs md:text-sm font-heading font-bold uppercase tracking-wide text-gray-500 hover:text-[#111] transition-colors">
                Legal
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          {children}
        </main>

        <footer className="bg-gradient-to-b from-white to-[#f8f5f0] border-t-[1.5px] border-[#e8e4de] py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-[#111] mb-2">SoleToolkit</h3>
                <p className="max-w-xl text-[12px] text-gray-600 font-sans leading-relaxed">
                  SoleToolkit is reader-supported. We may earn a commission when you click links on our site. This never affects our editorial independence.
                </p>
              </div>

              <div>
                <h4 className="font-heading text-xs tracking-widest uppercase text-gray-500 font-bold mb-3">Explore</h4>
                <div className="flex flex-wrap gap-4 text-[13px] font-semibold font-heading text-gray-600 tracking-wide uppercase">
                  <Link href="/" className="hover:text-[#111] transition-colors">Home</Link>
                  <Link href="/affiliate-disclosure" className="hover:text-[#111] transition-colors">Disclosure</Link>
                </div>
              </div>

              <div>
                <h4 className="font-heading text-xs tracking-widest uppercase text-gray-500 font-bold mb-3">Legal</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px] font-semibold font-heading text-gray-600 tracking-wide uppercase">
                  <Link href="/privacy-policy" className="hover:text-[#111] transition-colors">Privacy Policy</Link>
                  <Link href="/cookie-policy" className="hover:text-[#111] transition-colors">Cookie Policy</Link>
                  <Link href="/terms-and-conditions" className="hover:text-[#111] transition-colors">Terms</Link>
                  <Link href="/affiliate-disclosure" className="hover:text-[#111] transition-colors">Affiliate Disclosure</Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
