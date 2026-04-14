import admin from "firebase-admin";
import dotenv from "dotenv";
import { readFileSync } from "fs";

let appInitialized: boolean = false;

dotenv.config({ quiet: true });

// Initialize Firebase Admin once for the whole process.
export function initializeFirebase(): void {
    if (appInitialized) {
        return;
    }

    const serviceAccountPath: string | undefined = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const projectId: string | undefined = process.env.FIREBASE_PROJECT_ID;
    const clientEmail: string | undefined = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey: string | undefined = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (serviceAccountPath) {
        const serviceAccountRaw = readFileSync(serviceAccountPath, "utf8");
        const serviceAccount = JSON.parse(serviceAccountRaw) as admin.ServiceAccount;

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        appInitialized = true;
        return;
    }

    // Use service-account fields when they are provided.
    if (projectId && clientEmail && privateKey) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
        appInitialized = true;
        return;
    }

    // Fall back to the default app if no explicit credentials exist.
    if (!admin.apps.length) {
        admin.initializeApp();
    }

    appInitialized = true;
}

export function getFirebaseAdmin(): typeof admin {
    if (!appInitialized) {
        initializeFirebase();
    }

    return admin;
}
