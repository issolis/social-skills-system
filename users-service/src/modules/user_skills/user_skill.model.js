import pool from "../../config/db.js";

export default class UserSkill {
    static async getByUserId(user_id, client = pool) {
        const result = await client.query(
            `
            SELECT user_id, skill_id, user_exp
            FROM user_skill
            WHERE user_id = $1
            ORDER BY skill_id
            `,
            [user_id]
        );

        return result.rows;
    }

    static async getByIds(user_id, skill_id, client = pool) {
        const result = await client.query(
            `
            SELECT user_id, skill_id, user_exp
            FROM user_skill
            WHERE user_id = $1 AND skill_id = $2
            `,
            [user_id, skill_id]
        );

        return result.rows[0] || null;
    }

    static async create({ user_id, skill_id, user_exp }, client = pool) {
        const result = await client.query(
            `
            INSERT INTO user_skill (user_id, skill_id, user_exp)
            VALUES ($1, $2, $3)
            RETURNING user_id, skill_id, user_exp
            `,
            [user_id, skill_id, user_exp]
        );

        return result.rows[0];
    }

    static async increase(user_id, skill_id, amount, client = pool) {
        const result = await client.query(
            `
            UPDATE user_skill
            SET user_exp = user_exp + $3
            WHERE user_id = $1 AND skill_id = $2
            RETURNING user_id, skill_id, user_exp
            `,
            [user_id, skill_id, amount]
        );

        return result.rows[0] || null;
    }

    static async delete(user_id, skill_id, client = pool) {
        const result = await client.query(
            `
            DELETE FROM user_skill
            WHERE user_id = $1 AND skill_id = $2
            RETURNING *
            `,
            [user_id, skill_id]
        );

        return result.rows[0] || null;
    }

    static async decrease(user_id, skill_id, amount, client = pool) {
        const result = await client.query(
            `
        UPDATE user_skill
        SET user_exp = GREATEST(user_exp - $3, 0)
        WHERE user_id = $1 AND skill_id = $2
        RETURNING user_id, skill_id, user_exp
        `,
            [user_id, skill_id, amount]
        );

        return result.rows[0] || null;
    }
}