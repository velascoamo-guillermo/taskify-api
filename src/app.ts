import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";
import { authRouter } from "./routes/auth.routes";
// import { authRouter } from "./modules/auth/auth.routes";
// import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.disable("x-powered-by");

// Health check
app.get("/health", (_, res) =>
  res.json({ status: "ok", message: "Taskify API running" })
);

// Routes
app.use("/auth", authRouter);

// Error handling
app.use(errorHandler);

export default app;
