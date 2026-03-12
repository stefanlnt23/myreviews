'use client';

import { useState, useEffect } from 'react';
import { Review } from '../types';
import ReviewCard from './ReviewCard';
import { cn } from '../lib/utils';
import { ArrowLeft, Database, LayoutGrid, AlertTriangle } from 'lucide-react';

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

  const newlyAdded = initialReviews.filter(r => r.isNew);
  const topRated = initialReviews.filter(r => r.score >= 8.2);
  const filteredReviews = activeCategory ? initialReviews.filter(r => r.category === activeCategory) : [];

  const getCategoryCount = (cat: string) => initialReviews.filter(r => r.category === cat).length;

  return (
    <div className="pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#2d1a0a] pt-24 pb-32">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-accent/40 bg-accent/10">
            <span className="text-accent text-[11px] font-bold uppercase tracking-widest font-heading">
              🇬🇧 UK-Focused &middot; Updated Regularly
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-normal text-white font-heading mb-6 drop-shadow-lg">
            The best tools for <span className="text-accent italic font-normal px-2">UK sole traders.</span> Ranked.
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 font-serif italic max-w-2xl mx-auto mb-10 opacity-90">
            Independent, brutally honest reviews of the software you actually need to run your business.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-heading shadow-xl backdrop-blur-md transition-transform hover:-translate-y-1">
              <div className="p-2 bg-accent/20 rounded-lg text-accent">
                <Database className="w-6 h-6" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-white text-xl leading-none">{initialReviews.length} Tools</span>
                <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mt-1">Reviewed</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-heading shadow-xl backdrop-blur-md transition-transform hover:-translate-y-1">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-white text-xl leading-none">{Object.keys(CATEGORY_MAP).length} Cats</span>
                <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mt-1">Covered</span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-heading shadow-xl backdrop-blur-md transition-transform hover:-translate-y-1">
              <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-white text-xl leading-none">Apr '26</span>
                <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mt-1">MTD Deadline</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        
        {/* 2. BROWSE BY CATEGORY */}
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(CATEGORY_MAP).map(([key, cat]) => {
              const count = getCategoryCount(key);
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(isActive ? null : key)}
                  className={cn(
                    "relative flex flex-col items-center justify-end p-6 h-40 rounded-[20px] overflow-hidden transition-all duration-300 hover:-translate-y-[4px] shadow-sm hover:shadow-xl group border-2",
                    isActive ? "border-accent scale-105 shadow-xl ring-2 ring-accent ring-offset-2" : "border-transparent"
                  )}
                >
                  {/* Background Image Details */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${cat.image})` }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/100 via-[#1a1a1a]/60 to-black/20 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center text-white mt-auto w-full">
                    <span className="font-heading font-extrabold text-[22px] uppercase tracking-wider text-center leading-tight mb-1 drop-shadow-lg">
                      {cat.name}
                    </span>
                    <span className="text-[13px] font-bold text-gray-200 uppercase tracking-widest drop-shadow-md">
                      {count} {count === 1 ? 'tool' : 'tools'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {activeCategory ? (
          /* FILTERED VIEW */
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#e8e4de]">
              <h2 className="text-3xl font-heading font-extrabold tracking-normal text-[#111]">
                {CATEGORY_MAP[activeCategory].name} Tools
              </h2>
              <button 
                onClick={() => setActiveCategory(null)}
                className="text-accent font-heading font-bold flex items-center gap-1 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" /> Show all
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredReviews.map(review => (
                <ReviewCard key={review.slug} review={review} />
              ))}
            </div>
          </section>
        ) : (
          /* DEFAULT HOMEPAGE VIEW */
          <div className="animate-in fade-in duration-500">
            {/* 3. NEWLY ADDED */}
            {newlyAdded.length > 0 && (
              <section className="mb-20">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-3xl font-heading font-extrabold tracking-normal text-[#111]">Newly Added</h2>
                  <span className="bg-[#fef3e8] text-[#d4720a] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest font-heading border border-[#d4720a]/20">
                    Fresh 🔥
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {newlyAdded.map(review => (
                    <ReviewCard key={review.slug} review={review} />
                  ))}
                </div>
              </section>
            )}

            {/* 4. TOP RATED */}
            {topRated.length > 0 && (
              <section className="mb-24">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-3xl font-heading font-extrabold tracking-normal text-[#111]">Top Rated</h2>
                  <span className="bg-[#e8f4f0] text-[#2d8a6b] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest font-heading border border-[#2d8a6b]/20">
                    Best of the best 🏆
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {topRated.map(review => (
                    <ReviewCard key={review.slug} review={review} />
                  ))}
                </div>
              </section>
            )}

            {/* 5. BIG MTD COUNTDOWN BANNER */}
            <section className="bg-gradient-to-r from-[#1a1a1a] to-[#2d1a0a] rounded-3xl p-8 md:p-14 border-[3px] border-accent/30 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none animate-pulse" />
              
              <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
                <div className="flex-1 w-full max-w-3xl">
                  <div className="flex items-center gap-2 text-red-400 text-sm font-bold uppercase tracking-widest font-heading mb-4">
                    <AlertTriangle className="w-5 h-5 animate-pulse" /> Urgent Deadline
                  </div>
                  <h3 className="text-4xl md:text-5xl font-heading font-extrabold text-white leading-tight mb-8">
                    Making Tax Digital (MTD) starts in:
                  </h3>
                  
                  {/* LIVE COUNTDOWN */}
                  {timeLeft && (
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-8">
                      {/* DAYS */}
                      <div className="flex flex-col items-center justify-center bg-black/40 border border-white/10 rounded-2xl p-4 min-w-[80px] md:min-w-[100px] shadow-inner">
                        <span className="text-4xl md:text-5xl font-heading font-extrabold text-white tabular-nums drop-shadow-md">{timeLeft.days}</span>
                        <span className="text-[10px] md:text-[11px] text-red-400 uppercase tracking-widest font-bold mt-1">Days</span>
                      </div>
                      <span className="text-2xl text-white/20 font-light hidden md:block">:</span>
                      
                      {/* HOURS */}
                      <div className="flex flex-col items-center justify-center bg-black/40 border border-white/10 rounded-2xl p-4 min-w-[80px] md:min-w-[100px] shadow-inner">
                        <span className="text-4xl md:text-5xl font-heading font-extrabold text-white tabular-nums drop-shadow-md">{timeLeft.hours.toString().padStart(2, '0')}</span>
                        <span className="text-[10px] md:text-[11px] text-red-400 uppercase tracking-widest font-bold mt-1">Hours</span>
                      </div>
                      <span className="text-2xl text-white/20 font-light hidden md:block">:</span>
                      
                      {/* MINUTES */}
                      <div className="flex flex-col items-center justify-center bg-black/40 border border-white/10 rounded-2xl p-4 min-w-[80px] md:min-w-[100px] shadow-inner">
                        <span className="text-4xl md:text-5xl font-heading font-extrabold text-white tabular-nums drop-shadow-md">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                        <span className="text-[10px] md:text-[11px] text-red-400 uppercase tracking-widest font-bold mt-1">Mins</span>
                      </div>
                      <span className="text-2xl text-white/20 font-light hidden md:block">:</span>
                      
                      {/* SECONDS */}
                      <div className="flex flex-col items-center justify-center bg-accent/20 border border-accent/40 rounded-2xl p-4 min-w-[80px] md:min-w-[100px] shadow-[0_0_20px_rgba(230,92,0,0.3)]">
                        <span className="text-4xl md:text-5xl font-heading font-extrabold text-accent tabular-nums drop-shadow-md">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                        <span className="text-[10px] md:text-[11px] text-accent uppercase tracking-widest font-bold mt-1">Secs</span>
                      </div>
                    </div>
                  )}

                  <p className="text-lg text-gray-300 font-serif italic mb-6">
                    By April 2026, all sole traders earning over £50k must keep digital records and use MTD-compatible software. Don't wait until the last minute.
                  </p>
                </div>
                
                <div className="shrink-0 w-full xl:w-auto flex flex-col items-center xl:items-end gap-3">
                  <a 
                    href="https://www.gov.uk/guidance/check-if-youre-eligible-for-making-tax-digital-for-income-tax"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center px-10 py-5 bg-accent hover:bg-[#cc5200] text-white font-heading font-extrabold text-xl rounded-[12px] transition-all duration-300 shadow-xl shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1 block"
                  >
                    Check MTD Eligibility &rarr;
                  </a>
                  <span className="text-gray-400 text-xs italic font-serif opacity-80">
                    Links to official Gov.uk guidance
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

      </div>
    </div>
  );
}
