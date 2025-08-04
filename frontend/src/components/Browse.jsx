import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { setSearchQuery } from '@/redux/jobSlice';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

function Browse() {
  useGetAllJobs();

  const { allJobs } = useSelector(store => store.job);
  const dispatch = useDispatch();

  useEffect(()=> {
    return () => {
      dispatch(setSearchQuery(''));
    }
  })

  return (
    <div>
      <Navbar />
      <div className='max-w-7xl mx-auto my-10'>
            <h1 className='font-bold text-xl my-10'>Search Results ({allJobs.length})</h1>
            <div className='grid grid-cols-3 gap-4'>
                {
                    allJobs.map((job) => (
                      <motion.div
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      >
                        <Job key={job?.id} job={job}/>
                      </motion.div>
                    ))
                }
            </div>
      </div>
    </div>
  )
}

export default Browse
