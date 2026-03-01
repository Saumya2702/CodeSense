import express from "express";
import cors from "cors";
import codeRoutes from "./routes/code.routes.js";
import reviewRoutes from "./routes/review.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "CodeSense backend" });
});

app.use("/api/code", codeRoutes);
app.use("/api/review", reviewRoutes);

app.get("/", (req, res) => {
  res.send("CodeSense backend running.");
});

export default app;
