import type { NextFunction, Request, Response } from "express";
import { ProjectService } from "../services/project.service";
import { projectSchema } from "../schemas/project.schema";

const projectService = new ProjectService();

export class ProjectController {
  async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description } = req.body;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      // Validate input using schema
      const validationResult = projectSchema.safeParse({ title, description });

      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation failed",
          details: validationResult.error.issues,
        });
      }

      const project = await projectService.createProject({
        title: validationResult.data.title,
        description: validationResult.data.description,
        ownerId: user.id,
      });

      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Project ID is required" });
      }

      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      await projectService.deleteProject(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getProjectsByOwner(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const projects = await projectService.getProjectsByOwnerId(user.id);

      res.status(200).json(projects);
    } catch (error) {
      next(error);
    }
  }

  async getProjectById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = req.user;

      if (!id) {
        return res.status(400).json({ error: "Project ID is required" });
      }

      if (!user) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const project = await projectService.getProjectById(id);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  }

  async updateProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      const user = req.user;

      if (!id) {
        return res.status(400).json({ error: "Project ID is required" });
      }

      if (!user) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const project = await projectService.updateProject(
        id,
        title,
        description
      );

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.status(200).json(project);
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
}
