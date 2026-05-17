import OrderModel from "./order.model.js";
import { getServiceToken } from "../../config/serviceAuth.js";

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

    static async create(data, userToken) {
        const { user_id, skill_id, pts_assigned } = data;

        const headers = await authHeaders();
        const jsonHeaders = await authHeaders({ "Content-Type": "application/json" });

        let pointsDecreased = false;

        try {
            const [userRes, skillRes] = await Promise.all([
                fetch(`${USERS_SERVICE}/users/${user_id}`, { headers }),
                fetch(`${SKILLS_SERVICE}/skills/${skill_id}`, { headers })
            ]);

            if (!userRes.ok) {
                const error = new Error(userRes.status === 404 ? "User not found" : "Users service is not available");
                error.status = userRes.status === 404 ? 404 : 503;
                throw error;
            }

            if (!skillRes.ok) {
                const error = new Error(skillRes.status === 404 ? "Skill not found" : "Skills service is not available");
                error.status = skillRes.status === 404 ? 404 : 503;
                throw error;
            }

            const skillData = await skillRes.json();

            if (skillData.data.available_pts < pts_assigned) {
                const error = new Error("Not enough available points");
                error.status = 400;
                throw error;
            }

            const decreaseRes = await fetch(`${SKILLS_SERVICE}/skills/${skill_id}/decrease`, {
                method: "PATCH",
                headers: jsonHeaders,
                body: JSON.stringify({ points: pts_assigned })
            });

            if (!decreaseRes.ok) {
                const error = new Error("Failed to decrease skill points");
                error.status = decreaseRes.status >= 500 ? 503 : 400;
                throw error;
            }

            pointsDecreased = true;

            const userSkillRes = await fetch(`${USERS_SERVICE}/users/skills/${user_id}/${skill_id}/increase`, {
                method: "PATCH",
                headers: jsonHeaders,
                body: JSON.stringify({ amount: pts_assigned })
            });

            if (!userSkillRes.ok) {
                const error = new Error("Failed to assign skill experience to user");
                error.status = userSkillRes.status >= 500 ? 503 : 400;
                throw error;
            }

            const newOrder = await OrderModel.create({ user_id, skill_id, pts_assigned, status: "completed" });

            // Mock Event Broker Emission - Integracion EDA
            const authUserId = userToken?.id || user_id;
            const eventPayload = {
                event: "pedido.creado",
                data: newOrder,
                user_id: authUserId,
                issued_by: "auth-service"
            };
            console.log(`[EventBroker Mock] Emitting event pedido.creado:`, JSON.stringify(eventPayload));

            return newOrder;

        } catch (error) {
            if (pointsDecreased) {
                try {
                    await fetch(`${SKILLS_SERVICE}/skills/${skill_id}/increase`, {
                        method: "PATCH",
                        headers: jsonHeaders,
                        body: JSON.stringify({ points: pts_assigned })
                    });
                } catch (rollbackError) {
                    console.error("Rollback failed:", rollbackError.message);
                }
            }
            throw error;
        }
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