import jwt, { TokenExpiredError } from "jsonwebtoken";
import { CustomError } from "../custom-class/CustomError";
import { JWTPayload } from "../types";
import { env } from "../config/env.config";

export class TokenService {
	private readonly jwtSecret: string;

	constructor() {
		this.jwtSecret = env.JWT_SECRET as string;
	}

	/**
	 * @description Generate JWT token
	 * @param payload JWTPayload
	 * @returns string
	 */
	generateToken = (payload: JWTPayload): string => {
		try {
			return jwt.sign(payload, this.jwtSecret, {
				expiresIn: "30d",
			});
		} catch (error) {
			throw new CustomError("Couldn't create token", 500);
		}
	};

	/**
	 * @description Verify JWT token
	 * @param token string
	 * @returns JWTPayload
	 */
	verifyToken = (token: string): JWTPayload => {
		try {
			return jwt.verify(token, this.jwtSecret) as JWTPayload;
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw new CustomError("Token expired", 401);
			}
			throw new CustomError("Invalid token", 401);
		}
	};

	/**
	 * @description Decode JWT token without verification
	 * @param token string
	 * @returns JWTPayload | null
	 */
	decodeToken = (token: string): JWTPayload | null => {
		return jwt.decode(token) as JWTPayload | null;
	};
}

export const tokenService = new TokenService();
