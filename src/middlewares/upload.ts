import multer from "multer";
import type { Request } from "express";

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Define allowed file types
  const allowedMimeTypes = [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",

    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",

    // Archives
    "application/zip",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
};

// Create multer upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5, // Maximum 5 files per request
  },
});

// File validation utilities
export const validateFileSize = (
  file: Express.Multer.File,
  maxSizeInMB: number
): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

export const generateFileName = (
  originalName: string,
  prefix?: string
): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(originalName);
  const baseName = originalName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9]/g, "_");

  return prefix
    ? `${prefix}_${baseName}_${timestamp}_${random}.${extension}`
    : `${baseName}_${timestamp}_${random}.${extension}`;
};

export const isImageFile = (file: Express.Multer.File): boolean => {
  return file.mimetype.startsWith("image/");
};

export const isDocumentFile = (file: Express.Multer.File): boolean => {
  const documentMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
  ];

  return documentMimeTypes.includes(file.mimetype);
};
