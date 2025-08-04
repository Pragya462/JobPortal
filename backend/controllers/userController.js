import { sql } from '../database/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';

dotenv.config();

export const register = async (req, res) => {
    
    const { fullName, email, phoneNumber, password, role } = req.body;
    
    if(!fullName || !email || !phoneNumber || !password || !role){
        return res.status(400).json({ success: false, message: "Please fill in all fields" });
    }

    let image=null;
    if(req.file)
    {
        const fileuri = getDataUri(req.file);
        const cloudResponse = await cloudinary.uploader.upload(fileuri.content);
        image=cloudResponse.secure_url;
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

        const profile = await sql`
            INSERT INTO profiles (user_id, profile_photo)
            VALUES (${newUser[0].id}, ${image ?? ''})
            RETURNING *
        `;

        const token = jwt.sign({ userId: newUser[0].id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res.status(201).cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "Lax",
        }).json({ success: true, user: {...newUser[0], ...profile[0]}, message: "User created successfully" });
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
        const user = await sql `
        SELECT u.id, 
        u.fullname, 
        u.email,
        u.phoneNumber,
        u.password,
        u.role,
        p.bio, 
        p.skills,
        p.profile_photo,
        p.resume,
        p.resume_original_name
        FROM users u 
        LEFT JOIN profiles p
        ON u.id = p.user_id
        WHERE u.email=${email}`;

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

        const file = req.file;
        let resumeUrl=null;
        let resumeName=null;

        if(file)
        {
            const fileuri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileuri.content);
            resumeUrl= cloudResponse.secure_url;
            resumeName= file.originalname;
        }

        const skillsArray = skills.split(",").map((skill) => skill.trim());

        const updatedUser = await sql`UPDATE users
        SET fullname = ${fullName}, 
        email = ${email}, 
        phonenumber = ${phoneNumber}
        WHERE id = ${userId}
        RETURNING fullname, email, phonenumber
        `;

        const profile = await sql`SELECT * FROM profiles WHERE user_id = ${userId}`;

        const updatedProfile = await sql`
            UPDATE profiles SET bio=${bio}, skills=${skillsArray}, 
            resume=${resumeUrl?? profile[0].resume}, 
            resume_original_name=${resumeName?? profile[0].resume_original_name}
            WHERE user_id = ${userId}
            RETURNING bio, skills, resume, resume_original_name` ;

        return res.status(200).json({success: true, user: {...updatedUser[0], ...updatedProfile[0]}, message: "Profile updated successfully"});
    }
    catch(error)
    {
        console.log("Error in updateProfile function ", error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}