import pool from "../../config/db.js";
import User from "./user.model.js";
import UserDBValidator from "./user.dbvalidator.js";

export default class UserService {
    static async getAll(client = pool) {
        return await User.getAll(client);
    }

    static async getById(id, client = pool) {
        const user = await User.getById(id, client);

        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        return user;
    }

    static async create(data, client = pool) {
        const usernameExists = await UserDBValidator.existsByUsername(
            data.username,
            client
        );

        if (usernameExists) {
            const error = new Error("Username already exists");
            error.status = 409;
            throw error;
        }

        return await User.create(data, client);
    }

    static async update(id, data, client = pool) {
        const userExists = await UserDBValidator.existsById(id, client);

        if (!userExists) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const usernameExists =
            await UserDBValidator.existsByUsernameExcludingId(
                data.username,
                id,
                client
            );

        if (usernameExists) {
            const error = new Error("Username already exists");
            error.status = 409;
            throw error;
        }

        return await User.update(id, data, client);
    }

    static async delete(id, client = pool) {
        const userExists = await UserDBValidator.existsById(id, client);

        if (!userExists) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        return await User.delete(id, client);
    }
}