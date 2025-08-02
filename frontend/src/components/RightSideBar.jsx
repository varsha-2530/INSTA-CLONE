
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SuggestedUser from "./SuggestedUser";

const RightSideBar = () => {
  const { user } = useSelector((store) => store.auth);
  const initials = (user?.username && user.username.slice(0, 2).toUpperCase()) || "CN";

  return (
    <div className="w-fit my-8 mt-1 ">
      <div className="flex items-center gap-5 rounded-lg p-2 mr-2">
        {/* ✅ current user profile by id */}
        <Link to={`profile/${user?._id}`}>
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.profilePicture} alt={user?.username || "User"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex flex-col">
          <h1 className="text-base font-medium text-white">{user?.username || "User"}</h1>
          <span className="text-sm text-neutral-400 truncate w-40 block">
            {user?.bio || "bio here..."}
          </span>
        </div>
      </div>

      <SuggestedUser />
    </div>
  );
};

export default RightSideBar;
