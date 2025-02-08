import { z } from "zod";

export const registerSchema = z.object({
	body: z.object({
		email: z.string().email("Invalid email address"),
		password: z
			.string()
			.min(6, "Password must be at least 6 characters")
			.max(100),
	}),
});

export const loginSchema = z.object({
	body: z.object({
		email: z.string().email("Invalid email address"),
		password: z.string(),
	}),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
