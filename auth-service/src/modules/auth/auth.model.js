import pool from "../../config/db.js";

export class Auth {
    static async getUserByUsername(username, client = pool) {
        const result = await client.query(
            "SELECT id, password_hash, role_id FROM users WHERE username = $1",
            [username]
        );
        return result.rows[0];
    }
}