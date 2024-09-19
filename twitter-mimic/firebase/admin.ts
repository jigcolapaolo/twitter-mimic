import admin, { ServiceAccount } from "firebase-admin";


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS!) as ServiceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

// Se exporta solo el servicio de firestore Admin
export const firestore = admin.firestore()
