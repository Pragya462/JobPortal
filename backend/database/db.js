import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import { config } from '../utils/loadConfig.js';

dotenv.config();

const { PGUSER, PGPASSWORD, PGHOST, PGDATABASE } = process.env;

export const sql = neon(
    `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&channel_binding=require`
)


export async function initDB(){
    try{
        await sql `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            fullName TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phoneNumber BIGINT NOT NULL,
            password TEXT NOT NULL,
            role TEXT CHECK (role IN ('student', 'recruiter')) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )`;

        await sql `CREATE TABLE IF NOT EXISTS companies (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            website TEXT,
            location TEXT,
            logo TEXT,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`;

        await sql `CREATE TABLE IF NOT EXISTS profiles (
            id SERIAL PRIMARY KEY,
            user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
            bio TEXT,
            skills TEXT[],
            resume TEXT,
            resume_original_name TEXT,
            company_id INTEGER REFERENCES companies(id),
            profile_photo TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`;

        await sql `CREATE TABLE IF NOT EXISTS jobs (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            requirements TEXT[],
            salary INTEGER NOT NULL,
            location TEXT NOT NULL,
            job_type TEXT NOT NULL,
            position TEXT NOT NULL,
            company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
            created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`;

        await sql `CREATE TABLE IF NOT EXISTS applications (
            id SERIAL PRIMARY KEY,
            job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
            applicant_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`;
        
        console.log("Database Initialised");
    }
    catch(error)
    {
        console.log("Error in initializing database: ",error);
    }
    
}