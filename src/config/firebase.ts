import admin from "firebase-admin";
import { Firestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

let appInitialized: boolean = false;

interface ServiceAccountJson {
    project_id: string;
    client_email: string;
    private_key: string;
}

function loadServiceAccountFromFile(): ServiceAccountJson | null {
    const fileFromEnv: string | undefined = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const serviceAccountPath: string = fileFromEnv ?? path.resolve(process.cwd(), "firebase-service-account.json");

    if (!fs.existsSync(serviceAccountPath)) {
        return null;
    }

    const rawContent: string = fs.readFileSync(serviceAccountPath, "utf8");
    const parsed: ServiceAccountJson = JSON.parse(rawContent) as ServiceAccountJson;

    return parsed;
}

export function initializeFirebase(): void {
    if (appInitialized) {
        return;
    }

    const serviceAccount: ServiceAccountJson | null = loadServiceAccountFromFile();

    if (serviceAccount) {
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

    const projectId: string | undefined = process.env.FIREBASE_PROJECT_ID;
    const clientEmail: string | undefined = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey: string | undefined = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

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

export function getFirestoreDb(): Firestore {
    return getFirebaseAdmin().firestore();
}
