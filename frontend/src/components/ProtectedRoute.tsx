import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, isAuthLoading } = useAuth();
    if (!isAuthLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <p className="text-gray-500">Memeriksa sesi login..</p>
            </div>
        );
    }

    // Kalau belum login, paksa ke halaman login
    if (!user) {
        return <Navigate to = "/login" replace />;
    }

    return <>{ children }</>;
}