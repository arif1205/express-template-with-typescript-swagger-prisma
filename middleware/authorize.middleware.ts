import { NextFunction, Request, Response } from "express";
import { CustomError } from "../custom-class/CustomError";
import { tokenService } from "../lib/token.lib";

/**
 * @description Authorization middleware
 * @param requiredPermissions string[] - Optional array of permissions required to access the route
 * @returns Express middleware function
 */
export const authorize = (requiredPermissions?: string[]) => {
	return async (req: Request, _res: Response, next: NextFunction) => {
		try {
			const token = req.headers.authorization?.split(" ")[1];

			if (!token) {
				throw new CustomError("Unauthorized - No token provided", 401);
			}

			// Verify and decode token
			const decodedToken = tokenService.verifyToken(token);

			req.user = decodedToken;

			// If specific roles are required, check if user has any of them
			if (requiredPermissions && requiredPermissions.length > 0) {
				// const my_permissions = decodedToken.permissions;
				// if (my_permissions.includes(ALL_PERMISSION)) {
				// 	return next();
				// }
				// const hasRequiredPermission = requiredPermissions.every((permission) =>
				// 	my_permissions.includes(permission)
				// );
				// if (!hasRequiredPermission) {
				// 	throw new CustomError("Forbidden - Insufficient permissions", 403);
				// }
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
