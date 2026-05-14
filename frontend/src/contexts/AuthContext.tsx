import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import type { AuthUser } from "../types/auth";

interface AuthContextType {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    logout: () => void;
    isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthUser | null>(null);
    // state ini untuk mengecek apakah aplikasi sedang mengecek localStorage
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
    // ketika app dibuka, ambil user dari localStorage (kalau ada)
    useEffect(() => {
        const storedUser = localStorage.getItem("auth_user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // setelah pengecekan localStorage selesai, loading auth dimatikan
        setIsAuthLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem("auth_user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, isAuthLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

// custom hook agar penggunaan context lebih mudah
    export function useAuth () {
        const context = useContext(AuthContext);

        if (!context) {
            throw new Error("useAuth harus dipakai di dalam AuthProvider");
        }

        return context;
    }