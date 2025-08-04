import { setAllAdminJobs } from "@/redux/jobSlice"
import { JOB_API_END_POINT } from "@/utils/constants"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

export const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            try{
                const res = await axios.get(`${JOB_API_END_POINT}/admin/getall`, {withCredentials: true});
                if(res.data.success)
                {
                    dispatch(setAllAdminJobs(res.data.jobs));
                    console.log(res);
                }
                else
                    dispatch(setAllAdminJobs([]));
            }
            catch(error)
            {
                dispatch(setAllAdminJobs([]));
                console.log(error)
            }
        }
        fetchAllAdminJobs();
    }, [dispatch])
}