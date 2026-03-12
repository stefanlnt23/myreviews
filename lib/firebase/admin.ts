import * as admin from 'firebase-admin';

const formatPrivateKey = (key?: string) => {
  if (!key) return undefined;
  return key.replace(/\\n/g, '\n');
};

if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY),
        }),
      });
      console.log('Firebase Admin Initialized successfully.');
    } else {
      console.error('CRITICAL: Firebase env variables are missing (FIREBASE_PROJECT_ID is not set). Initialization skipped.');
    }
  } catch (error) {
    console.error('CRITICAL: Firebase Admin initialization error', error);
  }
}

// Throw an explicit error if DB is accessed before initialization succeeds
export const db = admin.apps.length ? admin.firestore() : new Proxy({} as admin.firestore.Firestore, {
  get(target, prop) {
    throw new Error(`CRITICAL: Firebase DB accessed but not initialized. Check Vercel environment variables! Trying to access: ${String(prop)}`);
  }
});

export default admin;
