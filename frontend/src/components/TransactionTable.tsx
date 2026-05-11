import type { Transaction } from "../types/transaction";
import { formatNumber } from "../utils/currency";

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({
  transactions,
}: TransactionTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white p-4 shadow">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Invoice</th>
            <th className="px-4 py-2 text-left">Kasir</th>
            <th className="px-4 py-2 text-left">Total</th>
            <th className="px-4 py-2 text-left">Bayar</th>
            <th className="px-4 py-2 text-left">Kembalian</th>
            <th className="px-4 py-2 text-left">Tanggal</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((trx) => (
            <tr key={trx.id} className="border-b">
              <td className="px-4 py-2">{trx.invoice_code}</td>
              <td className="px-4 py-2">{trx.cashier_name}</td>
              <td className="px-4 py-2">Rp {formatNumber(trx.total_amount)}</td>
              <td className="px-4 py-2">Rp {formatNumber(trx.payment_amount)}</td>
              <td className="px-4 py-2">Rp {formatNumber(trx.change_amount)}</td>
              <td className="px-4 py-2">
                {new Date(trx.created_at).toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}