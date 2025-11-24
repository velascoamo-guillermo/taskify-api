import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { ProjectRepository } from "../../repositories/project.repository";
import { UserRepository } from "../../repositories/user.repository.ts";

describe("ProjectRepository", () => {
	let projectRepository: ProjectRepository;
	let userRepository: UserRepository;
	let testUserId: string;

	beforeAll(async () => {
		projectRepository = new ProjectRepository();
		userRepository = new UserRepository();

		const testUser = await userRepository.create({
			email: `test-user-${Date.now()}@example.com`,
			password: "hashedpassword123",
			name: "Test User for Projects",
		});
		testUserId = testUser.id;
	});

	afterAll(async () => {
		console.log("Tests completed for ProjectRepository");
	});

	beforeEach(async () => {
		const projects = await projectRepository.findByOwnerId(testUserId);
		for (const project of projects) {
			await projectRepository.delete(project.id);
		}
	});

	describe("create", () => {
		it("should create a new project", async () => {
			const projectData = {
				title: "Test Project",
				description: "This is a test project description",
				ownerId: testUserId,
			};

			const projectCreated = await projectRepository.create({ ...projectData });

			expect(projectCreated).toBeDefined();
			expect(projectCreated.title).toBe(projectData.title);
			expect(projectCreated.description).toBe(projectData.description);
			expect(projectCreated.ownerId).toBe(projectData.ownerId);
			expect(projectCreated.id).toBeDefined();
			expect(projectCreated.createdAt).toBeDefined();
			expect(projectCreated.updatedAt).toBeDefined();
		});

		it("should create a project without description", async () => {
			const projectData = {
				title: "Test Project No Description",
				ownerId: testUserId,
			};

			const projectCreated = await projectRepository.create({ ...projectData });

			expect(projectCreated).toBeDefined();
			expect(projectCreated.title).toBe(projectData.title);
			expect(projectCreated.description).toBeNull();
			expect(projectCreated.ownerId).toBe(projectData.ownerId);
		});
	});

	describe("findById", () => {
		it("should find project by id", async () => {
			const projectData = {
				title: "Find By ID Test",
				ownerId: testUserId,
				description: "Test finding project by ID",
			};

			const createdProject = await projectRepository.create(projectData);
			const foundProject = await projectRepository.findById(createdProject.id);

			expect(foundProject).toBeDefined();
			expect(foundProject?.id).toBe(createdProject.id);
			expect(foundProject?.title).toBe(projectData.title);
			expect(foundProject?.ownerId).toBe(testUserId);
		});

		it("should return null for non-existent id", async () => {
			const nonExistentId = "cm1invalid-id-123";
			const project = await projectRepository.findById(nonExistentId);

			expect(project).toBeNull();
		});
	});

	describe("findByOwnerId", () => {
		it("should find projects by owner id", async () => {
			await projectRepository.create({
				title: "Project 1",
				ownerId: testUserId,
				description: "First project",
			});

			await projectRepository.create({
				title: "Project 2",
				ownerId: testUserId,
				description: "Second project",
			});

			const projects = await projectRepository.findByOwnerId(testUserId);

			expect(projects).toBeDefined();
			expect(Array.isArray(projects)).toBe(true);
			expect(projects.length).toBeGreaterThanOrEqual(2);
			projects.forEach((project) => {
				expect(project.ownerId).toBe(testUserId);
			});
		});

		it("should return empty array for user with no projects", async () => {
			const anotherUser = await userRepository.create({
				email: `another-user-${Date.now()}@example.com`,
				password: "hashedpassword123",
				name: "User Without Projects",
			});

			const projects = await projectRepository.findByOwnerId(anotherUser.id);

			expect(projects).toBeDefined();
			expect(Array.isArray(projects)).toBe(true);
			expect(projects.length).toBe(0);
		});
	});

	describe("update", () => {
		it("should update project title and description", async () => {
			const projectData = {
				title: "Original Title",
				ownerId: testUserId,
				description: "Original description",
			};

			const createdProject = await projectRepository.create(projectData);

			const updatedTitle = "Updated Title";
			const updatedDescription = "Updated description";

			const updatedProject = await projectRepository.update(
				createdProject.id,
				updatedTitle,
				updatedDescription,
			);

			expect(updatedProject).toBeDefined();
			expect(updatedProject.title).toBe(updatedTitle);
			expect(updatedProject.description).toBe(updatedDescription);
			expect(updatedProject.id).toBe(createdProject.id);
			expect(updatedProject.updatedAt).not.toBe(createdProject.updatedAt);
		});

		it("should update project title only", async () => {
			const projectData = {
				title: "Original Title",
				ownerId: testUserId,
				description: "Original description",
			};

			const createdProject = await projectRepository.create(projectData);
			const updatedTitle = "Updated Title Only";

			const updatedProject = await projectRepository.update(
				createdProject.id,
				updatedTitle,
			);

			expect(updatedProject).toBeDefined();
			expect(updatedProject.title).toBe(updatedTitle);
			expect(updatedProject.description).toBe(projectData.description);
		});
	});

	describe("delete", () => {
		it("should delete project by id", async () => {
			const projectData = {
				title: "Project to Delete",
				ownerId: testUserId,
				description: "This project will be deleted",
			};

			const createdProject = await projectRepository.create(projectData);

			const projectBeforeDelete = await projectRepository.findById(
				createdProject.id,
			);
			expect(projectBeforeDelete).toBeDefined();

			const deletedProject = await projectRepository.delete(createdProject.id);

			expect(deletedProject).toBeDefined();
			expect(deletedProject.id).toBe(createdProject.id);

			const projectAfterDelete = await projectRepository.findById(
				createdProject.id,
			);
			expect(projectAfterDelete).toBeNull();
		});

		it("should throw error when deleting non-existent project", async () => {
			const nonExistentId = "cm1invalid-project-id";

			await expect(projectRepository.delete(nonExistentId)).rejects.toThrow();
		});
	});
});
