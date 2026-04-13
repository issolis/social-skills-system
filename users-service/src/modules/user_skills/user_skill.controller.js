import UserSkillService from "./user_skill.service.js";

export default class UserSkillController {

    static async getByUserId(req, res) {
        try {
            const { user_id } = req.params;
            const data = await UserSkillService.getByUserId(Number(user_id));

            return res.status(200).json({
                status: "success",
                message: "User skills retrieved successfully",
                data
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                status: "error",
                message: error.message
            });
        }
    }

    static async getByIds(req, res) {
        try {
            const { user_id, skill_id } = req.params;
            const data = await UserSkillService.getByIds(
                Number(user_id),
                Number(skill_id)
            );

            return res.status(200).json({
                status: "success",
                message: "User skill retrieved successfully",
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
            const data = await UserSkillService.create(req.body);

            return res.status(201).json({
                status: "success",
                message: "User skill created successfully",
                data
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                status: "error",
                message: error.message
            });
        }
    }

    static async addExperience(req, res) {
        try {
            const { user_id, skill_id } = req.params;
            const { amount } = req.body;

            const data = await UserSkillService.addExperience(
                Number(user_id),
                Number(skill_id),
                Number(amount)
            );

            return res.status(200).json({
                status: "success",
                message: "Experience added successfully",
                data
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                status: "error",
                message: error.message
            });
        }
    }

    static async decreaseExperience(req, res) {
        try {
            const { user_id, skill_id } = req.params;
            const { amount } = req.body;

            const data = await UserSkillService.decreaseExperience(
                Number(user_id),
                Number(skill_id),
                Number(amount)
            );

            return res.status(200).json({
                status: "success",
                message: data
                    ? "Experience decreased successfully"
                    : "Experience decreased successfully and user skill was removed",
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
            const { user_id, skill_id } = req.params;

            await UserSkillService.delete(
                Number(user_id),
                Number(skill_id)
            );

            return res.status(200).json({
                status: "success",
                message: "User skill deleted successfully"
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                status: "error",
                message: error.message
            });
        }
    }
}