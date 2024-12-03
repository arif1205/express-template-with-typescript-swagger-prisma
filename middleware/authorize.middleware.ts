import { Request, Response, NextFunction } from "express";
import { tokenService } from "../lib/token.lib";
import { CustomError } from "../custom-class/CustomError";

/**
 * @description Authorization middleware
 * @param requiredRoles string[] - Optional array of roles required to access the route
 * @returns Express middleware function
 */
export const authorize = (requiredRoles?: string[]) => {
	return (req: Request, _res: Response, next: NextFunction) => {
		try {
			const token = req.cookies.token;

			if (!token) {
				throw new CustomError("Unauthorized - No token provided", 401);
			}

			// Verify and decode token
			const decodedToken = tokenService.verifyToken(token);
			req.user = decodedToken;

			// If specific roles are required, check if user has any of them
			if (requiredRoles && requiredRoles.length > 0) {
				const hasRequiredRole = decodedToken.roles.some((role) =>
					requiredRoles.includes(role)
				);

				if (!hasRequiredRole) {
					throw new CustomError("Forbidden - Insufficient permissions", 403);
				}
			}

			next();
		} catch (error) {
			if (error instanceof CustomError) {
				next(error);
			} else {
				next(new CustomError("Unauthorized", 401));
			}
		}
	};
};
