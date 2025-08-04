import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constants';
import { setLoading, setAllJobs } from '@/redux/jobSlice';

const useGetAllJobs = () =>
{
    const dispatch = useDispatch();
    const { searchQuery } = useSelector(store => store.job);
    useEffect(() => {
        const fetchAllJobs = async () => {
            try{
                const res= await axios.get(`${JOB_API_END_POINT}/getall?keyword=${searchQuery}`, {
                    withCredentials: true,
                });
                if(res.data.success)
                {
                    dispatch(setAllJobs(res.data.jobs));
                    dispatch(setLoading(false));
                }
            }
            catch(error)
            {
                console.log(error);
            }
            finally{
                dispatch(setLoading(false));
            }
        }
        fetchAllJobs();
    }, [dispatch])
}

export default useGetAllJobs; 