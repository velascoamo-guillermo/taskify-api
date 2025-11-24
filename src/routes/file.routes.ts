import { Router } from "express";
import { FileController } from "../controllers/file.controller.js";
import { upload } from "../middlewares/upload.js";
import { ensureAuth } from "../middlewares/ensureAuth.js";
import { invalidateCache } from "../middlewares/cache.js";

export const fileRouter = Router();
const fileController = new FileController();

fileRouter.use(ensureAuth);

/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: File ID
 *         originalName:
 *           type: string
 *           description: Original filename
 *         filename:
 *           type: string
 *           description: Stored filename
 *         mimeType:
 *           type: string
 *           description: File MIME type
 *         size:
 *           type: integer
 *           description: File size in bytes
 *         url:
 *           type: string
 *           description: File URL
 *         optimizedUrl:
 *           type: string
 *           description: Optimized URL for images
 *         projectId:
 *           type: string
 *           description: Associated project ID
 *         uploadedBy:
 *           type: string
 *           description: Uploader user ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         project:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             title:
 *               type: string
 *             ownerId:
 *               type: string
 *         uploader:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *     FileStats:
 *       type: object
 *       properties:
 *         totalFiles:
 *           type: integer
 *           description: Total number of files
 *         totalSize:
 *           type: integer
 *           description: Total size in bytes
 */

/**
 * @swagger
 * /projects/{id}/files:
 *   post:
 *     summary: Upload files to a project
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Files to upload (max 5 files, 10MB each)
 *     responses:
 *       201:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       file:
 *                         $ref: '#/components/schemas/File'
 *                       url:
 *                         type: string
 *                       optimizedUrl:
 *                         type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
fileRouter.post(
  "/projects/:projectId/files",
  invalidateCache("api:*projects*"), // Invalidate project cache
  upload.array("files", 5), // Max 5 files
  fileController.uploadFiles.bind(fileController)
);

/**
 * @swagger
 * /projects/{id}/files:
 *   get:
 *     summary: Get all files for a project
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Files retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     files:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/File'
 *                     stats:
 *                       $ref: '#/components/schemas/FileStats'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
fileRouter.get(
  "/projects/:projectId/files",
  fileController.getProjectFiles.bind(fileController)
);

/**
 * @swagger
 * /files/{id}:
 *   get:
 *     summary: Get a specific file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     responses:
 *       200:
 *         description: File retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/File'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */
fileRouter.get("/files/:fileId", fileController.getFile.bind(fileController));

/**
 * @swagger
 * /files/{id}:
 *   delete:
 *     summary: Delete a file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */
fileRouter.delete(
  "/files/:fileId",
  invalidateCache("api:*projects*"), // Invalidate project cache
  fileController.deleteFile.bind(fileController)
);

/**
 * @swagger
 * /files/stats:
 *   get:
 *     summary: Get user file statistics
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: File statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/FileStats'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
fileRouter.get(
  "/files/stats",
  fileController.getUserFileStats.bind(fileController)
);
