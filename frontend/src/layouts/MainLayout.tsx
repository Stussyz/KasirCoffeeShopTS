import type { ReactNode } from "react";
import Navbar from "../components/Navbar";

interface MainLayoutProps {
    children: ReactNode;
}

// Layout pembungkus untuk semua halaman umum
// Komponen ini menerima "children" yaitu isi halaman yg akan ditampilkan di dalam layout
export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <Navbar />
            {children}
        </div>
    )
}