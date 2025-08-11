// import { Outlet } from "react-router-dom";
// import MainFeed from "./MainFeed";
// import RightSideBar from "./RightSideBar";
// import GetAllPost from "@/Hook/GetAllPost";
// import GetSuggestedUser from "@/Hook/GetSuggestedUser";

// const Home = () => {
//   GetAllPost()
//   GetSuggestedUser()
//   return (
//     <div className="flex min-h-screen w-full bg-black text-white">
//       {/* Main Feed */}
//       <div className="flex-grow w-full max-w-[850px]">
//         <MainFeed />
//         <Outlet />
//       </div>

//       {/* Right Sidebar - narrower */}
//       <div className="hidden lg:block w-[160px] ">
//         <RightSideBar />
//       </div>
//     </div>
//   );
// };

// export default Home;

import { Outlet } from "react-router-dom";
import MainFeed from "./MainFeed";
import RightSideBar from "./RightSideBar";
import GetAllPost from "@/Hook/GetAllPost";
import GetSuggestedUser from "@/Hook/GetSuggestedUser";

const Home = () => {
  // GetAllPost();
  // GetSuggestedUser();

  return (
    <div className="flex w-full min-h-screen bg-black text-white">
     
       <GetAllPost />
      <GetSuggestedUser />
      
      {/* Main Feed */}
      <div
        className="
      flex-grow
      w-full
      max-w-[850px]
      px-2 sm:px-4
      mx-auto
      mr-[8%]
    "
      >
        <MainFeed />
        <Outlet />
      </div>

      {/* Right Sidebar - only on large screens */}
      <div className="hidden lg:block w-[220px] mr-10 pr-7">
        <RightSideBar />
      </div>
    </div>
  );
};

export default Home;
