import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import Comment from "./Comment";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { setSelectedPost, setPosts } from "@/Redux/postSlice";

const CommentDialog = ({ open, setOpen }) => {
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  const dispatch = useDispatch();

  const handleError = (error) => {
    const msg =
      error?.response?.data?.errorMsg ||
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    toast.error(msg);
  };

  // Fetch comments when dialog opens or selectedPost changes
  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedPost?._id) return;
      try {
        const res = await axios.get(
          `http://localhost:2530/api/post/getAllComments/${selectedPost._id}`,
          { withCredentials: true }
        );
        setComments(res.data.comments || []);
      } catch (err) {
        toast.error("Failed to fetch comments");
      }
    };

    if (open && selectedPost?._id) fetchComments();
  }, [open, selectedPost]);

  const handleChange = (e) => setText(e.target.value);

  // 🔴 Delete a comment (API + local + feed sync)
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `http://localhost:2530/api/post/deleteComment/${commentId}`,
        { withCredentials: true }
      );

      const updatedComments = (comments || []).filter((c) => c._id !== commentId);
      setComments(updatedComments);

      // update selectedPost for dialog
      dispatch(setSelectedPost({ ...selectedPost, comments: updatedComments }));

      // update posts list for feed count
      const updatedPosts = (posts || []).map((p) =>
        p._id === selectedPost._id ? { ...p, comments: updatedComments } : p
      );
      dispatch(setPosts(updatedPosts));

      toast.success("Comment deleted!");
    } catch (err) {
      handleError(err);
    }
  };

  // 🟢 Add a comment (API + local + feed sync)
  const sentCommentHandler = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `/api/post/addComments/${selectedPost?._id}`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.newComment) {
        const updatedComments = [...(comments || []), res.data.newComment];
        setComments(updatedComments);

        // update dialog
        dispatch(setSelectedPost({ ...selectedPost, comments: updatedComments }));

        // update feed
        const updatedPosts = (posts || []).map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updatedComments } : p
        );
        dispatch(setPosts(updatedPosts));

        toast.success("Comment added!");
        setText("");
      }
    } catch (error) {
      handleError(error);
    }
  };

  if (!selectedPost) return null;

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col"
      >
        <DialogTitle className="sr-only">Comments</DialogTitle>
        <DialogDescription className="sr-only">
          View and add comments on the post.
        </DialogDescription>

        <div className="flex flex-1">
          {/* Image Section */}
          <div className="w-1/2">
            <img
              src={selectedPost?.image}
              alt="post_img"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          {/* Comments Section */}
          <div className="w-1/2 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar className="w-9 h-9 rounded-full">
                    <AvatarImage
                      src={selectedPost.author?.profilePicture}
                      alt={selectedPost.author?.username}
                      className="object-cover w-full h-full rounded-full"
                    />
                    <AvatarFallback className="w-9 h-9 bg-gray-200 text-black text-sm flex items-center justify-center">
                      {selectedPost.author?.username
                        ?.slice(0, 2)
                        .toUpperCase() || "NA"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Link className="font-semibold text-xs">
                  {selectedPost?.author?.username}
                </Link>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-sm text-center">
                  <DropdownMenuItem className="cursor-pointer">
                    Add to favorites
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <hr />

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {(comments || []).map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>

            {/* Add Comment Input */}
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={handleChange}
                  placeholder="Add a comment..."
                  className="w-full outline-none border text-sm border-gray-300 p-2 rounded"
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sentCommentHandler}
                  variant="outline"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
