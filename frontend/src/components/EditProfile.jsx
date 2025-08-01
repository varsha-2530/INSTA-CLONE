import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "@/Redux/authSlice";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  //console.log(user)

  const initials =
    (user?.username && user.username.slice(0, 2).toUpperCase()) || "CN";

  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    profilePicture: null,
    bio: user?.bio || "",
    username: user?.username || "",
    email: user?.email || "",
    gender: user?.gender || "",
  });
  

  const fileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profilePicture: file });
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const handleError = (error) => {
    const msg =
      error?.response?.data?.errorMsg ||
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    toast.error(msg);
  };

  const editProfileHandler = async () => {
    // console.log(input);
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("username", input.username);
    formData.append("email", input.email);
    formData.append("gender", input.gender);
    // console.log("Sending gender =>", input.gender);
    if (input.profilePicture) {
      formData.append("profilePicture", input.profilePicture);
    }

    try {
      setLoading(true);

      const res = await axios.put(
        `/api/user/editprofile/profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      // console.log("Current User =>", user);

      if (res.data.message) {
        const updateUserData = {
          ...user,
          username: res.data.user?.username,
          email: res.data.user?.email,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user?.gender,
        };
       // console.log("Redux gender update =>", res.data.user?.gender);
        dispatch(setAuthUser(updateUserData));
        navigate(`/home/profile/${res.data.user?._id}`);

    //  navigate(`/profile/${res.data.user?._id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6">
        ✨ Edit Profile
      </h1>

      <hr className="border-t border-gray-700 my-8" />

      <section className="flex flex-col gap-8 w-full max-w-4xl mx-auto border border-b-fuchsia-900 p-6 rounded-xl bg-zinc-900/60 shadow-xl">
        {/* Profile Row */}
        <div className="w-full flex justify-between items-center flex-col sm:flex-row gap-6 px-4 py-4 shadow-lg border border-white/10 rounded-lg">
          <div className="flex items-center gap-6 text-center sm:text-left">
            <Avatar className="h-20 w-20 shadow-md rounded-full overflow-hidden">
              <AvatarImage
                className="rounded-full object-cover w-full h-full"
                src={
                  input.profilePicture
                    ? URL.createObjectURL(input.profilePicture)
                    : user?.profilePicture
                }
                alt={user?.username || "User"}
              />
              <AvatarFallback className="bg-zinc-800 text-white font-semibold rounded-full">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-xl font-semibold text-white">
                {user?.username}
              </h1>
              <p className="text-sm font-semibold text-gray-400">{user?.bio}</p>
            </div>
          </div>

          <label className="relative">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={fileChange}
            />
            <span className="cursor-pointer inline-block px-5 py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-700 hover:from-purple-700 hover:to-pink-600 transition duration-300 shadow-lg hover:shadow-xl">
              Change Profile Photo
            </span>
          </label>
        </div>

        {/* Text Fields */}
        <div className="flex flex-col gap-4 text-white">
          <div className="flex flex-col gap-2">
            <label htmlFor="bio" className="text-sm font-bold">
              Bio
            </label>
            <Textarea
              id="bio"
              name="bio"
              value={input.bio}
              onChange={(e) => setInput({ ...input, bio: e.target.value })}
              className="bg-zinc-800 border border-white/10 text-white font-light focus-visible:ring-transparent"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm font-bold">
              Username
            </label>
            <Textarea
              id="username"
              name="username"
              value={input.username}
              onChange={(e) => setInput({ ...input, username: e.target.value })}
              className="bg-zinc-800 border border-white/10 text-white font-light focus-visible:ring-transparent"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-bold">
              Email
            </label>
            <Textarea
              id="email"
              name="email"
              value={input.email}
              onChange={(e) => setInput({ ...input, email: e.target.value })}
              className="bg-zinc-800 border border-white/10 text-white font-light focus-visible:ring-transparent"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="gender" className="text-sm font-bold">
              Gender
            </label>
            <Select value={input.gender} onValueChange={selectChangeHandler}>
              <SelectTrigger className="w-full sm:w-72 bg-zinc-800 border border-white/10 text-white">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="bg-fuchsia-300">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center">
          {loading ? (
            <button
              disabled
              className="mt-6 flex items-center px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl transition duration-300 shadow-lg"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait...
            </button>
          ) : (
            <button
              onClick={editProfileHandler}
              className="mt-6 px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl transition duration-300 shadow-lg hover:shadow-xl"
            >
              Submit
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;

