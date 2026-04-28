import express from "express";
import skillsRoutes from "./modules/skills/skill.routes.js";
import { authenticate } from "./middlewares/auth/auth.middleware.js";

const app = express();


app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Skills services is running"
    });
});

app.use("/skills", authenticate, skillsRoutes);

export default app; 