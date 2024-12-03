import prisma from "../db/db_client";
import { hashService } from "../lib/hash.lib";
import { tokenService } from "../lib/token.lib";
import { emailService } from "./email.service";
import { CustomError } from "../custom-class/CustomError";
import { LoginInput, RegisterInput } from "../validators/schema/auth.schema";
import { AuthResponse } from "../types";

export class AuthService {
	register = async (input: RegisterInput): Promise<AuthResponse> => {
		const existingUser = await prisma.user.findUnique({
			where: { email: input.email },
		});

		if (existingUser) {
			throw new CustomError("Email already exists", 409);
		}

		const hashedPassword = await hashService.hashText(input.password);

		const user = await prisma.user.create({
			data: {
				email: input.email,
				password: hashedPassword,
				name: input.name,
				userToRoles: {
					create: {
						role: {
							connect: {
								role_name: "USER",
							},
						},
					},
				},
			},
			include: {
				userToRoles: {
					include: {
						role: true,
					},
				},
			},
		});

		// Send welcome email (commented for now)
		// await emailService.sendWelcomeEmail(user.email, user.name);

		const token = tokenService.generateToken({
			userId: user.id,
			email: user.email,
			roles: user.userToRoles.map((ur) => ur.role.role_name),
		});

		return {
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				roles: user.userToRoles.map((ur) => ur.role.role_name),
			},
			token,
		};
	};

	login = async (input: LoginInput): Promise<AuthResponse> => {
		const user = await prisma.user.findUnique({
			where: { email: input.email },
			include: {
				userToRoles: {
					select: {
						role: {
							select: {
								role_name: true,
							},
						},
					},
				},
			},
		});

		if (!user) {
			throw new CustomError("Invalid credentials", 401);
		}

		const isValidPassword = await hashService.verifyHash(
			user.password,
			input.password
		);

		if (!isValidPassword) {
			throw new CustomError("Invalid credentials", 401);
		}

		const token = tokenService.generateToken({
			userId: user.id,
			email: user.email,
			roles: user.userToRoles.map((ur) => ur.role.role_name),
		});

		return {
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				roles: user.userToRoles.map((ur) => ur.role.role_name),
			},
			token,
		};
	};
}
