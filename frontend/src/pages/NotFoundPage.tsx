import { Link } from "react-router-dom";

export default function NotFoundPage () {
    return (
        <div className="rounded-xl bg-white p-8 text-center shadow">
            <h1 className="text-3xl font-bold">404</h1>
            <p className="mt-2 text-gray-600">Halaman tidak dapat ditemukan</p>

            <Link
                to="/"
                className="mt-4 inline-block rounded-lg bg-amber-700 px-4 py-2 text-white"
            >
                Kembali ke halaman kasir
            </Link>
        </div>
    );
}