import { Router } from "express"
import { AuthController } from "./auth.controller.js"
import { AuthValidator } from "./auth.validator.js"

const router = Router(); 


router.post("/login", AuthValidator.login, AuthController.login); 


export default router; 