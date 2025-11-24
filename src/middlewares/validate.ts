import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppError } from "./errorHandler.ts";

export const validate = (schema: z.ZodSchema) => {
	return (req: Request, _res: Response, next: NextFunction) => {
		try {
			schema.parse(req.body);
			next();
		} catch (error) {
			if (error instanceof z.ZodError) {
				next(new AppError("Validation failed", 400, error.issues));
			} else {
				next(error);
			}
		}
	};
};

export const validateParams = (schema: z.ZodSchema) => {
	return (req: Request, _res: Response, next: NextFunction) => {
		try {
			schema.parse(req.params);
			next();
		} catch (error) {
			if (error instanceof z.ZodError) {
				next(new AppError("Invalid parameters", 400, error.issues));
			} else {
				next(error);
			}
		}
	};
};

export const validateQuery = (schema: z.ZodSchema) => {
	return (req: Request, _res: Response, next: NextFunction) => {
		try {
			schema.parse(req.query);
			next();
		} catch (error) {
			if (error instanceof z.ZodError) {
				next(new AppError("Invalid query parameters", 400, error.issues));
			} else {
				next(error);
			}
		}
	};
};
