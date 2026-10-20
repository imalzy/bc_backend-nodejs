
const connect = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const table_name = 'suppliers';

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

const findById = async (id) => {
  const result = await connect.query(
    `SELECT * FROM ${table_name} WHERE id = ?`,
    [id]
  );
  return result[0];
};

const create = async (data) => {
  const id = uuidv4();
  const { name, phone, email, address } = data;

  await connect.query(
    `INSERT INTO ${table_name}
      (id, name, phone, email, address)
     VALUES (?, ?, ?, ?, ?)`,
    [id, name, phone, email, address]
  );

  return await findById(id);
};

const update = async (id, data) => {
  const fields = ['name', 'phone', 'email', 'address'];
  const updates = [];
  const values = [];

  for (const field of fields) {
    if (data[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(data[field]);
    }
  }

  if (updates.length === 0) {
    return await findById(id);
  }

  values.push(id);

  await connect.query(
    `UPDATE ${table_name}
     SET ${updates.join(', ')}
     WHERE id = ?`,
    values
  );

  return await findById(id);
};

const remove = async (id) => {
  const result = await connect.query(
    `DELETE FROM ${table_name} WHERE id = ?`,
    [id]
  );
  return result.affectedRows > 0;
};


async function findAll(page = 1, limit = 10) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    const countResult = await connect.query(
        `SELECT COUNT(*) as total FROM suppliers`
    );

    const total = Number(countResult[0]?.total || 0);

    const rows = await connect.query(
        `SELECT * FROM suppliers
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




module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
