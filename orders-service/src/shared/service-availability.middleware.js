const USERS_SERVICE = "http://localhost:3001";
const SKILLS_SERVICE = "http://localhost:3002";

export default class ServiceAvailabilityMiddleware {
    static async validateCreateDependencies(req, res, next) {
        try {
            await fetch(`${USERS_SERVICE}/health`);
        } catch (error) {
            return res.status(503).json({
                status: "error",
                message: "Users service is not available"
            });
        }

        try {
            await fetch(`${SKILLS_SERVICE}/health`);
        } catch (error) {
            return res.status(503).json({
                status: "error",
                message: "Skills service is not available"
            });
        }

        return next();
    }
}