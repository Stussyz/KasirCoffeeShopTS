import { Request, Response } from "express";
import { db } from "../db";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validasi yang wajib diisi:
        if (!email || !password) {
            return res.status(400).json({
                message: "Email dan password wajib diisi",
            });
        }

    // cari user berdasarkan email:
    const [rows]: any = await db.query(
        "SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1", [email]
    );

    // kalau user tidak ditemukan:
    if (rows.length === 0) {
        return res.status(401).json({
            message: "Email atau password salah",
        });
    }

    const user = rows[0];

    // membandingkan password input dengan password di database
    if (user.password !== password) {
        return res.status(401).json({
            message: "email atau password salah",
        });
    }

    // mencegah password dikirim ke frontend
    res.status(200).json({
        message: "Login berhasil",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
    } catch (error) {
        console.error("Login gagal:", error);
        res.status(500).json({
            message: "Terjadi kesalahan pada server",
        });
    }
};