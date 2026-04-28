import { getServiceToken } from "../../config/serviceAuth.js"

const USERS_SERVICE = process.env.USERS_SERVICE_URL || "http://localhost:3001";
const SKILLS_SERVICE = process.env.SKILLS_SERVICE_URL || "http://localhost:3002";

export default class ServiceAvailabilityMiddleware {
    static async validateCreateDependencies(req, res, next) {
        let headers;
        try {
            const token = await getServiceToken();
            headers = { "Authorization": `Bearer ${token}` };
        } catch (error) {
            return res.status(400).json({
                status: "error",
                message: "Invalid token"
            });
        }

        console.log(headers)

        try {
            const userRes = await fetch(`${USERS_SERVICE}/`, { headers });
            if (!userRes.ok) throw new Error();
        } catch {
            return res.status(503).json({
                status: "error",
                message: `Users service is not available (tried: ${USERS_SERVICE}/)`
            });
        }

        try {
            const skillRes = await fetch(`${SKILLS_SERVICE}/`, { headers });
            if (!skillRes.ok) throw new Error();
        } catch {
            return res.status(503).json({
                status: "error",
                message: `Skills service is not available (tried: ${SKILLS_SERVICE}/)`
            });
        }
        return next();
    }
}