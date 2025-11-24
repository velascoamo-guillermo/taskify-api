import { UserRepository } from "../../repositories/user.repository";
import { generateAccessToken } from "../../utils/jwt";

export class TestHelpers {
	private static userRepository = new UserRepository();

	/**
	 * Create test user and return access token
	 */
	static async createTestUserWithToken(userData?: {
		email?: string;
		name?: string;
		password?: string;
	}) {
		const defaultData = {
			email: `test-${Date.now()}@example.com`,
			name: "Test User",
			password: "hashedpassword123",
			...userData,
		};

		const user = await TestHelpers.userRepository.create(defaultData);

		const token = generateAccessToken({
			id: user.id,
			email: user.email,
		});

		return {
			user,
			token,
			authHeader: `Bearer ${token}`,
		};
	}

	/**
	 * Generate token for existing user
	 */
	static generateTokenForUser(user: { id: string; email: string }) {
		const token = generateAccessToken({
			id: user.id,
			email: user.email,
		});

		return {
			token,
			authHeader: `Bearer ${token}`,
		};
	}

	/**
	 * Create mock token for lightweight testing
	 */
	static createMockToken() {
		const token = generateAccessToken({
			id: "test-user-id",
			email: "test@example.com",
		});

		return {
			token,
			authHeader: `Bearer ${token}`,
		};
	}

	/**
	 * Clean up test user from database
	 */
	static async cleanupUser(userId: string) {
		try {
			await TestHelpers.userRepository.delete(userId);
		} catch (error) {
			// Ignore errors during cleanup
			console.warn(`Failed to cleanup user ${userId}:`, error);
		}
	}
}
