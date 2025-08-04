import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux';

function AppliedJobsTable() {
  const { appliedJobs } = useSelector((store) => store.job);
  console.log(appliedJobs);

  return (
    <div>
      <Table>
        <TableCaption>A list of your applied jobs</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Job Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="text-right">Status</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {
                appliedJobs.length<=0? <span>You haven't applied for any job yet.</span> : 
                appliedJobs.map((job, index) => (
                    <TableRow key={index}>
                        <TableCell>{job?.created_at?.split("T")[0]}</TableCell>
                        <TableCell>{job?.job_title}</TableCell>
                        <TableCell>{job?.company_name}</TableCell>
                        <TableCell className="text-right"><Badge className={job?.status == 'rejected' ? 'bg-red-400' : job?.status === 'pending' ? 'bg-gray-400' : 'bg-green-800'}>{job?.status.toUpperCase()}</Badge></TableCell>
                    </TableRow>
                ))
            }
        </TableBody>
      </Table>
    </div>
  )
}

export default AppliedJobsTable
