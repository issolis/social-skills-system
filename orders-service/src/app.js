import express from "express";
import ordersRoutes from "./modules/orders/order.routes.js";
import {authenticate} from "./middleware/auth/auth.middleware.js"

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Orders service is running"
    });
});

app.use("/orders", authenticate, ordersRoutes);

export default app;