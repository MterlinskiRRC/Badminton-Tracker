export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: {
        message: string;
        code: string;
    };
    timestamp: string;
}

// Success responses always use the same envelope.
export const successResponse = <T>(data?: T, message?: string): ApiResponse<T> => ({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
});

// Error responses also use the same envelope.
export const errorResponse = (message: string, code: string): ApiResponse<never> => ({
    success: false,
    error: {
        message,
        code,
    },
    timestamp: new Date().toISOString(),
});
