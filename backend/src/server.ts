import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
// add routes baru: /products
app.use("/products", productRoutes)

app.get("/", (req, res) => {
    res.send("Congrats!, your API is working fine!");
});

app.listen(PORT, () => {
    console.log(`Your server is running on http://localhost:${PORT}`);
});