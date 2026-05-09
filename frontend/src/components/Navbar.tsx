import { Link, useLocation } from "react-router-dom"

// Navbar = komponen navigasi aplikasi
export default function Navbar() {
    // useLocation dipakai untuk mengetahui URL aktif sekarang
    const location = useLocation();


    const isActive = (path : string) => location.pathname === path;

    return (
        <nav className="mb-6 rounded-xl bg-white p-4 shadow">
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
        </nav>
    );
}