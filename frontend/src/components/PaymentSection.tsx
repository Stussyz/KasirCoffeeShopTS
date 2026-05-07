// TUGAS:
// 1. Menangani logika pembayaran
// 2. Menangani tombol bayar

interface PaymentSectionProps {
  paymentAmount: string;
  onChangePayment: (value: string) => void;
  onCheckout: () => void;
}

// Komponen ini menangani area input pembayaran dan tombol Bayar.
export default function PaymentSection({
  paymentAmount,
  onChangePayment,
  onCheckout,
}: PaymentSectionProps) {
  return (
    <div className="mt-4">
      <input
        type="number"
        value={paymentAmount}
        onChange={(e) => onChangePayment(e.target.value)}
        className="w-full rounded-lg border p-2"
        placeholder="Masukkan jumlah pembayaran"
      />

      <button
        onClick={onCheckout}
        className="mt-4 w-full rounded-lg bg-green-600 px-4 py-2 text-white"
      >
        Bayar
      </button>
    </div>
  );
}