export class CustomError extends Error {
	status: number;
	errors?: { field: string; message: string }[];

	constructor(
		message: string,
		status: number,
		name?: string,
		errors?: { field: string; message: string }[]
	) {
		super(message);
		this.status = status;
		this.name = name || "CustomError";
		this.errors = errors;
	}
}
