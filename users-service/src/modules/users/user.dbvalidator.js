import pool from "../../config/db.js";

export default class UserDBValidator {
    static async existsById(id, client = pool) {
        const result = await client.query(`
            SELECT 1
            FROM users
            WHERE id = $1
        `, [id]);

        return result.rowCount > 0;
    }

    static async existsByUsername(username, client = pool) {
        const result = await client.query(`
            SELECT 1
            FROM users
            WHERE username = $1
        `, [username]);

        return result.rowCount > 0;
    }
    static async existsByUsernameExcludingId(username, id, client = pool) {
        const result = await client.query(`
        SELECT 1
        FROM users
        WHERE username = $1
          AND id <> $2
    `, [username, id]);

        return result.rowCount > 0;
    }
}