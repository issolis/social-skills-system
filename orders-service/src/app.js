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