// Config Database: Supports MariaDB (Local) & Supabase PostgreSQL (Vercel / Production)
require("dotenv").config();

const isVercelOrSupabase = Boolean(
  process.env.VERCEL ||
  process.env.SUPABASE_DB_URL ||
  process.env.DATABASE_URL ||
  process.env.USE_SUPABASE === "true"
);

let connect;

if (isVercelOrSupabase) {
  // Use Supabase PostgreSQL via 'pg'
  const { Pool } = require("pg");

  const connectionString =
    process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

  const pgPool = new Pool(
    connectionString
      ? {
          connectionString,
          ssl: { rejectUnauthorized: false },
          max: 5,
        }
      : {
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT || 5432),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME || "postgres",
          ssl: { rejectUnauthorized: false },
          max: 5,
        }
  );

  /**
   * Helper to convert MariaDB '?' placeholders into PostgreSQL '$1, $2, ...' placeholders.
   * Also handles array parameters for `IN (?)`.
   */
  function formatPgQuery(sql, params = []) {
    if (!params || params.length === 0) {
      return { pgSql: sql, pgParams: [] };
    }

    let paramIndex = 1;
    const pgParams = [];
    let pIdx = 0;

    const pgSql = sql.replace(/\?/g, () => {
      if (pIdx >= params.length) {
        return "?";
      }
      const val = params[pIdx++];
      if (Array.isArray(val)) {
        if (val.length === 0) {
          return "NULL";
        }
        const placeholders = val.map((item) => {
          pgParams.push(item);
          return `$${paramIndex++}`;
        });
        return `${placeholders.join(", ")}`;
      } else {
        pgParams.push(val);
        return `$${paramIndex++}`;
      }
    });

    return { pgSql, pgParams };
  }

  // Wrapper to make 'pg' client emulate MariaDB query & transaction response format
  connect = {
    isSupabase: true,
    async query(sql, params = []) {
      const { pgSql, pgParams } = formatPgQuery(sql, params);
      const res = await pgPool.query(pgSql, pgParams);
      const rows = res.rows || [];
      rows.affectedRows = res.rowCount || 0;
      return rows;
    },
    async getConnection() {
      const client = await pgPool.connect();
      return {
        beginTransaction: () => client.query("BEGIN"),
        commit: () => client.query("COMMIT"),
        rollback: () => client.query("ROLLBACK"),
        release: () => client.release(),
        query: async (sql, params = []) => {
          const { pgSql, pgParams } = formatPgQuery(sql, params);
          const res = await client.query(pgSql, pgParams);
          const rows = res.rows || [];
          rows.affectedRows = res.rowCount || 0;
          return rows;
        },
      };
    },
    end: () => pgPool.end(),
  };
} else {
  // Use MariaDB for local development
  const maria_db = require("mariadb");

  connect = maria_db.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5,
  });
}

module.exports = connect;