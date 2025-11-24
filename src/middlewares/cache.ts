import type { NextFunction, Request, Response } from "express";
import { redisCache } from "../config/redis.js";

export interface CacheConfig {
	ttl?: number; // Time to live in seconds
	keyPrefix?: string;
	skipCache?: (req: Request) => boolean;
}

export function cache(config: CacheConfig = {}) {
	const { ttl = 300, keyPrefix = "api", skipCache } = config;

	return async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		// Skip cache for specific conditions
		if (skipCache?.(req)) {
			return next();
		}

		// Only cache GET requests
		if (req.method !== "GET") {
			return next();
		}

		// Generate cache key
		const cacheKey = `${keyPrefix}:${req.originalUrl}:${JSON.stringify(
			req.query,
		)}`;

		try {
			// Try to get from cache
			const cachedData = await redisCache.get(cacheKey);

			if (cachedData) {
				res.set("X-Cache", "HIT");
				res.json(JSON.parse(cachedData));
				return;
			}

			// Store original json method
			const originalJson = res.json.bind(res);

			// Override json method to cache the response
			res.json = (data: unknown) => {
				// Cache the response
				redisCache.set(cacheKey, JSON.stringify(data), ttl).catch((err) => {
					console.error("Failed to cache response:", err);
				});

				res.set("X-Cache", "MISS");
				return originalJson(data);
			};

			next();
		} catch (error) {
			console.error("Cache middleware error:", error);
			next();
		}
	};
}

export function invalidateCache(pattern: string) {
	return async (
		_req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		// Store original json and status methods
		const originalJson = res.json.bind(res);
		const originalStatus = res.status.bind(res);

		let statusCode = 200;

		// Override status method to capture status code
		res.status = (code: number) => {
			statusCode = code;
			return originalStatus(code);
		};

		// Override json method to invalidate cache after successful operations
		res.json = (data: unknown) => {
			// Only invalidate cache for successful operations
			if (statusCode >= 200 && statusCode < 300) {
				redisCache.invalidatePattern(pattern).catch((err) => {
					console.error("Failed to invalidate cache:", err);
				});
			}

			return originalJson(data);
		};

		next();
	};
}
