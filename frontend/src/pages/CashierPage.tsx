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
import PageHeader from "../components/PageHeader";

export default function CashierPage() {
  // Menyimpan daftar produk yang diambil dari backend
  const [products, setProducts] = useState<Product[]>([]);

  // Menyimpan angka yang diketik user pada input pembayaran
  // Disimpan sebagai string karena input HTML mengembalikan string
  const [paymentAmount, setPaymentAmount] = useState<string>("");

  // Memakai custom hook useCart
  // Artinya semua logic cart sekarang diambil dari file hooks/useCart.ts
  const { cart, addToCart, increaseQty, decreaseQty, clearCart } = useCart();

  // state loading dan error saat akan menampilkan produk
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [productsError, setProductsError] = useState<string>("");

  // state loading pada untuk checkout
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  
  // Mengambil produk dari backend saat halaman pertama dibuka
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        setProductsError("");

        const data = await getProducts();
        console.log("Data products:", data);
        setProducts(data);
      } catch (error) {
        console.error("Gagal fetching products:", error);
        setProductsError("Gagal memuat data produk");
      } finally {
        setIsLoadingProducts(false);
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
      setIsCheckingOut(true);

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
      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          const soldItem = cart.find((item) => item.id === product.id);

          if (!soldItem) return product;
          
          return {
            ...product,
            stock: product.stock - soldItem.quantity,
          };
        })
      );  
    } catch (error) {
      console.error("Checkout gagal:", error);
      alert("Checkout gagal");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (

    <div>
      {/* Title diganti dengan komponen yg ada di PageHeader */}
      {/* <h1 className="mb-6 text-3xl font-bold">Kasir Coffee Shop</h1> */}
       <PageHeader 
          title="Cashier Kentjana Coffee"
          description="Mengelola transaksi dengan mudah dan cepat"
        />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* KOLOM KIRI: daftar produk */}
        <div className="lg:col-span-2">
          {/* conditional rendering = kondisi dibawah berdasarkan kondisi masing-masingnya */}
          {isLoadingProducts ? (
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Memuat produk...</p>
          </div>
          ) : productsError ? (
            <div className="rounded-xl bg-white p-6 shadow">
              <p className="text-red-500">{productsError}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-xl bg-white p-6 shadow">
              <p className="text-gray-500">Produk tidak tersedia</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
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
                isCheckingOut={isCheckingOut}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}