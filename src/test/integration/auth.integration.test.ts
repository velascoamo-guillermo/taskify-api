import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app.ts";

describe("Integration Tests - Auth Routes", () => {
  describe("GET /health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body).toEqual({
        status: "ok",
        message: "Taskify API running",
      });
    });
  });

  describe("POST /auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: `integration-${Date.now()}@example.com`,
        password: "password123",
        name: "Integration User",
      };

      const response = await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.email).toBe(userData.email);
      expect(response.body.name).toBe(userData.name);
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).not.toHaveProperty("password");
    });

    it("should return 400 for invalid email", async () => {
      const userData = {
        email: "invalid-email",
        password: "password123",
        name: "Test User",
      };

      const response = await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Validation failed");
    });

    it("should return 400 for short password", async () => {
      const userData = {
        email: `test-${Date.now()}@example.com`,
        password: "123",
        name: "Test User",
      };

      const response = await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Validation failed");
    });

    it("should return 500 for duplicate email", async () => {
      const userData = {
        email: `duplicate-${Date.now()}@example.com`,
        password: "password123",
        name: "Duplicate User",
      };

      // Register first user
      await request(app).post("/auth/register").send(userData).expect(201);

      // Try to register again with same email
      const response = await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(500);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /auth/login", () => {
    it("should login user successfully", async () => {
      const userData = {
        email: `login-${Date.now()}@example.com`,
        password: "password123",
        name: "Login User",
      };

      // Register user first
      await request(app).post("/auth/register").send(userData).expect(201);

      // Login
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");
      expect(typeof response.body.accessToken).toBe("string");
      expect(typeof response.body.refreshToken).toBe("string");
    });

    it("should return 500 for invalid credentials", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        })
        .expect(500);

      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 for invalid input", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "invalid-email",
          password: "123",
        })
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Validation failed");
    });
  });
});
