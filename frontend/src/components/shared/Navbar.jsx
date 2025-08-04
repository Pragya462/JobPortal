import { LogOut, User2 } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/constants";
import { setUser } from "@/redux/authSlice";

function Navbar() {
    const {user} = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async() => {
      try{
          const res = await axios.get(`${USER_API_END_POINT}/logout`, {
            withCredentials: true
          });

          if(res.data.success)
          {
            dispatch(setUser(null));
            navigate('/');
            toast.success("Logged out successfully");
          }
      }
      catch(error)
      {
        console.log("Error in logging out",error);
        toast.error(error.response.data.message);
      }
    }


  return (
    <div className="bg-white">
      <div className="flex justify-between items-center max-w-7xl mx-auto h-16">
        <div>
          <h1 className="text-2xl font-bold">
            Job<span className="text-red-500">Portal</span>
          </h1>
        </div>
        <div className="flex items-center gap-12">
          <ul className="flex gap-6 items-center">
            {
              user && user.role === "recruiter" ? 
              <>
                <li><Link to="/admin/companies">Company</Link></li>
                <li><Link to="/admin/jobs">Jobs</Link></li>
              </> 
              :
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/jobs">Jobs</Link></li>
                <li><Link to="/browse">Browse</Link></li>
              </>
            }
          </ul>
          { !user ? 
          <>
            <div className="flex items-center gap-2">
                <Link to="/login"><Button variant="outline">Login</Button></Link>
                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#531ab5]">Signup</Button></Link>
                
            </div>
          </> 
          : 
          <>
          <Popover>
            <PopoverTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user?.profile_photo || "https://github.com/shadcn.png"} />
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="flex gap-4 space-y-2">
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.profile_photo || "https://github.com/shadcn.png"} />
                </Avatar>
                <div>
                  <h4 className="font-medium">{user?.fullname}</h4>
                  <p className="text-sm text-muted-foreground">
                    {user?.bio}
                  </p>
                </div>
              </div>
              <div className="flex flex-col text-gray-600 pt-2 my-2">
                {
                  user && user.role==='recruiter' ? 
                  <></>
                  :
                  <>
                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <User2 />
                      <Button variant="link"><Link to="/profile">View Profile</Link></Button>
                    </div>
                  </>
                }
                <div className="flex w-fit items-center gap-2 cursor-pointer">
                  <LogOut />
                  <Button onClick={handleLogout} variant="link">Logout</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          </> }
          
        </div>
      </div>
    </div>
  );
}

export default Navbar;
