import type { File } from "../../generated/prisma/client.js";
import { prisma } from "../../prisma/db.js";
import { cloudinaryService } from "../config/cloudinary.js";
import { generateFileName, isImageFile } from "../middlewares/upload.js";
import type { CreateFileData } from "../repositories/file.repository.js";
import { FileRepository } from "../repositories/file.repository.js";
import { ProjectRepository } from "../repositories/project.repository.js";
import logger from "../utils/logger.js";

export interface UploadFileResult {
	file: File;
	url: string;
	optimizedUrl?: string;
}

export class FileService {
	private fileRepository: FileRepository;
	private projectRepository: ProjectRepository;

	constructor() {
		this.fileRepository = new FileRepository(prisma);
		this.projectRepository = new ProjectRepository();
	}

	async uploadFiles(
		files: Express.Multer.File[],
		projectId: string,
		userId: string,
	): Promise<UploadFileResult[]> {
		// Verify project exists and user has access
		const project = await this.projectRepository.findById(projectId);
		if (!project) {
			throw new Error("Project not found");
		}

		if (project.ownerId !== userId) {
			throw new Error("Access denied: You are not the owner of this project");
		}

		const uploadPromises = files.map((file) =>
			this.uploadSingleFile(file, projectId, userId),
		);
		return Promise.all(uploadPromises);
	}

	private async uploadSingleFile(
		file: Express.Multer.File,
		projectId: string,
		userId: string,
	): Promise<UploadFileResult> {
		try {
			// Generate unique filename
			const filename = generateFileName(file.originalname, projectId);

			// Upload to Cloudinary
			const uploadResult = await cloudinaryService.uploadFile(file.buffer, {
				folder: `taskify/projects/${projectId}`,
				public_id: filename,
				resource_type: "auto",
			});

			// Save to database
			const fileData: CreateFileData = {
				originalName: file.originalname,
				filename: uploadResult.public_id,
				mimeType: file.mimetype,
				size: file.size,
				url: uploadResult.secure_url,
				publicId: uploadResult.public_id,
				projectId,
				uploadedBy: userId,
			};

			const savedFile = await this.fileRepository.create(fileData);

			let optimizedUrl: string | undefined;
			if (isImageFile(file)) {
				optimizedUrl = cloudinaryService.getOptimizedUrl(
					uploadResult.public_id,
					{
						width: 800,
						height: 600,
						quality: "auto",
						crop: "fill",
					},
				);
			}

			logger.info(
				`File uploaded successfully: ${file.originalname} -> ${uploadResult.public_id}`,
			);

			return {
				file: savedFile,
				url: uploadResult.secure_url,
				optimizedUrl,
			};
		} catch (error) {
			logger.error(`Failed to upload file ${file.originalname}:`, error);
			throw new Error(`Failed to upload file: ${file.originalname}`);
		}
	}

	async getProjectFiles(projectId: string, userId: string) {
		// Verify project exists and user has access
		const project = await this.projectRepository.findById(projectId);
		if (!project) {
			throw new Error("Project not found");
		}

		if (project.ownerId !== userId) {
			throw new Error("Access denied: You are not the owner of this project");
		}

		const files = await this.fileRepository.findByProject(projectId);
		const stats = await this.fileRepository.getProjectFileStats(projectId);

		return {
			files: files.map((file) => ({
				...file,
				optimizedUrl: isImageFile({
					mimetype: file.mimeType,
				} as Express.Multer.File)
					? cloudinaryService.getOptimizedUrl(file.publicId, {
							width: 300,
							height: 200,
							quality: "auto",
							crop: "fill",
						})
					: undefined,
			})),
			stats,
		};
	}

	async deleteFile(fileId: string, userId: string): Promise<void> {
		const file = await this.fileRepository.findById(fileId);
		if (!file) {
			throw new Error("File not found");
		}

		if (file.project.ownerId !== userId) {
			throw new Error("Access denied: You are not the owner of this project");
		}

		try {
			// Delete from Cloudinary
			await cloudinaryService.deleteFile(file.publicId);
			logger.info(`File deleted from Cloudinary: ${file.publicId}`);
		} catch (error) {
			logger.warn(
				`Failed to delete file from Cloudinary: ${file.publicId}`,
				error,
			);
			// Continue with database deletion even if Cloudinary fails
		}

		// Delete from database
		await this.fileRepository.delete(fileId);
		logger.info(`File deleted from database: ${fileId}`);
	}

	async getFileById(fileId: string, userId: string) {
		const file = await this.fileRepository.findById(fileId);
		if (!file) {
			throw new Error("File not found");
		}

		if (file.project.ownerId !== userId) {
			throw new Error("Access denied: You are not the owner of this project");
		}

		return {
			...file,
			optimizedUrl: isImageFile({
				mimetype: file.mimeType,
			} as Express.Multer.File)
				? cloudinaryService.getOptimizedUrl(file.publicId, {
						width: 800,
						height: 600,
						quality: "auto",
						crop: "fill",
					})
				: undefined,
		};
	}

	async getUserFileStats(userId: string) {
		return this.fileRepository.getUserFileStats(userId);
	}
}
