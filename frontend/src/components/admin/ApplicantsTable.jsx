import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constants';
import { toast } from 'sonner';

const shortlistingStatus = ["accepted", "rejected"];
function ApplicantsTable() {
    const { applicants } = useSelector(store => store.application);
    console.log(applicants);

    const statusHandler = async (status, id) => {
        try{
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, {status}, {withCredentials: true});
            if(res.data.success)
                toast.success(res.data.message);
        }
        catch(error)
        {
            toast.error(error.response?.data?.message);
        }
    }

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent applied jobs</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead>Fullname</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className='text-right'>Action</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            { applicants && applicants?.map((applicant) => (
                <TableRow>
                    <TableCell>{applicant?.fullname}</TableCell>
                    <TableCell>{applicant?.email}</TableCell>
                    <TableCell>{applicant?.phonenumber}</TableCell>
                    <TableCell>
                        {
                            applicant?.resume? <a className='text-blue-600' href={applicant?.resume} target="_blank">{applicant?.resume_original_name}</a> : <span>NA</span>
                        }
                        </TableCell>
                    <TableCell>{applicant?.application_date.split("T")[0]}</TableCell>
                    <TableCell className='text-right'>
                    <Popover>
                        <PopoverTrigger>
                            <MoreHorizontal />
                        </PopoverTrigger>
                        <PopoverContent className='w-32'>
                        {
                            shortlistingStatus.map((status, index) => (
                                <div key={index} onClick={() =>statusHandler(status, applicant?.applicant_id)} className='flex w-fit items-center my-2 cursor-pointer'>
                                    <span>{status}</span>
                                </div>
                            ))
                        }
                        </PopoverContent>
                    </Popover>
                    </TableCell>
                </TableRow>
                ))
            }
        </TableBody>
      </Table>
    </div>
  )
}

export default ApplicantsTable