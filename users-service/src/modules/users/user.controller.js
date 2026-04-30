import UserService from "./user.service.js";

export default class UserController {
    static async getAll(req, res) {
        try {
            const users = await UserService.getAll();

            return res.status(200).json({
                status: "success",
                message: "Users retrieved successfully",
                data: users
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
            const user = await UserService.getById(Number(id));

            return res.status(200).json({
                status: "success",
                message: "User retrieved successfully",
                data: user
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
            const createdUser = await UserService.create(req.body);

            return res.status(201).json({
                status: "success",
                message: "User created successfully",
                data: createdUser
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
            const updatedUser = await UserService.update(Number(id), req.body);

            return res.status(200).json({
                status: "success",
                message: "User updated successfully",
                data: updatedUser
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
            await UserService.delete(Number(id));

            return res.status(200).json({
                status: "success",
                message: "User deleted successfully"
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                status: "error",
                message: error.message
            });
        }
    }

    static async getSkillsByUserId(req, res) {
        try {
            const { id } = req.params;
            const token = req.headers["authorization"]?.split(" ")[1];

            const data = await UserService.getSkillsByUserId(Number(id), token);

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
}