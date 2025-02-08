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
	phone: string;
	roles: string[];
	permissions: string[];
}

export interface User {
	id: string;
	phone: string;
	roles: string[];
	name: string;
	status: string;
	orders?: number;
	reviews?: number;
	permissions: string[];
}

export interface AuthResponse {
	user: User;
	token: string;
}

export interface AddressResponse {
	id: string;
	street: string;
	city: string;
	upazila: string;
	country: string;
	zipCode: string | null;
}

export interface CookieOptions {
	httpOnly: boolean;
	secure: boolean;
	sameSite: "strict" | "lax" | "none";
	maxAge: number;
}

export enum Role {
	ADMIN = "ADMIN",
	MODERATOR = "MODERATOR",
	CUSTOMER = "CUSTOMER",
}

declare global {
	namespace Express {
		interface Request {
			user: JWTPayload;
		}
	}
}
