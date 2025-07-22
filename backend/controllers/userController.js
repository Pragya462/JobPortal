import { sql } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res) => {
    
    const { fullName, email, phoneNumber, password, role } = req.body;
    
    if(!fullName || !email || !phoneNumber || !password || !role){
        return res.status(400).json({ success: false, message: "Please fill in all fields" });
    }

    try{
        const existing = await sql `SELECT * FROM users WHERE email=${email}`
        if(existing.length>0)
        {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await sql `INSERT INTO users (fullName, email, phoneNumber, password, role)
        VALUES (${fullName}, ${email}, ${phoneNumber}, ${hashedPassword}, ${role})
        RETURNING *
        `;

        const token = jwt.sign({ userId: newUser[0].id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res.status(201).cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "Lax",
        }).json({ success: true, user: newUser[0], message: "User created successfully" });
    }
    catch(error)
    {
        console.log("Error in register funtion ",error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

export const login = async (req, res) => {
    const { email, password, role } = req.body;

    if(!email || !password || !role){
        return res.status(400).json({success: false, message: "Please fill in all fields"});
    }

    try{
        const user = await sql `SELECT * FROM users WHERE email=${email}`;

        if(user.length == 0)
        {
            return res.status(400).json({success: false, message: "User does not exist. Please register"});
        }

        const isValidPassword = await bcrypt.compare(password, user[0].password);

        if(!isValidPassword)
        {
            return res.status(400).json({success: false, message: "Invalid password"});
        }

        if(role != user[0].role)
        {
            return res.status(400).json({success: false, message: "Account does not exist with current role"});
        }

        const token = jwt.sign({ userId: user[0].id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "Lax",
        }).json(
            {success: true, user: user[0], message: "User logged in successfully"}
        );

    }
    catch(error)
    {
        console.log("Error in login function ", error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

export const logout = (req, res) => {
    try{
        res.cookie("token", "",{
            maxAge: 0,
        }).json({success: true, message: "Logged out successfully"});
    }
    catch(error)
    {
        console.log("Error in logout function ", error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

export const updateProfile = async (req, res) => {
    try{
        const userId = req.user.id;

        const { fullName, email, phoneNumber, bio, skills } = req.body;

        if(!fullName || !email || !phoneNumber || !bio || !skills)
        {
            return res.status(400).json({ success: false, message: "Please fill in all fields" });
        }

        const skillsArray = skills.split(",").map((skill) => skill.trim());

        const updatedUser = await sql`UPDATE users
        SET fullname = ${fullName}, 
        email = ${email}, 
        phonenumber = ${phoneNumber}
        WHERE id = ${userId}
        RETURNING *
        `;

        const updatedProfile = await sql `UPDATE profiles
        SET bio = ${bio},
        skills = ${skillsArray}
        WHERE user_id = ${userId}
        RETURNING *`;

        return res.status(200).json({success: true, user: {...updatedUser[0], ...updatedProfile[0]}, message: "Profile updated successfully"});
    }
    catch(error)
    {
        console.log("Error in updateProfile function ", error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}