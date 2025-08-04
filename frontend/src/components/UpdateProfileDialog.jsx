import React, { useState } from 'react'
import axios from 'axios';
import { USER_API_END_POINT } from "@/utils/constants";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,DialogDescription } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';

function UpdateProfileDialog({open, setOpen}) {
    const dispatch = useDispatch();

    const {user, loading} = useSelector(state => state.auth);

    const [input, setInput] = useState({
        fullName: user?.fullname,
        email: user?.email,
        phoneNumber: user?.phonenumber,
        bio: user?.bio,
        skills: user?.skills?.map(skill => skill),
        file: user?.resume
    })

    const changeEventHandler = (e) => {
        setInput({
            ...input, 
            [e.target.name]: e.target.value
        });
    }

    const changeFileHandler = (e) => {
        setInput({
            ...input,
            file: e.target.files?.[0]
        })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log(input);

        const formData = new FormData();
        formData.append("fullName", input.fullName);
        formData.append("email", input.email);
        formData.append("phoneNumber",input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills",input.skills);
        if(input.file)
            formData.append("file", input.file);

        try{
            dispatch(setLoading(true));
            const res = await axios.put(`${USER_API_END_POINT}/profile/update`, formData, 
                {
                    headers: {"Content-Type":"multipart/formdata"},
                    withCredentials: true
                });

            if(res.data.success)
            {
                dispatch(setUser(res.data.user));
                dispatch(setLoading(false));
                toast(res.data.message);
            }   
        }
        catch(error)
        {
            console.log("Error in updating profile ", error);
            alert(error.response?.data?.message || "Something went wrong");
        }
        finally
        {
            dispatch(setLoading(false));
        }
        setOpen(false);
        
    }

  return (
    <div>
      <Dialog open={open}>
        <DialogContent className='sm:max-w-[425px]' onInteractOutside={() => setOpen(false)}>
            <DialogHeader>
                <DialogTitle>Update Profile</DialogTitle>
                <DialogDescription>
                    Make changes to your profile here. Click update when you're done.
                </DialogDescription>
            </DialogHeader>
            <form action="" onSubmit={submitHandler}>
                <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor="name" className='text-right'>Name</Label>
                        <Input
                        id="name"
                        name="fullName"
                        value={input.fullName}
                        onChange={changeEventHandler}
                        className="col-span-3"
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor="email" className='text-right'>Email</Label>
                        <Input
                        id="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="col-span-3"
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor="number" className='text-right'>Number</Label>
                        <Input
                        id="number"
                        name="phoneNumber"
                        value={input.phoneNumber}
                        onChange={changeEventHandler}
                        className="col-span-3"
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor="bio" className='text-right'>Bio</Label>
                        <Input
                        id="bio"
                        name="bio"
                        value={input.bio}
                        onChange={changeEventHandler}
                        className="col-span-3"
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor="skills" className='text-right'>Skills</Label>
                        <Input
                        id="skills"
                        name="skills"
                        value={input.skills}
                        onChange={changeEventHandler}
                        className="col-span-3"
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor="number" className='text-right'>Resume</Label>
                        <Input
                        id="file"
                        type="file"
                        name="file"
                        onChange={changeFileHandler}
                        accept="application/pdf"
                        className="col-span-3"
                        />
                    </div>
                    <DialogFooter>
                        {
                            loading? 
                            <>
                                <Button className="w-full my-4"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please Wait...</Button>
                            </> 
                            :
                            <>
                                <Button type="submit" className="w-full my-4">Update</Button>
                            </>
                        }
                    </DialogFooter>
                </div>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UpdateProfileDialog
