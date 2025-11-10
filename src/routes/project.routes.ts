import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";

export const projectRouter = Router();
const projectController = new ProjectController();

projectRouter.post(
  "/",
  projectController.createProject.bind(projectController)
);

projectRouter.delete(
  "/:id",
  projectController.deleteProject.bind(projectController)
);

projectRouter.get(
  "/",
  projectController.getProjectsByOwner.bind(projectController)
);

projectRouter.get(
  "/:id",
  projectController.getProjectById.bind(projectController)
);

projectRouter.put(
  "/:id",
  projectController.updateProject.bind(projectController)
);
