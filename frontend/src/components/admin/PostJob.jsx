import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constants';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

function PostJob() {
    const [input, setInput]= useState({
        title: '' ,
        description: '', 
        requirements: '', 
        salary: '', 
        location: '',
        jobType: '', 
        position: 0, 
        experienceLevel: '',
        companyId: ''
    });

    const [loading, setLoading] = useState(false);
    const {allCompanies} = useSelector(store=>store.company);
    const [hasCompany, setHasCompany] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(allCompanies.length>0)
            setHasCompany(true);
    }, [allCompanies])

    const changeEventHandler = (e) => {
        setInput({...input, [e.target.name]: e.target.value})
    }

    const selectChangeHandler = (value) => {
        const selectedCompany = allCompanies.find((company) => company.name.toLowerCase() === value.toLowerCase());
        setInput({...input, companyId: selectedCompany.id})
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.companyId) {
            toast("Please select a company");
            return;
        }
        console.log(input);
        try
        {
            setLoading(true);
            const res= await axios.post(`${JOB_API_END_POINT}/admin/post`, input, {
                headers: {
                    'contentType': 'application/json',
                },
                withCredentials: true
            });
            if(res.data.success)
            {
                toast.success("Job created successfully");
                navigate('/admin/jobs');
            }
            console.log(res.data);
        }
        catch(error)
        {
            toast.error(error.res.data.msg);
        }
        finally
        {
            setLoading(false);
        }
    }
  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center w-screen my-5'>
        <form action="" onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
            <div className='grid grid-cols-2 gap-2'>
                <div>
                    <Label>Title</Label>
                    <Input
                    type='text'
                    name='title'
                    value={input.title}
                    onChange={changeEventHandler}
                    className='focus-visible:ring-offset-0 focus-visible:ring-0 my-2'
                    required
                    />
                </div>
                <div>
                    <Label>Description</Label>
                    <Input
                    type='text'
                    name='description'
                    value={input.description}
                    onChange={changeEventHandler}
                    className='focus-visible:ring-offset-0 focus-visible:ring-0 my-2'
                    required
                    />
                </div>
                <div>
                    <Label>Requirements</Label>
                    <Input
                    type='text'
                    name='requirements'
                    value={input.requirements}
                    onChange={changeEventHandler}
                    className='focus-visible:ring-offset-0 focus-visible:ring-0 my-2'
                    required
                    />
                </div>
                <div>
                    <Label>Salary</Label>
                    <Input
                    type='text'
                    name='salary'
                    value={input.salary}
                    onChange={changeEventHandler}
                    className='focus-visible:ring-offset-0 focus-visible:ring-0 my-2'
                    required
                    />
                </div>
                <div>
                    <Label>Location</Label>
                    <Input
                    type='text'
                    name='location'
                    value={input.location}
                    onChange={changeEventHandler}
                    className='focus-visible:ring-offset-0 focus-visible:ring-0 my-2'
                    required
                    />
                </div>
                <div>
                    <Label>Job Type</Label>
                    <Input
                    type='text'
                    name='jobType'
                    value={input.jobType}
                    onChange={changeEventHandler}
                    className='focus-visible:ring-offset-0 focus-visible:ring-0 my-2'
                    required
                    />
                </div>
                <div>
                    <Label>No. of Positions</Label>
                    <Input
                    type='number'
                    name='position'
                    value={input.position}
                    onChange={changeEventHandler}
                    className='focus-visible:ring-offset-0 focus-visible:ring-0 my-2'
                    required
                    />
                </div>
                <div>
                    <Label>Experience Level</Label>
                    <Input
                    type='text'
                    name='experienceLevel'
                    value={input.experienceLevel}
                    onChange={changeEventHandler}
                    className='focus-visible:ring-offset-0 focus-visible:ring-0 my-2'
                    required
                    />
                </div>
            </div>
            {
                allCompanies.length > 0 ? (
                    <Select onValueChange={selectChangeHandler}>
                        <SelectTrigger>
                            <SelectValue placeholder={'Select a company'}/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {
                                    allCompanies.map((company, index) => {
                                        return (
                                            <SelectItem key={index} value={company.name}>{company.name}</SelectItem>
                                        )
                                    })
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                ) : 
                (
                    <p className='text-xs text-red-600 font-bold text-center my-3'>*Please register a company fist, before posting a job</p>
                )
                 
            }
            {
                loading? 
                <>
                    <Button className="w-full my-4"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please Wait...</Button>
                </> 
                :
                <>
                    <Button disabled={!hasCompany} type="submit" className="w-full my-4">Post Job</Button>
                </>
            }
        </form>
      </div>
    </div>
  )
}

export default PostJob
