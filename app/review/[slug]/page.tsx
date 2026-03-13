import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Check,
  ChevronRight,
  ExternalLink,
  MessageSquareQuote,
  Minus,
  PlayCircle,
  ThumbsDown,
  ThumbsUp,
  X,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import ReviewCard from '../../../components/ReviewCard';
import { getReviewBySlug, getSimilarReviews } from '../../../lib/db/reviews';
import { cn, getCategoryStyles, getScoreColor } from '../../../lib/utils';

export const revalidate = 60;

const navItems = [
  { id: 'snapshot', label: 'Snapshot' },
  { id: 'pros-cons', label: 'Pros & Cons' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'signals', label: 'Market Signals' },
  { id: 'quotes', label: 'User Quotes' },
  { id: 'full-review', label: 'Full Review' },
  { id: 'faq', label: 'FAQ' },
];

function normalizeYoutubeEmbed(url: string | undefined): string | null {
  if (!url) return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  if (trimmed.includes('youtube.com/embed/')) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '');
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  } catch {
    return null;
  }

  return null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const review = await getReviewBySlug(params.slug);

    if (!review) return { title: 'Not Found | SoleToolkit' };

    return {
      title: `${review.productName} Review 2026 | SoleToolkit`,
      description: review.summary,
      openGraph: {
        title: `${review.productName} Review | SoleToolkit`,
        description: review.summary,
      },
    };
  } catch (error) {
    console.error('Failed to generate review metadata', error);
    return {
      title: 'Review | SoleToolkit',
      description: 'Practical UK business software reviews.',
    };
  }
}

