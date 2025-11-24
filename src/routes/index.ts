import { Router } from "express";
import { authRouter } from "./auth.routes";
import { projectRouter } from "./project.routes";
import { fileRouter } from "./file.routes";

export const router = Router();

router.use("/auth", authRouter);
router.use("/projects", projectRouter);
router.use("/", fileRouter);
