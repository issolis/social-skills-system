import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function authenticate(req, res, next) {

    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token)
        return res.status(401).json({
            status: "error",
            error: "No token provided"
        });

    try {
        const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY, {
            algorithms: ["RS256"]
        });
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            status: "error",
            error: error.message
        });
    }
}