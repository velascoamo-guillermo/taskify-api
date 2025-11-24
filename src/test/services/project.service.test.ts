import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { UserRepository } from "../../repositories/user.repository";
import { ProjectService } from "../../services/project.service";

describe("ProjectService", () => {
	let projectService: ProjectService;
	let userRepository: UserRepository;
	let testUserId: string;

	beforeAll(async () => {
		projectService = new ProjectService();
		userRepository = new UserRepository();

		const testUser = await userRepository.create({
			email: `test-service-user-${Date.now()}@example.com`,
			password: "hashedpassword123",
			name: "Test User for Project Service",
		});
		testUserId = testUser.id;
	});

	afterAll(async () => {
		console.log("Project Service tests completed");
	});

	beforeEach(async () => {
		const projects = await projectService.getProjectsByOwnerId(testUserId);
		for (const project of projects) {
			await projectService.deleteProject(project.id);
		}
	});

	describe("createProject", () => {
		it("should create a new project successfully", async () => {
			const projectData = {
				title: "Service Test Project",
				description: "A project created through service layer",
				ownerId: testUserId,
			};

			const project = await projectService.createProject(projectData);

			expect(project).toBeDefined();
			expect(project.title).toBe(projectData.title);
			expect(project.description).toBe(projectData.description);
			expect(project.ownerId).toBe(testUserId);
			expect(project.id).toBeDefined();
			expect(project.createdAt).toBeDefined();
			expect(project.updatedAt).toBeDefined();
		});

		it("should create project without description", async () => {
			const projectData = {
				title: "Project Without Description",
				ownerId: testUserId,
			};

			const project = await projectService.createProject(projectData);

			expect(project).toBeDefined();
			expect(project.title).toBe(projectData.title);
			expect(project.description).toBeNull();
			expect(project.ownerId).toBe(testUserId);
		});

		it("should validate required fields", async () => {
			const invalidProjectData = {
				description: "Project without title",
				ownerId: testUserId,
			} as { title: string; description: string; ownerId: string };

			await expect(
				projectService.createProject(invalidProjectData),
			).rejects.toThrow();
		});
	});
	describe("getProjectById", () => {
		it("should retrieve project by id", async () => {
			const projectData = {
				title: "Get By ID Test",
				description: "Project for testing getById",
				ownerId: testUserId,
			};

			const createdProject = await projectService.createProject(projectData);
			const retrievedProject = await projectService.getProjectById(
				createdProject.id,
			);

			expect(retrievedProject).toBeDefined();
			expect(retrievedProject?.id).toBe(createdProject.id);
			expect(retrievedProject?.title).toBe(projectData.title);
			expect(retrievedProject?.description).toBe(projectData.description);
			expect(retrievedProject?.ownerId).toBe(testUserId);
		});

		it("should return null for non-existent project", async () => {
			const nonExistentId = "cm1nonexistent-id";
			const project = await projectService.getProjectById(nonExistentId);

			expect(project).toBeNull();
		});
	});

	describe("getProjectsByOwnerId", () => {
		it("should retrieve all projects for an owner", async () => {
			const project1 = await projectService.createProject({
				title: "First Project",
				description: "First project description",
				ownerId: testUserId,
			});

			const project2 = await projectService.createProject({
				title: "Second Project",
				description: "Second project description",
				ownerId: testUserId,
			});

			const projects = await projectService.getProjectsByOwnerId(testUserId);

			expect(projects).toBeDefined();
			expect(Array.isArray(projects)).toBe(true);
			expect(projects.length).toBe(2);

			const projectIds = projects.map((p) => p.id);
			expect(projectIds).toContain(project1.id);
			expect(projectIds).toContain(project2.id);
		});

		it("should return empty array for owner with no projects", async () => {
			const anotherUser = await userRepository.create({
				email: `no-projects-user-${Date.now()}@example.com`,
				password: "hashedpassword123",
				name: "User Without Projects",
			});

			const projects = await projectService.getProjectsByOwnerId(
				anotherUser.id,
			);

			expect(projects).toBeDefined();
			expect(Array.isArray(projects)).toBe(true);
			expect(projects.length).toBe(0);
		});
	});

	describe("updateProject", () => {
		it("should update project title and description", async () => {
			const projectData = {
				title: "Original Title",
				description: "Original description",
				ownerId: testUserId,
			};

			const project = await projectService.createProject(projectData);

			const updatedTitle = "Updated Title";
			const updatedDescription = "Updated description";

			const updatedProject = await projectService.updateProject(
				project.id,
				updatedTitle,
				updatedDescription,
			);

			expect(updatedProject).toBeDefined();
			expect(updatedProject.title).toBe(updatedTitle);
			expect(updatedProject.description).toBe(updatedDescription);
			expect(updatedProject.id).toBe(project.id);
			expect(updatedProject.updatedAt.getTime()).toBeGreaterThan(
				project.updatedAt.getTime(),
			);
		});

		it("should update only title when description is not provided", async () => {
			const projectData = {
				title: "Original Title",
				description: "Original description",
				ownerId: testUserId,
			};

			const project = await projectService.createProject(projectData);
			const updatedTitle = "Only Title Updated";

			const updatedProject = await projectService.updateProject(
				project.id,
				updatedTitle,
			);

			expect(updatedProject).toBeDefined();
			expect(updatedProject.title).toBe(updatedTitle);
			expect(updatedProject.description).toBe(projectData.description);
		});

		it("should throw error when updating non-existent project", async () => {
			const nonExistentId = "cm1nonexistent-project";

			await expect(
				projectService.updateProject(nonExistentId, "New Title"),
			).rejects.toThrow();
		});
	});

	describe("deleteProject", () => {
		it("should delete project successfully", async () => {
			const projectData = {
				title: "Project to Delete",
				description: "This project will be deleted",
				ownerId: testUserId,
			};

			const project = await projectService.createProject(projectData);

			const projectBeforeDelete = await projectService.getProjectById(
				project.id,
			);
			expect(projectBeforeDelete).toBeDefined();

			const deletedProject = await projectService.deleteProject(project.id);

			expect(deletedProject).toBeDefined();
			expect(deletedProject.id).toBe(project.id);

			const projectAfterDelete = await projectService.getProjectById(
				project.id,
			);
			expect(projectAfterDelete).toBeNull();
		});

		it("should throw error when deleting non-existent project", async () => {
			const nonExistentId = "cm1nonexistent-project-delete";

			await expect(
				projectService.deleteProject(nonExistentId),
			).rejects.toThrow();
		});
	});
});
