import { setAllCompanies } from "@/redux/companySlice"
import { COMPANY_API_END_POINT } from "@/utils/constants"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux";

export const useGetAllCompanies = () => 
{
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchCompanies = async () => {
            try{
                const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {withCredentials: true});
                if(res.data.success)
                    dispatch(setAllCompanies(res.data.companies));
                else
                    dispatch(setAllCompanies([]));
            }
            catch(err)
            {
                dispatch(setAllCompanies([]));
                console.log(err);
            }
        }
        fetchCompanies();
    }, [dispatch]);
}