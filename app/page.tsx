import { getReviews } from '../lib/db/reviews';
import HomepageClient from '../components/HomepageClient';
import { Review } from '../types';

export const revalidate = 60;

export default async function Home() {
  let reviews: Review[] = [];

  try {
    reviews = await getReviews();
  } catch (error) {
    console.error('Failed to load reviews for homepage:', error);
  }

  return (
    <div className="min-h-screen">
      <HomepageClient initialReviews={reviews} />
    </div>
  );
}
