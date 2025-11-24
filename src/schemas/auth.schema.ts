import { z } from "zod";

export const registerSchema = z.object({
	email: z.email({ message: "Invalid email" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" }),
	name: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
	email: z.email({ message: "Invalid email" }),
	password: z.string().min(6, { message: "Password is too short" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
