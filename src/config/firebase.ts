import admin from "firebase-admin";

let appInitialized: boolean = false;

export function initializeFirebase(): void {
    if (appInitialized) {
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
