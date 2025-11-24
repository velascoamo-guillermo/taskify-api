import { createClient } from "redis";
import logger from "../utils/logger.js";
import { env } from "./env.js";

class RedisCache {
	private client;
	private isConnected = false;

	constructor() {
		this.client = createClient({
			url: env.REDIS_URL || "redis://localhost:6379",
		});

		this.client.on("error", (err) => {
			logger.error("Redis Client Error:", err);
			this.isConnected = false;
		});

		this.client.on("connect", () => {
			logger.info("Redis Client Connected");
			this.isConnected = true;
		});

		this.client.on("disconnect", () => {
			logger.info("Redis Client Disconnected");
			this.isConnected = false;
		});
	}

	async connect(): Promise<void> {
		try {
			await this.client.connect();
		} catch (error) {
			logger.error("Failed to connect to Redis:", error);
		}
	}

	async disconnect(): Promise<void> {
		try {
			await this.client.quit();
		} catch (error) {
			logger.error("Failed to disconnect from Redis:", error);
		}
	}

	async get(key: string): Promise<string | null> {
		if (!this.isConnected) return null;

		try {
			return await this.client.get(key);
		} catch (error) {
			logger.error(`Failed to get key ${key} from Redis:`, error);
			return null;
		}
	}

	async set(key: string, value: string, ttl?: number): Promise<void> {
		if (!this.isConnected) return;

		try {
			if (ttl) {
				await this.client.setEx(key, ttl, value);
			} else {
				await this.client.set(key, value);
			}
		} catch (error) {
			logger.error(`Failed to set key ${key} in Redis:`, error);
		}
	}

	async del(key: string): Promise<void> {
		if (!this.isConnected) return;

		try {
			await this.client.del(key);
		} catch (error) {
			logger.error(`Failed to delete key ${key} from Redis:`, error);
		}
	}

	async invalidatePattern(pattern: string): Promise<void> {
		if (!this.isConnected) return;

		try {
			const keys = await this.client.keys(pattern);
			if (keys.length > 0) {
				await this.client.del(keys);
			}
		} catch (error) {
			logger.error(
				`Failed to invalidate pattern ${pattern} from Redis:`,
				error,
			);
		}
	}

	isHealthy(): boolean {
		return this.isConnected;
	}
}

export const redisCache = new RedisCache();
