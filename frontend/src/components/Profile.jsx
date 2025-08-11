import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle } from "lucide-react";
import axios from "axios";
import useGetUserProfile from "@/Hook/useGetUserProfile";
import { toast } from "sonner";
import { setUserProfile , setAuthUser} from "@/Redux/authSlice";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();

  const { user, userProfile, loading: authLoading } = useSelector((s) => s.auth || {});
  const isOwnProfile = useMemo(() => !id || id === user?._id, [id, user?._id]);

  useGetUserProfile(isOwnProfile ? null : id);

  const displayUser = isOwnProfile ? user : userProfile;
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!isOwnProfile && displayUser?.followers) {
      setIsFollowing(displayUser.followers.includes(user._id));
    }
  }, [displayUser, isOwnProfile, user?._id]);

 const handleFollowToggle = async () => {
  try {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    const res = await axios.put(
      `/api/user/toggleFollow/${displayUser._id}`,
      {},
      {
        headers: { Authorization: token },
        withCredentials: true,
      }
    );

    toast.success(res?.data?.message || "Follow status updated");

    const updatedFollowers = isFollowing
      ? displayUser.followers.filter((id) => id !== user._id)
      : [...displayUser.followers, user._id];

    const updatedFollowing = isFollowing
      ? user.following.filter((id) => id !== displayUser._id)
      : [...user.following, displayUser._id];

    const updatedDisplayUser = {
      ...displayUser,
      followers: updatedFollowers,
    };

    const updatedAuthUser = {
      ...user,
      following: updatedFollowing,
    };

    setIsFollowing((prev) => !prev);

    // Update Redux
    if (isOwnProfile) {
      dispatch(setAuthUser(updatedAuthUser));
    } else {
      dispatch(setUserProfile(updatedDisplayUser));
      dispatch(setAuthUser(updatedAuthUser)); // 🟢 Update logged-in user also
    }

  } catch (err) {
    console.error("Follow toggle error:", err);
    toast.error("Failed to update follow status");
  }
};

  const handleEditProfile = () => navigate("/home/edit-profile");

  

  const onPostClick = (postId) => {
    console.log("Open post:", postId);
  };

  const displayUserPosts =
    (activeTab === "posts" ? displayUser?.posts : displayUser?.bookmarks) || [];

  if (authLoading && !displayUser) {
    return <div className="text-center text-gray-400">Loading profile…</div>;
  }

  if (!displayUser) {
    return <div className="text-center text-gray-400">Profile not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 md:p-8">
      <div className="flex flex-col items-center md:flex-row md:items-start gap-6 md:gap-10">
        <Avatar className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32">
          <AvatarImage
            src={displayUser?.profilePicture || "/default-avatar.png"}
            alt={displayUser?.username || "profile"}
            className="object-cover"
          />
          <AvatarFallback className="bg-gray-200 text-black text-4xl flex items-center justify-center">
            {(displayUser?.username?.slice(0, 2) || "US").toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="w-full text-center md:text-left">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              {displayUser?.username}
            </h1>

            {isOwnProfile && (
              <button
                onClick={handleEditProfile}
                className="px-4 mr-[50%] py-1.5 rounded-lg bg-gray-200 text-black text-sm hover:bg-gray-300"
              >
                Edit Profile
              </button>
            )}
          </div>

          {displayUser?.fullName && (
            <p className="text-sm text-gray-400 mt-1">{displayUser.fullName}</p>
          )}

          <p className="text-sm text-gray-500 mt-2 whitespace-pre-line">
            {displayUser?.bio || "No bio yet."}
          </p>

          <span className="text-sm text-gray-500 mt-2 block">
            {displayUser?.gender || "Gender"}
          </span>

          <div className="mt-4 flex flex-col items-center md:items-start gap-3">
            <div className="flex gap-6 text-sm text-gray-600">
              <span>
                <strong>{displayUser?.followers?.length || 0}</strong> Followers
              </span>
              <span>
                <strong>{displayUser?.following?.length || 0}</strong> Following
              </span>
              <span>
                <strong>{displayUser?.posts?.length || 0}</strong> Posts
              </span>
            </div>

            {!isOwnProfile && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFollowToggle}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold ${
                    isFollowing
                      ? "bg-red-200 text-red-600 hover:bg-red-300"
                      : "bg-sky-200 text-sky-600 hover:bg-sky-300"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>

              
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-t-gray-800 mt-8">
        <div className="flex items-center justify-center gap-20 text-sm">
          <span
            className={`py-5 cursor-pointer ${
              activeTab === "posts" ? "font-bold" : ""
            }`}
            onClick={() => setActiveTab("posts")}
          >
            POSTS
          </span>

          {isOwnProfile && (
            <span
              className={`py-5 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("saved")}
            >
              SAVED
            </span>
          )}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-5 mt-5">
          {displayUserPosts.length === 0 ? (
            <div className="col-span-3 text-center text-sm text-gray-500 py-10">
              {activeTab === "posts" ? "No posts yet." : "No saved posts yet."}
            </div>
          ) : (
            displayUserPosts.map((post, index) => (
              <div
                key={post?._id || `${index}-${post?.image}`}
                className="relative group cursor-pointer"
                onClick={() => onPostClick(post?._id)}
              >
                <img
                  src={post?.image}
                  alt="post"
                  className="w-full aspect-square object-cover rounded-sm"
                />

                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center space-x-6 text-white text-lg font-semibold">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      <span>{post?.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      <span>{post?.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

