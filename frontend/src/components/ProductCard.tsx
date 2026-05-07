// TUGAS:
// 1. Menampilkan produk
// 2. Menangani tombol "Tambah"

import type { Product } from "../types/product";
import { formatNumber } from "../utils/currency";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

// Komponen ini hanya bertugas menampilkan SATU produk
// Dia tidak tahu soal state products secara keseluruhan
// Data produk dikirim lewat props dari parent (CashierPage)
export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-sm text-gray-500">Stok: {product.stock}</p>

      <p className="mt-2 text-xl font-bold">
        Rp {formatNumber(product.price)}
      </p>

      <button
        onClick={() => onAddToCart(product)}
        className="mt-4 w-full rounded-lg bg-amber-700 px-4 py-2 text-white"
      >
        Tambah
      </button>
    </div>
  );
}