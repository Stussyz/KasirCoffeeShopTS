// TUGAS:
// 1. Menampilkan item di keranjang
// 2. Menangani tombol + dan -

import type { CartItem } from "../types/cart";
import { formatNumber } from "../utils/currency";

interface CartItemCardProps {
  item: CartItem;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
}

// Komponen ini hanya menampilkan SATU item keranjang.
export default function CartItemCard({
  item,
  onIncrease,
  onDecrease,
}: CartItemCardProps) {
  return (
    <div className="border-b pb-2">
      <p className="font-semibold">{item.name}</p>
      <p>Qty: {item.quantity}</p>
      <p>Subtotal: Rp {formatNumber(item.subtotal)}</p>

      {/* Tombol untuk menambah / mengurangi quantity */}
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => onDecrease(item.id)}
          className="rounded bg-gray-200 px-2 py-1"
        >
          -
        </button>

        <span>{item.quantity}</span>

        <button
          onClick={() => onIncrease(item.id)}
          className="rounded bg-gray-200 px-2 py-1"
        >
          +
        </button>
      </div>
    </div>
  );
}