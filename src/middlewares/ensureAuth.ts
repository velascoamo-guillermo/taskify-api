import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

export function ensureAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!token) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}
