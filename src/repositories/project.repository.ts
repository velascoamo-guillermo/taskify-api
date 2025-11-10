import { prisma } from "../../prisma/db";

interface CreateProjectDTO {
  title: string;
  ownerId: string;
  description?: string;
}

export class ProjectRepository {
  async findById(id: string) {
    return prisma.project.findUnique({ where: { id } });
  }

  async create(data: CreateProjectDTO) {
    return prisma.project.create({
      data: {
        title: data.title,
        ownerId: data.ownerId,
        description: data.description,
      },
    });
  }

  async delete(id: string) {
    return prisma.project.delete({ where: { id } });
  }

  async findByOwnerId(ownerId: string) {
    return prisma.project.findMany({ where: { ownerId } });
  }

  async update(id: string, title: string, description?: string) {
    return prisma.project.update({
      where: { id },
      data: { title, description },
    });
  }
}
