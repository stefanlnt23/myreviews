import { db } from '../firebase/admin';
import { Review } from '../../types';

const COLLECTION_NAME = 'reviews';

export async function getReviews(): Promise<Review[]> {
  const snapshot = await db.collection(COLLECTION_NAME).orderBy('score', 'desc').get();
  return snapshot.docs.map(doc => doc.data() as Review);
}

export async function getReviewBySlug(slug: string): Promise<Review | null> {
  const doc = await db.collection(COLLECTION_NAME).doc(slug).get();
  if (!doc.exists) {
    return null;
  }
  return doc.data() as Review;
}

export async function getSimilarReviews(category: string, excludeSlug: string): Promise<Review[]> {
  const snapshot = await db.collection(COLLECTION_NAME)
    .where('category', '==', category)
    .orderBy('score', 'desc')
    .limit(4) // Fetch 4 in case one is the excluded slug
    .get();
    
  return snapshot.docs
    .map(doc => doc.data() as Review)
    .filter(review => review.slug !== excludeSlug)
    .slice(0, 3);
}

export async function upsertReview(slug: string, reviewData: Partial<Review>): Promise<void> {
  await db.collection(COLLECTION_NAME).doc(slug).set(reviewData, { merge: true });
}

export async function deleteReview(slug: string): Promise<boolean> {
  const docRef = db.collection(COLLECTION_NAME).doc(slug);
  const doc = await docRef.get();
  if (!doc.exists) {
    return false;
  }
  await docRef.delete();
  return true;
}
