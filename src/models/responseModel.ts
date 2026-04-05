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

export const successResponse = <T>(data?: T, message?: string): ApiResponse<T> => ({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
});

export const errorResponse = (message: string, code: string): ApiResponse<never> => ({
    success: false,
    error: {
        message,
        code,
    },
    timestamp: new Date().toISOString(),
});
