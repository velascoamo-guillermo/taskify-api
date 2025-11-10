import { prisma } from "../../prisma/db.ts";
import type { User } from "../../generated/prisma/client.ts";

interface CreateUserDTO {
  email: string;
  password: string;
  name?: string;
}

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUserDTO): Promise<User> {
    return prisma.user.create({ data });
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    return prisma.user.update({ where: { id }, data: { refreshToken } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }
}
