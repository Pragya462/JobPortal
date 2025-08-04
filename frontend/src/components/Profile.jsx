import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobsTable from "./AppliedJobsTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useGetAllAppliedJobs } from "@/hooks/useGatAllAppliedJobs";

function Profile() {
  useGetAllAppliedJobs();

  const [open, setOpen] = useState(false);
  const haveResume = true;

  const { user } = useSelector((store) => store.auth);

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 roundex-2xl my-5 p-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="cursor-pointer">
              <AvatarImage src={user?.profile_photo || "https://github.com/shadcn.png"}   />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">{user?.fullname}</h1>
              <p>
                {user?.bio}
              </p>
            </div>
          </div>
          <Button onClick={() => setOpen(true)} className="text-right" variant="outline">
            <Pen />
          </Button>
        </div>
        <div className="my-5">
          <div className="flex items-center gap-3 my-2">
            <Mail />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact />
            <span>{user?.phonenumber}</span>
          </div>
        </div>
        <div className="my-5">
          <h1>Skills</h1>
          <div className="flex items-center gap-1">
            {user?.skills?.length != 0 ? (
              user?.skills?.map((skill, index) => <Badge key={index}>{skill}</Badge>)
            ) : (
              <span>NA</span>
            )}
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label className="text-md font-bold">Resume</Label>
            {haveResume ? (
              <a
                target="blank"
                href={user?.resume}
                className="text-blue-500 w-full hover: underline cursor-pointer"
              >
                {user?.resume_original_name}
              </a>
            ) : (
              <span>NA</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl">
        <h1 className="font-bold text-lg my-5">Applied Jobs</h1>
        <AppliedJobsTable />
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />

    </div>
  );
}

export default Profile;
