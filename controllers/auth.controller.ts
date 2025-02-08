import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginInput, RegisterInput } from "../validators/schema/auth.schema";
import { hashService } from "../lib/hash.lib";

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
			const hashedPassword = await hashService.hashText(req.body.password);
			req.body.password = hashedPassword;

			const result = await this.authService.register(req.body);

			return res.status(201).json({ user: result.user, token: result.token });
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
			return res.status(200).json({ user: result.user, token: result.token });
		} catch (error) {
			next(error);
		}
	};
}
