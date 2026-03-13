import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { upsertReview, deleteReview } from '../../../lib/db/reviews';
import { Review, ReviewImage, ReviewSignal, UserQuote, ScoreBreakdown, SourceAudit } from '../../../types';

function validateApiKey(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  return apiKey === process.env.API_SECRET;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string' && item.trim().length > 0);
}

function normalizeImages(value: unknown): (string | ReviewImage)[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const normalized = value
    .map((entry) => {
      if (typeof entry === 'string' && entry.trim()) return entry.trim();
      if (entry && typeof entry === 'object' && 'src' in entry && typeof entry.src === 'string' && entry.src.trim()) {
        const obj = entry as { src: string; alt?: string; caption?: string };
        return {
          src: obj.src.trim(),
          alt: typeof obj.alt === 'string' ? obj.alt.trim() : undefined,
          caption: typeof obj.caption === 'string' ? obj.caption.trim() : undefined,
        } as ReviewImage;
      }
      return null;
    })
    .filter(Boolean) as (string | ReviewImage)[];

  return normalized.length > 0 ? normalized : undefined;
}

function normalizeCategory(value: unknown): Review['category'] | null {
  if (typeof value !== 'string' || !value.trim()) return null;

  const normalized = value
    .trim()
    .toUpperCase()
    .replace(/[\s_-]+/g, ' ');

  const aliases: Record<string, Review['category']> = {
    ACCOUNTING: 'ACCOUNTING',
    INVOICING: 'INVOICING',
    'WEBSITE BUILDER': 'WEBSITE BUILDER',
    PAYMENTS: 'PAYMENTS',
    'JOB MANAGEMENT': 'JOB MANAGEMENT',
    INSURANCE: 'INSURANCE',
  };

  return aliases[normalized] ?? null;
}

function normalizeReviewSignals(value: unknown): ReviewSignal[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const normalized = value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;

      const candidate = entry as Record<string, unknown>;
      const platform = candidate.platform;
      const takeaway = candidate.takeaway;

      if (!isNonEmptyString(platform) || !isNonEmptyString(takeaway)) return null;

      const sentimentRaw = typeof candidate.sentiment === 'string' ? candidate.sentiment.trim().toUpperCase() : undefined;
      const sentiment = sentimentRaw === 'POSITIVE' || sentimentRaw === 'MIXED' || sentimentRaw === 'NEGATIVE'
        ? sentimentRaw
        : undefined;

      return {
        platform: platform.trim(),
        rating: isNonEmptyString(candidate.rating) ? candidate.rating.trim() : undefined,
        reviewCount: isNonEmptyString(candidate.reviewCount) ? candidate.reviewCount.trim() : undefined,
        sentiment,
        takeaway: takeaway.trim(),
      } as ReviewSignal;
    })
    .filter(Boolean) as ReviewSignal[];

  return normalized.length > 0 ? normalized : undefined;
}


function clampScore(value: unknown): number | null {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  if (n < 0 || n > 10) return null;
  return Number(n.toFixed(1));
}

function normalizeStringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const normalized = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
  return normalized.length > 0 ? normalized : undefined;
}

function normalizeScoreBreakdown(value: unknown): ScoreBreakdown | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const candidate = value as Record<string, unknown>;

  const easeOfUse = clampScore(candidate.easeOfUse);
  const valueForMoney = clampScore(candidate.valueForMoney);
  const ukFit = clampScore(candidate.ukFit);
  const supportQuality = clampScore(candidate.supportQuality);
  const featureDepth = clampScore(candidate.featureDepth);

  if ([easeOfUse, valueForMoney, ukFit, supportQuality, featureDepth].some((n) => n === null)) {
    return undefined;
  }

  return {
    easeOfUse: easeOfUse!,
    valueForMoney: valueForMoney!,
    ukFit: ukFit!,
    supportQuality: supportQuality!,
    featureDepth: featureDepth!,
  };
}

function normalizeUserQuotes(value: unknown): UserQuote[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const normalized = value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;
      const candidate = entry as Record<string, unknown>;
      const platform = candidate.platform;
      const quote = candidate.quote;

      if (!isNonEmptyString(platform) || !isNonEmptyString(quote)) return null;

      const rawUrl = candidate.url;
      const url = isNonEmptyString(rawUrl) && /^https?:\/\//i.test(rawUrl.trim()) ? rawUrl.trim() : undefined;

      return {
        platform: platform.trim(),
        quote: quote.trim(),
        url,
        author: isNonEmptyString(candidate.author) ? candidate.author.trim() : undefined,
        rating: isNonEmptyString(candidate.rating) ? candidate.rating.trim() : undefined,
        date: isNonEmptyString(candidate.date) ? candidate.date.trim() : undefined,
        topicTag: isNonEmptyString(candidate.topicTag) ? candidate.topicTag.trim() : undefined,
      } as UserQuote;
    })
    .filter(Boolean) as UserQuote[];

  return normalized.length > 0 ? normalized : undefined;
}

function normalizeSourceAudit(value: unknown): SourceAudit | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const candidate = value as Record<string, unknown>;
  const checkedAt = candidate.checkedAt;

  if (!isNonEmptyString(checkedAt)) return undefined;

  const sourcesCount = typeof candidate.sourcesCount === 'number'
    ? candidate.sourcesCount
    : Number(candidate.sourcesCount);

  if (!Number.isFinite(sourcesCount) || sourcesCount <= 0) return undefined;

  const rawConfidence = typeof candidate.confidence === 'string' ? candidate.confidence.trim().toUpperCase() : undefined;
  const confidence = rawConfidence === 'HIGH' || rawConfidence === 'MEDIUM' || rawConfidence === 'LOW'
    ? rawConfidence
    : undefined;

  return {
    checkedAt: checkedAt.trim(),
    sourcesCount: Math.round(sourcesCount),
    confidence,
  };
}

