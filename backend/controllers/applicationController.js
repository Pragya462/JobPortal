import { sql } from '../database/db.js';

export const applyJob = async (req, res) => {
    try{
        const userId = req.user.id;
        const jobId = req.params.id;

        if(!jobId)
            return res.status(400).json({success: false, message: 'Job id is required'});

        const existing = await sql `
        SELECT * from applications 
        WHERE job_id=${jobId} 
        AND applicant_id=${userId}`;

        if(existing.length > 0)
        {
            return res.status(400).json({success: false, message: "You have already applied for this job"});
        }

        const job = await sql `SELECT * FROM jobs WHERE id=${jobId}`;

        if(job.length==0)
        {
            return res.status(400).json({success: false, message: "Job not found"});
        }

        const newApplication = await sql `
        INSERT INTO applications (job_id, applicant_id)
        VALUES (${jobId}, ${userId})
        RETURNING *`;

        return res.status(201).json({success: true, application: newApplication[0], message: "Job applied successfully"});
    }
    catch(error)
    {
        console.log("Error in applyJob function: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAppliedJobs = async (req, res) => {
    try{
        const user_id = req.user.id;

        const appliedJobs = await sql `
        SELECT 
            applications.*,
            jobs.id AS job_id,
            jobs.title AS job_title,
            jobs.description AS job_description,
            jobs.created_at AS job_created_at,
            companies.id AS company_id,
            companies.name AS company_name,
            companies.logo AS company_logo
            FROM applications
            JOIN jobs ON applications.job_id = jobs.id
            JOIN companies ON jobs.company_id = companies.id
            WHERE applications.applicant_id = ${user_id}
            ORDER BY applications.created_at DESC`;

        if(appliedJobs.length==0)
            return res.status(200).json({success: true, message: "No jobs applied", appliedJobs});

        return res.status(200).json({success: true, message: "Jobs found successfully", appliedJobs});
    }
    catch(error)
    {
        console.log("Error in getAppliedJobs function: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getApplicants = async (req, res) => {
    try{
        const jobId = req.params.id;

        const applicants = await sql `
        SELECT 
            a.status,
            a.created_at AS application_date,
            u.id AS applicant_id,
            u.fullname,
            u.email,
            u.phonenumber,
            p.resume,
            p.resume_original_name
            FROM applications AS a
            INNER JOIN users AS u ON a.applicant_id = u.id
            INNER JOIN profiles AS p ON u.id = p.user_id
            WHERE a.job_id = ${jobId};
        `;

        if(applicants.length==0)
            return res.status(404).json({success: false, message: "No applicants found"});

        return res.status(200).json({ success: true, applicants });
    }
    catch(error)
    {
        console.log("Error in getApplicants function: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateStatus = async (req, res) => {
    try{
        const { status } = req.body;
        const applicantId = req.params.id;

        if(!status)
            return res.status(400).json({ success: false, message: "Status is required"});

        const application = await sql `SELECT * FROM applications WHERE id = ${applicantId};`;

        if(application.length==0)
            return res.status(404).json({success: false, message: "Application not found"});

        const updatedApplication = await sql `
        UPDATE applications 
        SET status = ${status} 
        WHERE id = ${applicantId}
        RETURNING *
        `;

        return res.status(200).json({ success: true, updatedApplication, message: "Application status updated successfully"});
    }
    catch(error)
    {
        console.log("Error in updateStatus function: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}