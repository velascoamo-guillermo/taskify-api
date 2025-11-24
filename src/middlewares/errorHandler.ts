import type { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.ts";

export class AppError extends Error {
	public readonly statusCode: number;
	public readonly isOperational: boolean;
	public readonly details?: unknown;

	constructor(
		message: string,
		statusCode: number = 500,
		details?: unknown,
		isOperational: boolean = true,
	) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		this.details = details;

		Error.captureStackTrace(this, this.constructor);
	}
}

export function errorHandler(
	err: Error | AppError,
	_: Request,
	res: Response,
	__: NextFunction,
) {
	let error = err as AppError;

	// If it's not our AppError, wrap it
	if (!(err instanceof AppError)) {
		error = new AppError(
			err.message || "Internal server error",
			500,
			undefined,
			false,
		);
	}

	// Log error
	if (error.statusCode >= 500) {
		logger.error("Server Error:", {
			message: error.message,
			stack: error.stack,
			details: error.details,
		});
	} else {
		logger.warn("Client Error:", {
			message: error.message,
			details: error.details,
		});
	}

	// Send response
	const response: {
		error: string;
		details?: unknown;
		stack?: string;
	} = {
		error: error.message,
	};

	if (error.details) {
		response.details = error.details;
	}

	if (process.env.NODE_ENV === "development") {
		response.stack = error.stack;
	}

	res.status(error.statusCode).json(response);
}
