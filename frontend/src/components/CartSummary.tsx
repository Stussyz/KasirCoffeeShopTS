// TUGAS:
// Menampilkan "Total, Pembayaran, dan Kembalian"

import { formatNumber } from "../utils/currency";

interface CartSummaryProps {
  totalAmount: number;
  paymentAmount: string;
  changeAmount: number;
}

// Komponen ini hanya menampilkan ringkasan angka.
// Dia tidak bertugas menghitung.
export default function CartSummary({
  totalAmount,
  paymentAmount,
  changeAmount,
}: CartSummaryProps) {
  return (
    <div className="mt-4 pt-4">
      <p className="text-lg font-bold">
        Total: Rp {formatNumber(totalAmount)}
      </p>

      <div className="mt-2">
        <p className="text-sm text-gray-600">
          Pembayaran: Rp {formatNumber(paymentAmount || 0)}
        </p>
        <p className="text-sm text-gray-600">
          Kembalian: Rp {formatNumber(Math.max(changeAmount, 0))}
        </p>
      </div>
    </div>
  );
}