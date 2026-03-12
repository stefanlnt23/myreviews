import { NextRequest, NextResponse } from 'next/server';
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
    const reviewData: Review = {
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
    };

    await upsertReview(slug, reviewData);

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

    return NextResponse.json({ deleted: true, slug }, { status: 200 });
  } catch (error) {
    console.error('Error processing DELETE /api/push:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
