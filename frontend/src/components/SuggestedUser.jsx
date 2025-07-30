import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SuggestedUser = () => {
  const suggestedUser = useSelector((s) => s?.auth?.suggestedUser) ?? [];

  return (
    <div className="p-2">
      <div className="flex items-center justify-between text-sm mt-6 mb-3">
        <h1 className="font-semibold text-gray-400">Suggested for you</h1>
        {/* <span className="font-medium cursor-pointer text-gray-300 hover:underline">
          See All
        </span> */}
      </div>

      <div className="space-y-3">
        {suggestedUser.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-2">
            No suggestions right now.
          </p>
        ) : (
          suggestedUser.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between hover:bg-neutral-800 px-2 py-1 rounded-lg transition-all"
            >
              {/* ✅ relative link: /home/profile/:id */}
              <Link
                to={`/home/profile/${user._id}`}
                className="flex items-center gap-3"
              >
                <Avatar className="h-9 w-9 ring-1 ring-gray-700">
                  <AvatarImage
                    src={user?.profilePicture}
                    alt={user?.username || "avatar"}
                  />
                  <AvatarFallback className="bg-gray-600 text-white text-sm">
                    {(user?.username?.[0] || "U").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {user?.username || "User"}
                  </span>
                  {user?.fullName && (
                    <span className="text-xs text-gray-400">
                      {user.fullName}
                    </span>
                  )}
                  <span className="text-gray-600 text-sm">
                    {user?.bio || "Bio here..."}
                  </span>
                </div>
              </Link>

              <button className="text-xs font-semibold text-sky-500 hover:text-sky-400">
                Follow
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SuggestedUser;
