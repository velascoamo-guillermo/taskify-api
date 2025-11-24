import type { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export function requestLogger(req: Request, _: Response, next: NextFunction) {
	logger.info(`${req.method} ${req.originalUrl}`);
	next();
}
