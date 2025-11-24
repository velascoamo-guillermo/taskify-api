import z from "zod";

export const projectSchema = z.object({
	title: z.string().min(1, { message: "Title is required" }),
	description: z.string().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
