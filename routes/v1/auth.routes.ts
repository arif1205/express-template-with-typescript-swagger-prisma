import { Router } from "express";
import { AuthController } from "../../controllers/auth.controller";
import { validateRequest } from "../../middleware/validate.middleware";
import { loginSchema } from "../../validators/schema/auth.schema";

const router = Router();
const authController = new AuthController();

// router.post(
// 	"/register",
// 	validateRequest(registerSchema),
// 	authController.register
// );

router.post("/login", validateRequest(loginSchema), authController.login);

export default router;
