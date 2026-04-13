import { Router } from "express";
import UserSkillController from "./user_skill.controller.js";

const router = Router();

router.get("/:user_id", UserSkillController.getByUserId);
router.get("/:user_id/:skill_id", UserSkillController.getByIds);
router.post("/", UserSkillController.create);
router.patch("/:user_id/:skill_id/decrease", UserSkillController.decreaseExperience);
router.patch("/:user_id/:skill_id/increase", UserSkillController.addExperience);
router.delete("/:user_id/:skill_id", UserSkillController.delete);

export default router;