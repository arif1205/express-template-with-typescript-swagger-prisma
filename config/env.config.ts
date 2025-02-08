import dotenv from "dotenv";
import path from "path";

// Load .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Export all environment variables
export const env = {
	JWT_SECRET: process.env.JWT_SECRET,
	DATABASE_URL: process.env.DATABASE_URL,
	PORT: process.env.PORT,
	NODE_ENV: process.env.NODE_ENV,
} as const;

// Validate required environment variables
const requiredEnvVars = ["JWT_SECRET", "DATABASE_URL"] as const;
for (const envVar of requiredEnvVars) {
	if (!env[envVar]) {
		throw new Error(`Missing required environment variable: ${envVar}`);
	}
}
