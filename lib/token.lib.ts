import jwt, { TokenExpiredError } from "jsonwebtoken";
import { CustomError } from "../custom-class/CustomError";
import { JWTPayload } from "../types";

export class TokenService {
	private readonly jwtSecret: string;

	constructor() {
		if (!process.env.JWT_SECRET) {
			throw new CustomError("JWT_SECRET is not defined", 500);
		}
		this.jwtSecret = process.env.JWT_SECRET;
	}

	/**
	 * @description Generate JWT token
	 * @param payload JWTPayload
	 * @returns string
	 */
	generateToken = (payload: JWTPayload): string => {
		try {
			return jwt.sign(payload, this.jwtSecret, {
				expiresIn: "1h",
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
