import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { Review } from '../types';
import { getScoreColor, getCategoryStyles, cn } from '../lib/utils';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Link 
      href={`/review/${review.slug}`}
      className="group flex flex-col bg-card rounded-xl border border-border p-6 hover:border-accent/50 transition-colors h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <span className={cn("px-3 py-1 rounded-full text-xs font-semibold border", getCategoryStyles(review.category))}>
          {review.category}
        </span>
        {review.mtdReady ? (
          <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-xs font-semibold">
            MTD Ready
          </span>
        ) : (
          <span className="px-3 py-1 bg-gray-500/10 text-gray-400 border border-gray-500/20 rounded-full text-xs font-semibold">
            Not MTD
          </span>
        )}
      </div>

      <div className="flex gap-4 items-start mb-6">
        <div className={cn("flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl text-white", getScoreColor(review.score))}>
          {review.score}
        </div>
        <div>
          <h2 className="text-2xl font-bold group-hover:text-accent transition-colors">
            {review.productName}
          </h2>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {(review.pros || []).slice(0, 3).map((pro, i) => (
          <div key={i} className="flex gap-2 items-start text-sm text-gray-300">
            <Check className="w-5 h-5 text-green-500 shrink-0" />
            <span>{pro}</span>
          </div>
        ))}
        {(review.cons || []).slice(0, 2).map((con, i) => (
          <div key={i} className="flex gap-2 items-start text-sm text-gray-300">
            <X className="w-5 h-5 text-red-500 shrink-0" />
            <span>{con}</span>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="italic text-gray-400 text-sm line-clamp-1 mb-4">
          &quot;{review.summary}&quot;
        </p>
        <object data="" type="text/html" className="w-full">
          <a 
            href={review.affiliateLink}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="w-full py-3 bg-accent hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors text-center inline-block"
          >
            Get Deal &rarr;
          </a>
        </object>
      </div>
    </Link>
  );
}
