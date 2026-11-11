export interface LoginRequest {
    user_email: string,
    password: string
}

export interface RegisterRequest {
    user_name: string,
    user_email: string,
    password: string
}

export interface AuthResponse {
    message?: string;
    data: {
        token: string;
        expiresAt: string;
        role: string;
        userId: string;
        userName: string;
        userEmail: string;
    };
}