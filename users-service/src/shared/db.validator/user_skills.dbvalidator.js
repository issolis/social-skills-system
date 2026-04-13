import pool from "../../config/db.js";

export default class SkillDBValidator {
    static async existsById(id, client = pool) {
        const result = await client.query(`
            SELECT *
            FROM skills
            WHERE id = $1
        `, [id]);

        return result.rowCount > 0;
    }

    static async existsByIds(ids, client = pool) {
        const result = await client.query(`
            SELECT id
            FROM skills
            WHERE id = ANY($1)
        `, [ids]);

        return result.rows.map(row => row.id);
    }
}