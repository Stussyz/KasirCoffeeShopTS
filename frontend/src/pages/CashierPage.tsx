// TUGAS:
// 1. Ambil data produk dari backend
// 2. Menyimpan state "paymentAmount"
// 3. Menghitung "totalAmount" dan "changeAmount"
// 4. Memanggil komponen UI
// 5. Menjalankan "handleCheckout"


import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { createTransaction } from "../services/transactionService";
import type { Product } from "../types/product";

import { useCart } from "../hooks/useCart";

import ProductCard from "../components/ProductCard";
import CartItemCard from "../components/CartItemCard";
import CartSummary from "../components/CartSummary";
import PaymentSection from "../components/PaymentSection";

export default function CashierPage() {
  // Menyimpan daftar produk yang diambil dari backend
  const [products, setProducts] = useState<Product[]>([]);

  // Menyimpan angka yang diketik user pada input pembayaran
  // Disimpan sebagai string karena input HTML mengembalikan string
  const [paymentAmount, setPaymentAmount] = useState<string>("");

  // Memakai custom hook useCart
  // Artinya semua logic cart sekarang diambil dari file hooks/useCart.ts
  const { cart, addToCart, increaseQty, decreaseQty, clearCart } = useCart();

  // Mengambil produk dari backend saat halaman pertama dibuka
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        console.log("Data products:", data);
        setProducts(data);
      } catch (error) {
        console.error("Gagal fetching products:", error);
      }
    };

    fetchProducts();
    // Dependensi kosong "[]" artinya fetchProducts hanya dijalankan sekali saat komponen pertama kali dimuat.
  }, []);

  // Menghitung total semua subtotal item yang ada di keranjang
  // "reduce" = function array untuk menghitung semua subtotal item di cart menjadi satu angka "totalAmount"   
  // "acc" = accumulator, "item" = item yg dikeranjang sekarang
  const totalAmount = cart.reduce((acc, item) => acc + Number(item.subtotal), 0);

  // Menghitung estimasi kembalian
  // Jika input pembayaran kosong, maka dianggap 0
  // kembalian = paymentAmount - totalAmount
  const changeAmount = Number(paymentAmount || 0) - totalAmount;

  // Function checkout untuk mengirim transaksi ke backend
  const handleCheckout = async () => {
    // validasi 1: jangan checkout kalau keranjang masih kosong
    if (cart.length === 0) {
      alert("Keranjang masih kosong");
      return;
    }
    // validasi 2: jangan checkout kalau input pembayaran kosong
    if (!paymentAmount) {
      alert("Masukkan jumlah pembayaran terlebih dahulu");
      return;
    }
    // validasi 3: uang customer harus cukup
    if (Number(paymentAmount) < totalAmount) {
      alert("Uang pembayaran kurang");
      return;
    }

    try {
      // Payload = object data yang akan dikirim ke backend
      const payload = {
        user_id: 1,
        payment_amount: Number(paymentAmount),
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: Number(item.price),
        })),
      };

      const result = await createTransaction(payload);

      alert(
        `Transaksi berhasil\nInvoice: ${result.invoice_code}\nKembalian: Rp ${Number(
          result.change_amount
        ).toLocaleString("id-ID")}`
      );

      // Reset cart dan input setelah checkout sukses
      clearCart();
      setPaymentAmount("");
    } catch (error) {
      console.error("Checkout gagal:", error);
      alert("Checkout gagal");
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Kasir Coffee Shop</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* KOLOM KIRI: daftar produk */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>

        {/* KOLOM KANAN: keranjang */}
        <div className="rounded-xl bg-white p-4 shadow">
          <h2 className="mb-4 text-xl font-bold">Keranjang Belanja</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">Belum ada item di keranjang</p>
          ) : (
            <>
              <div className="space-y-3">
                {cart.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onIncrease={increaseQty}
                    onDecrease={decreaseQty}
                  />
                ))}
              </div>

              <CartSummary
                totalAmount={totalAmount}
                paymentAmount={paymentAmount}
                changeAmount={changeAmount}
              />

              <PaymentSection
                paymentAmount={paymentAmount}
                onChangePayment={setPaymentAmount}
                onCheckout={handleCheckout}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}