import { getReviews } from '../lib/db/reviews';
import HomepageClient from '../components/HomepageClient';

export const revalidate = 60;

export default async function Home() {
  const reviews = await getReviews();

  return (
    <div className="min-h-screen">
      <HomepageClient initialReviews={reviews} />
    </div>
  );
}
