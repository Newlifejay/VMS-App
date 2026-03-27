import sql from "mssql";

let pool = null;

export async function getDb() {
  // ✅ ADD THIS BLOCK HERE
  if (!process.env.DB_SERVER) {
    throw new Error("DB_SERVER is not set");
  }

  if (pool) return pool;

  pool = await sql.connect({
    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    options: {
      encrypt: true,
      trustServerCertificate: false,
    },
  });

  return pool;
}

export default getDb;