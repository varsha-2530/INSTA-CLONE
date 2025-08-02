import React from "react";
import Posts from "./Posts";
const MainFeed = () => {
  return (
  
    <div
      className="flex-1 my-2 mt-10 flex flex-col items-center 
  px-2 sm:px-4 
  md:pl-[15%] 
  lg:pl-[20%] 
  xl:pl-[25%] 
  lg:mr-[100px] 
  w-full"
    >
      <Posts />
    </div>
  );
};

export default MainFeed;
