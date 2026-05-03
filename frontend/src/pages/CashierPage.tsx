import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import type { Product } from "../types/product";
import type { CartItem } from "../types/cart"
import { createTransaction } from "../services/transactionService";

// EXPORT FUNGSI, KELAS, OBJEK, ATAU NILAI LAIN SEBAGAI DEFAULT VALUE DARI MODULE. 
export default function CashierPage() {
    // STATE <Product> digunakan untuk menyimpan daftar produk yang diambil dari backend.
    // TYPE "Product[]" digunakan karena setiap element dalam array harus sesuai dengan struktur yang didefinisikan dalam interface "Product" yang diimpor dari "../types/product".
    const [products, setProducts] = useState<Product[]>([
        // Data dummy ini digunakan untuk melakukan tes fetching data produk dari backend!!!!
        // {
        //     id: 1,
        //     category_id: 1,
        //     name: "Cappucino",
        //     price: 20000,
        //     stock: 100,
        //     image_url:"",
        //     is_active: true,
        // }
    ]);

    // FUNCTION MENYIMPAN ITEM YANG DITAMBAHKAN KE KERANJANG BELANJA
    const [cart, setCart] = useState<CartItem[]>([]);
    // "useEffect" (hook React) akan menjalankan sebuah proses setelah komponen dirender pertama kali
    useEffect (() => {
        const fetchProducts = async () => {
            try{

                const data = await getProducts();
                console.log("Data products:", data);
                setProducts(data);
            } catch (error) {
                console.error("Gagal fetching products:", error);
            }
        };

        fetchProducts();
        // Dependency array kosong "[]" dipakai agar function "fetchProducts" hanya dijalankan sekali saat komponen pertama kali muncul
        // Kalau tidak ada dependency array kosong maka fetching data akan berjalan terus menerus setiap kali komponen dirender
    }, []);

    // FUNCTION MENAMBAHKAN PRODUK KE KERANJANG BELANJA
    const addToCart = (product: Product) => {
        // State dibawah ini (prevCart) dipakai untuk memeriksa apakah produk yang ditambahkan sudah ada di keranjang belanja atau belum
        setCart((prevCart) => {
            // ".find" adalah method array yg dipakai untuk mencari item dalam array "prevCart" yg memiliki "id" yg sama dengan "product.id" 
            const existingItem = prevCart.find((item) => item.id === product.id);
            
            if (existingItem) {
                // map adalah method array yg dipakai untuk mengupdate item tertentu tanpa mengubah item lainnya dalam array "prevCart"
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { 
                            // spread operator "...item" dipakai agar properti yg lama tetap ada, lalu kita update "quantity" dan "subtotal" sesuai dengan penambahan produk yang sama  
                            ...item, 
                            quantity: item.quantity + 1, 
                            subtotal: (item.quantity + 1) * Number(item.price),
                        }
                        : item
                    );
                }

                return [
                    ...prevCart,
                    {
                        // sama juga kayak "...item" tapi ini untuk menambahkan properti baru "quantity" dan "subtotal" ke dalam objek produk yang ditambahkan ke keranjang belanja
                        ...product,
                        quantity: 1,
                        subtotal: product.price,
                    },
                ];
            });
    };

    // FUNCTION MENGHITUNG TOTAL HARGA BELANJAAN DI KERANJANG
    const totalAmount = cart.reduce((acc, item) => acc + Number(item.subtotal), 0);
    
    // FUNCTION UNTUK MENAMBAHKAN KUANTITAS ITEM DI KERANJANG BELANJA
    const increaseQty = (id: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                        subtotal: (item.quantity + 1) * Number(item.price),
                    }
                    : item
            )
        );
    };

    // FUNCTION UNTUK MENGURANGI KUANTITAS ITEM DI KERANJANG BELANJA
    const decreaseQty = (id: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id && item.quantity > 1
                    ? {
                        ...item,
                        quantity: item.quantity - 1,
                        subtotal: (item.quantity - 1) * Number(item.price),
                    }
                    : item
            )
            .filter((item) => item.quantity > 0)
        );
    };

    // FUNCTION UNTUK MEMBUAT TRANSAKSI (CHECKOUT) DAN MENGIRIM DATA KE BACKEND
    // Tipe data "STRING" digunakan pada state "paymentAmount" karena input HTML selalu mengembalikan nilai sebagai string, meskipun tipe inputnya adalah "number".
    // Apabila menggunakan tipe data "NUMBER" maka input angka pembayaran akan error.
    // Sehingga diperlukan konversi ke "NUMBER" saat mengirim data ke backend dengan menggunakan "Number(paymentAmount)" 
    const [paymentAmount, setPaymentAmount] = useState<string>("");

    const handleCheckout = async () => {
        try {
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
                `Transaksi berhasil! Kembalian: Rp ${result.change_amount.toLocaleString("id-ID")}`
            );

            setCart([]);
            setPaymentAmount("");
        } catch (error) {
            console.error("Checkout gagal:", error);
            alert("Checkout gagal");
        }
    };

    return (
        // JUDUL HALAMAN KASIR
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="mb-6 text-3xl font-bold">Kasir Coffee Shop</h1>
            
            {/* MENAMPILKAN DAFTAR PRODUK */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <div key={product.id} className="rounded-xl bg-white p-4 shadow">
                        <h2 className="text-lg font-semibold">{product.name}</h2>
                        <p className="text-sm text-gray-500">Stok: {product.stock}</p>
                        <p className="mt-2 text-xl font-bold">Rp {Number(product.price).toLocaleString("id-ID")}</p>
                        <button onClick={() => addToCart(product)} className="mt-4 w-full rounded-lg bg-amber-700 px-4 py-2 text-white">
                            Tambah
                        </button>
                    </div>
                ))}
                </div>
            </div>
            
            {/* KERANJANG BELANJA */}
            <div className="rounded-xl bg-white p-4 shadow">
                <h2 className="mb-4 text-xl font-bold">Keranjang Belanja</h2>
                
                    {cart.length === 0 ? (
                        <p className="text-gray-500">Belum ada item di keranjang</p>
                    ) : (
                    <>
                        <div className="space-y-3">
                            {cart.map((item) => (
                                <div key={item.id} className="border-b pb-2">
                                    <p className="font-semibold">{item.name}</p>
                                    <p>Qty: {item.quantity}</p>
                                    <p>Subtotal: Rp {Number(item.subtotal).toLocaleString("id-ID")}</p>

                                    {/* MENAMBAH DAN MENGURANGI KUANTITAS */}
                                    <div className="mt-2 flex items-center gap-2">
                                        <button 
                                        onClick={() => decreaseQty(item.id)}
                                        className="rounded bg-gray-200 px-2 py-1"
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button 
                                        onClick={() => increaseQty(item.id)}
                                        className="rounded bg-gray-200 px-2 py-1"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* MENGHITUNG HARGA TOTAL BELANJA */}
                        <div className="mt-4 pt-4">
                            <p className="text-lg font-bold">
                            Total: Rp {Number(totalAmount).toLocaleString("id-ID")}
                            </p>
                        </div>

                        <div className="mt-4">
                            <input 
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                className="w-full rounded-lg border p-2"
                                placeholder="Masukkan jumlah pembayaran"
                            />
                        </div>

                        <button
                        onClick={handleCheckout}
                        className="mt-4 w-full rounded-lg bg-green-600 px-4 py-2 text-white"
                        >
                            Bayar
                        </button>
                    </>
                )}
            </div>
        </div>
    </div>
    );
}


