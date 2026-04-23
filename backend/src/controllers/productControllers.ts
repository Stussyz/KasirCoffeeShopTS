import { Request, Response } from "express";
import { db } from "../db";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query("SELECT * FROM products WHERE is_active = TRUE");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data produk" });
    }
};