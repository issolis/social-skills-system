import express from "express";
import userRoutes from "./modules/users/user.routes.js";

import { authenticate } from "./middlewares/auth/auth.middleware.js"

const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.get("/", (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Users service is running"
    });
});

app.use("/users", authenticate, userRoutes);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Internal server error";
    
    return res.status(status).json({
        status: "error",
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

export default app;