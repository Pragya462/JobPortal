import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constants';
import { useGetCompanyById } from '@/hooks/useGetCompanyById';
import { useSelector } from 'react-redux';

function CompanySetup() {
    const params= useParams();
    useGetCompanyById(params.id);

    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });

    const {singleCompany} = useSelector(store => store.company);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const changeEventHandler = (e) => {
        setInput({...input, [e.target.name]: e.target.value});
    }

    const changeFileHandler = (e) => {
        setInput({...input, file: e.target.files?.[0]});
    }

    useEffect(() => {
        setInput({
            name: singleCompany?.name,
            description: singleCompany?.description,
            website: singleCompany?.website,
            location: singleCompany?.location,
            logo: singleCompany?.logo
        })
    }, [singleCompany])

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log(input);
        const formdata = new FormData();
        formdata.append("companyName", input.name);
        formdata.append("description", input.description);
        formdata.append("website", input.website);
        formdata.append("location", input.location);
        
        if(input.file)
            formdata.append("file", input.file);

        try{
            setLoading(true);
            const response = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true,
            });
            console.log(response);

            if(response.data.success){
                toast.success(response.data.message);
                navigate('/admin/companies');
            }
            else
            {
                toast.error(response.data.message);
            }
        }
        catch(error)
        {
            toast.error(error.response.data.message);
        }
        finally
        {
            setLoading(false);
        }
    }

  return (
    <div>
      <Navbar />
      <div className='max-w-xl mx-auto my-10'>
        <form onSubmit={submitHandler}>
            <div className='flex items-center gap-5 p-8'>
                <Button type="button" variant='outline' className='flex items-center gap-2 text-gray-500 font-semibold' onClick={() => navigate('/admin/companies')}>
                    <ArrowLeft />
                    <span>Back</span>
                </Button>
                <h1 className='font-bold text-xl'>Company Setup</h1>
            </div>
            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <Label className='my-2'>Company Name</Label>
                    <Input
                        type="text"
                        name="name"
                        value={input.name}
                        onChange={changeEventHandler}
                        placeholder="Enter company name"
                    />
                </div>
                <div>
                    <Label className='my-2'>Description</Label>
                    <Input
                        type="text"
                        name="description"
                        value={input.description}
                        onChange={changeEventHandler}
                        placeholder="Enter description"
                    />
                </div>
                <div>
                    <Label className='my-2'>Website</Label>
                    <Input
                        type="text"
                        name="website"
                        value={input.website}
                        onChange={changeEventHandler}
                        placeholder="Enter website url"
                    />
                </div>
                <div>
                    <Label className='my-2'>Location</Label>
                    <Input
                        type="text"
                        name="location"
                        value={input.location}
                        onChange={changeEventHandler}
                        placeholder="Enter location"
                    />
                </div>
                <div>
                    <Label className='my-2'>Logo</Label>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={changeFileHandler}
                    />
                </div>
            </div>
            {
                loading? 
                <>
                    <Button className="w-full my-4"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please Wait...</Button>
                </> 
                :
                <>
                    <Button type="submit" className="w-full my-4">Upload</Button>
                </>
            }
        </form>
      </div>
    </div>
  )
}

export default CompanySetup
