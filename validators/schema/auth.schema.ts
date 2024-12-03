import { z } from "zod";
import { validate_email } from "../validation";

/**
 * @swagger
 * components:
 *   schemas:
 *     Register as User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *             enum: [ADMIN, COORDINATOR, EVALUATOR, USER]
 */
export const registerSchema = z.object({
	body: z.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		email: z
			.string()
			.email()
			.refine((val) => validate_email(val), "Invalid email format"),
		password: z
			.string()
			.min(6, "Password must be at least 6 characters")
			.max(100),
		roleId: z.string().uuid().optional(),
	}),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Login as User:
 *       type: object
 *       required:
 *         - email
 *         - password
 */
export const loginSchema = z.object({
	body: z.object({
		email: z
			.string()
			.email()
			.refine((val) => validate_email(val), "Invalid email format"),
		password: z.string(),
	}),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
