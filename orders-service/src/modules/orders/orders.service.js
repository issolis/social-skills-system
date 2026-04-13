import OrderModel from "./order.model.js";

const USERS_SERVICE = "http://localhost:3001";
const SKILLS_SERVICE = "http://localhost:3002";

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

        const userRes = await fetch(`${USERS_SERVICE}/users/${user_id}`);
        if (!userRes.ok) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const skillRes = await fetch(`${SKILLS_SERVICE}/skills/${skill_id}`);
        if (!skillRes.ok) {
            const error = new Error("Skill not found");
            error.status = 404;
            throw error;
        }

        const skillData = await skillRes.json();

        if (skillData.data.available_pts < pts_assigned) {
            const error = new Error("Not enough available points");
            error.status = 400;
            throw error;
        }

        const decreaseRes = await fetch(
            `${SKILLS_SERVICE}/skills/${skill_id}/decrease`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ points: pts_assigned })
            }
        );

        if (!decreaseRes.ok) {
            const error = new Error("Failed to decrease skill points");
            error.status = 500;
            throw error;
        }

        return await OrderModel.create({
            user_id,
            skill_id,
            pts_assigned,
            status: "completed"
        });
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
