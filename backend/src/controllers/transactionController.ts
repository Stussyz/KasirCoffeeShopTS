import { Request, Response } from "express";
import { db } from "../db";

export const createTransaction = async (req: Request, res: Response) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();
        
        const {user_id, payment_amount, items} = req.body;
    
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Tidak ada item di keranjang!" })
        }

        let total_amount = 0;

        for (const item of items) {
            const [productRows]: any = await connection.query(
                "SELECT * FROM products WHERE id = ? AND is_active = TRUE",
                [item.product_id]
            );

            if (productRows.length === 0) {
                await connection.rollback();
                return res.status(400).json({
                    message: `Produk dengan ID ${item.product_id} tidak ditemukan!`,
                });
            }

            const product = productRows[0];
            
            if(product.stock < item.quantity) {
                await connection.rollback();
                return res.status(400).json({
                    message: `Stock ${product.name} tidak mencukupi!`,
                });
            }

            total_amount += item.quantity * item.price;
        }

        const change_amount = payment_amount - total_amount;

        if (change_amount < 0) {
            await connection.rollback();
            return res.status(400).json({
                message: "Uang yang dibayarakan kurang!" 
            });
        }

        const invoice_code = `INV-${Date.now()}`;

        const [transactionResult]: any = await connection.query(
            `INSERT INTO transactions 
            (invoice_code, user_id, total_amount, payment_amount, change_amount)
            VALUES (?, ?, ?, ?, ?)`,
            [invoice_code, user_id, total_amount, payment_amount, change_amount]
        );

        const transactionId = transactionResult.insertId;

        for (const item of items) {
            const subtotal = item.quantity * item.price;

            await connection.query(
                `INSERT INTO transaction_items
                (transaction_id, product_id, quantity, price, subtotal)
                VALUES (?, ?, ?, ?, ?)`,
                [transactionId, item.product_id, item.quantity, item.price, subtotal]
            );
            
            await connection.query(
                `UPDATE products SET stock = stock - ? WHERE id = ?`,
                [item.quantity, item.product_id]
            );
        }

        await connection.commit();

        res.status(201).json({
            message: "Transaksi berhasil!",
            invoice_code,
            total_amount,
            payment_amount,
            change_amount,
        });
    } catch (error) {
        await connection.rollback();
        console.error("Gagal membuat transaksi!:", error);
        res.status(500).json({
            message: "Gagal membuat transaksi!" 
        });
    } finally {
        connection.release();
    }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.id,
        t.invoice_code,
        t.total_amount,
        t.payment_amount,
        t.change_amount,
        t.created_at,
        u.name AS cashier_name
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Gagal mengambil transaksi:", error);
    res.status(500).json({ message: "Gagal mengambil transaksi" });
  }
};