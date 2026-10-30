const { v4 } = require("uuid");
const connect = require("../config/database");
const upload = require("../middlewares/upload.middleware");

const table_name = "products";

async function findById(id) {
    const rows = await connect.query(`SELECT * FROM ${table_name} WHERE id = ?`, [
        id,
    ]);

    return rows[0] || null;
}

async function create({ code, name, category_id, supplier_id, price, stock }, images = []) {
    const id = v4();
    let conn;
    try {
        conn = await connect.getConnection();
        await conn.beginTransaction();

        await conn.query(
            `INSERT INTO ${table_name}
        (id, code, name, category_id, supplier_id, price, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, code, name, category_id, supplier_id ?? null, price, stock],
        );

        for (const image of images) {
            await conn.query(
                `INSERT INTO product_images (id, name, product_id) VALUES (?, ?, ?)`,
                [v4(), image.name, id],
            );
        }

        await conn.commit();
    } catch (error) {
        console.error('Error creating product:', error);
        if (conn) {
            await conn.rollback();
        }
        throw error;
    } finally {
        if (conn) {
            conn.release();
        }
    }

    return findById(id);
}

async function update(id, data, images = []) {
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

    let deleteImageIds = [];
    const rawDeleteImageIds = data.delete_image_ids;

    if (rawDeleteImageIds) {
        if (Array.isArray(rawDeleteImageIds)) {
            deleteImageIds = rawDeleteImageIds;
        } else if (typeof rawDeleteImageIds === 'string') {
            const parsed = JSON.parse(rawDeleteImageIds);
            if (Array.isArray(parsed)) {
                deleteImageIds = parsed;
            } else {
                deleteImageIds = [parsed];
            }
        }
    }

    if (fields.length === 0 && images.length === 0 && deleteImageIds.length === 0) {
        const error = new Error("Minimal satu field, image baru, atau delete image id harus diisi");
        error.status = 400;
        throw error;
    }

    let conn;
    let imagesToDelete = [];

    try {
        conn = await connect.getConnection();
        await conn.beginTransaction();

        if (fields.length > 0) {
            await conn.query(
                `UPDATE ${table_name} SET ${fields.join(", ")} WHERE id = ?`,
                [...values, id],
            );
        }

        if (deleteImageIds.length > 0) { // ada yang mau di takeout
            imagesToDelete = await conn.query(
                `SELECT id, name FROM product_images WHERE id IN (?) AND product_id = ?`,
                [deleteImageIds, id]
            );
        }

        if (imagesToDelete.length > 0) {
            const idsRemove = imagesToDelete.map(img => img.id)
            await conn.query(
                `DELETE FROM product_images WHERE id IN (?) AND product_id = ?`,
                [idsRemove, id]
            );
        }

        for (const image of images) {
            await conn.query(
                `INSERT INTO product_images (id, name, product_id) VALUES (?, ?, ?)`,
                [v4(), image.name, id],
            );
        }

        conn.commit();

        for (const oldImage of imagesToDelete) {
            if (oldImage.name) {
                const filePath = path.join("uploads", oldImage.name);
                if (fs.existingSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        }
    } catch (error) {
        if (conn) {
            await conn.rollback();
        }
    } finally {
        if (conn) {
            conn.release();
        }
    }

    values.push(id);

    return findById(id);
}

async function remove(id) {
    const result = await connect.query(`DELETE FROM ${table_name} WHERE id = ?`, [
        id,
    ]);
    let conn;
    try {
        conn = await connect.getConnection();
        await conn.beginTransaction();
        const images = await conn.query(
            `SELECT name FROM product_images WHERE product_id = ?`,
            [id]
        );

        await conn.query(
            `DELETE FROM product_images WHERE product_id = ?`,
            [id]
        );

        const result = await conn.query(`DELETE FROM ${table_name} WHERE id = ?`, [
            id,
        ]);

        if (!result) {
            await conn.rollback();
            return false;
        }

        await conn.commit();
        for (const image of images) {
            if (image.name) {
                const filePath = path.join("uploads", image.name);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        }
    } catch (error) {
        if (conn) await conn.rollback();
        throw error;
    } finally {
        if (conn) conn.release();
    }

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
