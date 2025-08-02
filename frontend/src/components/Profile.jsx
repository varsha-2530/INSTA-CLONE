// import React, { useEffect, useMemo, useState } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import useGetUserProfile from "@/Hook/useGetUserProfile";
// import { Heart, MessageCircle } from "lucide-react";

// const Profile = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   // Redux state: auth me user (self) aur userProfile (other) aa raha hai
//   const {
//     user,
//     userProfile,
//     loading: authLoading,
//   } = useSelector((s) => s.auth || {});

//   // ✅ Kiski profile dekh rahe ho (current ya other)?
//   const isOwnProfile = useMemo(() => !id || id === user?._id, [id, user?._id]);

//   // ✅ Dusre user ka profile fetch karo; own profile par no-op
//   // (Hook rule: hamesha call karo, par param se control do)
//   useGetUserProfile(isOwnProfile ? null : id);

//   // ✅ Display user ka data source
//   const displayUser = isOwnProfile ? user : userProfile;

//   // Tabs: own profile par "posts" / "saved", other par sirf "posts"
//   const [activeTab, setActiveTab] = useState("posts");
//   useEffect(() => {
//     if (!isOwnProfile && activeTab === "saved") {
//       setActiveTab("posts");
//     }
//   }, [isOwnProfile, activeTab]);

//   // ✅ Hamesha array fallback
//   const displayUserPosts =
//     (activeTab === "posts" ? displayUser?.posts : displayUser?.bookmarks) || [];

//   // Loading state
//   if (authLoading && !displayUser) {
//     return (
//       <div className="max-w-4xl mx-auto w-full p-4 text-center text-gray-400">
//         Loading profile…
//       </div>
//     );
//   }

//   if (!displayUser) {
//     return (
//       <div className="max-w-4xl mx-auto w-full p-4 text-center text-gray-400">
//         Profile not found.
//       </div>
//     );
//   }

//   // Handlers
//   const handleEditProfile = () => navigate("/home/edit-profile");

//   const handleFollowToggle = async () => {
//     // TODO: Isse apne API / Redux thunk se wire karein
//     // Example: await dispatch(toggleFollow(displayUser._id)).unwrap();
//     console.log("Follow/Unfollow clicked for:", displayUser?._id);
//   };

//   const handleMessage = () => {
//     // Aap apne messages page par query param ke saath ja sakte ho
//     navigate(`/home/messages?to=${displayUser?._id}`);
//   };

//   const onPostClick = (postId) => {
//     // TODO: Yahan aap post dialog open kar sakte ho ya route kar sakte ho
//     // navigate(`/home/post/${postId}`);
//     console.log("Open post:", postId);
//   };

//   return (
//     <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 md:p-8">
//       <div className="flex flex-col items-center md:flex-row md:items-start gap-6 md:gap-10">
//         {/* Avatar */}
//         <Avatar className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32">
//           <AvatarImage
//             src={displayUser?.profilePicture || "/default-avatar.png"}
//             alt={displayUser?.username || "profile"}
//             className="object-cover"
//           />
//           <AvatarFallback className="bg-gray-200 text-black text-4xl flex items-center justify-center">
//             {(displayUser?.username?.slice(0, 2) || "US").toUpperCase()}
//           </AvatarFallback>
//         </Avatar>

//         {/* Info Section */}
//         <div className="w-full text-center md:text-left">
//           {/* Username + Button Row */}
//           <div className="flex items-center justify-between gap-3">
//             <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
//               {displayUser?.username}
//             </h1>

//             {/* Right side Edit button (only own profile) */}
//             {isOwnProfile ? (
//               <button
//                 type="button"
//                 onClick={handleEditProfile}
//                 className="px-4 mr-[50%] py-1.5 rounded-lg bg-gray-200 text-black text-sm hover:bg-gray-300"
//               >
//                 Edit Profile
//               </button>
//             ) : null}
//           </div>

//           {/* Full Name */}
//           {displayUser?.fullName && (
//             <p className="text-sm text-gray-400 mt-1">{displayUser.fullName}</p>
//           )}

//           {/* Bio */}
//           <p className="text-sm text-gray-500 mt-2 whitespace-pre-line">
//             {displayUser?.bio || "No bio yet."}
//           </p>

//           {/* Static info lines */}
//           <span className="text-sm text-gray-500 mt-2 block">
//             {displayUser?.gender || "Gender"}
//           </span>

//           {/* Counts + CTA Buttons */}
//           <div className="mt-4 flex flex-col items-center md:items-start gap-3">
//             <div className="flex gap-6 text-sm text-gray-600">
//               <span>
//                 <strong>{displayUser?.followers?.length || 0}</strong> Followers
//               </span>
//               <span>
//                 <strong>{displayUser?.following?.length || 0}</strong> Following
//               </span>
//               <span>
//                 <strong>{displayUser?.posts?.length || 0}</strong> Posts
//               </span>
//             </div>

