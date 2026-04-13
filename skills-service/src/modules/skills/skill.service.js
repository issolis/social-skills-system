import SkillModel from "./skill.model.js";

export default class SkillService {

    static async getAll() {
        return await SkillModel.getAll();
    }

    static async getById(id) {
        const skill = await SkillModel.getById(id);

        if (!skill) {
            const error = new Error("Skill not found");
            error.status = 404;
            throw error;
        }

        return skill;
    }

    static async create(data) {
        const existing = await SkillModel.getByName(data.name);

        if (existing) {
            const error = new Error("Skill already exists");
            error.status = 400;
            throw error;
        }

        return await SkillModel.create(data);
    }

    static async update(id, data) {
        const exists = await SkillModel.existsById(id);

        if (!exists) {
            const error = new Error("Skill not found");
            error.status = 404;
            throw error;
        }

        return await SkillModel.update(id, data);
    }

    static async delete(id) {
        const exists = await SkillModel.existsById(id);

        if (!exists) {
            const error = new Error("Skill not found");
            error.status = 404;
            throw error;
        }

        return await SkillModel.delete(id);
    }

    static async decreasePoints(id, points) {
        const skill = await SkillModel.getById(id);

        if (!skill) {
            const error = new Error("Skill not found");
            error.status = 404;
            throw error;
        }

        if (points <= 0) {
            const error = new Error("Points must be greater than 0");
            error.status = 400;
            throw error;
        }

        if (skill.available_pts < points) {
            const error = new Error("Not enough available points");
            error.status = 400;
            throw error;
        }

        const newPoints = skill.available_pts - points;

        return await SkillModel.updatePoints(id, newPoints);
    }
    static async increasePoints(id, points) {
        const skill = await SkillModel.getById(id);

        if (!skill) {
            const error = new Error("Skill not found");
            error.status = 404;
            throw error;
        }

        if (points <= 0) {
            const error = new Error("Points must be greater than 0");
            error.status = 400;
            throw error;
        }

        return await SkillModel.increasePoints(id, points);
    }
}