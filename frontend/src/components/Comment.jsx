import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { Trash } from "lucide-react";
import { useSelector } from "react-redux";

const Comment = ({ comment, onDelete }) => {
  const { user } = useSelector((store) => store.auth);

  // covers both populated author ({_id,...}) and plain id string
  const isAuthor =
    String(comment?.author?._id || comment?.author) ===
    String(user?._id || user?.id);

  return (
    <div className="my-2 flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <Avatar className="w-8 h-8 rounded-full overflow-hidden">
          <AvatarImage
            src={comment?.author?.profilePicture}
            alt={comment?.author?.username}
            className="w-full h-full object-cover"
          />
          <AvatarFallback className="w-8 h-8 bg-gray-200 text-black text-xs flex items-center justify-center">
            {comment?.author?.username?.slice(0, 2).toUpperCase() || "NA"}
          </AvatarFallback>
        </Avatar>

        <h1 className="font-bold text-sm text-black">
          {comment?.author?.username}
          <span className="font-normal pl-1 text-black">{comment?.text}</span>
        </h1>
      </div>

      {isAuthor && (
        <Trash
          size={16}
          className="text-red-500 cursor-pointer"
          onClick={() => onDelete(comment._id)}
          title="Delete comment"
        />
      )}
    </div>
  );
};

export default Comment;