function normalizeVerdict(value: unknown): Review['verdict'] | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  const normalized = value.trim().toUpperCase();
  if (normalized === 'YES' || normalized === 'NO' || normalized === 'MAYBE') return normalized;
  return undefined;
}

function validatePayload(body: unknown): { ok: true; payload: Partial<Review> } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Body must be a JSON object' };
  }

  const payload = body as Record<string, unknown>;
  const category = normalizeCategory(payload.category);
  const score = typeof payload.score === 'number' ? payload.score : Number(payload.score);

  if (!isNonEmptyString(payload.productName)) return { ok: false, error: 'Missing or invalid productName' };
  if (!isNonEmptyString(payload.slug)) return { ok: false, error: 'Missing or invalid slug' };
  if (!category) {
    return { ok: false, error: 'Missing or invalid category' };
  }
  if (!Number.isFinite(score) || score < 0 || score > 10) return { ok: false, error: 'Missing or invalid score' };
  if (!isStringArray(payload.pros)) return { ok: false, error: 'Missing or invalid pros' };
  if (!isStringArray(payload.cons)) return { ok: false, error: 'Missing or invalid cons' };
  if (!isNonEmptyString(payload.summary)) return { ok: false, error: 'Missing or invalid summary' };
  if (!isNonEmptyString(payload.detailedReview)) return { ok: false, error: 'Missing or invalid detailedReview' };
  if (!isNonEmptyString(payload.affiliateLink)) return { ok: false, error: 'Missing or invalid affiliateLink' };

  const normalizedImages = normalizeImages(payload.images);
  const reviewSignals = normalizeReviewSignals(payload.reviewSignals);
  const verdict = normalizeVerdict(payload.verdict);
  const userQuotes = normalizeUserQuotes(payload.userQuotes);
  const scoreBreakdown = normalizeScoreBreakdown(payload.scoreBreakdown);
  const whoItsFor = normalizeStringList(payload.whoItsFor);
  const notFor = normalizeStringList(payload.notFor);
  const sourceAudit = normalizeSourceAudit(payload.sourceAudit);

  const reviewData: Partial<Review> = {
    productName: payload.productName.trim(),
    slug: payload.slug.trim(),
    category,
    score,
    pros: payload.pros,
    cons: payload.cons,
    summary: payload.summary.trim(),
    detailedReview: payload.detailedReview.trim(),
    affiliateLink: payload.affiliateLink.trim(),
    mtdReady: payload.mtdReady === true,
    affiliateDisclosure: isNonEmptyString(payload.affiliateDisclosure) ? payload.affiliateDisclosure.trim() : undefined,
    pricingTable: Array.isArray(payload.pricingTable) ? (payload.pricingTable as Review['pricingTable']) : undefined,
    youtubeEmbed: isNonEmptyString(payload.youtubeEmbed) ? payload.youtubeEmbed.trim() : undefined,
    expertName: isNonEmptyString(payload.expertName) ? payload.expertName.trim() : undefined,
    expertTitle: isNonEmptyString(payload.expertTitle) ? payload.expertTitle.trim() : undefined,
    dateUpdated: isNonEmptyString(payload.dateUpdated) ? payload.dateUpdated.trim() : undefined,
    images: normalizedImages,
    youtubeTitle: isNonEmptyString(payload.youtubeTitle) ? payload.youtubeTitle.trim() : undefined,
    expertQuote: isNonEmptyString(payload.expertQuote) ? payload.expertQuote.trim() : undefined,
    verdict,
    verdictReason: isNonEmptyString(payload.verdictReason) ? payload.verdictReason.trim() : undefined,
    reviewSignals,
    userQuotes,
    scoreBreakdown,
    whoItsFor,
    notFor,
    sourceAudit,
    faqItems: Array.isArray(payload.faqItems) ? (payload.faqItems as Review['faqItems']) : undefined,
    alternatives: Array.isArray(payload.alternatives) ? (payload.alternatives as Review['alternatives']) : undefined,
    lastTestedVersion: isNonEmptyString(payload.lastTestedVersion) ? payload.lastTestedVersion.trim() : undefined,
    tagline: isNonEmptyString(payload.tagline) ? payload.tagline.trim() : undefined,
    badge: isNonEmptyString(payload.badge) ? payload.badge.trim() : undefined,
    isNew: payload.isNew === true,
  };

  return { ok: true, payload: reviewData };
}

export async function POST(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = validatePayload(body);

    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const reviewData = Object.fromEntries(
      Object.entries(validated.payload).filter(([, v]) => v !== undefined)
    ) as unknown as Partial<Review>;

    await upsertReview(validated.payload.slug!, reviewData);

    revalidatePath('/');
    revalidatePath(`/review/${validated.payload.slug}`);

    return NextResponse.json({ success: true, slug: validated.payload.slug }, { status: 200 });
  } catch (error) {
    console.error('Error processing POST /api/push:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const deleted = await deleteReview(slug);

    if (!deleted) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath(`/review/${slug}`);

    return NextResponse.json({ deleted: true, slug }, { status: 200 });
  } catch (error) {
    console.error('Error processing DELETE /api/push:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}