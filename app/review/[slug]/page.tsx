import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, X, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getReviewBySlug, getSimilarReviews } from '../../../lib/db/reviews';
import { getScoreColor, getCategoryStyles, cn } from '../../../lib/utils';
import ReviewCard from '../../../components/ReviewCard';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const review = await getReviewBySlug(params.slug);
  
  if (!review) return { title: 'Not Found | SoleToolkit' };

  return {
    title: `${review.productName} Review 2026 | SoleToolkit`,
    description: review.summary,
    openGraph: {
      title: `${review.productName} Review | SoleToolkit`,
      description: review.summary,
    }
  };
}

export default async function ReviewPage({ params }: { params: { slug: string } }) {
  const review = await getReviewBySlug(params.slug);

  if (!review) {
    notFound();
  }

  const similarReviews = await getSimilarReviews(review.category, review.slug);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to all tools
      </Link>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className={cn("px-3 py-1 rounded-full text-xs font-semibold border", getCategoryStyles(review.category))}>
          {review.category}
        </span>
        {review.mtdReady && (
          <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-xs font-semibold">
            MTD Ready
          </span>
        )}
      </div>

      <div className="flex justify-between items-start gap-6 border-b border-border pb-8 mb-8 flex-col sm:flex-row">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            {review.productName}
          </h1>
          {review.dateUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {review.dateUpdated}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-4 shrink-0 w-full sm:w-auto">
          <div className={cn("w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl text-white", getScoreColor(review.score))}>
            {review.score}
          </div>
          <a
            href={review.affiliateLink}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-center text-lg shadow-lg shadow-accent/20"
          >
            Get Deal &rarr;
          </a>
          {review.affiliateDisclosure && (
            <p className="text-xs text-gray-500 italic text-center sm:text-right max-w-xs">
              {review.affiliateDisclosure}
            </p>
          )}
        </div>
      </div>

      {/* Pros & Cons */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-card p-6 rounded-2xl border border-border">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-500">
            <Check className="w-5 h-5" /> Pros
          </h3>
          <ul className="space-y-3">
            {review.pros.map((pro, i) => (
              <li key={i} className="flex gap-3 text-gray-300">
                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-500">
            <X className="w-5 h-5" /> Cons
          </h3>
          <ul className="space-y-3">
            {review.cons.map((con, i) => (
              <li key={i} className="flex gap-3 text-gray-300">
                <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Expert Verdict */}
      <div className="bg-accent/10 border border-accent/20 p-8 rounded-2xl mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <h3 className="text-xl font-bold mb-4 text-white">Expert Verdict</h3>
        <p className="text-lg text-gray-200 italic mb-6 leading-relaxed">
          &ldquo;{review.summary}&rdquo;
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-accent border border-accent/20" aria-hidden="true">
            EK
          </div>
          <div>
            <div className="font-bold text-white">
              {review.expertName || "SoleToolkit Editorial Team"}
            </div>
            <div className="text-sm text-gray-400">
              {review.expertTitle || "UK Business Tools Reviewer"}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Table */}
      {review.pricingTable && review.pricingTable.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Pricing</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm text-left">
              <thead className="bg-card text-gray-300 border-b border-border">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold text-lg">Plan</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-lg">Price</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-lg">Best For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {review.pricingTable.map((tier, i) => (
                  <tr key={i} className="hover:bg-card/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{tier.plan}</td>
                    <td className="px-6 py-4 text-gray-300">{tier.price}</td>
                    <td className="px-6 py-4 text-gray-400">{tier.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Review Markdown */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Our Full Review</h2>
        <div className="prose prose-invert prose-orange max-w-none">
          <ReactMarkdown>{review.detailedReview}</ReactMarkdown>
        </div>
      </div>

      {/* YouTube Embed */}
      {review.youtubeEmbed && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Watch Our Review</h2>
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border shadow-2xl">
            <iframe
              src={review.youtubeEmbed}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      )}

      {/* Similar Tools */}
      {similarReviews.length > 0 && (
        <div className="border-t border-border pt-12 mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar {review.category.toLowerCase().replace('_', ' ')} tools</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {similarReviews.map(sim => (
              <ReviewCard key={sim.slug} review={sim} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
