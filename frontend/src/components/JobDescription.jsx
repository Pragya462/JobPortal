import React from 'react'
import { Badge } from './ui/badge';
import { Button } from './ui/button';

function JobDescription() {

  const isApplied=false;

  return (
    <div className='max-w-7xl mx-auto my-10'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='font-bold text-xl'>Front Developer</h1>
            <div className='flex items-center gap-2 mt-4'>
              <Badge className={'text-blue-700 font-bold'} variant="ghost">12 Positions</Badge>
              <Badge className={'text-[#F83002] font-bold'} variant="ghost">Part Time</Badge>
              <Badge className={'text-[#7209b7] font-bold'} variant="ghost">24 lpa</Badge>
            </div>
          </div>
          <Button 
          disabled={isApplied}
          className={`rounded-lg ${isApplied? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#77429a]'}`}>
            {isApplied ? 'Already Applied' : 'Apply Now'}
          </Button>
        </div>
        <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
        <div>
            <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>Frontend Developer</span></h1>
            <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>Hyderabad</span></h1>
            <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>FLorem ipsum dolor sit amet consectetur, adipisicing elit Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi dolore</span></h1>
            <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>12lpa</span></h1>
            <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>12</span></h1>
            <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>17-07-2025</span></h1>
        </div>
    </div>
  )
}

export default JobDescription
