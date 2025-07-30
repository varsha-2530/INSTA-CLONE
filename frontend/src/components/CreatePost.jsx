
import React, { useRef, useState } from "react";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { readFileDataURL } from "@/lib/utils";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/Redux/postSlice"; // ✅ FIXED import

const CreatePost = () => {
  const imageRef = useRef();
  const [imgfile, setImgfile] = useState(null);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const handleError = (error) => {
    const msg =
      error?.response?.data?.errorMsg ||
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    toast.error(msg);
  };

  const fileChangeHandle = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgfile(file);
      const dataUrl = await readFileDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandle = async (e) => {
    e.preventDefault();

    if (!imgfile || !caption.trim()) {
      toast.error("Image and caption are required");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", imgfile);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:2530/api/post/addPost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.message) {
        toast.success(res.data.message);
      }

      // ✅ FIXED: use setPosts instead of setPost
      dispatch(setPosts([...posts, res.data.post]));

      // Clear form after success
      setImgfile(null);
      setImagePreview("");
      setCaption("");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      {/* Header */}
      <div className="bg-neutral-900 p-4 rounded-2xl shadow text-white text-center">
        <h2 className="text-2xl font-semibold">Create New Post</h2>
      </div>

      {/* User Avatar */}
      <div className="flex items-center gap-4 bg-neutral-900 p-4 rounded-xl shadow">
        <Avatar className="w-14 h-14 rounded-full overflow-hidden">
          <AvatarImage src={user?.profilePicture} alt="User" />
          <AvatarFallback className="bg-neutral-700 text-white text-lg">
            {user?.username?.slice(0, 2).toUpperCase() || "NA"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h1 className="text-white font-semibold text-lg leading-tight">
            {user?.username}
          </h1>
          <span className="text-sm text-gray-500">{user?.bio}</span>
        </div>
      </div>

      {/* Caption Input */}
      <Textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="bg-neutral-900 text-white placeholder:text-neutral-400 border-none focus:ring-0 focus-visible:ring-0 resize-none rounded-lg p-3"
        placeholder="Write a caption ..."
        rows={4}
      />

      {/* Image Preview */}
      {imagePreview && (
        <div className="w-full h-64 rounded-lg overflow-hidden flex items-center justify-center border border-neutral-700">
          <img
            src={imagePreview}
            alt="preview_img"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={imageRef}
        onChange={fileChangeHandle}
        className="hidden"
        accept="image/*"
      />

      {/* Select File Button */}
      <button
        onClick={() => imageRef.current.click()}
        type="button"
        className="block bg-orange-500 hover:bg-[#d97470] text-white font-semibold px-5 py-2 rounded-lg transition-all duration-200 mx-auto"
      >
        Select Your Post
      </button>

      {/* Submit Button */}
      {imagePreview && (
        loading ? (
          <Button
            disabled
            className="w-full flex items-center justify-center gap-2 mt-4"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Please wait...
          </Button>
        ) : (
          <Button
            onClick={createPostHandle}
            type="submit"
            className="block bg-pink-500 hover:bg-[#6a325f] text-white font-semibold px-10 py-2 rounded-lg transition-all duration-200 mx-auto mt-4"
          >
            Post
          </Button>
        )
      )}
    </div>
  );
};

export default CreatePost;
