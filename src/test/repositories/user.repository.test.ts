import { describe, it, expect, beforeEach } from "vitest";
import { UserRepository } from "../../repositories/user.repository.ts";

describe("UserRepository", () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const userData = {
        email: `test-${Date.now()}@example.com`,
        password: "hashedpassword123",
        name: "Test User",
      };

      const user = await userRepository.create(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
    });

    it("should create user without name", async () => {
      const userData = {
        email: `test2-${Date.now()}@example.com`,
        password: "hashedpassword123",
      };

      const user = await userRepository.create(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.name).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("should find user by email", async () => {
      const userData = {
        email: `find-${Date.now()}@example.com`,
        password: "hashedpassword123",
        name: "Find User",
      };

      await userRepository.create(userData);
      const foundUser = await userRepository.findByEmail(userData.email);

      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe(userData.email);
      expect(foundUser?.name).toBe(userData.name);
    });

    it("should return null for non-existent email", async () => {
      const foundUser = await userRepository.findByEmail(
        "nonexistent@example.com"
      );
      expect(foundUser).toBeNull();
    });
  });

  describe("findById", () => {
    it("should find user by id", async () => {
      const userData = {
        email: `findbyid-${Date.now()}@example.com`,
        password: "hashedpassword123",
        name: "Find By ID User",
      };

      const createdUser = await userRepository.create(userData);
      const foundUser = await userRepository.findById(createdUser.id);

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
      expect(foundUser?.email).toBe(userData.email);
    });

    it("should return null for non-existent id", async () => {
      const foundUser = await userRepository.findById("non-existent-id");
      expect(foundUser).toBeNull();
    });
  });

  describe("updateRefreshToken", () => {
    it("should update refresh token", async () => {
      const userData = {
        email: `refresh-${Date.now()}@example.com`,
        password: "hashedpassword123",
        name: "Refresh User",
      };

      const user = await userRepository.create(userData);
      const refreshToken = "new-refresh-token-123";

      const updatedUser = await userRepository.updateRefreshToken(
        user.id,
        refreshToken
      );

      expect(updatedUser.refreshToken).toBe(refreshToken);
      expect(updatedUser.id).toBe(user.id);
    });
  });
});
