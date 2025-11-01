import { UserRepository } from "../repositories/user.repository";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema";
import { comparePassword, hashPassword } from "../utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

const userRepo = new UserRepository();

export class AuthService {
  async register({ password, email, name }: RegisterInput) {
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

  async login({ email, password }: LoginInput) {
    const user = await userRepo.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isSame = await comparePassword(password, user.password);

    if (!isSame) {
      throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    await userRepo.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh({ token }: { token: string }) {
    const decode = verifyRefreshToken(token);
    const user = await userRepo.findById(decode.id);

    if (!user || user.refreshToken !== token) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
    });
    const newRefreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    await userRepo.updateRefreshToken(user.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
