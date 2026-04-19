import { NextFunction, Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { getFirebaseAdmin } from "../config/firebase";
import { AuthenticationError, AuthorizationError } from "../errors/appError";

type UserRole = "user" | "admin";

// Map Firebase role claims into the small role set used by the API.
function normalizeRole(roleValue: unknown): UserRole {
    return roleValue === "admin" ? "admin" : "user";
}

function isTokenFromExpectedProject(decoded: DecodedIdToken, expectedProjectId: string): boolean {
    const expectedIssuer: string = `https://securetoken.google.com/${expectedProjectId}`;
    return decoded.aud === expectedProjectId && decoded.iss === expectedIssuer;
}

export async function verifyFirebaseToken(
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> {
    const authHeader: string | undefined = req.headers.authorization;
    const token: string | undefined = authHeader?.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length)
        : undefined;

    if (!token) {
        next(new AuthenticationError("Missing or invalid Authorization header", "TOKEN_NOT_FOUND"));
        return;
    }

    try {
        const checkRevoked: boolean = process.env.FIREBASE_CHECK_REVOKED === "true";
        const expectedProjectId: string | undefined = process.env.FIREBASE_PROJECT_ID;
        const decoded: DecodedIdToken = await getFirebaseAdmin().auth().verifyIdToken(token, checkRevoked);

        if (expectedProjectId && !isTokenFromExpectedProject(decoded, expectedProjectId)) {
            next(new AuthenticationError("Token does not belong to configured Firebase project", "TOKEN_PROJECT_MISMATCH"));
            return;
        }

        const role: UserRole = normalizeRole(decoded.role);

        req.user = {
            uid: decoded.uid,
            role,
        };

        next();
    } catch (_error: unknown) {
        next(new AuthenticationError("Invalid or expired Firebase token", "TOKEN_INVALID"));
    }
}

export function requireRole(...allowedRoles: UserRole[]): (req: Request, res: Response, next: NextFunction) => void {
    // Reject requests when the authenticated role is not allowed.
    return (req: Request, _res: Response, next: NextFunction): void => {
        const userRole: UserRole | undefined = req.user?.role;
        if (!userRole || !allowedRoles.includes(userRole)) {
            next(new AuthorizationError("Forbidden: insufficient permissions", "INSUFFICIENT_ROLE"));
            return;
        }

        next();
    };
}

export function requirePlayerAuth(): (req: Request, res: Response, next: NextFunction) => void {
    return requireRole("user", "admin");
}
