import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      console.warn('Firebase env variables are missing. Initialization skipped.');
    }
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
  }
}

// Fallback mock for Next.js build-time prerendering when env vars might be undefined
export const db = admin.apps.length ? admin.firestore() : {
  collection: () => ({
    orderBy: () => ({ get: async () => ({ docs: [] }) }),
    doc: () => ({
      get: async () => ({ exists: false, data: () => null }),
      set: async () => {},
      delete: async () => {},
    }),
    where: () => ({
      orderBy: () => ({
        limit: () => ({ get: async () => ({ docs: [] }) })
      })
    })
  })
} as unknown as admin.firestore.Firestore;

export default admin;
