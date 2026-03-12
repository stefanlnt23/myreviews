import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { Review } from '../types';
import { getScoreColor, getCategoryStyles, cn } from '../lib/utils';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  // 5 dot logic
  const dots = Array.from({ length: 5 }).map((_, i) => i < Math.round(review.score / 2));

  return (
    <Link 
      href={`/review/${review.slug}`}
      className="group relative flex flex-col bg-white rounded-[16px] border-[1.5px] border-[#e8e4de] hover:border-[#c8b89a] p-[20px] px-[22px] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg h-full"
    >
      {review.badge && (
        <span className="absolute -top-3 -right-3 bg-[#111] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-heading shadow-md">
          {review.badge}
        </span>
      )}

      <div className="flex gap-4 items-start mb-4">
        <div className={cn("flex-shrink-0 w-[52px] h-[52px] rounded-[12px] flex items-center justify-center font-heading font-bold text-2xl shadow-sm", getScoreColor(review.score))}>
          {review.score}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={cn("px-2.5 py-0.5 rounded-[20px] text-[11px] font-bold uppercase tracking-wide", getCategoryStyles(review.category))}>
              {review.category.replace('_', ' ')}
            </span>
            {review.mtdReady ? (
              <span className="px-2 py-0.5 rounded-[20px] text-[10px] font-bold uppercase tracking-wide bg-[#e8f4f0] text-[#2d8a6b]">
                MTD Ready
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-[20px] text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-500">
                Not MTD
              </span>
            )}
          </div>
          <h2 className="font-heading font-bold text-[22px] leading-tight text-[#111] group-hover:text-accent transition-colors">
            {review.productName}
          </h2>
        </div>
      </div>

      <div className="flex-1">
        <p className="font-serif italic text-[13.5px] text-gray-500 leading-relaxed mb-4">
          &ldquo;{review.tagline || review.summary}&rdquo;
        </p>
        
        {review.pros && review.pros.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {review.pros.slice(0, 2).map((pro, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-[#e8f4f0] text-[#2d8a6b] px-2.5 py-1 rounded-md text-[12px] font-medium leading-tight max-w-full">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{pro}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-[#e8e4de] flex items-center justify-between">
        <span className="text-accent font-heading font-bold text-[14px]">
          Read full review &rarr;
        </span>
        <div className="flex items-baseline gap-1 bg-[#1a1a1a] px-4 py-2 rounded-[10px] shadow-sm">
          <span className={cn("font-heading font-extrabold text-[20px] leading-none", getScoreColor(review.score))}>
            {review.score}
          </span>
          <span className="font-serif italic text-gray-400 text-[13px] leading-none">/ 10</span>
        </div>
      </div>
    </Link>
  );
}
