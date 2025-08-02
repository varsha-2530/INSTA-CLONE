


import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import LeftSideBar from "../components/LeftSideBar";
import { Menu } from "lucide-react";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black text-white relative">
      {/* Sidebar for medium and larger screens */}
      <aside className="hidden md:block w-64">
        <LeftSideBar />
      </aside>

      {/* Hamburger menu for small screens */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white p-2 focus:outline-none"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar drawer for small screens */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-90 md:hidden">
          <div className="w-64 h-full bg-black p-4 shadow-lg">
            <button
              className="text-white mb-4"
              onClick={() => setIsSidebarOpen(false)}
            >
              Close
            </button>
            <LeftSideBar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
