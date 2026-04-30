import pool from "../../config/db.js";

export default class User {
    static async getAll(client = pool) {
        const result = await client.query(`
            SELECT
                id,
                username,
                fname,
                lname
            FROM users
            ORDER BY id
        `);

        return result.rows;
    }

    static async getById(id, client = pool) {
        const result = await client.query(`
            SELECT
                id,
                username,
                fname,
                lname
            FROM users
            WHERE id = $1
        `, [id]);

        return result.rows[0] || null;
    }

    static async create(data, client = pool) {
        const { username, fname, lname, passwordHash, role_id } = data;

        const result = await client.query(`
        INSERT INTO users (
            username,
            fname,
            lname, 
            password_hash, 
            role_id
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            id,
            username,
            fname,
            lname,
            role_id
    `, [username, fname, lname, passwordHash, role_id]);

        return result.rows[0];
    }

    static async update(id, data, client = pool) {
        const { username, fname, lname } = data;

        const result = await client.query(`
            UPDATE users
            SET
                username = $1,
                fname = $2,
                lname = $3
            WHERE id = $4
            RETURNING
                id,
                username,
                fname,
                lname
        `, [username, fname, lname, id]);

        return result.rows[0] || null;
    }

    static async delete(id, client = pool) {
        const result = await client.query(`
            DELETE FROM users
            WHERE id = $1
            RETURNING
                id,
                username,
                fname,
                lname
        `, [id]);

        return result.rows[0] || null;
    }
}