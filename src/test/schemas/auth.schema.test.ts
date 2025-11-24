import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "../../schemas/auth.schema.ts";

describe("Auth Schemas", () => {
	describe("registerSchema", () => {
		it("should validate correct registration data", () => {
			const validData = {
				email: "test@example.com",
				password: "password123",
				name: "Test User",
			};

			const result = registerSchema.safeParse(validData);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(validData);
			}
		});

		it("should validate registration data without name", () => {
			const validData = {
				email: "test@example.com",
				password: "password123",
			};

			const result = registerSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("should reject invalid email", () => {
			const invalidData = {
				email: "invalid-email",
				password: "password123",
				name: "Test User",
			};

			const result = registerSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues).toHaveLength(1);
				expect(result.error.issues[0]?.path).toContain("email");
			}
		});

		it("should reject short password", () => {
			const invalidData = {
				email: "test@example.com",
				password: "123",
				name: "Test User",
			};

			const result = registerSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues).toHaveLength(1);
				expect(result.error.issues[0]?.path).toContain("password");
			}
		});

		it("should reject missing email", () => {
			const invalidData = {
				password: "password123",
				name: "Test User",
			};

			const result = registerSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject missing password", () => {
			const invalidData = {
				email: "test@example.com",
				name: "Test User",
			};

			const result = registerSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});

	describe("loginSchema", () => {
		it("should validate correct login data", () => {
			const validData = {
				email: "test@example.com",
				password: "password123",
			};

			const result = loginSchema.safeParse(validData);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(validData);
			}
		});

		it("should reject invalid email", () => {
			const invalidData = {
				email: "invalid-email",
				password: "password123",
			};

			const result = loginSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues).toHaveLength(1);
				expect(result.error.issues[0]?.path).toContain("email");
			}
		});

		it("should reject short password", () => {
			const invalidData = {
				email: "test@example.com",
				password: "123",
			};

			const result = loginSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues).toHaveLength(1);
				expect(result.error.issues[0]?.path).toContain("password");
			}
		});

		it("should reject missing fields", () => {
			const invalidData = {
				email: "test@example.com",
			};

			const result = loginSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});
});
