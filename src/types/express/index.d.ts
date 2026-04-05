declare namespace Express {
    interface Request {
        user?: {
            uid: string;
            role: string;
        };
    }
}
