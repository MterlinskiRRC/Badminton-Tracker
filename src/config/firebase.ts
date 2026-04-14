import admin from "firebase-admin";
import { readFileSync } from "node:fs";

interface ServiceAccountCredential {
    project_id: string;
    client_email: string;
    private_key: string;
}

let appInitialized: boolean = false;

export function initializeFirebase(): void {
    if (appInitialized) {
        return;
    }

    const projectId: string | undefined = process.env.FIREBASE_PROJECT_ID;
    const clientEmail: string | undefined = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey: string | undefined = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const serviceAccountPath: string | undefined = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? process.env.GOOGLE_APPLICATION_CREDENTIALS;

    if (serviceAccountPath) {
        const serviceAccountRaw: string = readFileSync(serviceAccountPath, "utf8");
        const serviceAccount: ServiceAccountCredential = JSON.parse(serviceAccountRaw) as ServiceAccountCredential;

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: serviceAccount.project_id,
                clientEmail: serviceAccount.client_email,
                privateKey: serviceAccount.private_key,
            }),
        });
        appInitialized = true;
        return;
    }

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

    throw new Error(
        "Firebase credentials are required. Set FIREBASE_SERVICE_ACCOUNT_PATH or GOOGLE_APPLICATION_CREDENTIALS, or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
    );
}

export function getFirebaseAdmin(): typeof admin {
    if (!appInitialized) {
        initializeFirebase();
    }

    return admin;
}
