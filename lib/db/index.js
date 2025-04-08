import mysql from 'mysql2/promise'
import { drizzle } from 'drizzle-orm/mysql2'

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

const db = drizzle(pool)

export { db }
