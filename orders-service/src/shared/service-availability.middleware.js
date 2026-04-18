const USERS_SERVICE = process.env.USERS_SERVICE_URL || "http://localhost:3001";
const SKILLS_SERVICE = process.env.SKILLS_SERVICE_URL || "http://localhost:3002";

export default class ServiceAvailabilityMiddleware {
    static async validateCreateDependencies(req, res, next) {
        try {
            const userRes = await fetch(`${USERS_SERVICE}/`);
            if (!userRes.ok) throw new Error("Status API fail");
        } catch (error) {
            return res.status(503).json({
                status: "error",
                message: `Users service is not available (tried: ${USERS_SERVICE}/)`
            });
        }

        try {
            const skillRes = await fetch(`${SKILLS_SERVICE}/`);
            if (!skillRes.ok) throw new Error("Status API fail");
        } catch (error) {
            return res.status(503).json({
                status: "error",
                message: `Skills service is not available (tried: ${SKILLS_SERVICE}/)`
            });
        }

        return next();
    }
}