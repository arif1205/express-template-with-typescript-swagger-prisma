import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { LoginInput, RegisterInput } from "../validators/schema/auth.schema";

export class AuthController {
	private authService: AuthService;

	constructor() {
		this.authService = new AuthService();
	}

	register = async (
		req: Request<{}, {}, RegisterInput>,
		res: Response,
		next: NextFunction
	) => {
		try {
			const result = await this.authService.register(req.body);

			// Set cookie
			res.cookie("token", result.token, {
				httpOnly: true,
				secure: true,
				sameSite: "none",
				maxAge: 60 * 60 * 1000, // 1 hours
			});

			return res.status(201).json({ user: result.user });
		} catch (error) {
			next(error);
		}
	};

	login = async (
		req: Request<{}, {}, LoginInput>,
		res: Response,
		next: NextFunction
	) => {
		try {
			const result = await this.authService.login(req.body);

			res.cookie("token", result.token, {
				httpOnly: true,
				secure: true,
				sameSite: "none",
				maxAge: 60 * 60 * 1000, // 1 hours
			});

			return res.status(200).json({ user: result.user });
		} catch (error) {
			next(error);
		}
	};

	logout = (_req: Request, res: Response) => {
		res.clearCookie("token");
		return res.status(200).json({ message: "Logged out successfully" });
	};
}
