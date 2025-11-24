import { v2 as cloudinary } from "cloudinary";
import logger from "../utils/logger.js";
import { env } from "./env.js";

class CloudinaryService {
	private isConfigured = false;

	constructor() {
		this.configure();
	}

	private configure() {
		const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
			env;

		if (
			!CLOUDINARY_CLOUD_NAME ||
			!CLOUDINARY_API_KEY ||
			!CLOUDINARY_API_SECRET
		) {
			logger.warn(
				"⚠️  Cloudinary not configured. File uploads will be disabled.",
			);
			return;
		}

		cloudinary.config({
			cloud_name: CLOUDINARY_CLOUD_NAME,
			api_key: CLOUDINARY_API_KEY,
			api_secret: CLOUDINARY_API_SECRET,
		});

		this.isConfigured = true;
		logger.info("✅ Cloudinary configured successfully");
	}

	async uploadFile(
		buffer: Buffer,
		options: {
			folder?: string;
			public_id?: string;
			resource_type?: "auto" | "image" | "video" | "raw";
			format?: string;
		} = {},
	): Promise<{
		public_id: string;
		secure_url: string;
		original_filename?: string;
		bytes: number;
		format: string;
		resource_type: string;
	}> {
		if (!this.isConfigured) {
			throw new Error("Cloudinary not configured");
		}

		return new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					folder: options.folder || "taskify",
					public_id: options.public_id,
					resource_type: options.resource_type || "auto",
					format: options.format,
				},
				(error, result) => {
					if (error) {
						logger.error("Cloudinary upload error:", error);
						reject(error);
					} else if (result) {
						resolve({
							public_id: result.public_id,
							secure_url: result.secure_url,
							original_filename: result.original_filename,
							bytes: result.bytes,
							format: result.format,
							resource_type: result.resource_type,
						});
					} else {
						reject(new Error("Unknown Cloudinary error"));
					}
				},
			);

			uploadStream.end(buffer);
		});
	}

	async deleteFile(publicId: string): Promise<boolean> {
		if (!this.isConfigured) {
			throw new Error("Cloudinary not configured");
		}

		try {
			const result = await cloudinary.uploader.destroy(publicId);
			return result.result === "ok";
		} catch (error) {
			logger.error("Cloudinary delete error:", error);
			throw error;
		}
	}

	isHealthy(): boolean {
		return this.isConfigured;
	}

	getOptimizedUrl(
		publicId: string,
		options: {
			width?: number;
			height?: number;
			crop?: string;
			quality?: string | number;
			format?: string;
		} = {},
	): string {
		if (!this.isConfigured) {
			return publicId; // Return as-is if not configured
		}

		return cloudinary.url(publicId, {
			transformation: [
				{
					width: options.width,
					height: options.height,
					crop: options.crop || "fill",
					quality: options.quality || "auto",
					format: options.format || "auto",
				},
			],
		});
	}
}

export const cloudinaryService = new CloudinaryService();
