export default class OrderValidator {

    static validateId(req, res, next) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid order id"
            });
        }

        next();
    }

    static validateCreate(req, res, next) {
        const { user_id, skill_id, pts_assigned } = req.body;

        if (!user_id || isNaN(user_id)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid user_id"
            });
        }

        if (req.params.id && parseInt(req.params.id) !== parseInt(user_id)) {
            return res.status(403).json({
                status: "error",
                message: "Forbidden: you cannot create orders for someone else"
            });
        }

        if (!skill_id || isNaN(skill_id)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid skill_id"
            });
        }

        if (!pts_assigned || isNaN(pts_assigned) || pts_assigned <= 0) {
            return res.status(400).json({
                status: "error",
                message: "Invalid pts_assigned"
            });
        }

        next();
    }
}
