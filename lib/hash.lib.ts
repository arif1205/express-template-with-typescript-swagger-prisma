import argon2 from "argon2";
import { CustomError } from "../custom-class/CustomError";

export class HashService {
	/**
	 * @description Hash the text using argon2 hashing algorithm
	 * @param text: string
	 * @returns Promise<string>
	 */
	hashText = async (text: string): Promise<string> => {
		try {
			const hash = await argon2.hash(text);
			return hash;
		} catch (err: any) {
			throw new CustomError(err?.message || "Failed to hash", 500);
		}
	};

	/**
	 * @description Verify the hashed text and original text using argon2 hashing algorithm
	 * @param hashText: string
	 * @param text: string
	 * @returns Promise<boolean>
	 */
	verifyHash = async (hashText: string, text: string): Promise<boolean> => {
		try {
			if (await argon2.verify(hashText, text)) {
				return true;
			}
			return false;
		} catch (err: any) {
			throw new CustomError(err.message || "Failed to verify", 500);
		}
	};

	/**
	 * @description Compare the hashed text and original text using argon2 hashing algorithm
	 * @param hashText: string
	 * @param text: string
	 * @returns Promise<boolean>
	 */
	compareHash = async (hashText: string, text: string): Promise<boolean> => {
		return await argon2.verify(hashText, text);
	};
}

export const hashService = new HashService();
