import  pool  from "../../config/db.js";

export default class OrderModel {

    static async getAll(client = pool) {
        const result = await client.query(`
            SELECT *
            FROM orders
            ORDER BY id
        `);

        return result.rows;
    }

    static async getById(id, client = pool) {
        const result = await client.query(`
            SELECT *
            FROM orders
            WHERE id = $1
        `, [id]);

        return result.rows[0];
    }

    static async create(data, client = pool) {
        const { user_id, skill_id, pts_assigned, status } = data;

        const result = await client.query(`
            INSERT INTO orders (user_id, skill_id, pts_assigned, status)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [user_id, skill_id, pts_assigned, status]);

        return result.rows[0];
    }

    static async updateStatus(id, status, client = pool) {
        const result = await client.query(`
            UPDATE orders
            SET status = $1
            WHERE id = $2
            RETURNING *
        `, [status, id]);

        return result.rows[0];
    }

    static async delete(id, client = pool) {
        const result = await client.query(`
            DELETE FROM orders
            WHERE id = $1
            RETURNING *
        `, [id]);

        return result.rows[0];
    }

    static async existsById(id, client = pool) {
        const result = await client.query(`
            SELECT 1 FROM orders WHERE id = $1
        `, [id]);

        return result.rowCount > 0;
    }
}
