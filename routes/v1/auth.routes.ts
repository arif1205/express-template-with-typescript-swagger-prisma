import { Router } from "express";
import { AuthController } from "../../controllers/auth.controller";
import { validateRequest } from "../../middleware/validate.middleware";
import {
	loginSchema,
	registerSchema,
} from "../../validators/schema/auth.schema";

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - departmentId
 *               - designation
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: professor@sust.edu
 *               password:
 *                 type: string
 *                 example: 123456
 *               name:
 *                 type: string
 *                 example: Professor
 *               departmentId:
 *                 type: string
 *                 format: uuid
 *                 example: 2510b8d6-b581-422c-a6ef-a308070abacd
 *               designation:
 *                 type: string
 *                 enum: [LECTURER, ASSISTANT_PROFESSOR, ASSOCIATE_PROFESSOR, PROFESSOR, HEAD, DEAN, CHAIRMAN]
 *                 example: ASSOCIATE_PROFESSOR
 *               roleId:
 *                 type: string
 *                 format: uuid
 *                 description: Optional role ID for the user
 *                 example: 6723b575-f15b-4fc8-a965-7a11d51bcff3
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */
router.post(
	"/register",
	validateRequest(registerSchema),
	authController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: professor@sust.edu
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials / Unauthorized
 *       400:
 *         description: Validation error
 */
router.post("/login", validateRequest(loginSchema), authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         description: Not authenticated
 */
router.post("/logout", authController.logout);

export default router;
