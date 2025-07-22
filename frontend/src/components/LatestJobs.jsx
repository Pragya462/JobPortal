import React from 'react'
import LatestJobsCard from './LatestJobsCard';

const jobs =[1,2,3,4,5,6,7,8];

function LatestJobs() {
  return (
    <div className='max-w-7xl mx-auto my-20'>
        <h1 className='text-4xl font-bold'><span className='text-[#7209b7]'> Latest & Top </span> Job Openings </h1>
        <div className='grid grid-cols-3 gap-4 my-5'>
            {
                jobs.slice(0,6).map((job) => <LatestJobsCard jobs={job}/>)
            }
        </div>
    </div>
  )
}

export default LatestJobs;
