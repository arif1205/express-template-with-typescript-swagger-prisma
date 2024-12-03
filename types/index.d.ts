import { Request } from "express";
import { JWTPayload } from "./jwt";

/**
 * Custom Error Type extends Error Type with status property
 */
export interface CustomErrorType extends Error {
	status?: number;
}

export interface JWTPayload {
	userId: string;
	email: string;
	roles: string[];
}

export interface AuthResponse {
	user: {
		id: string;
		email: string;
		name: string;
		roles: string[];
	};
	token: string;
}

export interface CookieOptions {
	httpOnly: boolean;
	secure: boolean;
	sameSite: "strict" | "lax" | "none";
	maxAge: number;
}

declare global {
	namespace Express {
		interface Request {
			user: JWTPayload;
		}
	}
}

export enum Role {
	ADMIN = "ADMIN",
	MODERATOR = "MODERATOR",
	CUSTOMER = "CUSTOMER",
}
