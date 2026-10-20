const { v4 } = require("uuid");
const connect = require("../config/database");

const table_name = "products";

async function findById(id) {
    const rows = await connect.query(`SELECT * FROM ${table_name} WHERE id = ?`, [
        id,
    ]);

    return rows[0] || null;
}

async function create({ code, name, category_id, supplier_id, price, stock }) {
    const id = v4();

    await connect.query(
        `INSERT INTO ${table_name}
        (id, code, name, category_id, supplier_id, price, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, code, name, category_id, supplier_id ?? null, price, stock],
    );

    return findById(id);
}

async function update(id, data) {
    const existing = await findById(id);

    if (!existing) return null;

    const allowedFields = [
        "code",
        "name",
        "category_id",
        "supplier_id",
        "price",
        "stock",
    ];

    const fields = [];
    const values = [];

    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            fields.push(`${field} = ?`);
            values.push(data[field]);
        }
    }

    if (fields.length === 0) {
        const error = new Error("Minimal satu field harus diisi");
        error.status = 400;
        throw error;
    }

    values.push(id);

    await connect.query(
        `UPDATE ${table_name}
         SET ${fields.join(", ")}
         WHERE id = ?`,
        values,
    );

    return findById(id);
}

async function remove(id) {
    const result = await connect.query(`DELETE FROM ${table_name} WHERE id = ?`, [
        id,
    ]);

    return result.affectedRows > 0;
}

//pagenation
async function findAll(
    page = 1,
    limit = 10,
    search = "",
    category_id = null,
    supplier_id = null,
) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    // 1. Fetch total count
    let count_sql = `SELECT COUNT(*) as total FROM ${table_name} p`;

    let query = `SELECT 
                    p.id, 
                    p.code,
                    p.name, 
                    c.name as category_name, 
                    s.name as supplier_name, 
                    p.price, 
                    p.stock, 
                    p.created_at, 
                    p.updated_at 
                    FROM ${table_name} p 
                    LEFT JOIN category c ON p.category_id = c.id 
                    LEFT JOIN suppliers s ON p.supplier_id  = s.id`;

    let where_clouses = [];
    let params = [];
    if (search && search.trim().length > 0) {
        where_clouses.push(`(p.code LIKE ?) OR p.name LIKE ?`)
        const search_pattern = `%${search.trim()}%`
        params.push(search_pattern, search_pattern)
    }

    if (category_id) {
        where_clouses.push(`p.category_id = ?`)
        params.push(category_id)
    }

    if (supplier_id) {
        where_clouses.push(`p.supplier_id = ?`)
        params.push(supplier_id)
    }

    if (where_clouses.length > 0) {
        let where_sql = ` WHERE ${where_clouses.join(" AND ")}`
        count_sql += where_sql;
        query += where_sql;
    }

    const count_result = await connect.query(count_sql, params);
    const total = Number(count_result[0]?.total || 0);

    query += ` ORDER BY P.created_at DESC LIMIT ? OFFSET ?`

    console.log('query', query);
    console.log('count_sql', count_sql);


    // 2. Fetch paginated data
    const rows = await connect.query(
        query,
        [...params, limitNum, offset],
    );

    // 3. Return structured response
    return {
        success: true,
        message: "Success",
        data: rows,
        meta: {
            page: pageNum,
            limit: limitNum,
            total: total,
        },
    };
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
};
