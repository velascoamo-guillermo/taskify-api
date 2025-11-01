import { prisma } from "../../prisma/db.js";
import type { User } from "../../generated/prisma/client";

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
}
