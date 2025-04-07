// import dotenv from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// dotenv.config()

export default defineConfig({
  out: './lib/drizzle',
  schema: './lib/db/schema.js',
  dialect: 'mysql',
  dbCredentials: {
    host: 'localhost',
    user: 'root',
    password: 'rootpassword',
    database: 'mydatabase',
  },
})
