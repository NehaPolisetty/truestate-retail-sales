// backend/src/index.js
import express from "express";
import cors from "cors";
import salesRouter from "./routes/salesRoutes.js";
import { loadSalesData } from "./utils/dataLoader.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// load data once at startup
await loadSalesData();

app.use("/api/sales", salesRouter);

app.get("/", (req, res) => {
  res.json({ message: "Retail Sales Management API is running" });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
