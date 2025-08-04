import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { COMPANY_API_END_POINT } from '@/utils/constants';
import { toast } from 'sonner';
import axios from 'axios';

function CompanyCreate() {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState();

    const registerNewCompany = async () =>{
        try{
            const response = await axios.post(`${COMPANY_API_END_POINT}/register`, {companyName}, {
                headers:{
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            if(response.data.success)
            {
                toast.success("Please fill in the required fields to complete the registration process.");
                const companyId = response.data.company.id;
                navigate(`/admin/companies/${companyId}`);
            }
        }
        catch(error)
        {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

  return (
    <div>
      <Navbar/>
      <div className='max-w-4xl mx-auto '>
        <div className='my-10'>
            <h1 className='font-bold text-2xl'>Your Company Name</h1>
            <p className='text-gray-500'>What would you like to name your company name? You can change this later</p>
        </div>

        <Label>Company Name</Label>
        <Input
            type="text"
            className='my-2'
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder='JobHunt, Microsoft, etc.' 
          />
        <div className='flex items-center gap-2 my-10'>
            <Button variant="outline" onClick={() => navigate('/admin/companies')}>Cancel</Button>
            <Button onClick={registerNewCompany}>Continue</Button>
        </div>
      </div>
    </div>
  )
}

export default CompanyCreate
