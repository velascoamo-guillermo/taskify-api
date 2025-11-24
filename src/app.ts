import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";
import { authRouter } from "./routes/auth.routes";
import rateLimit from "express-rate-limit";
import { requestLogger } from "./middlewares/requestLogger";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { projectRouter } from "./routes/project.routes.js";
import { fileRouter } from "./routes/file.routes.js";
import { ensureAuth } from "./middlewares/ensureAuth.js";
import { redisCache } from "./config/redis.js";
import { cloudinaryService } from "./config/cloudinary.js";

dotenv.config();
const app = express();

// Configure Helmet with Swagger-friendly settings
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for Swagger to work
    crossOriginEmbedderPolicy: false,
  })
);
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

// Swagger documentation
app.use("/docs", swaggerUi.serve);
app.get(
  "/docs",
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Taskify API Documentation",
  })
);

app.get("/health", (_, res) =>
  res.json({
    status: "ok",
    message: "Taskify API running",
    services: {
      redis: redisCache.isHealthy() ? "connected" : "disconnected",
      cloudinary: cloudinaryService.isHealthy()
        ? "configured"
        : "not_configured",
    },
  })
);

// Routes
app.use("/auth", authRouter);
app.use("/projects", ensureAuth, projectRouter);
app.use("/", ensureAuth, fileRouter);

// Error handling
app.use(errorHandler);

export default app;
