import jwt from "jsonwebtoken";
import { publicKey } from "../../config/keys.js";

export function authenticate(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token)
        return res.status(401).json({
            status: "error",
            error: "No token provided"
        });

    try {
        const decoded = jwt.verify(token, publicKey, {
            algorithms: ["RS256"]
        });
        req.user = decoded;
        next();

    } catch (error) {
        console.log("hello")
        return res.status(401).json({
            status: "error",
            error: error.message
        });
    }
}