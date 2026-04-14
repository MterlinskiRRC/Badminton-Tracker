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

    const serviceAccountPath: string | undefined = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    if (!serviceAccountPath) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT_PATH is required.");
    }

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

export function getFirebaseAdmin(): typeof admin {
    if (!appInitialized) {
        initializeFirebase();
    }

    return admin;
}

export async function verifyFirebaseConnections(): Promise<void> {
    const adminApp = getFirebaseAdmin();

    await adminApp.auth().listUsers(1);
    await adminApp.firestore().collection("connection_test").doc("ping").get();
}
