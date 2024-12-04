import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const db = new pg.Pool({
    user: `${process.env.POSTGRES_USER}`,
    password: `${process.env.POSTGRES_PASSWORD}`,
    host: `${process.env.POSTGRES_HOST}`,
    database: `${process.env.POSTGRES_DATABASE}`,
})
export default db;