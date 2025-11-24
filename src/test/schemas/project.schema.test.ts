import { describe, expect, it } from "vitest";
import { projectSchema } from "../../schemas/project.schema";

describe("Projects Schema", () => {
	describe("projectSchema", () => {
		it("should validate project data", () => {
			const projectData = {
				title: "New Project",
				description: "This is a test project",
			};

			const result = projectSchema.safeParse(projectData);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(projectData);
			}
		});

		it("should validate project data without description", () => {
			const projectData = {
				title: "New Project Without Description",
			};

			const result = projectSchema.safeParse(projectData);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(projectData);
			}
		});

		it("should reject project data without title", () => {
			const projectData = {
				description: "This project has no title",
			};

			const result = projectSchema.safeParse(projectData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues).toHaveLength(1);
				expect(result.error.issues[0]?.path).toContain("title");
			}
		});
	});
});
