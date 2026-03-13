'use client';

import { useState, useEffect } from 'react';
import { Review } from '../types';
import ReviewCard from './ReviewCard';
import { cn } from '../lib/utils';
import { ArrowLeft, Database, LayoutGrid, AlertTriangle, ShieldCheck, Star } from 'lucide-react';

const CATEGORY_MAP: Record<string, { name: string; image: string }> = {
  'ACCOUNTING': { name: 'Accounting', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80' },
  'INVOICING': { name: 'Invoicing', image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&q=80' },
  'WEBSITE BUILDER': { name: 'Websites', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80' },
  'PAYMENTS': { name: 'Payments', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80' },
  'JOB MANAGEMENT': { name: 'Jobs', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80' },
  'INSURANCE': { name: 'Insurance', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80' },
};

export default function HomepageClient({ initialReviews }: { initialReviews: Review[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const target = new Date('2026-04-06T00:00:00Z');

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  const newlyAdded = initialReviews.filter((r) => r.isNew);
  const topRated = initialReviews.filter((r) => r.score >= 8.2);
  const filteredReviews = activeCategory ? initialReviews.filter((r) => r.category === activeCategory) : [];

  const getCategoryCount = (cat: string) => initialReviews.filter((r) => r.category === cat).length;

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#2d1a0a] pt-24 pb-28">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-[#2d8a6b]/30 bg-[#e8f4f0] shadow-sm">
            <span className="text-xl leading-none">🇬🇧</span>
            <span className="text-[#2d8a6b] text-[12px] font-bold uppercase tracking-widest font-heading">
              100% UK-Focused · Updated Regularly
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-normal text-white font-heading mb-6 drop-shadow-lg">
            The best tools for <span className="text-accent italic font-normal px-2">UK sole traders.</span> Ranked.
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 font-serif italic max-w-3xl mx-auto mb-10 opacity-90">
            Independent, brutally honest reviews of software for plumbers, electricians, builders, mechanics, and service businesses.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-heading shadow-xl backdrop-blur-md">
              <div className="p-2 bg-accent/20 rounded-lg text-accent">
                <Database className="w-6 h-6" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-white text-xl leading-none">{initialReviews.length} Tools</span>
                <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mt-1">Reviewed</span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-heading shadow-xl backdrop-blur-md">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-white text-xl leading-none">{Object.keys(CATEGORY_MAP).length} Categories</span>
                <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mt-1">Covered</span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-heading shadow-xl backdrop-blur-md">
              <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-white text-xl leading-none">Apr &apos;26</span>
                <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mt-1">MTD Deadline</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-[#ece7df]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <ShieldCheck className="w-5 h-5 text-[#2d8a6b]" />
            <span><strong>Independent scoring:</strong> affiliate payouts don&apos;t change rank.</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Star className="w-5 h-5 text-accent" />
            <span><strong>UK-first lens:</strong> VAT, MTD, invoicing, and day-to-day practicality.</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Database className="w-5 h-5 text-blue-500" />
            <span><strong>Clear breakdowns:</strong> pricing, pros/cons, and who each tool is for.</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#111] mb-3">Browse by category</h2>
          <p className="text-gray-600 font-serif italic">Pick your lane and we&apos;ll show only the relevant tools.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {Object.entries(CATEGORY_MAP).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key === activeCategory ? null : key)}
              className={cn(
                'text-left rounded-2xl overflow-hidden border-[1.5px] transition-all duration-300 bg-white shadow-sm hover:-translate-y-1 hover:shadow-lg',
                activeCategory === key ? 'border-accent ring-2 ring-accent/25' : 'border-[#e8e4de]'
              )}
            >
              <div className="h-32 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={info.image} alt={info.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white font-heading font-bold tracking-wide uppercase text-xs">
                  {getCategoryCount(key)} listed
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-heading font-extrabold text-2xl text-[#111]">{info.name}</h3>
              </div>
            </button>
          ))}
        </div>

        {activeCategory && (
          <section className="mb-16 bg-[#fcfaf7] border border-[#e8e4de] rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
              <h3 className="text-2xl font-heading font-extrabold text-[#111]">{CATEGORY_MAP[activeCategory].name} picks</h3>
              <button onClick={() => setActiveCategory(null)} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-500 hover:text-[#111]">
                <ArrowLeft className="w-4 h-4" /> Clear filter
              </button>
            </div>
            {filteredReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredReviews.map((review) => (
                  <ReviewCard key={review.slug} review={review} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 font-serif italic">No tools in this category yet — more are being added.</p>
            )}
          </section>
        )}

        <section className="mb-16 grid lg:grid-cols-3 gap-6">
          <div className="bg-white border border-[#e8e4de] rounded-2xl p-6">
            <h3 className="font-heading font-extrabold text-2xl text-[#111] mb-3">How we test</h3>
            <p className="text-gray-700 text-sm leading-relaxed">We score each tool for usability, value for money, UK relevance, and practical usefulness for real day-to-day jobs.</p>
          </div>
          <div className="bg-white border border-[#e8e4de] rounded-2xl p-6">
            <h3 className="font-heading font-extrabold text-2xl text-[#111] mb-3">Who this is for</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Sole traders, one-person firms, and small crews who need software that saves time and gets paid faster.</p>
          </div>
          <div className="bg-white border border-[#e8e4de] rounded-2xl p-6">
            <h3 className="font-heading font-extrabold text-2xl text-[#111] mb-3">No fluff promise</h3>
            <p className="text-gray-700 text-sm leading-relaxed">No fake hype. Clear pros and cons. If the product page is vague, we tell you it&apos;s vague.</p>
          </div>
        </section>

        {initialReviews.length === 0 && (
          <section className="mb-16 bg-white border border-[#e8e4de] rounded-2xl p-8 text-center">
            <h3 className="font-heading font-extrabold text-3xl text-[#111] mb-3">Reviews are loading</h3>
            <p className="text-gray-600 font-serif italic max-w-xl mx-auto">We&apos;re pulling fresh tool data. Check back shortly — the homepage sections are live and the latest reviews will appear once connected.</p>
          </section>
        )}

        {newlyAdded.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-heading font-extrabold tracking-normal text-[#111]">Newly Added</h2>
              <span className="bg-[#fef3e8] text-[#d4720a] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest font-heading border border-[#d4720a]/20">Fresh 🔥</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newlyAdded.map((review) => (
                <ReviewCard key={review.slug} review={review} />
              ))}
            </div>
          </section>
        )}

        {topRated.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-heading font-extrabold tracking-normal text-[#111]">Top Rated</h2>
              <span className="bg-[#e8f4f0] text-[#2d8a6b] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest font-heading border border-[#2d8a6b]/20">Best of the best 🏆</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topRated.map((review) => (
                <ReviewCard key={review.slug} review={review} />
              ))}
            </div>
          </section>
        )}

        <section className="bg-gradient-to-r from-[#1a1a1a] to-[#2d1a0a] rounded-3xl p-8 md:p-14 border-[3px] border-accent/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none animate-pulse" />

          <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
            <div className="flex-1 w-full max-w-3xl">
              <div className="flex items-center gap-2 text-red-400 text-sm font-bold uppercase tracking-widest font-heading mb-4">
                <AlertTriangle className="w-5 h-5 animate-pulse" /> Urgent Deadline
              </div>
              <h3 className="text-4xl md:text-5xl font-heading font-extrabold text-white leading-tight mb-8">Making Tax Digital (MTD) starts in:</h3>

              {timeLeft && (
                <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-8">
                  {[
                    { label: 'Days', value: timeLeft.days.toString() },
                    { label: 'Hours', value: timeLeft.hours.toString().padStart(2, '0') },
                    { label: 'Mins', value: timeLeft.minutes.toString().padStart(2, '0') },
                    { label: 'Secs', value: timeLeft.seconds.toString().padStart(2, '0'), accent: true },
                  ].map((item) => (
                    <div key={item.label} className={cn('flex flex-col items-center justify-center rounded-2xl p-4 min-w-[80px] md:min-w-[100px] border', item.accent ? 'bg-accent/20 border-accent/40' : 'bg-black/40 border-white/10')}>
                      <span className={cn('text-4xl md:text-5xl font-heading font-extrabold tabular-nums drop-shadow-md', item.accent ? 'text-accent' : 'text-white')}>{item.value}</span>
                      <span className={cn('text-[10px] md:text-[11px] uppercase tracking-widest font-bold mt-1', item.accent ? 'text-accent' : 'text-red-400')}>{item.label}</span>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-lg text-gray-300 font-serif italic mb-6">By April 2026, sole traders over £50k must keep digital records and use MTD-compatible software. Don&apos;t leave this to the last week.</p>
            </div>

            <div className="shrink-0 w-full xl:w-auto flex flex-col items-center xl:items-end gap-3">
              <a
                href="https://www.gov.uk/guidance/check-if-youre-eligible-for-making-tax-digital-for-income-tax"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center px-10 py-5 bg-accent hover:bg-[#cc5200] text-white font-heading font-extrabold text-xl rounded-[12px] transition-all duration-300 shadow-xl shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1 block"
              >
                Check MTD Eligibility →
              </a>
              <span className="text-gray-400 text-xs italic font-serif opacity-80">Links to official Gov.uk guidance</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
