import Navbar from "@/components/shared/Navbar";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "@/utils/constants";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

function LoginPage() {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    })

    const changeEventHandler = (e) =>{
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    const { loading } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(input);
        try{
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input,
                {
                    withCredentials: true,
            })
            console.log(res);
            if(res.data.success)
            {
                dispatch(setUser(res.data.user));
                navigate('/');
                toast(res.data.message);
            }
        }
        catch(error)
        {
            console.log(error);
            alert(error.response?.data?.message || "Something went wrong");
        }
        finally
        {
            dispatch(setLoading(false));
        }
    }
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          action=""
          onSubmit={handleSubmit}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Login</h1>
          <div className="my-2">
            <Label>Email</Label>
            <Input
              className="mt-2"
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="john@example.com"
            />
          </div>
          <div className="my-2">
            <Label>Password</Label>
            <Input className="mt-2" 
            type="password" 
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            />
          </div>
          <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  value="student"
                  className="cursor-pointer"
                />
                <Label htmlFor="option-one">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  value="recruiter"
                  className="cursor-pointer"
                />
                <Label htmlFor="option-two">Recruiter</Label>
              </div>
            </RadioGroup>
          </div>
            {
                loading? 
                <>
                    <Button className="w-full my-4"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please Wait...</Button>
                </> 
                :
                <>
                    <Button type="submit" className="w-full my-4">Submit</Button>
                </>
            }
          
          <div className="text-sm mt-2">
            Don't have an account?{" "}
            <Link className="text-blue-600" to="/signup">
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
