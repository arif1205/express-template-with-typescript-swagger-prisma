import { CustomError } from "../custom-class/CustomError";
import prisma from "../db/db_client";
import { hashService } from "../lib/hash.lib";
import { tokenService } from "../lib/token.lib";
import { AuthResponse } from "../types";
import { LoginInput, RegisterInput } from "../validators/schema/auth.schema";

export class AuthService {
	register = async (input: RegisterInput): Promise<AuthResponse> => {
		const existingUser = await prisma.user.findUnique({
			where: { phone: input.phone },
		});

		if (existingUser) {
			throw new CustomError("Phone number already exists", 409);
		}

		const user = await prisma.user.create({
			data: {
				phone: input.phone,
				password: input.password,
				userToRoles: {
					create: {
						role: {
							connect: {
								id: input.roleId,
							},
						},
					},
				},
				name: input.name,
			},
			include: {
				userToRoles: {
					include: {
						role: true,
					},
				},
			},
		});

		// OTP verification (commented for now)

		const token = tokenService.generateToken({
			userId: user.id,
			phone: user.phone,
			roles: user.userToRoles.map((ur) => ur.role.roleName),
			permissions: user.userToRoles.flatMap((ur) => ur.role.permissions),
		});

		return {
			user: {
				id: user.id,
				phone: user.phone,
				roles: user.userToRoles.map((ur) => ur.role.roleName),
				name: user.name || "",
				status: user.status,
				permissions: user.userToRoles.flatMap((ur) => ur.role.permissions),
			},
			token,
		};
	};

	login = async (input: LoginInput): Promise<AuthResponse> => {
		const user = await prisma.user.findUnique({
			where: { phone: input.phone },
			include: {
				userToRoles: {
					select: {
						role: {
							select: {
								roleName: true,
								permissions: true,
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
			phone: user.phone,
			roles: user.userToRoles.map((ur) => ur.role.roleName),
			permissions: user.userToRoles.flatMap((ur) => ur.role.permissions),
		});

		return {
			user: {
				id: user.id,
				phone: user.phone,
				roles: user.userToRoles.map((ur) => ur.role.roleName),
				permissions: user.userToRoles.flatMap((ur) => ur.role.permissions),
				name: user.name || "",
				status: user.status,
			},
			token,
		};
	};
}
