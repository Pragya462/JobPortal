import React from 'react'
import LatestJobsCard from './LatestJobsCard';
import { useSelector } from 'react-redux';

function LatestJobs() {
  const { allJobs } = useSelector(state => state.job);

  return (
    <div className='max-w-7xl mx-auto my-20'>
        <h1 className='text-4xl font-bold'><span className='text-[#7209b7]'> Latest & Top </span> Job Openings </h1>
        <div className='grid grid-cols-3 gap-4 my-5'>
            {
                allJobs?.length<=0? <span>No jobs found</span> : allJobs?.slice(0,6).map((job) => <LatestJobsCard key={job?.id} job={job}/>)
            }
        </div>
    </div>
  )
}

export default LatestJobs;
