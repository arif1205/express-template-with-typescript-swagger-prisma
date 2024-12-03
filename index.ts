import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { swaggerSpecs } from "./config/swagger.conf";
import routes from "./routes";
import { errorService } from "./services/error.service";
import { CustomErrorType } from "./types";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { logger } from "./lib/logger.lib";

// To load environment variables
dotenv.config();

// Initialize express app with port 9292
// process.env.UV_THREADPOOL_SIZE = "12";

const app: Application = express();
const port = process.env.PORT || 9292;

// allowlist for cors
const allowlist = [""];

/**
 * Root level middlewares
 * 1. cors: to allow cross-origin requests from the specified domains
 * 2. express.static: to serve static files from the public directory
 * 3. express.json: to parse incoming request with JSON payloads
 * 4. express.urlencoded: to parse incoming request with URL-encoded payloads
 * 5. Compression: Use the gzip to compress the req res payload, increase the server performance
 * 6. cookieParser: to parse cookies from the request
 */
app.use(cors({ origin: allowlist }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	compression({
		level: 4,
		threshold: 2048,
		filter: (req: Request, res: Response) => {
			if (req.headers?.["x-no-compression"]) {
				return false;
			}
			const contentType = res.getHeader("Content-Type") as string;
			if (contentType && /(image|video|audio)/.test(contentType)) {
				return false;
			}
			return compression.filter(req, res);
		},
	})
);
app.use(cookieParser());
app.use(loggerMiddleware);

app.get("/", (_req: Request, res: Response) => {
	res.json({ message: "Server is healthy" });
});

/**
 * Swagger UI
 */
app.use(
	"/docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpecs, {
		explorer: true,
		customCss: ".swagger-ui .topbar { display: none }",
	})
);

/**
 * MAIN API routes
 * @description All the API routes are prefixed with /api
 */
app.use("/api", routes);

/**
 * Catch all route
 * @description If the route is not found, it will return 404
 */
app.use("*", (_req: Request, res: Response) => {
	res.status(404).json({ message: "Route not found", status: 404 });
});

/**
 * GLOBAL Error handling middleware
 * @description If any error occurs, it will catch the error, and based on the error type and status, it will send the customized message and status
 */
app.use(
	(err: CustomErrorType, _req: Request, res: Response, next: NextFunction) => {
		// if headers already sent then skip
		if (res.headersSent) {
			return next(err);
		}

		const status = err?.status || 500;
		/**
		 * Get the appropiate error response message based on the error type and status
		 */
		const errorResponse = errorService.getErrorResponse(err, status);

		// Send the error response
		res.status(errorResponse.status).json(errorResponse);
	}
);

// Start the server at the specified port
app.listen(port, () => {
	logger.info(`Server is Fire at ${port}`);
});
