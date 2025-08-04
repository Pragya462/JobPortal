import { sql } from '../database/db.js'

//for admin to post a new job
export const postJob = async (req, res) => {
    try{
        const { title, description, requirements, salary, location, companyId, jobType, position, experienceLevel } = req.body;
        if(!title || !description || !requirements || !salary || !location || !companyId || !jobType || !position || experienceLevel === undefined)
            return res.status(400).json({success: false, message: "Please fill in all fields"});

        const userId = req.user.id;

        const require = requirements.split(',').map((e) => e.trim());
        const newJob = await sql `INSERT INTO jobs 
        (title, description, requirements, salary, location, company_id, job_type, position, experiencelevel, created_by)
        VALUES (${title}, ${description}, ${require}, ${salary}, ${location}, ${companyId}, ${jobType}, ${position}, 
        ${experienceLevel}, ${userId}) RETURNING *
        `;
        
        return res.status(201).json({success: true, message: "Job posted successfully", job: newJob[0]});
            
    }
    catch(error)
    {
        console.log("Error in postJob function", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

//for studetn to get list of all jobs
export const getAllJobs = async (req, res) => {
    try{
        const keyword = req.query.keyword || '';

        const jobs = await sql`
            SELECT jobs.*, companies.name AS company_name, companies.logo AS company_logo
            FROM jobs
            LEFT JOIN companies ON jobs.company_id = companies.id
            WHERE jobs.title ILIKE ${'%' + keyword + '%'}
               OR jobs.description ILIKE ${'%' + keyword + '%'}
            ORDER BY jobs.created_at DESC
        `;

        if(jobs.length==0)
            return res.status(200).json({success: true, message: "No jobs found", jobs});

        return res.status(200).json({success: true, jobs, message: "Jobs found successfully"});
    }
    catch(error)
    {
        console.log("Error in getAllJobs function", error);
        res.status(500).json({ sucess: false, message: "Internal Server Error" });
    }
}

//for student to get a particular job
export const getJobById = async (req, res) => {
    try{
        const jobId= req.params.id;
        const userId = req.user.id;

        const job = await sql`
            SELECT 
                j.*, 
                COUNT(a.id) AS applicant_count
            FROM jobs j
            LEFT JOIN applications a ON j.id = a.job_id
            WHERE j.id = ${jobId}
            GROUP BY j.id;
        `;

        if(job.length==0)
            return res.status(404).json({success: false, message: "Job not found"});

        const applyResult = await sql `
            SELECT * FROM applications 
            WHERE applicant_id=${userId} 
            AND job_id=${job[0].id}`;

        let isApplied = false;
        if(applyResult.length>0)
            isApplied = true;

        return res.status(200).json({success: true, job: {...job[0], isApplied}, message: "Job found successfully"});

    }
    catch(error)
    {
        console.log("Error in getJobById function", error);
        res.status(500).json({ sucess: false, message: "Internal Server Error" });
    }
}

//get all jobs posted by a particular admin
export const getJobsByAdminId = async (req, res) => {
    try{
        const adminId = req.user.id;

        const jobs = await sql `
        SELECT jobs.* , companies.name as company
        FROM jobs 
        LEFT JOIN companies 
        ON jobs.company_id=companies.id
        WHERE jobs.created_by = ${adminId}`;

        if(jobs.length==0)
            return res.status(200).json({success: true, message: "No jobs found", jobs});

        return res.status(200).json({success: true, jobs, message:"Jobs found successfully"});
    }
    catch(error)
    {
        console.log("Error in getJobsByAdminId function", error);
        res.status(500).json({ sucess: false, message: "Internal Server Error" });
    }
}
