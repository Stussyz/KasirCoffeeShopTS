import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import type { Product } from "../types/product";

export default function CashierPage() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect (() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            setProducts(data);
        };
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="mb-6 text-3xl font-bold">Kasir Coffee Shop</h1>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
                <div key={product.id} className="rounded-xl bg-white p-4 shadow">
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="text-sm text-gray-500">Stok: {product.stock}</p>
                    <p className="mt-2 text-xl font-bold">Rp {product.price.toLocaleString("id-ID")}</p>
                    <button className="mt-4 w-full rounded-lg bg-amber-700 px-4 py-2 text-white">Tambah</button>
                </div>
            ))}
        </div>
        </div>
    );
}