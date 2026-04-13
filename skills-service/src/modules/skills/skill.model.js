import pool from "../../config/db.js";

export default class SkillModel {

    static async getAll(client = pool) {
        const result = await client.query(`
            SELECT id, name, available_pts
            FROM skills
            ORDER BY id
        `);

        return result.rows;
    }

    static async getById(id, client = pool) {
        const result = await client.query(`
            SELECT id, name, available_pts
            FROM skills
            WHERE id = $1
        `, [id]);

        return result.rows[0];
    }

    static async getByName(name, client = pool) {
        const result = await client.query(`
            SELECT id, name, available_pts
            FROM skills
            WHERE name = $1
        `, [name]);

        return result.rows[0];
    }

    static async create(data, client = pool) {
        const { name, available_pts } = data;

        const result = await client.query(`
            INSERT INTO skills (name, available_pts) 
            VALUES ($1, $2)
            RETURNING *
        `, [name, available_pts]);

        return result.rows[0];
    }

    static async update(id, data, client = pool) {
        const { name, available_pts } = data;

        const result = await client.query(`
            UPDATE skills
            SET name = $1,
                available_pts = $2
            WHERE id = $3
            RETURNING *
        `, [name, available_pts, id]);

        return result.rows[0];
    }

    static async delete(id, client = pool) {
        const result = await client.query(`
            DELETE FROM skills
            WHERE id = $1
            RETURNING *
        `, [id]);

        return result.rows[0];
    }

    static async existsById(id, client = pool) {
        const result = await client.query(`
            SELECT 1 FROM skills WHERE id = $1
        `, [id]);

        return result.rowCount > 0;
    }

    static async updatePoints(id, newPoints, client = pool) {
        const result = await client.query(`
        UPDATE skills
        SET available_pts = $1
        WHERE id = $2
        RETURNING *
    `, [newPoints, id]);

        return result.rows[0];
    }
    static async increasePoints(id, points, client = pool) {
        const result = await client.query(`
        UPDATE skills
        SET available_pts = available_pts + $1
        WHERE id = $2
        RETURNING *
    `, [points, id]);

        return result.rows[0];
    }
}