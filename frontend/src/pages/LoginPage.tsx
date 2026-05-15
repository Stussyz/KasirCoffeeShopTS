import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authServices";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage () {
    const navigate = useNavigate();
    const { user, setUser, isAuthLoading } = useAuth();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    
    // Kalau user sudah login dan auth sudah selesai dicek, jangan biarkan tetap di /login
    useEffect(() => {
        console.log("LoginPage -> user:", user);
        console.log("LoginPage -> isAuthLoading:", isAuthLoading);

        if (!isAuthLoading && user) {
        navigate("/", { replace: true });
        }
    }, [user, isAuthLoading, navigate]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            setErrorMessage("Email dan password wajib diisi");
            return;
        }

        try {
            setIsSubmitting(true);
            setErrorMessage("");

            const result = await login({ email, password });

            // Simpan user ke context
            setUser(result.user);

            // Simpan user ke localStorage agar tetap login saat refresh
            localStorage.setItem("auth_user", JSON.stringify(result.user));

            // Setelah login sukses, arahkan ke halaman kasir
            navigate("/", { replace: true });
        } catch (error: any) {
            console.error("Login gagal:", error);

            const message = error?.response?.data?.message || "Login gagagl, silahkan coba lagi";

            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
            <h1 className="mb-2 text-3xl font-bold">Login Kasir</h1>
            <p className="mb-6 text-sm text-gray-600">
            Masuk untuk mengakses aplikasi kasir coffee shop
            </p>

            {errorMessage && (
            <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
                {errorMessage}
            </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border p-2"
                placeholder="Masukkan email"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">Password</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border p-2"
                placeholder="Masukkan password"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-amber-700 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? "Memproses..." : "Login"}
            </button>
            </form>
        </div>
        </div>
    );
}