import { Request, Response } from "express";
import { db } from "../db";

export const createTransaction = async (req: Request, res: Response) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const { user_id, payment_amount, items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Tidak ada item transaksi"  });
        }

        const total_amount = items.reduce(
            (acc: number, item: any) => acc + item.quantity * item.price,
            0
        );

        const change_amount = payment_amount - total_amount;

        if (change_amount < 0) {
            return res.status(400).json({ message: "Uang pembayaran tidak mencukupi" });
        }

        const invoice_code = `INV-${Date.now()}`;

        const [transactionResult]: any = await connection.query(
            `INSERT INTO transctions (invoice_code, user_id, total_amount, payment_amount, change_amount VALUES (?, ?, ?, ?, ?))`,
            [invoice_code, user_id, total_amount, payment_amount, change_amount]
        );

        const transactionId = transactionResult.insertId;

        for (const item of items) {
            
            await connection.query(
                `INSERT INTO transaction_items (transaction_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)`,
            );

            await connection.query(
                `UPDATE products SET stock = stock - ? WHERE id = ?`,
                [item.quantity, item.product_id]
            );
        }

        await connection.commit();

        res.status(201).json({
            message: "Transaksi berhasil dibuat",
            invoice_code,
            total_amount,
            payment_amount,
            change_amount,
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: "Gagal membuat transaksi" });
    } finally {
        connection.release();
    }
};