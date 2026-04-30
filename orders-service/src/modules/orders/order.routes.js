import { Router } from "express";
import OrderController from "./order.controller.js";
import OrderValidator from "./order.validator.js";
import ServiceAvailabilityMiddleware from "../../middleware/availability/service-availability.middleware.js";
import { RBACMiddleware } from "../../middleware/rbac/rbac.middeware.js";

const router = Router();

router.get("/", RBACMiddleware.requireRole(1), OrderController.getAll);

router.get(
    "/:id",
    RBACMiddleware.requireRole(1),
    OrderValidator.validateId,
    OrderController.getById
);

router.post(
    "/:id",
    RBACMiddleware.requireSelfOrPrivileged("id"),
    ServiceAvailabilityMiddleware.validateCreateDependencies,
    OrderValidator.validateCreate,
    OrderController.create
);

router.post(
    "/",
    RBACMiddleware.requireRole(1),
    ServiceAvailabilityMiddleware.validateCreateDependencies,
    OrderValidator.validateCreate,
    OrderController.create
);

router.delete(
    "/:id",
    RBACMiddleware.requireRole(1),
    OrderValidator.validateId,
    OrderController.delete
);

export default router;