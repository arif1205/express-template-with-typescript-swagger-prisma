import {
	PrismaClientKnownRequestError,
	PrismaClientInitializationError,
} from "@prisma/client/runtime/library";
import { ZodError } from "zod";
import { CustomError } from "../custom-class/CustomError";

export class ErrorService {
	/**
	 * @description Handle Zod validation errors
	 */
	private handleZodError = (err: ZodError) => {
		return {
			status: 403,
			message: `${err?.issues?.[0]?.path?.join("-")}: ${
				err?.issues?.[0]?.message
			}`,
			name: err?.name,
			path: err?.issues?.[0]?.path?.join("-"),
		};
	};

	/**
	 * @description Handle Prisma known request errors
	 */
	private handlePrismaKnownError = (err: PrismaClientKnownRequestError) => {
		if (err.code === "P2002") {
			const target = err.meta?.target;
			let errorMessage = "Validation error: ";

			if (Array.isArray(target)) {
				errorMessage += target.join(", ");
			} else if (typeof target === "string") {
				errorMessage += target;
			}
			errorMessage += " already exists";

			return {
				status: 403,
				message: errorMessage,
				name: err?.name,
			};
		}

		if (err.code === "P2025") {
			return {
				status: 403,
				message: err.meta?.cause,
				name: err?.name,
			};
		}

		return {
			status: 403,
			message: err?.message,
			name: err?.name,
		};
	};

	/**
	 * @description Handle Prisma initialization errors
	 */
	private handlePrismaInitError = (err: PrismaClientInitializationError) => {
		return {
			status: 403,
			message: `Prisma db connection error - ${err?.message}`,
			name: err?.name,
		};
	};

	/**
	 * @description Get formatted error response
	 */
	getErrorResponse = (err: any, status: number) => {
		if (err instanceof ZodError) {
			return this.handleZodError(err);
		}

		if (err instanceof PrismaClientKnownRequestError) {
			return this.handlePrismaKnownError(err);
		}

		if (err instanceof PrismaClientInitializationError) {
			return this.handlePrismaInitError(err);
		}

		if (err instanceof CustomError) {
			return {
				status: err.status,
				message: err.message,
				name: err.name,
			};
		}

		return {
			status,
			message: err?.message || "Internal Server Error",
			name: err?.name,
		};
	};
}

// Export singleton instance
export const errorService = new ErrorService();
