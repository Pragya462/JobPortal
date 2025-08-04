import { sql } from '../database/db.js'
import cloudinary from '../utils/cloudinary.js';
import getDataUri from '../utils/datauri.js';

export const registerCompany = async (req, res) => {
    try{
        const { companyName, description, website, location, logo } = req.body;
        if(!companyName)
        {
            return res.status(400).json({success: false, message: "Company name is required"});
        }

        const company = await sql `SELECT * FROM companies WHERE name = ${companyName}`;

        if(company.length>0)
            return res.status(400).json({success: false, message: "Company already exists"});

        const newCompany = await sql `INSERT INTO companies 
        (name, description, website, location, logo, user_id) 
        VALUES (${companyName}, ${description}, ${website}, ${location}, ${logo}, ${req.user.id})
        RETURNING *`;

        return res.status(201).json({success: true, message: "Company created successfully", company: newCompany[0]});
    }
    catch(error)
    {
        console.log("Error in registerCompany function ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const getCompany = async (req, res) => {
    try{
        const userId = req.user.id;
        const companies = await sql `SELECT * FROM companies WHERE user_id = ${userId}`;

        if(companies.length==0)
            return res.status(200).json({success: true, message: "No companies found", companies});

        return res.status(200).json({success: true, message: "Companies found successfully", companies: companies});
    }
    catch(error)
    {
        console.log("Error in getCompany function ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const getCompanyById = async (req, res) => {
    try{
        const Id = req.params.id;
        const company = await sql `SELECT * FROM companies WHERE id = ${Id}`;

        if(company.length==0)
            return res.status(404).json({success: false, message: "Company not found"});

        return res.status(200).json({success: true, message: "Companies found successfully", company: company[0]});
    }
    catch(error)
    {
        console.log("Error in getCompanyById function ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const updateCompany = async (req, res) => {
    try{
        const { companyName, description, website, location } = req.body;

        const id = req.params.id;

        let logo=null;
        if(req.file)
        {
            const fileuri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileuri.content);
            logo= cloudResponse.secure_url;
        }

        const existing = await sql `SELECT * FROM profiles where user_id=${id}`;

        const updatedCompany = await sql `UPDATE companies 
        SET name = ${companyName}, 
        description = ${description}, 
        website = ${website},
        location = ${location},
        logo = ${logo?? existing.logo}
        WHERE id = ${id}
        RETURNING *`;

        if(updatedCompany.length==0)
        {
            return res.status(404).json({success: false, message: "Company not found"});
        }

        return res.status(200).json({success: true, message: "Companies updated successfully", company: updatedCompany[0]});
    }
    catch(error)
    {
        console.log("Error in updateComapny function ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
