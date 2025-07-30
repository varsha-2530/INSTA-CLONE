import { Outlet } from "react-router-dom";
import MainFeed from "./MainFeed";
import RightSideBar from "./RightSideBar";
import GetAllPost from "@/Hook/GetAllPost";
import GetSuggestedUser from "@/Hook/GetSuggestedUser";

const Home = () => {
  GetAllPost()
  GetSuggestedUser()
  return (
    <div className="flex min-h-screen w-full bg-black text-white">
      {/* Main Feed */}
      <div className="flex-grow w-full max-w-[850px]">
        <MainFeed />
        <Outlet />
      </div>

      {/* Right Sidebar - narrower */}
      <div className="hidden lg:block w-[160px] ">
        <RightSideBar />
      </div>
    </div>
  );
};

export default Home;
