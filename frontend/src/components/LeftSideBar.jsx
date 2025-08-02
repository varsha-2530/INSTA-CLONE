import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  User,
} from "lucide-react";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/Redux/authSlice";
import { setPosts, setSelectedPost } from "@/Redux/postSlice";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const handleError = (error) => {
    const msg =
      error?.response?.data?.errorMsg ||
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    toast.error(msg);
  };

  const SidebarItems = [
    { icon: <Home />, text: "Home", path: "/home" },
    { icon: <Search />, text: "Search", path: "/home/search" },
    { icon: <TrendingUp />, text: "Trending", path: "/home/trending" },
    { icon: <MessageCircle />, text: "Messages", path: "/home/messages" },
    { icon: <Heart />, text: "Notification", path: "/home/notifications" },
    { icon: <PlusSquare />, text: "CreatePost", path: "/home/CreatePost" },
    {
      icon: <User />,
      text: "Profile",
      path: user?._id ? `/home/profile/${user._id}` : "/home/profile",
      avatarUrl: user?.profilePicture,
    },
  ];

  const toastMap = {
    Home: "🏠 Welcome Home!",
    Search: "🔍 Time to search!",
    Trending: "📈 You're trending now!",
    Messages: "💬 Checking messages...",
    Notification: "❤️ Love is in the air!",
    CreatePost: "➕ Let's post something new!",
    Profile: "👤 Viewing profile",
  };

  const logOutHandler = async () => {
    try {
      const res = await axios.get("/api/User/logout", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.message) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([])); // ✅ Correct action name
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };

  return (
    <div className="w-[290px] border-r border-gray-800 p-10 mt-2 space-y-9 min-h-screen bg-black text-white">
      {/* Logo */}
      <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text font-[cursive] text-center">
        ChatTALK
      </h1>

      {/* Sidebar Navigation */}
      <div className="space-y-6 m-4 relative">
        {SidebarItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            onClick={() => toast(toastMap[item.text])}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded hover:bg-gray-800 ${
                isActive ? "bg-gray-800 font-semibold" : ""
              } text-white`
            }
          >
            <div className="flex items-center gap-3">
              <div className="text-xl">{item.icon}</div>
              <span className="text-base">{item.text}</span>
            </div>

            {/* Avatar for Profile */}
            {item.text === "Profile" && (
              <Avatar className="w-10 h-10 ml-3">
                <AvatarImage src={item.avatarUrl} alt="Profile" />
                <AvatarFallback>
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            )}
          </NavLink>
        ))}

        {/* Logout Button */}
        <button
          onClick={logOutHandler}
          className="flex items-center px-3 py-2 rounded hover:bg-gray-800 text-red-400 hover:text-red-500 w-full"
        >
          <div className="flex items-center gap-3">
            <LogOut className="text-xl" />
            <span className="text-base">Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default LeftSideBar;
