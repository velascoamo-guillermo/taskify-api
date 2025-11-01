import type { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      const parsed = registerSchema.parse({ email, password, name });
      const user = await authService.register(parsed);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error && "issues" in (error as any)) {
        return res.status(400).json({
          error: "Validation failed",
          details: (error as any).issues,
        });
      }
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const parsed = loginSchema.parse({ email, password });
      const user = await authService.login(parsed);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error && "issues" in (error as any)) {
        return res.status(400).json({
          error: "Validation failed",
          details: (error as any).issues,
        });
      }
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      const tokens = await authService.refresh({ token });
      res.status(200).json(tokens);
    } catch (err) {
      next(err);
    }
  }
}
