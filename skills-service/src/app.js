import express from "express";
import skillsRoutes from "./modules/skills/skill.routes.js";

const app = express();


app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Skills service is running"
    });
});

app.use("/skills", skillsRoutes);

export default app; 