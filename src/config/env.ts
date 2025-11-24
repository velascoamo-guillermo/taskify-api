import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.url(),
	JWT_SECRET: z.string().min(32),
	JWT_REFRESH_SECRET: z.string().min(32),
	JWT_ACCESS_EXPIRES: z.string().default("15m"),
	JWT_REFRESH_EXPIRES: z.string().default("7d"),
	REDIS_URL: z.string().url().optional().default("redis://localhost:6379"),
	CLOUDINARY_CLOUD_NAME: z.string().optional(),
	CLOUDINARY_API_KEY: z.string().optional(),
	CLOUDINARY_API_SECRET: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(): EnvConfig {
	try {
		return envSchema.parse(process.env);
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error("❌ Invalid environment variables:");
			error.issues.forEach((issue) => {
				console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
			});
			process.exit(1);
		}
		throw error;
	}
}

export const env = validateEnv();
