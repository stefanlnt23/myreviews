import Link from 'next/link';

export default function LegalPage({
  title,
  lastUpdated,
  intro,
  children,
}: {
  title: string;
  lastUpdated: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <section className="bg-gradient-to-r from-[#1a1a1a] to-[#2d1a0a] border-b-[3px] border-accent/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <Link href="/" className="inline-block text-sm text-gray-300 hover:text-white transition-colors mb-6">
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">{title}</h1>
          <p className="text-gray-300 text-lg max-w-3xl">{intro}</p>
          <p className="text-xs uppercase tracking-widest text-accent font-bold mt-6">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <article className="bg-white rounded-2xl border border-[#e8e4de] shadow-sm p-6 md:p-10 prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-[#111] prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-[#111]">
          {children}
        </article>
      </section>
    </div>
  );
}
