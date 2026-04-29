import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import type { Product } from "../types/product";
import type { CartItem } from "../types/cart"

// EXPORT DEFAULT ADALAH UNTUK: 
// MENGEKSPOR SEBUAH FUNGSI, KELAS, OBJEK, ATAU NILAI LAIN SEBAGAI NILAI DEFAULT DARI MODULE. 
// PADA KASUS INI, FUNGSI CashierPage DI EKSPOR SEBAGAI NILAI DEFAULT, 
// SEHINGGA BISA DIIMPOR TANPA HARUS MENGGUNAKAN NAMA YANG SAMA DENGAN FUNGSI TERSEBUT.
export default function CashierPage() {
    const [products, setProducts] = useState<Product[]>([
        // just for testing, will be removed later!.
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
    }, []);

    // FUNCTION MENAMBAHKAN PRODUK KE KERANJANG BELANJA
    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { 
                            ...item, 
                            quantity: item.quantity + 1, 
                            subtotal: (item.quantity + 1) * item.price,
                        }
                        : item
                    );
                }

                return [
                    ...prevCart,
                    {
                        ...product,
                        quantity: 1,
                        subtotal: product.price,
                    },
                ];
            });
    };

    // FUNCTION MENGHITUNG TOTAL HARGA BELANJAAN DI KERANJANG
    const totalAmount = cart.reduce((acc, item) => acc + item.subtotal, 0);
    
    // FUNCTION UNTUK MENINGKATKAN ATAU MENGURANGI KUANTITAS ITEM DI KERANJANG BELANJA
    const increaseQty = (id: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                        subtotal: (item.quantity + 1) * item.price,
                    }
                    : item
            )
        );
    };

    const decreaseQty = (id: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id && item.quantity > 1
                    ? {
                        ...item,
                        quantity: item.quantity - 1,
                        subtotal: (item.quantity - 1) * item.price,
                    }
                    : item
            )
            .filter((item) => item.quantity > 0)
        );
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
                        <div className="space-y-3">
                            {cart.map((item) => (
                                <div key={item.id} className="border-b pb-2">
                                    <p className="font-semibold">{item.name}</p>
                                    <p>Qty: {item.quantity}</p>
                                    <p>Subtotal: Rp {Number(item.subtotal).toLocaleString("id-ID")}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* MENGHITUNG HARGA TOTAL BELANJA */}
            <div className="mt-4 border-t pt-4">
                <p className="text-lg font-bold">
                    Total: Rp {totalAmount.toLocaleString("id-ID")}
                </p>
            </div>

            <div className="mt-2 flex items-cernter gap-2">
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
    );
}

