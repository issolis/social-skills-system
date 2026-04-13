import { Router } from "express";
import UserController from "./user.controller.js";
import UserValidator from "./user.validator.js";

const router = Router();



router.get("/", UserController.getAll);
router.get("/:id", UserValidator.validateGetById, UserController.getById);
router.post("/", UserValidator.validateCreate, UserController.create);
router.put("/:id", UserValidator.validateUpdate, UserController.update);
router.delete("/:id", UserValidator.validateDelete, UserController.delete);



export default router;