import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "../../utils/hash.ts";

describe("Hash Utils", () => {
  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const password = "testpassword123";
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(20);
    });

    it("should generate different hashes for same password", async () => {
      const password = "testpassword123";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("comparePassword", () => {
    it("should return true for correct password", async () => {
      const password = "testpassword123";
      const hashedPassword = await hashPassword(password);

      const isMatch = await comparePassword(password, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it("should return false for incorrect password", async () => {
      const password = "testpassword123";
      const wrongPassword = "wrongpassword";
      const hashedPassword = await hashPassword(password);

      const isMatch = await comparePassword(wrongPassword, hashedPassword);
      expect(isMatch).toBe(false);
    });
  });
});
