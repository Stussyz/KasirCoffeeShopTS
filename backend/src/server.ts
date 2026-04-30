import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import transactionRoutes from "./routes/transactionRoutes";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Congrats!, your API is working fine!");
});

// add routes baru: /products
app.use("/products", productRoutes)
// add routes baru: /transactions
app.use("/transactions", transactionRoutes)

app.listen(PORT, () => {
    console.log(`Your server is running on http://localhost:${PORT}`);
});