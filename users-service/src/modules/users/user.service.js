import pool from "../../config/db.js";
import User from "./user.model.js";
import UserDBValidator from "../../shared/db.validator/user.db.validator.js";
import UserSkill from "../user_skills/user_skill.model.js";

const SKILLS_SERVICE = "http://skills-service:3002";


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

    static async getSkillsByUserId(userId) {
        const user = await User.getById(userId);

        if (!user) {
            return {
                message: "User not found",
                status: 404,
                data: null
            };
        }

        const relations = await UserSkill.getByUserId(userId);

        if (!relations || relations.length === 0) {
            return {
                message: "User has no assigned skills",
                status: 200,
                data: []
            };
        }

        const enrichedRelations = await Promise.all(
            relations.map(async (relation) => {
                try {
                    const skillRes = await fetch(
                        `${SKILLS_SERVICE}/skills/${relation.skill_id}`
                    );

                    if (!skillRes.ok) {
                        return {
                            ...relation,
                            skill_name: null
                        };
                    }

                    const skillData = await skillRes.json();

                    return {
                        ...relation,
                        skill_name: skillData.data.name
                    };
                } catch {
                    return {
                        ...relation,
                        skill_name: null
                    };
                }
            })
        );

        return {
            message: "User skills retrieved successfully",
            status: 200,
            data: enrichedRelations
        };
    }
}