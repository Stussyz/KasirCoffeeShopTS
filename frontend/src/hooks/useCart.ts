// TUGAS:
// Menyimpan state "cart"
// Berisi function "addToCart, increaseQty, decreaseQty, clearCart"

import { useState } from "react";
import type { Product } from "../types/product";
import type { CartItem } from "../types/cart";

// Custom hook = function React yang berisi logic stateful
// dan bisa dipakai ulang di komponen lain.
// Karena hook ini memakai useState, nama function-nya diawali "use".
export function useCart() {
  // State ini menyimpan daftar item yang ada di keranjang
  const [cart, setCart] = useState<CartItem[]>([]);

  // Menambahkan produk ke keranjang
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      // Cari apakah produk yang diklik sudah ada di cart
      const existingItem = prevCart.find((item) => item.id === product.id);

      // Jika sudah ada, cukup tambah quantity dan subtotal
      if (existingItem) {
        // validasi untuk mencegah quantity yang di add melebihi stock yang ada
        if (existingItem.quantity >= product.stock) {
            alert(`Stock ${product.name} tidak mencukupi`);
            return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * Number(item.price),
              }
            : item
        );
      }

      // Jika belum ada, masukkan sebagai item baru ke keranjang
      return [
        ...prevCart,
        {
          ...product,
          quantity: 1,
          subtotal: Number(product.price),
        },
      ];
    });
  };

  // Menambah quantity item di cart
  const increaseQty = (id: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
            if (item.quantity >= item.stock) {
                alert (`Stok ${item.name} tidak mencukupi`);
                return item;
            }

            return {
              ...item,
              quantity: item.quantity + 1,
              subtotal: (item.quantity + 1) * Number(item.price),
            };
        }
       
        return item;
      })
    );
  };

  // Mengurangi quantity item di cart
  const decreaseQty = (id: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
                subtotal: (item.quantity - 1) * Number(item.price),
              }
            : item
        )
        // Jika quantity sudah 0, item dihapus dari keranjang
        .filter((item) => item.quantity > 0)
    );
  };

  // Mengosongkan semua isi keranjang setelah checkout sukses
  const clearCart = () => {
    setCart([]);
  };

  // Nilai yang dikembalikan hook ini bisa dipakai oleh halaman CashierPage
  return {
    cart,
    addToCart,
    increaseQty,
    decreaseQty,
    clearCart,
  };
}