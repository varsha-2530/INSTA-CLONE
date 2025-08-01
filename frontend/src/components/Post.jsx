
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// ❌ Remove Badge from lucide-react
// import { Badge, Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
// ✅ Use shadcn/ui Badge
import { Badge } from "@/components/ui/badge";

import { FaRegHeart, FaHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/Redux/postSlice";

const Post = ({ post }) => {
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState(post.comments);

  if (!Array.isArray(posts)) {
    console.warn("⚠️ posts is not an array:", posts);
    return null;
  }

  const [like, setLike] = useState(
    post?.likes?.some((u) => u._id === user?._id)
  );
  const [likeCount, setLikeCount] = useState(post?.likes?.length || 0);

  const dispatch = useDispatch();

  const handleError = (error) => {
    const msg =
      error?.response?.data?.errorMsg ||
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    toast.error(msg);
  };

  const ChangeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const likesHandler = async (postId) => {
    try {
      const res = await axios.put(
        `http://localhost:2530/api/post/toggleLike/${postId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.message) toast.success(res.data.message);
      if (res.data.liked !== undefined) setLike(res.data.liked);
      if (res.data.totalLikes !== undefined) setLikeCount(res.data.totalLikes);

      const updatedPosts = posts.map((p) =>
        p._id === post._id ? { ...p, likes: res.data.updatedLikes } : p
      );

      dispatch(setPosts(updatedPosts));
    } catch (error) {
      handleError(error);
    }
  };

  const deleteHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:2530/api/post/deletePost/${post?._id}`,
        { withCredentials: true }
      );

      if (res.data.message) {
        const updatePostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatePostData));
        setOpen(false);
        toast.success(res.data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="bg-neutral-900 rounded-1xl mr-45 shadow-md max-w-[500px] w-full mx-auto mb-6 border border-neutral-800">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 rounded-full overflow-hidden">
            <AvatarImage
              src={post?.author?.profilePicture}
              alt={post?.author?.username}
              className="object-cover w-full h-full"
            />
            <AvatarFallback className="bg-gray-700 text-white text-xs flex items-center justify-center">
              {post?.author?.username?.slice(0, 2).toUpperCase() || "NA"}
            </AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-2">
            <p className="text-white text-sm font-medium">
              {post?.author?.username}
            </p>

            {String(user?._id || user?.id) === String(post?.author?._id) && (
              <Badge
                variant="outline"
                className="text-[10px] text-white px-2 py-0.5"
              >
                Author
              </Badge>
            )}
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="text-white w-4 h-4 cursor-pointer hover:opacity-70" />
          </DialogTrigger>
          <DialogContent
            showCloseButton={false}
            className="bg-neutral-900 border border-neutral-700 text-white w-60 p-0 rounded-xl overflow-hidden"
          >
            <DialogTitle className="text-base px-4 py-2 font-semibold">
              Post Options
            </DialogTitle>
            <DialogDescription className="sr-only">
              Options like unfollow or delete for this post.
            </DialogDescription>

            <div className="flex flex-col divide-y divide-neutral-700">
              <Button
                variant="ghost"
                className="text-red-500 rounded-none justify-start px-4 py-2 hover:bg-white"
              >
                Unfollow
              </Button>

              {(user?.id === post?.author?._id ||
                user?._id === post?.author?._id) && (
                <Button
                  onClick={deleteHandler}
                  variant="ghost"
                  className="text-red-500 rounded-none justify-start px-4 py-2 hover:bg-white"
                >
                  Delete
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <div className="w-full bg-black">
        <img
          src={post?.image}
          alt="post"
          className="w-full object-cover max-h-[400px] mx-auto"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-3 pt-2 mt-4 text-white text-lg">
        <div className="flex gap-3 items-center ">
          <div
            onClick={() => likesHandler(post._id)}
            className="cursor-pointer transition-all w-6 h-7 flex items-center justify-center"
          >
            {like ? (
              <FaHeart className="text-red-500 w-full h-full" />
            ) : (
              <FaRegHeart className="text-white hover:text-red-500 w-full h-full transition" />
            )}
          </div>
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-blue-400 transition w-7 h-7"
          />
          <Send className="cursor-pointer hover:text-green-400 transition w-7 h-7" />
        </div>
        <Bookmark className="cursor-pointer hover:text-yellow-400 transition w-7 h-7" />
      </div>

      {/* Likes & Caption */}
      <div className="px-3 py-4 mt-1">
        <p className="text-m text-white font-medium mb-1">
          {likeCount} <span>Likes</span>
        </p>
        <p className="text-sm text-white">
          <span className="font-semibold mr-1">{post?.author?.username}</span>
          {post?.caption}
        </p>
      </div>

      {/* Comments Link */}
      <p
        onClick={() => {
          dispatch(setSelectedPost(post));
          setOpen(true);
        }}
        className="px-3 text-m text-gray-400 cursor-pointer hover:underline mt-1"
      >
        {post?.comments?.length || 0} <span>Comments...</span>
      </p>

      {/* Comment Dialog */}
      <CommentDialog open={open} setOpen={setOpen} />

      {/* Add Comment */}
      <div className="px-3 pb-3 pt-1">
        <div className="flex items-center border-b border-neutral-800">
          <input
            type="text"
            value={text}
            onChange={ChangeEventHandler}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 py-1.5 focus:outline-none"
          />
          {text && (
            <span
              onClick={async () => {
                try {
                  const res = await axios.post(
                    `http://localhost:2530/api/post/addComments/${post?._id}`,
                    { text },
                    {
                      headers: { "Content-Type": "application/json" },
                      withCredentials: true,
                    }
                  );
                  if (res.data.newComment) {
                    const updatedCommentData = [
                      ...(post.comments || []),
                      res.data.newComment,
                    ];
                    // update local feed
                    const updatedPostData = posts.map((p) =>
                      p._id === post._id
                        ? { ...p, comments: updatedCommentData }
                        : p
                    );
                    dispatch(setPosts(updatedPostData));
                    toast.success("Comment added!");
                    setText("");
                  }
                } catch (err) {
                  handleError(err);
                }
              }}
              className="text-[#fe7143] text-sm font-medium cursor-pointer hover:opacity-80"
            >
              Post
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
