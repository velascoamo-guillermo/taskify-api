import { ProjectRepository } from "../repositories/project.repository";
import type { ProjectInput } from "../schemas/project.schema";

const projectRepository = new ProjectRepository();

export class ProjectService {
  async createProject(data: ProjectInput & { ownerId: string }) {
    return projectRepository.create(data);
  }

  async getProjectById(id: string) {
    return projectRepository.findById(id);
  }

  async updateProject(id: string, title: string, description?: string) {
    return projectRepository.update(id, title, description);
  }

  async deleteProject(id: string) {
    return projectRepository.delete(id);
  }

  async getProjectsByOwnerId(ownerId: string) {
    return projectRepository.findByOwnerId(ownerId);
  }
}
