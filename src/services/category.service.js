
const { v4 } = require('uuid');
const connect = require('../config/database');

const table_name = 'category';

async function findAll() {
    return connect.query(
        `SELECT * FROM ${table_name} ORDER BY created_at DESC`
    );
}

async function findById(id) {
    const rows = await connect.query(
        `SELECT * FROM ${table_name} WHERE id = ?`,
        [id]
    );

    return rows[0] || null;
}

async function create({ name, description }) {
    const id = v4();

    await connect.query(
        `INSERT INTO ${table_name} (id, name, description)
         VALUES (?, ?, ?)`,
        [id, name, description ?? null]
    );

    return findById(id);
}

async function update(id, data) {
    const existing = await findById(id);

    if (!existing) return null;

    const fields = [];
    const values = [];

    if (data.name !== undefined) {
        fields.push('name = ?');
        values.push(data.name);
    }

    if (data.description !== undefined) {
        fields.push('description = ?');
        values.push(data.description);
    }

    if (fields.length === 0) {
        const error = new Error('Minimal satu field harus diisi');
        error.status = 400;
        throw error;
    }

    fields.push('edited_at = CURRENT_TIMESTAMP');

    values.push(id);

    await connect.query(
        `UPDATE ${table_name}
         SET ${fields.join(', ')}
         WHERE id = ?`,
        values
    );

    return findById(id);
}

async function remove(id) {
    const result = await connect.query(
        `DELETE FROM ${table_name} WHERE id = ?`,
        [id]
    );

    return result.affectedRows > 0;
}

//pagenation
async function findAll(page = 1, limit = 10) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;
console.log({
    pageNum,
    limitNum,
    offset
})
    const countResult = await connect.query(
        `SELECT COUNT(*) as total FROM category`
    );

    const total = Number(countResult[0]?.total || 0);

    const rows = await connect.query(
        `SELECT * FROM category
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [limitNum, offset]
    );

    return {
        success: true,
        message: "Success",
        data: rows,
        meta: {
            page: pageNum,
            limit: limitNum,
            total: total
        }
    };
}


//pagenation
async function getAll(req, res, next) {
    try {
        const { page = 1, limit = 10 } = req.query;

        const result = await product_services.findAll(
            page,
            limit
        );

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};
