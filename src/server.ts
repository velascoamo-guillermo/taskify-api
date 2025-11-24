import app from "./app.ts";
import logger from "./utils/logger.ts";
import { redisCache } from "./config/redis.js";
import { cloudinaryService } from "./config/cloudinary.js";

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    // Connect to Redis
    await redisCache.connect();
    logger.info("✅ Redis connected successfully");
  } catch (error) {
    logger.error("❌ Redis connection failed:", error);
    logger.warn("⚠️  API will run without cache");
  }

  // Check Cloudinary configuration
  if (cloudinaryService.isHealthy()) {
    logger.info("✅ Cloudinary configured successfully");
  } else {
    logger.warn(
      "⚠️  Cloudinary not configured - file uploads will be disabled"
    );
  }

  app.listen(port, () => {
    logger.info(`🚀 Server running on http://localhost:${port}`);
    logger.info(
      `📚 API Documentation available at http://localhost:${port}/docs`
    );
  });
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  await redisCache.disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully");
  await redisCache.disconnect();
  process.exit(0);
});

startServer();
