import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { CustomError } from "../custom-class/CustomError";

export const validateRequest = (schema: AnyZodObject) => {
	return async (req: Request, _res: Response, next: NextFunction) => {
		try {
			const dataToValidate: any = {};

			if (schema.shape?.body) {
				dataToValidate.body = req.body;
			}

			if (schema.shape?.query) {
				dataToValidate.query = req.query;
			}

			if (schema.shape?.params) {
				dataToValidate.params = req.params;
			}

			await schema.parseAsync(dataToValidate);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errors = error.errors.map((err) => ({
					field: err.path.join("."),
					message: err.message,
				}));
				console.log(error, errors, req.body);

				next(
					new CustomError(
						errors?.[0]?.message || "Validation failed",
						400,
						"ValidationError",
						errors
					)
				);
			} else {
				next(error);
			}
		}
	};
};
