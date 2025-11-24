import { Router } from "express";
import { authRouter } from "./auth.routes";
import { fileRouter } from "./file.routes";
import { projectRouter } from "./project.routes";

export const router = Router();

router.use("/auth", authRouter);
router.use("/projects", projectRouter);
router.use("/", fileRouter);
