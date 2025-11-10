import { describe, expect, it, beforeAll, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import { TestHelpers } from "../helpers/test-helpers";

describe("Integration Tests - Project Routes", () => {
  let authHeader: string;
  let testUserId: string;

  beforeAll(async () => {
    // Create test user once for all tests with unique email
    const uniqueEmail = `project-test-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}@example.com`;

    const { user, authHeader: header } =
      await TestHelpers.createTestUserWithToken({
        email: uniqueEmail,
        name: "Project Test User",
      });

    authHeader = header;
    testUserId = user.id;
  });

  afterAll(async () => {
    // Clean up test user after all tests
    if (testUserId) {
      await TestHelpers.cleanupUser(testUserId);
    }
  });

  beforeEach(async () => {
    // Clean up projects before each test
    const projectsResponse = await request(app)
      .get("/projects")
      .set("Authorization", authHeader);

    if (projectsResponse.body && Array.isArray(projectsResponse.body)) {
      for (const project of projectsResponse.body) {
        await request(app)
          .delete(`/projects/${project.id}`)
          .set("Authorization", authHeader);
      }
    }
  });

  describe("POST /projects", () => {
    it("should create a new project", async () => {
      const projectData = {
        title: "Integration Test Project",
        description: "A project created through integration test",
      };

      const response = await request(app)
        .post("/projects")
        .set("Authorization", authHeader)
        .send(projectData)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.title).toBe(projectData.title);
      expect(response.body.description).toBe(projectData.description);
      expect(response.body.ownerId).toBe(testUserId);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
    });

    it("should create project without description", async () => {
      const projectData = {
        title: "Project Without Description",
      };

      const response = await request(app)
        .post("/projects")
        .set("Authorization", authHeader)
        .send(projectData)
        .expect(201);

      expect(response.body.title).toBe(projectData.title);
      expect(response.body.description).toBeNull();
      expect(response.body.ownerId).toBe(testUserId);
    });

    it("should return 401 without authentication", async () => {
      const projectData = {
        title: "Unauthorized Project",
        description: "This should fail",
      };

      await request(app).post("/projects").send(projectData).expect(401);
    });

    it("should return 400 for invalid data", async () => {
      const invalidData = {
        description: "Project without title",
      };

      await request(app)
        .post("/projects")
        .set("Authorization", authHeader)
        .send(invalidData)
        .expect(400);
    });
  });

  describe("GET /projects", () => {
    it("should return empty array when no projects exist", async () => {
      const response = await request(app)
        .get("/projects")
        .set("Authorization", authHeader)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it("should return user's projects", async () => {
      // Create test projects
      await request(app)
        .post("/projects")
        .set("Authorization", authHeader)
        .send({
          title: "First Project",
          description: "First description",
        });

      await request(app)
        .post("/projects")
        .set("Authorization", authHeader)
        .send({
          title: "Second Project",
        });

      const response = await request(app)
        .get("/projects")
        .set("Authorization", authHeader)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);

      const projectTitles = response.body.map((p: any) => p.title);
      expect(projectTitles).toContain("First Project");
      expect(projectTitles).toContain("Second Project");
    });

    it("should return 401 without authentication", async () => {
      await request(app).get("/projects").expect(401);
    });
  });

  describe("GET /projects/:id", () => {
    it("should get project by id", async () => {
      // Create project
      const createResponse = await request(app)
        .post("/projects")
        .set("Authorization", authHeader)
        .send({
          title: "Get By ID Project",
          description: "Project for get by ID test",
        });

      const projectId = createResponse.body.id;

      // Get by ID
      const response = await request(app)
        .get(`/projects/${projectId}`)
        .set("Authorization", authHeader)
        .expect(200);

      expect(response.body.id).toBe(projectId);
      expect(response.body.title).toBe("Get By ID Project");
    });

    it("should return 404 for non-existent project", async () => {
      await request(app)
        .get("/projects/non-existent-id")
        .set("Authorization", authHeader)
        .expect(404);
    });
  });

  describe("PUT /projects/:id", () => {
    it("should update project", async () => {
      // Create project
      const createResponse = await request(app)
        .post("/projects")
        .set("Authorization", authHeader)
        .send({
          title: "Original Title",
          description: "Original description",
        });

      const projectId = createResponse.body.id;

      // Update project
      const updateData = {
        title: "Updated Title",
        description: "Updated description",
      };

      const response = await request(app)
        .put(`/projects/${projectId}`)
        .set("Authorization", authHeader)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.description).toBe(updateData.description);
    });
  });

  describe("DELETE /projects/:id", () => {
    it("should delete project", async () => {
      // Create project
      const createResponse = await request(app)
        .post("/projects")
        .set("Authorization", authHeader)
        .send({
          title: "Project to Delete",
          description: "This will be deleted",
        });

      const projectId = createResponse.body.id;

      // Delete project
      await request(app)
        .delete(`/projects/${projectId}`)
        .set("Authorization", authHeader)
        .expect(204);

      // Verify it's gone
      await request(app)
        .get(`/projects/${projectId}`)
        .set("Authorization", authHeader)
        .expect(404);
    });
  });
});