//             {/* Other user CTAs */}
//             {!isOwnProfile && (
//               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={handleFollowToggle}
//                   className="px-4 py-1.5 rounded-lg bg-gray-200 text-black text-sm hover:bg-gray-300"
//                 >
//                   {displayUser?.isFollowedByAuthUser ? "Unfollow" : "Follow"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleMessage}
//                   className="px-4 py-1.5 rounded-lg bg-gray-200 text-black text-sm hover:bg-gray-300"
//                 >
//                   Message
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="border-t border-t-gray-800 mt-8">
//         <div className="flex items-center justify-center gap-20 text-sm">
//           <span
//             className={`py-5 cursor-pointer ${
//               activeTab === "posts" ? "font-bold" : ""
//             }`}
//             onClick={() => setActiveTab("posts")}
//           >
//             POSTS
//           </span>

//           {isOwnProfile && (
//             <span
//               className={`py-5 cursor-pointer ${
//                 activeTab === "saved" ? "font-bold" : ""
//               }`}
//               onClick={() => setActiveTab("saved")}
//             >
//               SAVED
//             </span>
//           )}
//         </div>

//         {/* Posts Grid */}
//         <div className="grid grid-cols-3 gap-5 mt-5">
//           {displayUserPosts.length === 0 ? (
//             <div className="col-span-3 text-center text-sm text-gray-500 py-10">
//               {activeTab === "posts" ? "No posts yet." : "No saved posts yet."}
//             </div>
//           ) : (
//             displayUserPosts.map((post, index) => (
//               <div
//                 key={post?._id || `${index}-${post?.image}`}
//                 className="relative group cursor-pointer"
//                 onClick={() => onPostClick(post?._id)}
//               >
//                 {/* Image */}
//                 <img
//                   src={post?.image}
//                   alt="post"
//                   className="w-full aspect-square object-cover rounded-sm"
//                 />

//                 {/* Hover Overlay */}
//                 <div
//                   className="absolute inset-0 bg-black/50 flex items-center justify-center
//                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                 >
//                   <div className="flex items-center space-x-6 text-white text-lg font-semibold">
//                     <div className="flex items-center gap-2">
//                       <Heart className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
//                       <span>{post?.likes?.length || 0}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <MessageCircle className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
//                       <span>{post?.comments?.length || 0}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;



import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useGetUserProfile from "@/Hook/useGetUserProfile";
import { Heart, MessageCircle } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    user,
    userProfile,
    loading: authLoading,
  } = useSelector((s) => s.auth || {});

  const isOwnProfile = useMemo(() => !id || id === user?._id, [id, user?._id]);
  useGetUserProfile(isOwnProfile ? null : id);
  const displayUser = isOwnProfile ? user : userProfile;

  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    if (!isOwnProfile && activeTab === "saved") {
      setActiveTab("posts");
    }
  }, [isOwnProfile, activeTab]);

  const displayUserPosts =
    (activeTab === "posts" ? displayUser?.posts : displayUser?.bookmarks) || [];

  if (authLoading && !displayUser) {
    return (
      <div className="max-w-4xl mx-auto w-full p-4 text-center text-gray-400">
        Loading profile…
      </div>
    );
  }

  if (!displayUser) {
    return (
      <div className="max-w-4xl mx-auto w-full p-4 text-center text-gray-400">
        Profile not found.
      </div>
    );
  }

  const handleEditProfile = () => navigate("/home/edit-profile");

  const handleFollowToggle = async () => {
    console.log("Follow/Unfollow clicked for:", displayUser?._id);
  };

  const handleMessage = () => {
    navigate(`/home/messages?to=${displayUser?._id}`);
  };

  const onPostClick = (postId) => {
    console.log("Open post:", postId);
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 md:p-8">
      <div className="flex flex-col items-center md:flex-row md:items-start gap-6 md:gap-10">
        {/* Avatar */}
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

        {/* Info Section */}
        <div className="w-full text-center md:text-left">
          {/* Username + Button Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              {displayUser?.username}
            </h1>

            {isOwnProfile && (
              <button
                type="button"
                onClick={handleEditProfile}
                className="px-4 py-1.5 mt-3 rounded-lg bg-gray-200 text-black text-sm hover:bg-gray-300"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Full Name */}
          {displayUser?.fullName && (
            <p className="text-sm text-gray-400 mt-1">{displayUser.fullName}</p>
          )}

          {/* Bio */}
          <p className="text-sm text-gray-500 mt-2 whitespace-pre-line">
            {displayUser?.bio || "No bio yet."}
          </p>

          <span className="text-sm text-gray-500 mt-2 block">
            {displayUser?.gender || "Gender"}
          </span>

          {/* Counts and CTA */}
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
                  type="button"
                  onClick={handleFollowToggle}
                  className="px-4 py-1.5 rounded-lg bg-gray-200 text-black text-sm hover:bg-gray-300"
                >
                  {displayUser?.isFollowedByAuthUser ? "Unfollow" : "Follow"}
                </button>
                <button
                  type="button"
                  onClick={handleMessage}
                  className="px-4 py-1.5 rounded-lg bg-gray-200 text-black text-sm hover:bg-gray-300"
                >
                  Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-t-gray-800 mt-8">
        <div className="flex items-center justify-center gap-10 sm:gap-20 text-sm">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 mt-5">
          {displayUserPosts.length === 0 ? (
            <div className="col-span-full text-center text-sm text-gray-500 py-10">
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
