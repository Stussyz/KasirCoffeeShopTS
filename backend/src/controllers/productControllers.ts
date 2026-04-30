import { Request, Response } from "express";
import { db } from "../db";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query("SELECT * FROM products WHERE is_active = TRUE");
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Gagal mengambil data produk", error });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } =req.params;
        const[rows]: any = await db.query("SELECT * FROM products WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil detail produk" });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { category_id, name, price, stock, image_url } = req.body;

        await db.query(
            "INSERT INTO products (category_id, name, price, stock, image_url) VALUES (?, ?, ?, ?, ?)",
            [category_id, name, price, stock, image_url]
        );
        res.status(201).json({ message: "Produk berhasil ditambahkan" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambahkan produk" });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { category_id, name, price, stock, image_url } = req.body;

        await db.query(
            "UPDATE products SET category_id = ?, name = ?, price = ?, stock = ?, image_url = ? WHERE id = ?",
            [category_id, name, price, stock, image_url, id]
        );

        res.json({ message: "Produk berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ message: "Gagal memperbarui produk" });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await db.query("UPDATE products SET is_active = FALSE WHERE id = ?", [id]);

        res.json({ message: "Produk berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus produk" });
    }
};