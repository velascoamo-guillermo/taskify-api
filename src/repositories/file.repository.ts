import type { File, PrismaClient } from "../../generated/prisma/client.js";

export interface CreateFileData {
	originalName: string;
	filename: string;
	mimeType: string;
	size: number;
	url: string;
	publicId: string;
	projectId: string;
	uploadedBy: string;
}

export interface FileWithProject extends File {
	project: {
		id: string;
		title: string;
		ownerId: string;
	};
	uploader: {
		id: string;
		name: string | null;
		email: string;
	};
}

export class FileRepository {
	constructor(private prisma: PrismaClient) {}

	async create(data: CreateFileData): Promise<File> {
		return this.prisma.file.create({
			data,
		});
	}

	async findByProject(projectId: string): Promise<FileWithProject[]> {
		return this.prisma.file.findMany({
			where: { projectId },
			include: {
				project: {
					select: {
						id: true,
						title: true,
						ownerId: true,
					},
				},
				uploader: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
			orderBy: { createdAt: "desc" },
		});
	}

	async findById(id: string): Promise<FileWithProject | null> {
		return this.prisma.file.findUnique({
			where: { id },
			include: {
				project: {
					select: {
						id: true,
						title: true,
						ownerId: true,
					},
				},
				uploader: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});
	}

	async delete(id: string): Promise<File> {
		return this.prisma.file.delete({
			where: { id },
		});
	}

	async findByPublicId(publicId: string): Promise<File | null> {
		return this.prisma.file.findFirst({
			where: { publicId },
		});
	}

	async updateSize(id: string, size: number): Promise<File> {
		return this.prisma.file.update({
			where: { id },
			data: { size },
		});
	}

	async getProjectFileStats(projectId: string): Promise<{
		totalFiles: number;
		totalSize: number;
	}> {
		const stats = await this.prisma.file.aggregate({
			where: { projectId },
			_count: true,
			_sum: {
				size: true,
			},
		});

		return {
			totalFiles: stats._count,
			totalSize: stats._sum.size || 0,
		};
	}

	async getUserFileStats(userId: string): Promise<{
		totalFiles: number;
		totalSize: number;
	}> {
		const stats = await this.prisma.file.aggregate({
			where: { uploadedBy: userId },
			_count: true,
			_sum: {
				size: true,
			},
		});

		return {
			totalFiles: stats._count,
			totalSize: stats._sum.size || 0,
		};
	}
}
