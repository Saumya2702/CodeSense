import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import codeRoutes from "./routes/code.routes.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();


const app = express();
const PORT = process.env.PORT || 5000;

app.use("/api/code", codeRoutes);
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("CodeSense backend running.");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
