import React from "react";
import { Outlet } from "react-router-dom";
import LeftSideBar from "../components/LeftSideBar";

const MainLayout = () => {
  return (
    <div className="flex bg-black text-white min-h-screen">
      {/* Hide sidebar on small screens */}
      <aside className="hidden md:block w-64">
        <LeftSideBar />
      </aside>

      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
