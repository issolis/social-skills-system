import express from "express";
import userRoutes from "./modules/users/user.routes.js";

const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.get("/", (req, res) => {
    res.send("Users service is running");
});

app.use("/users", userRoutes);

export default app;