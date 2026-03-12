import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { upsertReview, deleteReview } from '../../../lib/db/reviews';
import { Review } from '../../../types';

// Validate API Key
function validateApiKey(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  return apiKey === process.env.API_SECRET;
}

export async function POST(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      productName,
      slug,
      category,
      score,
      pros,
      cons,
      summary,
      detailedReview,
      affiliateLink,
    } = body;

    // Validate required fields
    if (
      !productName ||
      !slug ||
      !category ||
      score === undefined ||
      !pros ||
      !cons ||
      !summary ||
      !detailedReview ||
      !affiliateLink
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare full payload
    // Prepare full payload
    const rawReviewData: Partial<Review> = {
      productName,
      slug,
      category,
      score,
      pros,
      cons,
      summary,
      detailedReview,
      affiliateLink,
      mtdReady: body.mtdReady ?? false,
      affiliateDisclosure: body.affiliateDisclosure,
      pricingTable: body.pricingTable,
      youtubeEmbed: body.youtubeEmbed,
      expertName: body.expertName,
      expertTitle: body.expertTitle,
      dateUpdated: body.dateUpdated,
      images: body.images,
      youtubeTitle: body.youtubeTitle,
      expertQuote: body.expertQuote,
      faqItems: body.faqItems,
      alternatives: body.alternatives,
      lastTestedVersion: body.lastTestedVersion,
      tagline: body.tagline,
      badge: body.badge,
      isNew: body.isNew ?? false,
    };

    // Remove undefined values to prevent Firestore errors
    const reviewData = Object.fromEntries(
      Object.entries(rawReviewData).filter(([, v]) => v !== undefined)
    ) as unknown as Review;

    await upsertReview(slug, reviewData);

    // Revalidate the homepage and the specific review page
    revalidatePath('/');
    revalidatePath(`/review/${slug}`);

    return NextResponse.json({ success: true, slug }, { status: 200 });
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
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
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

    // Revalidate the homepage and the specific review page
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
