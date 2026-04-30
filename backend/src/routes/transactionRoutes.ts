import { Router } from "express";
import { createTransaction } from "../controllers/transactionController";

const router = Router();

router.post("/", createTransaction);

export default router;