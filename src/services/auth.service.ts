import { UserRepository } from "../repositories/auth.repository";
import { comparePassword, hashPassword } from "../utils/hash";

const userRepo = new UserRepository();

interface RegisterDTO {
  email: string;
  password: string;
  name?: string;
}

export class AuthService {
  async register({ password, email, name }: RegisterDTO) {
    const exists = await userRepo.findByEmail(email);
    if (exists) {
      throw new Error("User already exists");
    }

    const passwordHashed = await hashPassword(password);
    const user = await userRepo.create({
      email,
      password: passwordHashed,
      name: name,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  async login({
    email,
    password,
  }: {
    email: RegisterDTO["email"];
    password: RegisterDTO["password"];
  }) {
    const user = await userRepo.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isSame = await comparePassword(password, user.password);

    if (!isSame) {
      throw new Error("Invalid credentials");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }
}
