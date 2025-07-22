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

const skills = ["html", "CSS", "JavaScript"];

function Profile() {
    const [open, setOpen] = useState(false);
  const haveResume = true;

  const { user } = useSelector((store) => store.auth);
  console.log(user);

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 roundex-2xl my-5 p-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">Fulll Name</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Inventore error at impedit sapiente earum dolorum, optio sit
                quaerat quae
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
            <span>pragya@test.com</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact />
            <span>1234567890</span>
          </div>
        </div>
        <div className="my-5">
          <h1>Skills</h1>
          <div className="flex items-center gap-1">
            {skills.length != 0 ? (
              skills.map((skill, index) => <Badge key={index}>{skill}</Badge>)
            ) : (
              <span>NA</span>
            )}
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label className="text-md font-bold">Resume</Label>
            {haveResume ? (
              <a
                target="blank"
                href="https://ui.shadcn.com/docs/components/radio-group"
                className="text-blue-500 w-full hover: underline cursor-pointer"
              >
                Resume
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
