import OrderService from "./orders.service.js";

export default class OrderController {

    static async getAll(req, res) {
        try {
            const data = await OrderService.getAll();

            return res.status(200).json({
                status: "success",
                message: "Orders retrieved successfully",
                data
            });

        } catch (error) {
            return res.status(error.status || 500).json({
                status: "error",
                message: error.message
            });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;

            const data = await OrderService.getById(Number(id));

            return res.status(200).json({
                status: "success",
                message: "Order retrieved successfully",
                data
            });

        } catch (error) {
            return res.status(error.status || 500).json({
                status: "error",
                message: error.message
            });
        }
    }

    static async create(req, res) {
        try {
            const data = await OrderService.create(req.body, req.user);

            return res.status(201).json({
                status: "success",
                message: "Order created successfully",
                data
            });

        } catch (error) {
            return res.status(error.status || 500).json({
                status: "error",
                message: error.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;

            await OrderService.delete(Number(id));

            return res.status(200).json({
                status: "success",
                message: "Order deleted successfully"
            });

        } catch (error) {
            return res.status(error.status || 500).json({
                status: "error",
                message: error.message
            });
        }
    }
}
