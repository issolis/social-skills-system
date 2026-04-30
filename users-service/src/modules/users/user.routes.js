import { Router } from "express";
import UserController from "./user.controller.js";
import UserValidator from "./user.validator.js";
import userSkillRoutes from "../user_skills/user_skill.routes.js";
import { RBACMiddleware } from "../../middlewares/rbac/rbac.middeware.js";

const router = Router();

router.use("/skills", userSkillRoutes);

router.get("/", RBACMiddleware.requireRole(1, 3), UserController.getAll);
router.get("/:id", UserValidator.validateGetById, RBACMiddleware.requireSelfOrPrivileged("id"), UserController.getById);
router.post("/", RBACMiddleware.requireRole(1), UserValidator.validateCreate, UserController.create);
router.put("/:id", UserValidator.validateUpdate, RBACMiddleware.requireSelfOrPrivileged("id"), UserController.update);
router.delete("/:id", UserValidator.validateDelete, RBACMiddleware.requireRole(1), UserController.delete);
router.get("/:id/skills", RBACMiddleware.requireSelfOrPrivileged("id"), UserController.getSkillsByUserId);

export default router;