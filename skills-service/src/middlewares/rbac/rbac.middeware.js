export class RBACMiddleware {

    static requireRole(...roles) {
        return (req, res, next) => {
            if (!req.user)
                return res.status(401).json({ status: "error", message: "Unauthorized" });

            if (!roles.includes(req.user.role))
                return res.status(403).json({ status: "error", message: "Forbidden" });

            return next();
        };
    }

    static requireSelf(paramKey = "id") {
        return (req, res, next) => {
            if (!req.user)
                return res.status(401).json({ status: "error", message: "Unauthorized" });

            if (req.user.id !== parseInt(req.params[paramKey]))
                return res.status(403).json({ status: "error", message: "Forbidden" });

            return next();
        };
    }

    static requireSelfOrPrivileged(paramKey = "id") {
        return (req, res, next) => {
            if (!req.user)
                return res.status(401).json({ status: "error", message: "Unauthorized" });

            const isSelf = req.user.id === parseInt(req.params[paramKey]);
            const isPrivileged = [1, 3].includes(req.user.role); // admin o service

            if (!isSelf && !isPrivileged)
                return res.status(403).json({ status: "error", message: "Forbidden" });

            return next();
        };
    }
}