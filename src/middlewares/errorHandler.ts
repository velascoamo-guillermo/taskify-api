import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _: Request,
  res: Response,
  __: NextFunction
) {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: err.message || "Internal server error" });
}
