import { Router } from "express";
import OrderController from "./order.controller.js";
import OrderValidator from "./order.validator.js";

const router = Router();

router.get("/", OrderController.getAll);

router.get(
    "/:id",
    OrderValidator.validateId,
    OrderController.getById
); 

router.post(
    "/",
    OrderValidator.validateCreate,
    OrderController.create
);

router.delete(
    "/:id",
    OrderValidator.validateId,
    OrderController.delete
);

export default router;
