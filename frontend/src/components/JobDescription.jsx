import React, { useEffect } from 'react'
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from '@/utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { setSingleJob } from '@/redux/jobSlice';
import { toast } from 'sonner';

function JobDescription() {

  const dispatch = useDispatch();
  const { singleJob } = useSelector(state=>state.job);

  const params = useParams();
  const jobId = params.id;
  const isApplied = singleJob?.isApplied;

  const applyJobHandler = async () =>{
    try{
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials: true});
      if(res.data.success)
      {
        toast.success("Applied for job successfully");
        dispatch(setSingleJob({...singleJob, isApplied: true, applicant_count: singleJob.applicant_count + 1}));
      }
    }
    catch(error)
    {
      console.log("Error in applying job ", error);
      toast.error(error.response?.data?.message || "Failed to apply for job");
    }
  }

  useEffect(()=>{  
    const fetchSingleJob = async () =>{
      try{
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {withCredentials: true});
        if(res.data.success)
        {
          dispatch(setSingleJob(res.data.job));
        }
      }
      catch(err){
        console.log(err);
      }
    }
    fetchSingleJob();
  },[jobId, dispatch]);

  return (
    <div className='max-w-7xl mx-auto my-10'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
            <div className='flex items-center gap-2 mt-4'>
              <Badge className={'text-blue-700 font-bold'} variant="ghost">{singleJob?.position}</Badge>
              <Badge className={'text-[#F83002] font-bold'} variant="ghost">{singleJob?.job_type}</Badge>
              <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{singleJob?.salary} lpa</Badge>
            </div>
          </div>
          <Button 
          onClick={isApplied? null:applyJobHandler}
          disabled={isApplied}
          className={`rounded-lg ${isApplied? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#77429a]'}`}>
            {isApplied ? 'Already Applied' : 'Apply Now'}
          </Button>
        </div>
        <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
        <div>
            <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
            <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
            <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
            <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary} lpa</span></h1>
            <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applicant_count}</span></h1>
            <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.created_at ? singleJob.created_at.split("T")[0] : "N/A"}</span></h1>
        </div>
    </div>
  )
}

export default JobDescription
