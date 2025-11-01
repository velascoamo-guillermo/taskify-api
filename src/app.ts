import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";
import { authRouter } from "./routes/auth.routes";
import rateLimit from "express-rate-limit";
import { requestLogger } from "./middlewares/requestLogger";
import helmet from "helmet";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.disable("x-powered-by");
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(requestLogger);

// Health check
app.get("/health", (_, res) =>
  res.json({ status: "ok", message: "Taskify API running" })
);

// Routes
app.use("/auth", authRouter);

// Error handling
app.use(errorHandler);

export default app;
