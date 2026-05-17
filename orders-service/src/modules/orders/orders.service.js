import OrderModel from "./order.model.js";
import { getServiceToken } from "../../config/serviceAuth.js";
import { publishOrderCreated } from "../../events/order.publisher.js"
const USERS_SERVICE = process.env.USERS_SERVICE_URL || "http://localhost:3001";
const SKILLS_SERVICE = process.env.SKILLS_SERVICE_URL || "http://localhost:3002";

async function authHeaders(extra = {}) {
    const token = await getServiceToken();
    return {
        "Authorization": `Bearer ${token}`,
        ...extra
    };
}

export default class OrderService {

    static async getAll() {
        return await OrderModel.getAll();
    }

    static async getById(id) {
        const order = await OrderModel.getById(id);

        if (!order) {
            const error = new Error("Order not found");
            error.status = 404;
            throw error;
        }

        return order;
    }

    static async create(data) {
        const { user_id, skill_id, pts_assigned } = data;
 
        try {
            const newOrder = await OrderModel.create({
                user_id,
                skill_id,
                pts_assigned,
                status: "pending"
            });
 
            await publishOrderCreated(newOrder);
 
            return newOrder;
 
        } catch (err) {
            if (err.status) throw err; // already a handled error, re-throw as-is
 
            const error = new Error("Failed to create order. Please try again later.");
            error.status = 500;
            throw error;
        }
    }

    static async updateStatus(id, status) {
        const exists = await OrderModel.existsById(id);

        if (!exists) {
            const error = new Error("Order not found");
            error.status = 404;
            throw error;
        }

        return await OrderModel.updateStatus(id, status);
    }


    static async delete(id) {
        const exists = await OrderModel.existsById(id);

        if (!exists) {
            const error = new Error("Order not found");
            error.status = 404;
            throw error;
        }

        return await OrderModel.delete(id);
    }
}