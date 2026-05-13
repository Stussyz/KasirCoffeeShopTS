// data user yang dipakai frontend:
export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

// data user yang dikirim ketika login:
export interface LoginPayload {
    email: string;
    password: string;
}

// response sukses dari backend:
export interface LoginResponse {
    message: string;
    user: AuthUser;
}