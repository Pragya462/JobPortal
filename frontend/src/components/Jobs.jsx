import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '@/redux/jobSlice';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

function Jobs() {
  const { allJobs, searchQuery } = useSelector(state => state.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchQuery(''));
  }, [dispatch]);

  useEffect(() => {
    if(searchQuery)
    {
      const filteredJobs = allJobs.filter((job) => {
        return job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
        job.location.toLowerCase().includes(searchQuery.toLowerCase());
      })
      setFilterJobs(filteredJobs);
    }
    else
    {
      setFilterJobs(allJobs);
    }
  }, [allJobs,searchQuery])

  return (
    <div>
      <Navbar />
      <div className='max-w-7xl mx-auto mt-5'>
        <div className='flex gap-5'>
            <div className='w-20%'>
                <FilterCard />
            </div>
            {
                filterJobs.length<=0 ? 
                <span>No jobs found</span> 
                : 
                <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                    <div className='grid grid-cols-3 gap-4'>
                        {
                            filterJobs.map((job) => (
                                <motion.div 
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                key={job?.id}>
                                    <Job job={job}/>
                                </motion.div>
                            ))
                        }
                    </div>
                </div>
            }
        </div>
      </div>
    </div>
  )
}

export default Jobs
