import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, X } from 'lucide-react';
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
    <article className="min-h-screen bg-background pb-32">
      {/* 1. Breadcrumb Navigation */}
      <div className="bg-white border-b-[1.5px] border-[#e8e4de]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-block text-[13px] font-sans font-medium text-gray-500 hover:text-[#111] transition-colors">
            &larr; Back to all tools
          </Link>
        </div>
      </div>

      {/* 2. HERO HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#2d1a0a] border-b-[3px] border-accent/20">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/15 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10 flex flex-col md:flex-row gap-10 items-start justify-between">
          <div className="flex-1">
            <div className="mb-6">
              <span className={cn("px-3 py-1 rounded-[20px] text-[11px] font-bold uppercase tracking-wide", getCategoryStyles(review.category))}>
                {review.category.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-normal text-white mb-6 drop-shadow-sm">
              {review.productName}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-serif italic max-w-2xl opacity-90 leading-relaxed">
              &ldquo;{review.tagline || review.summary}&rdquo;
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center md:items-end w-full md:w-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex flex-col items-end">
                <span className="text-gray-400 font-heading text-sm uppercase tracking-widest font-bold mb-1">Score</span>
                <span className="text-gray-500 font-serif italic text-sm">out of 10</span>
              </div>
              <div className={cn("w-28 h-28 rounded-[20px] flex items-center justify-center font-heading font-extrabold text-6xl shadow-xl border-4 border-white/10", getScoreColor(review.score))}>
                {review.score}
              </div>
            </div>
            
            {review.mtdReady ? (
              <div className="mb-8 px-4 py-1.5 rounded-[20px] text-xs font-bold uppercase tracking-wide bg-[#e8f4f0] text-[#2d8a6b] self-center md:self-end border border-[#2d8a6b]/20">
                MTD Ready
              </div>
            ) : (
              <div className="mb-8 px-4 py-1.5 rounded-[20px] text-xs font-bold uppercase tracking-wide bg-white/10 text-gray-400 self-center md:self-end border border-white/5">
                Not MTD Ready
              </div>
            )}

            <a
              href={review.affiliateLink}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="w-full md:w-auto px-10 py-5 bg-accent hover:bg-[#cc5200] text-white font-heading font-bold text-xl rounded-[10px] transition-all duration-300 shadow-xl shadow-accent/20 hover:shadow-accent/40 text-center hover:-translate-y-1 block mb-3"
            >
              Get Deal &rarr;
            </a>
            {review.affiliateDisclosure && (
              <p className="text-[11px] text-gray-400 font-sans italic max-w-xs text-center md:text-right opacity-80">
                {review.affiliateDisclosure}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">

        {/* 3. PROS / CONS */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          <div className="bg-[#f0faf5] rounded-[16px] border-[1.5px] border-[#2d8a6b]/30 p-8 shadow-sm">
            <h3 className="font-heading font-bold text-xl uppercase tracking-widest text-[#2d8a6b] mb-6 flex items-center gap-2 border-b border-[#2d8a6b]/10 pb-4">
              <Check className="w-5 h-5 flex-shrink-0" />
              What we like
            </h3>
            <ul className="space-y-4">
              {review.pros.map((pro, i) => (
                <li key={i} className="flex gap-4 text-[#111] font-serif text-[15px] leading-relaxed">
                  <span className="text-[#2d8a6b] shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2d8a6b]/50" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-[#fff5f5] rounded-[16px] border-[1.5px] border-[#c0392b]/30 p-8 shadow-sm">
            <h3 className="font-heading font-bold text-xl uppercase tracking-widest text-[#c0392b] mb-6 flex items-center gap-2 border-b border-[#c0392b]/10 pb-4">
              <X className="w-5 h-5 flex-shrink-0" />
              Where it falls short
            </h3>
            <ul className="space-y-4">
              {review.cons.map((con, i) => (
                <li key={i} className="flex gap-4 text-[#111] font-serif text-[15px] leading-relaxed">
                  <span className="text-[#c0392b] shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#c0392b]/50" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Image Gallery */}
        {review.images && review.images.length > 0 && (
          <div className="mb-20 overflow-x-auto pb-4 snap-x">
            <div className="flex gap-6 min-w-max">
              {review.images.map((img, i) => (
                <img 
                  key={i} 
                  src={img} 
                  alt={`${review.productName} screenshot ${i + 1}`} 
                  className="h-64 md:h-80 w-auto rounded-[16px] border-[1.5px] border-[#e8e4de] object-cover snap-center bg-white shadow-md p-1"
                  loading="lazy"
                  /* eslint-disable-next-line @next/next/no-img-element */
                />
              ))}
            </div>
          </div>
        )}

        {/* 4. EXPERT VERDICT */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-[#fef8f2] to-[#fff3e8] rounded-[24px] border-[1.5px] border-accent/40 p-10 md:p-14 shadow-lg shadow-accent/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <h2 className="font-heading font-extrabold text-2xl uppercase tracking-widest text-[#111] mb-8 border-b-2 border-accent/20 pb-4 inline-block">
              Expert Verdict
            </h2>
            
            <p className="font-serif italic text-xl md:text-[22px] leading-[1.8] text-[#2d1a0a] mb-10 relative z-10">
              &ldquo;{review.expertQuote || review.detailedReview.split('\n')[0] || review.summary}&rdquo;
            </p>
            
            <div className="flex items-center gap-5 border-t border-accent/10 pt-8 relative z-10">
              <div className="w-[52px] h-[52px] rounded-full bg-accent flex items-center justify-center font-heading font-bold text-xl text-white shadow-md">
                {review.expertName ? review.expertName.split(' ').map(n => n[0]).join('') : 'EK'}
              </div>
              <div>
                <div className="font-heading font-bold text-lg text-[#111] leading-tight">
                  {review.expertName || "SoleToolkit Editorial Team"}
                </div>
                <div className="font-sans text-[13px] text-gray-500 font-medium">
                  {review.expertTitle || "UK Business Tools Reviewer"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. PRICING TABLE */}
        {review.pricingTable && review.pricingTable.length > 0 && (
          <div className="mb-24">
            <h2 className="font-heading font-extrabold text-3xl text-[#111] mb-8 tracking-normal">Pricing overview</h2>
            <div className="bg-white rounded-[16px] border-[1.5px] border-[#e8e4de] overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-[#f5f1eb] font-heading text-sm uppercase tracking-widest text-gray-500 font-bold border-b-[1.5px] border-[#e8e4de]">
                  <tr>
                    <th scope="col" className="px-8 py-5">Plan</th>
                    <th scope="col" className="px-8 py-5">Price</th>
                    <th scope="col" className="px-8 py-5">Best For</th>
                  </tr>
                </thead>
                <tbody className="divide-y-[1.5px] divide-[#f0ece6]">
                  {review.pricingTable.map((tier, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6 font-heading font-extrabold text-[#111] text-lg">{tier.plan}</td>
                      <td className="px-8 py-6 font-heading font-bold text-accent text-xl">{tier.price}</td>
                      <td className="px-8 py-6 font-serif italic text-gray-500 text-[15px]">{tier.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. FULL REVIEW */}
        <div className="mb-24">
          <h2 className="font-heading font-extrabold text-4xl text-[#111] mb-10 tracking-normal">Our Full Review</h2>
          <div className="prose prose-lg max-w-none 
            prose-headings:font-heading prose-headings:font-extrabold prose-headings:text-[#111]
            prose-h3:text-2xl prose-h3:border-b-2 prose-h3:border-[#f0ece6] prose-h3:pb-2 prose-h3:mb-6 prose-h3:mt-12
            prose-p:font-serif prose-p:text-[15px] prose-p:leading-[1.7] prose-p:text-gray-700
            prose-a:font-semibold prose-a:text-accent hover:prose-a:underline
            prose-strong:font-bold prose-strong:text-[#111]
            prose-ul:font-serif prose-ul:text-[15px] prose-ul:text-gray-700
            prose-img:rounded-[16px] prose-img:border-[1.5px] prose-img:border-[#e8e4de]
          ">
            <ReactMarkdown>{review.detailedReview}</ReactMarkdown>
          </div>
        </div>

        {/* FAQ Accordions */}
        {review.faqItems && review.faqItems.length > 0 && (
          <div className="mb-24">
            <h2 className="font-heading font-extrabold text-3xl text-[#111] mb-8 tracking-normal">Key Questions</h2>
            <div className="space-y-4">
              {review.faqItems.map((faq, i) => (
                <details key={i} className="group bg-white border-[1.5px] border-[#e8e4de] rounded-[16px] overflow-hidden [&_summary::-webkit-details-marker]:hidden shadow-sm">
                  <summary className="px-8 py-6 text-lg font-heading font-bold text-[#111] cursor-pointer flex items-center justify-between select-none hover:bg-gray-50 transition-colors">
                    {faq.question}
                    <span className="text-accent group-open:-rotate-180 transition-transform duration-300">
                      ↓
                    </span>
                  </summary>
                  <div className="px-8 pb-6 font-serif text-[15px] leading-[1.7] text-gray-700 border-t border-[#e8e4de]/50 pt-4 bg-gray-50/30">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Alternatives */}
        {review.alternatives && review.alternatives.length > 0 && (
          <div className="mb-24 bg-[#faf8f5] rounded-[24px] p-8 md:p-12 border-[1.5px] border-[#e8e4de]">
            <h2 className="font-heading font-extrabold text-3xl text-[#111] mb-8 tracking-normal">Top alternatives to {review.productName}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {review.alternatives.map((alt, i) => (
                <div key={i} className="bg-white p-6 rounded-[16px] border-[1.5px] border-[#e8e4de] shadow-sm hover:border-[#c8b89a] transition-colors">
                  <h4 className="font-heading font-bold text-xl text-[#111] mb-3">{alt.name}</h4>
                  <p className="font-serif italic text-gray-500 text-[14.5px] leading-relaxed">{alt.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Tools */}
        {similarReviews.length > 0 && (
          <div className="border-t-[1.5px] border-[#e8e4de] pt-16 mt-16">
            <h2 className="font-heading font-bold text-2xl text-gray-400 uppercase tracking-widest text-center mb-10">
              More {review.category.toLowerCase().replace('_', ' ')} tools
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {similarReviews.map(sim => (
                <ReviewCard key={sim.slug} review={sim} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
