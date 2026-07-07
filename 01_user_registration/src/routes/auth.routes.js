import { Router } from "express";
import * as authController from "../controllers/auth.controller.js"

const authRouter = Router(); // this file only for api declaration

/**
 * POST /api/auth/register
 */
authRouter.post("/register", authController.register )

/**
 * GET /api/auth/get-me
 */
authRouter.get("/get-me", authController.getMe) 


export default authRouter