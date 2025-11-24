import type { Request, Response } from "express";
import { FileService } from "../services/file.service.js";
import logger from "../utils/logger.js";

export class FileController {
  private fileService: FileService;

  constructor() {
    this.fileService = new FileService();
  }

  async uploadFiles(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const userId = req.user?.id;
      const files = req.files as Express.Multer.File[];

      if (!projectId) {
        res.status(400).json({
          error: "Project ID is required",
          message: "Please provide a valid project ID",
        });
        return;
      }

      if (!files || files.length === 0) {
        res.status(400).json({
          error: "No files provided",
          message: "Please select at least one file to upload",
        });
        return;
      }

      if (!userId) {
        res.status(401).json({
          error: "Unauthorized",
          message: "User not authenticated",
        });
        return;
      }

      const results = await this.fileService.uploadFiles(
        files,
        projectId,
        userId
      );

      res.status(201).json({
        success: true,
        message: `${results.length} file(s) uploaded successfully`,
        data: results,
      });
    } catch (error: any) {
      logger.error("Upload files error:", error);

      if (
        error.message.includes("not found") ||
        error.message.includes("Access denied")
      ) {
        res.status(error.message.includes("not found") ? 404 : 403).json({
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        error: "Internal server error",
        message: "Failed to upload files",
      });
    }
  }

  async getProjectFiles(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const userId = req.user?.id;

      if (!projectId) {
        res.status(400).json({
          error: "Project ID is required",
          message: "Please provide a valid project ID",
        });
        return;
      }

      if (!userId) {
        res.status(401).json({
          error: "Unauthorized",
          message: "User not authenticated",
        });
        return;
      }

      const result = await this.fileService.getProjectFiles(projectId, userId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error("Get project files error:", error);

      if (
        error.message.includes("not found") ||
        error.message.includes("Access denied")
      ) {
        res.status(error.message.includes("not found") ? 404 : 403).json({
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        error: "Internal server error",
        message: "Failed to retrieve files",
      });
    }
  }

  async getFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const userId = req.user?.id;

      if (!fileId) {
        res.status(400).json({
          error: "File ID is required",
          message: "Please provide a valid file ID",
        });
        return;
      }

      if (!userId) {
        res.status(401).json({
          error: "Unauthorized",
          message: "User not authenticated",
        });
        return;
      }

      const file = await this.fileService.getFileById(fileId, userId);

      res.json({
        success: true,
        data: file,
      });
    } catch (error: any) {
      logger.error("Get file error:", error);

      if (
        error.message.includes("not found") ||
        error.message.includes("Access denied")
      ) {
        res.status(error.message.includes("not found") ? 404 : 403).json({
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        error: "Internal server error",
        message: "Failed to retrieve file",
      });
    }
  }

  async deleteFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const userId = req.user?.id;

      if (!fileId) {
        res.status(400).json({
          error: "File ID is required",
          message: "Please provide a valid file ID",
        });
        return;
      }

      if (!userId) {
        res.status(401).json({
          error: "Unauthorized",
          message: "User not authenticated",
        });
        return;
      }

      await this.fileService.deleteFile(fileId, userId);

      res.json({
        success: true,
        message: "File deleted successfully",
      });
    } catch (error: any) {
      logger.error("Delete file error:", error);

      if (
        error.message.includes("not found") ||
        error.message.includes("Access denied")
      ) {
        res.status(error.message.includes("not found") ? 404 : 403).json({
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        error: "Internal server error",
        message: "Failed to delete file",
      });
    }
  }

  async getUserFileStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          error: "Unauthorized",
          message: "User not authenticated",
        });
        return;
      }

      const stats = await this.fileService.getUserFileStats(userId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      logger.error("Get user file stats error:", error);

      res.status(500).json({
        error: "Internal server error",
        message: "Failed to retrieve file statistics",
      });
    }
  }
}
