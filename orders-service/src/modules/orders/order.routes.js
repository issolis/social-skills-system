import { Router } from "express";
import OrderController from "./order.controller.js";
import OrderValidator from "./order.validator.js";
import ServiceAvailabilityMiddleware from "../../shared/service-availability.middleware.js";

const router = Router();

router.get("/", OrderController.getAll);

router.get(
    "/:id",
    OrderValidator.validateId,
    OrderController.getById
);

router.post(
    "/",
    ServiceAvailabilityMiddleware.validateCreateDependencies,
    OrderValidator.validateCreate,
    OrderController.create
);

router.delete(
    "/:id",
    OrderValidator.validateId,
    OrderController.delete
);

export default router;