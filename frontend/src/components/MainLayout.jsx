// import React from "react";
// import { Outlet } from "react-router-dom";
// import LeftSideBar from "../components/LeftSideBar";

// const MainLayout = () => {
//   return (
//     <div className="flex bg-black text-white min-h-screen">
//       {/* Hide sidebar on small screens */}
//       <aside className="hidden md:block w-64">
//         <LeftSideBar />
//       </aside>

//       <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default MainLayout;



import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import LeftSideBar from "../components/LeftSideBar";
import { Menu } from "lucide-react"; // hamburger icon

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex bg-black text-white min-h-screen relative">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-4 absolute top-2 left-2 z-50 bg-gray-800 rounded-full"
      >
        <Menu className="h-6 w-6 text-white" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full bg-gray-900 w-64 z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <LeftSideBar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 ml-0 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

