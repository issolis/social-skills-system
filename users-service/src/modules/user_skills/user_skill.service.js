import UserSkill from "./user_skill.model.js";

export default class UserSkillService {

    static async getByUserId(user_id) {
        return await UserSkill.getByUserId(user_id);
    }

    static async getByIds(user_id, skill_id) {
        const relation = await UserSkill.getByIds(user_id, skill_id);

        if (!relation) {
            const error = new Error("User skill not found");
            error.status = 404;
            throw error;
        }

        return relation;
    }

    static async create(data) {
        const { user_id, skill_id } = data;

        const existing = await UserSkill.getByIds(user_id, skill_id);

        if (existing) {
            const error = new Error("User skill already exists");
            error.status = 409;
            throw error;
        }

        return await UserSkill.create(data);
    }

    static async addExperience(user_id, skill_id, amount) {
        const existing = await UserSkill.getByIds(user_id, skill_id);

        if (!existing) {
            return await UserSkill.create({
                user_id,
                skill_id,
                user_exp: amount
            });
        }

        return await UserSkill.increase(user_id, skill_id, amount);
    }

    static async delete(user_id, skill_id) {
        const deleted = await UserSkill.delete(user_id, skill_id);

        if (!deleted) {
            const error = new Error("User skill not found");
            error.status = 404;
            throw error;
        }

        return deleted;
    }
    static async decreaseExperience(user_id, skill_id, amount) {
        const existing = await UserSkill.getByIds(user_id, skill_id);

        if (!existing) {
            const error = new Error("User skill not found");
            error.status = 404;
            throw error;
        }

        const updated = await UserSkill.decrease(user_id, skill_id, amount);

        if (updated.user_exp === 0) {
            await UserSkill.delete(user_id, skill_id);
            return null;
        }

        return updated;
    }
}