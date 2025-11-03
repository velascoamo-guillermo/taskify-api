import { beforeAll, afterAll, beforeEach } from "vitest";
import { config } from "dotenv";
import { prisma } from "../../prisma/db.ts";

// Load test environment variables
config({ path: ".env.test" });

// Setup test database
beforeAll(async () => {
  // Here you would typically set up your test database
  // For now, we'll use the same DB but in a different schema
  process.env.NODE_ENV = "test";

  // Clean database at start
  await cleanDatabase();
});

// Clean up before each test to ensure isolation
beforeEach(async () => {
  await cleanDatabase();
});

// Cleanup after all tests
afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

async function cleanDatabase() {
  // Clean database in the correct order (respecting foreign key constraints)
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
}
