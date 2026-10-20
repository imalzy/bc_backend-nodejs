const { v4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const connect = require("../config/database");

 const JWT_SECRET = "123445";
 const JWT_EXPIRE_IN = "15m";

const table_name = "users";
// offset
// page 2
// 2 - 1 = 1 * 10 = 10
async function findAll(page = 1, limit = 10) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    // 1. Fetch total count and convert BigInt to Number
    const countResult = await connect.query(
        `SELECT COUNT(*) as total FROM ${table_name}`,
    );
    const total = Number(countResult[0]?.total || 0);

    // 2. Fetch paginated data
    const rows = await connect.query(
        `SELECT id, name, email, created_at, updated_at FROM ${table_name} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [limitNum, offset],
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

async function findById(id) {
    return connect.query(`SELECT * FROM ${table_name} WHERE id = ?`, [id]);
}

async function create({ name, email, password }) {
    const uuid = v4();
    const salt = Number(process.env.SALT_ROUNDS);

    const hashed_password = await bcrypt.hash(password, salt);

    await connect.query(
        `INSERT INTO ${table_name} (id, name, email, password) VALUES (?, ?, ?, ?)`,
        [uuid, name, email, hashed_password],
    );

    return findById(uuid);
}

async function update(id, data) {
    const existUser = await findById(id);

    if (!existUser) return null;

    const fields = [];
    const values = [];

    if (data.name !== undefined) {
        fields.push("name = ?");
        values.push(data.name);
    }

    if (data.email !== undefined) {
        fields.push("email = ?");
        values.push(data.email);
    }

    if (fields.length === 0) {
        const error = new Error("Minimal satu field harus diisi");
        error.status = 400;
        throw error;
    }

    values.push(id);
    const sql = `UPDATE ${table_name} SET ${fields.join(", ")} WHERE id = ?`;

    await connect.query(sql, [data, id]);

    return findById(id);
}

async function remove(id) {
    const result = await connect.query(`DELETE FROM ${table_name} WHERE id = ?`, [
        id,
    ]);
    return result.affectedRows > 0;
}

async function login({email, password}) {
    const rows = await connect.query(
        `SELECT id, name, email, password FROM ${table_name} WHERE email = ? LIMIT 1`,
        [email],
    );

    const user = rows[0];

    if (!user) {
        const error = new Error("User not found");
        error.status = 401;
        throw error;
    }
    const password_hash = user.password;
    const password_validate = await bcrypt.compare(password, password_hash);

    if (!password_validate) {
        const error = new Error("User password salah");
        error.status = 401;
        throw error;
    }

    const access_token = jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        JWT_SECRET,
        {
            algorithm: "HS256",
            expiresIn: JWT_EXPIRE_IN,
        },
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
            update_at: user.updated_at,
        },
        token: {
            access_token,
            expires_in: JWT_EXPIRE_IN,
            token_type: "Bearer",
        },
    };
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
    login
};
