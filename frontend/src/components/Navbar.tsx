import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext";

// Navbar = komponen navigasi aplikasi
export default function Navbar() {
    // useLocation dipakai untuk mengetahui URL aktif sekarang
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const isActive = (path : string) => location.pathname === path;
    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <nav className="mb-6 rounded-xl bg-white p-4 shadow">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <Link
                    to="/"
                    className={`rounded-lg px-4 py-2 ${isActive('/')
                        ? "bg-amber-700 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    >
                        Kasir
                    </Link>

                    <Link
                    to="/transactions"
                    className={`rounded-lg px-4 py-2 ${isActive("/transactions")
                        ? "bg-amber-700 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    >
                        Riwayat Transaksi
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-600">
                        Login sebagai: <span className="font-semibold">{user?.name}</span>
                    </div>

                    <button
                    onClick={handleLogout}
                    className="rounded-lg bg-red-500 px-4 py-2 text-white"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}