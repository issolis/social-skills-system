export default class SkillValidator {

    static validateId(req, res, next) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid skill id"
            });
        }

        next();
    }

    static validateCreate(req, res, next) {
        const { name, available_pts } = req.body;

        if (!name || typeof name !== "string") {
            return res.status(400).json({
                status: "error",
                message: "Invalid name"
            });
        }

        if (available_pts == null || isNaN(available_pts) || available_pts < 0) {
            return res.status(400).json({
                status: "error",
                message: "Invalid available_pts"
            });
        }

        next();
    }

    static validateUpdate(req, res, next) {
        const { name, available_pts } = req.body;

        if (name !== undefined && typeof name !== "string") {
            return res.status(400).json({
                status: "error",
                message: "Invalid name"
            });
        }

        if (available_pts !== undefined && (isNaN(available_pts) || available_pts < 0)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid available_pts"
            });
        }

        next();
    }

    static validateDecrease(req, res, next) {
        const { points } = req.body;

        if (points == null || isNaN(points) || points <= 0) {
            return res.status(400).json({
                status: "error",
                message: "Invalid points value"
            });
        }

        next();
    }
    static validateDecrease(req, res, next) {
        const { points } = req.body;

        if (points == null || isNaN(points) || points <= 0) {
            return res.status(400).json({
                status: "error",
                message: "Invalid points value"
            });
        }

        next();
    }
}