export default async function ReviewPage({ params }: { params: { slug: string } }) {
  let review: Awaited<ReturnType<typeof getReviewBySlug>>;

  try {
    review = await getReviewBySlug(params.slug);
  } catch (error) {
    console.error('Failed to load review page data', error);
    notFound();
  }

  if (!review) {
    notFound();
  }

  let similarReviews: Awaited<ReturnType<typeof getSimilarReviews>> = [];

  try {
    similarReviews = await getSimilarReviews(review.category, review.slug);
  } catch (error) {
    console.error('Failed to load similar reviews', error);
  }

  const verdict = review.verdict || (review.score >= 8 ? 'YES' : review.score >= 6 ? 'MAYBE' : 'NO');
  const verdictText = verdict === 'YES' ? 'Yes, worth it' : verdict === 'MAYBE' ? 'Maybe, depends' : 'No, skip for most';
  const verdictTone =
    verdict === 'YES'
      ? 'bg-[#e8f4f0] text-[#2d8a6b] border-[#2d8a6b]/20'
      : verdict === 'NO'
        ? 'bg-[#fff5f5] text-[#c0392b] border-[#c0392b]/20'
        : 'bg-[#f5f1eb] text-[#6b5d4a] border-[#c8b89a]/40';

  const scoreBreakdown = review.scoreBreakdown
    ? [
        { key: 'Ease of use', value: review.scoreBreakdown.easeOfUse },
        { key: 'Value for money', value: review.scoreBreakdown.valueForMoney },
        { key: 'UK fit', value: review.scoreBreakdown.ukFit },
        { key: 'Support quality', value: review.scoreBreakdown.supportQuality },
        { key: 'Feature depth', value: review.scoreBreakdown.featureDepth },
      ]
    : [];

  const youtubeEmbed = normalizeYoutubeEmbed(review.youtubeEmbed);
  const bestForText = review.whoItsFor?.[0] || 'UK businesses wanting practical, no-fluff guidance.';
  const avoidIfText = review.notFor?.[0];

  return (
    <article className="min-h-screen bg-[#f7f6f3] pb-16">
      <div className="border-b border-[#e8e4de] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-[#111]">
            <ChevronRight className="h-3.5 w-3.5 rotate-180" />
            Back to all tools
          </Link>
        </div>
      </div>

      <header className="border-b border-[#e8e4de] bg-gradient-to-br from-[#181512] via-[#22180f] to-[#3a1f09]">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 py-7 sm:px-6 md:py-8 lg:grid-cols-[1.65fr_1fr] lg:gap-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn('rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider', getCategoryStyles(review.category))}>
                {review.category}
              </span>
              {review.isNew && (
                <span className="rounded-full border border-[#f09a4f]/40 bg-[#fef2e8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#d4720a]">
                  New
                </span>
              )}
              {review.badge && (
                <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#f5e5d8]">
                  {review.badge}
                </span>
              )}
            </div>

            <div>
              <h1 className="font-heading text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl">{review.productName}</h1>
              <p className="mt-2 max-w-3xl text-base leading-relaxed text-[#e9dfd3] sm:text-lg">
                {review.tagline || review.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-medium text-[#d9ccc0]">
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">Updated: {review.dateUpdated || 'Recently reviewed'}</span>
              {review.lastTestedVersion && (
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">Version: {review.lastTestedVersion}</span>
              )}
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">{review.mtdReady ? 'MTD ready' : 'Not MTD ready'}</span>
              {review.sourceAudit?.confidence && (
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">Evidence: {review.sourceAudit.confidence}</span>
              )}
            </div>
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5 lg:sticky lg:top-5 lg:h-fit">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#b8a896]">Overall score</p>
                <div className="mt-1 flex items-end gap-1">
                  <span className={cn('rounded-xl px-3 py-1.5 font-heading text-3xl font-extrabold', getScoreColor(review.score))}>
                    {review.score.toFixed(1)}
                  </span>
                  <span className="pb-1 text-xs text-[#d1c2b3]">/10</span>
                </div>
              </div>
              <span className={cn('rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider', verdictTone)}>{verdictText}</span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-[#f1e7db]">{review.verdictReason || review.summary}</p>

            <a
              href={review.affiliateLink}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#cc5200]"
            >
              Get Deal
            </a>

            {review.affiliateDisclosure && (
              <p className="mt-2 text-[11px] leading-relaxed text-[#ccbdaa]">{review.affiliateDisclosure}</p>
            )}
          </aside>
        </div>
      </header>

      <div className="sticky top-0 z-30 border-b border-[#e8e4de] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8">
          {navItems
            .filter((item) => {
              if (item.id === 'pricing') return !!review.pricingTable?.length;
              if (item.id === 'signals') return !!review.reviewSignals?.length;
              if (item.id === 'quotes') return !!review.userQuotes?.length;
              if (item.id === 'faq') return !!review.faqItems?.length;
              return true;
            })
            .map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="whitespace-nowrap rounded-full border border-[#e8e4de] bg-[#faf8f5] px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#d8d1c6] hover:text-[#111]"
              >
                {item.label}
              </a>
            ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-4 px-4 pt-4 sm:px-6 lg:px-8">
        <section id="snapshot" className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#e8e4de] bg-white p-4 lg:col-span-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Quick verdict</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-700 sm:text-[15px]">{review.summary}</p>
          </div>
          <div className="rounded-2xl border border-[#e8e4de] bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Best for</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{bestForText}</p>
            {avoidIfText && (
              <>
                <p className="mt-3 text-[11px] font-bold uppercase tracking-widest text-gray-500">Avoid if</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-700">{avoidIfText}</p>
              </>
            )}
          </div>
        </section>

        {(review.whoItsFor?.length || review.notFor?.length) && (
          <section className="grid gap-4 md:grid-cols-2">
            {review.whoItsFor && review.whoItsFor.length > 0 && (
              <div className="rounded-2xl border border-[#2d8a6b]/20 bg-[#f0faf5] p-4">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#2d8a6b]">Who this fits</p>
                <div className="flex flex-wrap gap-2">
                  {review.whoItsFor.map((item, idx) => (
                    <span key={`${item}-${idx}`} className="rounded-full border border-[#2d8a6b]/25 bg-white px-3 py-1 text-xs font-medium text-[#1f6c53]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {review.notFor && review.notFor.length > 0 && (
              <div className="rounded-2xl border border-[#c0392b]/20 bg-[#fff5f5] p-4">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#c0392b]">Who should skip</p>
                <div className="flex flex-wrap gap-2">
                  {review.notFor.map((item, idx) => (
                    <span key={`${item}-${idx}`} className="rounded-full border border-[#c0392b]/25 bg-white px-3 py-1 text-xs font-medium text-[#972d23]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <section id="pros-cons" className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#2d8a6b]/25 bg-[#f0faf5] p-4 sm:p-5">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-[#1f6c53]">
              <Check className="h-4 w-4" />
              What we like
            </h2>
            <ul className="space-y-2.5">
              {review.pros.map((pro, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[#1d1d1d]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2d8a6b]" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[#c0392b]/25 bg-[#fff5f5] p-4 sm:p-5">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-[#972d23]">
              <X className="h-4 w-4" />
              Where it falls short
            </h2>
            <ul className="space-y-2.5">
              {review.cons.map((con, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[#1d1d1d]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c0392b]" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {scoreBreakdown.length > 0 && (
          <section className="rounded-2xl border border-[#e8e4de] bg-white p-4 sm:p-5">
            <h2 className="mb-4 text-xl font-extrabold text-[#111]">Score breakdown</h2>
            <div className="space-y-3">
              {scoreBreakdown.map((row) => (
                <div key={row.key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold text-[#222]">{row.key}</span>
                    <span className="font-bold text-accent">{row.value.toFixed(1)}/10</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#f1ece4]">
                    <div className="h-2 rounded-full bg-accent" style={{ width: `${Math.max(0, Math.min(100, row.value * 10))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {review.pricingTable && review.pricingTable.length > 0 && (
          <section id="pricing" className="rounded-2xl border border-[#e8e4de] bg-white p-4 sm:p-5">
            <h2 className="mb-4 text-xl font-extrabold text-[#111]">Pricing overview</h2>
            <div className="space-y-2 md:hidden">
              {review.pricingTable.map((tier, i) => (
                <div key={i} className="rounded-xl border border-[#ede8e0] bg-[#faf8f5] p-3">
                  <p className="font-semibold text-[#111]">{tier.plan}</p>
                  <p className="mt-1 text-sm font-bold text-accent">{tier.price}</p>
                  <p className="mt-1 text-sm text-gray-600">{tier.bestFor}</p>
                </div>
              ))}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-left">
                <thead className="border-b border-[#ede8e0] bg-[#f6f2ec] text-[11px] uppercase tracking-widest text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Best for</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ece6]">
                  {review.pricingTable.map((tier, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3.5 text-sm font-semibold text-[#111]">{tier.plan}</td>
                      <td className="px-4 py-3.5 text-sm font-bold text-accent">{tier.price}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{tier.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {review.reviewSignals && review.reviewSignals.length > 0 && (
          <section id="signals" className="rounded-2xl border border-[#e8e4de] bg-white p-4 sm:p-5">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold text-[#111]">
              <MessageSquareQuote className="h-5 w-5 text-accent" />
              What real users say
            </h2>
            <div className="space-y-2.5">
              {review.reviewSignals.map((signal, i) => (
                <article key={`${signal.platform}-${i}`} className="rounded-xl border border-[#eee8df] bg-[#faf8f5] p-3.5">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full border border-[#e8e4de] bg-white px-2.5 py-1 font-bold uppercase tracking-wide">{signal.platform}</span>
                    {signal.rating && <span className="font-semibold text-gray-700">Rating: {signal.rating}</span>}
                    {signal.reviewCount && <span className="text-gray-600">{signal.reviewCount}</span>}
                    {signal.sentiment && (
                      <span className="ml-auto inline-flex items-center gap-1 font-semibold uppercase text-gray-600">
                        {signal.sentiment === 'POSITIVE' ? (
                          <ThumbsUp className="h-3.5 w-3.5 text-[#2d8a6b]" />
                        ) : signal.sentiment === 'NEGATIVE' ? (
                          <ThumbsDown className="h-3.5 w-3.5 text-[#c0392b]" />
                        ) : (
                          <Minus className="h-3.5 w-3.5 text-[#6b5d4a]" />
                        )}
                        {signal.sentiment.toLowerCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700">{signal.takeaway}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {review.userQuotes && review.userQuotes.length > 0 && (
          <section id="quotes" className="rounded-2xl border border-[#e8e4de] bg-white p-4 sm:p-5">
            <h2 className="mb-4 text-xl font-extrabold text-[#111]">Verified user quotes</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {review.userQuotes.map((quote, i) => (
                <article key={`${quote.platform}-${i}`} className="rounded-xl border border-[#eee8df] bg-[#faf8f5] p-3.5">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full border border-[#e8e4de] bg-white px-2.5 py-1 font-bold uppercase tracking-wide">{quote.platform}</span>
                    {quote.topicTag && <span className="text-gray-600">#{quote.topicTag}</span>}
                    {quote.rating && <span className="ml-auto font-semibold text-gray-700">{quote.rating}</span>}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700">“{quote.quote}”</p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    {quote.author && <span>{quote.author}</span>}
                    {quote.date && <span>{quote.date}</span>}
                    {quote.url && (
                      <a href={quote.url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-accent hover:underline">
                        Source <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {(review.expertQuote || review.expertName || review.expertTitle) && (
          <section className="rounded-2xl border border-accent/30 bg-gradient-to-br from-[#fff7ef] to-[#fff2e6] p-4 sm:p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a6643]">Expert verdict</p>
            <p className="mt-2 text-[15px] italic leading-relaxed text-[#3b2d20]">“{review.expertQuote || review.summary}”</p>
            <div className="mt-3.5 flex items-center gap-3 border-t border-accent/15 pt-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                {review.expertName ? review.expertName.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'ST'}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111]">{review.expertName || 'SoleToolkit Editorial Team'}</p>
                <p className="text-xs text-gray-600">{review.expertTitle || 'UK Business Tools Reviewer'}</p>
              </div>
            </div>
          </section>
        )}

        {review.sourceAudit && (
          <section className="rounded-2xl border border-[#e8e4de] bg-[#faf8f5] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">Evidence freshness</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-700">
              <span>Checked: <strong>{review.sourceAudit.checkedAt}</strong></span>
              <span>Sources: <strong>{review.sourceAudit.sourcesCount}</strong></span>
              {review.sourceAudit.confidence && <span>Confidence: <strong>{review.sourceAudit.confidence}</strong></span>}
            </div>
          </section>
        )}

        {youtubeEmbed && (
          <section className="rounded-2xl border border-[#e8e4de] bg-white p-4 sm:p-5">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-extrabold text-[#111]">
              <PlayCircle className="h-5 w-5 text-accent" />
              Video review
            </h2>
            <div className="overflow-hidden rounded-xl border border-[#ede8e0] bg-black">
              <div className="relative aspect-video w-full">
                <iframe
                  title={review.youtubeTitle || `${review.productName} video review`}
                  src={youtubeEmbed}
                  className="h-full w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
            {review.youtubeTitle && <p className="mt-2 text-sm text-gray-600">{review.youtubeTitle}</p>}
          </section>
        )}

        {review.images && review.images.length > 0 && (
          <section className="rounded-2xl border border-[#e8e4de] bg-white p-4 sm:p-5">
            <h2 className="mb-3 text-xl font-extrabold text-[#111]">Screenshots</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {review.images.map((img, i) => {
                const imageUrl = typeof img === 'string' ? img : img.src;
                const imageAlt = typeof img === 'string' ? `${review.productName} screenshot ${i + 1}` : img.alt || `${review.productName} screenshot ${i + 1}`;
                const caption = typeof img === 'string' ? undefined : img.caption;

                if (!imageUrl) return null;

                return (
                  <figure key={`${imageUrl}-${i}`} className="overflow-hidden rounded-xl border border-[#ede8e0] bg-[#faf8f5]">
                    <div className="relative aspect-[16/10] w-full">
                      <Image
                        src={`/api/image-proxy?url=${encodeURIComponent(imageUrl)}`}
                        alt={imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    {caption && <figcaption className="px-3 py-2 text-xs text-gray-600">{caption}</figcaption>}
                  </figure>
                );
              })}
            </div>
          </section>
        )}

        <section id="full-review" className="rounded-2xl border border-[#e8e4de] bg-white p-4 sm:p-5">
          <h2 className="mb-3 text-2xl font-extrabold text-[#111]">Our full review</h2>
          <div
            className="prose prose-sm max-w-none text-gray-700
              prose-headings:font-heading prose-headings:font-bold prose-headings:text-[#111]
              prose-p:leading-[1.7] prose-p:text-[15px]
              prose-strong:text-[#111]
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
          >
            <ReactMarkdown>{review.detailedReview}</ReactMarkdown>
          </div>
        </section>

        {review.faqItems && review.faqItems.length > 0 && (
          <section id="faq" className="rounded-2xl border border-[#e8e4de] bg-white p-4 sm:p-5">
            <h2 className="mb-3 text-xl font-extrabold text-[#111]">Key questions</h2>
            <div className="space-y-2.5">
              {review.faqItems.map((faq, i) => (
                <details key={i} className="group overflow-hidden rounded-xl border border-[#ede8e0] bg-[#faf8f5] [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 px-3.5 py-3 text-sm font-semibold text-[#111] hover:bg-[#f5f2ed]">
                    {faq.question}
                    <span className="text-accent transition-transform group-open:rotate-180">⌄</span>
                  </summary>
                  <div className="border-t border-[#ede8e0] px-3.5 py-3 text-sm leading-relaxed text-gray-700">{faq.answer}</div>
                </details>
              ))}
            </div>
          </section>
        )}

        {review.alternatives && review.alternatives.length > 0 && (
          <section className="rounded-2xl border border-[#e8e4de] bg-[#faf8f5] p-4 sm:p-5">
            <h2 className="mb-3 text-xl font-extrabold text-[#111]">Alternatives to {review.productName}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {review.alternatives.map((alt, i) => (
                <article key={i} className="rounded-xl border border-[#ede8e0] bg-white p-3.5">
                  <h3 className="text-sm font-bold text-[#111]">{alt.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{alt.reason}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {similarReviews.length > 0 && (
          <section className="border-t border-[#e8e4de] pt-6">
            <h2 className="mb-4 text-xl font-bold text-[#111]">More {review.category.toLowerCase()} tools</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similarReviews.map((sim) => (
                <ReviewCard key={sim.slug} review={sim} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
