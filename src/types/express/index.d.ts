// Extend Express requests with the authenticated user context.
declare namespace Express {
    interface Request {
        user?: {
            uid: string;
            role: "user" | "admin";
        };
    }
}
