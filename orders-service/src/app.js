import express from "express";
import ordersRoutes from "./modules/orders/order.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Orders service is running"
    });
});

app.use("/orders", ordersRoutes);

export default app;