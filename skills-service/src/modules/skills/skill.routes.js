
import { Router } from "express";
import SkillController from "./skill.controller.js";
import SkillValidator from "./skill.validator.js";

const router = Router();

router.get("/", SkillController.getAll);

router.get(
    "/:id",
    SkillValidator.validateId,
    SkillController.getById
);

router.post(
    "/",
    SkillValidator.validateCreate,
    SkillController.create
);

router.put(
    "/:id",
    SkillValidator.validateId,
    SkillValidator.validateUpdate,
    SkillController.update
);

router.delete(
    "/:id",
    SkillValidator.validateId,
    SkillController.delete
);

router.patch(
    "/:id/decrease",
    SkillValidator.validateId,
    SkillValidator.validateDecrease,
    SkillController.decreasePoints
);
router.patch(
    "/:id/increase",
    SkillValidator.validateId,
    SkillValidator.validateDecrease,
    SkillController.increasePoints
);

export default router;