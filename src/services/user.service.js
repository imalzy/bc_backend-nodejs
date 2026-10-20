const { v4 } = require('uuid')
const bcrypt = require('bcrypt')

const connect = require('../config/database');

const table_name = 'users';

async function findAll() {
    return connect.query(`SELECT * FROM ${table_name} ORDER BY created_at DESC`)
};

async function findById(id) {
    return connect.query(`SELECT * FROM ${table_name} WHERE id = ?`, [id])
}

async function create({ name, email, password }) {
    const uuid = v4();
    const salt = Number(process.env.SALT_ROUNDS);

    const hashed_password = await bcrypt.hash(password, salt);

    await connect.query(`INSERT INTO ${table_name} (id, name, email, password) VALUES (?, ?, ?, ?)`, [uuid, name, email, hashed_password])

    return findById(uuid);
}

async function update(id, data) {
    const existUser = await findById(id);

    if (!existUser) return null;

    const fields = []
    const values = []

    if (data.name !== undefined) {
        fields.push('name = ?');
        values.push(data.name);
    }

    if (data.email !== undefined) {
        fields.push('email = ?');
        values.push(data.email);
    }

    if (fields.length === 0) {
        const error = new Error("Minimal satu field harus diisi");
        error.status = 400;
        throw error;
    }

    values.push(id);
    const sql = `UPDATE ${table_name} SET ${fields.join(', ')} WHERE id = ?`;

    await connect.query(sql, values);

    return findById(id)
}

async function remove(id) {
    const result = await connect.query(`DELETE FROM ${table_name} WHERE id = ?`, [id]);
    return result.affectedRows > 0;;
}

module.exports = {
    findAll, findById, create, update, remove
}