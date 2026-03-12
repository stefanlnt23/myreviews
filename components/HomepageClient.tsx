'use client';

import { useState, useMemo } from 'react';
import { Review } from '../types';
import ReviewCard from './ReviewCard';
import { cn } from '../lib/utils';

const CATEGORIES = [
  'All',
  'ACCOUNTING',
  'INVOICING',
  'WEBSITE BUILDER',
  'PAYMENTS',
  'JOB MANAGEMENT',
  'INSURANCE'
];

export default function HomepageClient({ initialReviews }: { initialReviews: Review[] }) {
  const [activeTab, setActiveTab] = useState('All');

  const filteredReviews = useMemo(() => {
    if (activeTab === 'All') return initialReviews;
    return initialReviews.filter(r => r.category === activeTab);
  }, [initialReviews, activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-16 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm font-medium">
          <span>🇬🇧</span> UK-focused • Updated regularly
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          The best tools for UK sole traders. <span className="text-accent">Ranked.</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Independent reviews covering accounting, invoicing, payments, websites and more — all MTD-aware.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
              activeTab === cat 
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-gray-400 border-border hover:border-gray-500 hover:text-gray-200"
            )}
          >
            {cat === 'All' ? 'All Tools' : cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="mb-6 text-sm text-gray-400 font-medium">
        Showing {filteredReviews.length} tool{filteredReviews.length !== 1 ? 's' : ''}
      </div>

      {/* Grid */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <p className="text-gray-400 text-lg">No reviews yet — check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map(review => (
            <ReviewCard key={review.slug} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
