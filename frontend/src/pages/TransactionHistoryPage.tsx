import { useEffect, useState } from "react";
import { getTransactions } from "../services/transactionService";
import type { Transaction } from "../types/transaction";
// import { formatNumber } from "../utils/currency";
import PageHeader from "../components/PageHeader";
import TransactionTable from "../components/TransactionTable";

export default function TransactionHistoryPage() {
 const [transactions, setTransactions] = useState<Transaction[]>([]);
 const [isLoadingTransactions, setIsLoadingTransactions] = useState<boolean>(false);
 const [transactionsError, setTransactionsError] = useState<string>("");
 
 useEffect(() => {
    const fetchTransactions = async () => {
        try {
            setIsLoadingTransactions(true);
            setTransactionsError("");

            const data = await getTransactions();
            setTransactions(data);
        } catch (error) {
            console.error("Gagal mengambil riwayat transaksi:", error);
            setTransactionsError("Gagal memuat riwayat transaksi");
        } finally {
            setIsLoadingTransactions(false);
        }
    };

    fetchTransactions();
 }, []);

 return (
    <div className="min-h-screen bg-gray-100 p-6">
        {/* diganti dengan komponen yg ada di PageHeader */}
        {/* <h1 className="mb-6 text-3xl font-bold">Riwayat Transaksi</h1> */}
        <PageHeader 
            title="Riwayat Transaksi"
            description="Tampilkan daftar transaksi yang tersimpan"
        />

        {isLoadingTransactions ? (
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">Memuat riwayat transaksi...</p>
        </div>
      ) : transactionsError ? (
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-red-500">{transactionsError}</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">Belum ada transaksi tersimpan</p>
        </div>
      ) : (
        <TransactionTable transactions={transactions} />
      )}
    </div>
  );
}