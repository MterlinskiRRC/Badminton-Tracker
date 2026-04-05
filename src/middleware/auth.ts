import { NextFunction, Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { getFirebaseAdmin } from "../config/firebase";

export async function verifyFirebaseToken(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const bypassAuth: boolean = process.env.BYPASS_AUTH === "true";

    if (bypassAuth) {
        req.user = { uid: "local-dev-user", role: "admin" };
        next();
        return;
    }

    const authHeader: string | undefined = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Missing or invalid Authorization header" });
        return;
    }

    const token: string = authHeader.split(" ")[1];

    try {
        const decoded: DecodedIdToken = await getFirebaseAdmin().auth().verifyIdToken(token);
        const roleValue: unknown = decoded.role;
        const role: string = typeof roleValue === "string" ? roleValue : "player";

        req.user = {
            uid: decoded.uid,
            role,
        };

        next();
    } catch (_error: unknown) {
        res.status(401).json({ message: "Invalid or expired Firebase token" });
    }
}

export function requireRole(...allowedRoles: string[]): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
        const userRole: string | undefined = req.user?.role;
        if (!userRole || !allowedRoles.includes(userRole)) {
            res.status(403).json({ message: "Forbidden: insufficient permissions" });
            return;
        }

        next();
    };
}
