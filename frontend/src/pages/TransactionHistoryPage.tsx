import { useEffect, useState } from "react";
import { getTransactions } from "../services/transactionService";
import type { Transaction } from "../types/transaction";
import { formatNumber } from "../utils/currency";

export default function TransactionHistoryPage() {
 const [transactions, setTransactions] = useState<Transaction[]>([]);
 
 useEffect(() => {
    const fetchTransactions = async () => {
        try {
            const data = await getTransactions();
            setTransactions(data);
        } catch (error) {
            console.error("Gagal mengambil riwayat transaksi:", error);
        }
    };

    fetchTransactions();
 }, []);

 return (
    <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="mb-6 text-3xl font-bold">Riwayat Transaksi</h1>

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
                            <td className="px-4 py-2">{trx.invoice_code}</td>
                            <td className="px-4 py-2">{formatNumber(trx.total_amount)}</td>
                            <td className="px-4 py-2">{formatNumber(trx.payment_amount)}</td>
                            <td className="px-4 py-2">{formatNumber(trx.change_amount)}</td>
                            <td className="px-4 py-2">
                                {new Date(trx.created_at).toLocaleString("id-ID")}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
 );
}