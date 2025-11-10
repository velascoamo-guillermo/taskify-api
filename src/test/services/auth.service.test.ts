import { describe, it, expect, beforeEach } from "vitest";
import { AuthService } from "../../services/auth.service";
import { UserRepository } from "../../repositories/user.repository";

describe("AuthService", () => {
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    authService = new AuthService();
    userRepository = new UserRepository();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: `test-register-${Date.now()}@example.com`,
        password: "password123",
        name: "Test User",
      };

      const result = await authService.register(userData);

      expect(result).toBeDefined();
      expect(result.email).toBe(userData.email);
      expect(result.name).toBe(userData.name);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result).not.toHaveProperty("password");
    });

    it("should register user without name", async () => {
      const userData = {
        email: `test-register-no-name-${Date.now()}@example.com`,
        password: "password123",
      };

      const result = await authService.register(userData);

      expect(result).toBeDefined();
      expect(result.email).toBe(userData.email);
      expect(result.name).toBeNull();
      expect(result.id).toBeDefined();
    });

    it("should throw error when email already exists", async () => {
      const email = `duplicate-${Date.now()}@example.com`;
      const userData = {
        email,
        password: "password123",
        name: "First User",
      };

      await authService.register(userData);

      const duplicateUserData = {
        email,
        password: "differentpassword123",
        name: "Second User",
      };

      await expect(authService.register(duplicateUserData)).rejects.toThrow(
        "User already exists"
      );
    });

    it("should hash password before storing", async () => {
      const userData = {
        email: `test-hash-${Date.now()}@example.com`,
        password: "plainTextPassword",
        name: "Hash Test User",
      };

      const result = await authService.register(userData);

      expect(result).toBeDefined();

      const storedUser = await userRepository.findByEmail(userData.email);
      expect(storedUser).toBeDefined();
      expect(storedUser!.password).not.toBe(userData.password);
      expect(storedUser!.password.length).toBeGreaterThan(20);
    });
  });

  describe("login", () => {
    it("should login successfully with correct credentials", async () => {
      const userData = {
        email: `test-login-${Date.now()}@example.com`,
        password: "correctpassword123",
        name: "Login Test User",
      };

      const registeredUser = await authService.register(userData);

      const loginData = {
        email: userData.email,
        password: userData.password,
      };

      const result = await authService.login(loginData);

      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(typeof result.accessToken).toBe("string");
      expect(typeof result.refreshToken).toBe("string");
    });

    it("should throw error for non-existent email", async () => {
      const loginData = {
        email: `nonexistent-${Date.now()}@example.com`,
        password: "anypassword",
      };

      await expect(authService.login(loginData)).rejects.toThrow(
        "Invalid credentials"
      );
    });

    it("should throw error for incorrect password", async () => {
      const userData = {
        email: `test-wrong-password-${Date.now()}@example.com`,
        password: "correctpassword123",
        name: "Wrong Password Test",
      };

      await authService.register(userData);

      const loginData = {
        email: userData.email,
        password: "wrongpassword123",
      };

      await expect(authService.login(loginData)).rejects.toThrow(
        "Invalid credentials"
      );
    });

    it("should generate valid tokens", async () => {
      const userData = {
        email: `test-tokens-${Date.now()}@example.com`,
        password: "password123",
        name: "Token Test User",
      };

      await authService.register(userData);

      const loginData = {
        email: userData.email,
        password: userData.password,
      };

      const result = await authService.login(loginData);

      expect(typeof result.accessToken).toBe("string");
      expect(typeof result.refreshToken).toBe("string");
      expect(result.accessToken.length).toBeGreaterThan(50);
      expect(result.refreshToken.length).toBeGreaterThan(50);

      expect(result.accessToken).not.toBe(result.refreshToken);
    });
  });

  describe("refresh", () => {
    it("should refresh tokens successfully", async () => {
      const userData = {
        email: `test-refresh-${Date.now()}@example.com`,
        password: "password123",
        name: "Refresh Test User",
      };

      await authService.register(userData);
      const loginResult = await authService.login({
        email: userData.email,
        password: userData.password,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const refreshResult = await authService.refresh({
        token: loginResult.refreshToken,
      });

      expect(refreshResult).toBeDefined();
      expect(refreshResult.accessToken).toBeDefined();
      expect(refreshResult.refreshToken).toBeDefined();

      expect(refreshResult.accessToken).not.toBe(loginResult.accessToken);
      expect(refreshResult.refreshToken).not.toBe(loginResult.refreshToken);
    });

    it("should throw error for invalid refresh token", async () => {
      const invalidRefreshData = {
        token: "invalid.refresh.token",
      };

      await expect(authService.refresh(invalidRefreshData)).rejects.toThrow();
    });

    it("should throw error for mismatched refresh token", async () => {
      const userData = {
        email: `test-mismatch-${Date.now()}@example.com`,
        password: "password123",
        name: "Mismatch Test User",
      };

      await authService.register(userData);
      const loginResult = await authService.login({
        email: userData.email,
        password: userData.password,
      });

      await authService.refresh({
        token: loginResult.refreshToken,
      });

      await expect(
        authService.refresh({
          token: loginResult.refreshToken,
        })
      ).rejects.toThrow("Invalid refresh token");
    });
  });
});
