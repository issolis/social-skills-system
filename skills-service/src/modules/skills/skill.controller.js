import SkillService from "./skill.service.js";

export default class SkillController {

    static async getAll(req, res) {
        try {
            const skills = await SkillService.getAll();

            return res.status(200).json({
                status: "success",
                message: "Skills retrieved successfully",
                data: skills
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
            const skill = await SkillService.getById(Number(id));

            return res.status(200).json({
                status: "success",
                message: "Skill retrieved successfully",
                data: skill
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
            const createdSkill = await SkillService.create(req.body);

            return res.status(201).json({
                status: "success",
                message: "Skill created successfully",
                data: createdSkill
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                status: "error",
                message: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const updatedSkill = await SkillService.update(Number(id), req.body);

            return res.status(200).json({
                status: "success",
                message: "Skill updated successfully",
                data: updatedSkill
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
            await SkillService.delete(Number(id));

            return res.status(200).json({
                status: "success",
                message: "Skill deleted successfully"
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                status: "error",
                message: error.message
            });
        }
    }

    static async decreasePoints(req, res) {
        try {
            const { id } = req.params;
            const { points } = req.body;

            const updatedSkill = await SkillService.decreasePoints(
                Number(id),
                Number(points)
            );

            return res.status(200).json({
                status: "success",
                message: "Points decreased successfully",
                data: updatedSkill
            });

        } catch (error) {
            return res.status(error.status || 500).json({
                status: "error",
                message: error.message
            });
        }
    }
    static async increasePoints(req, res) {
        try {
            const { id } = req.params;
            const { points } = req.body;

            const updatedSkill = await SkillService.increasePoints(
                Number(id),
                Number(points)
            );

            return res.status(200).json({
                status: "success",
                message: "Points increased successfully",
                data: updatedSkill
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                status: "error",
                message: error.message
            });
        }
    }
}