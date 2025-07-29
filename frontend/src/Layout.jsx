import React, { useState } from "react";
import { Header, Sidebar } from "./index";
import { Outlet, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();
  const noSidebarRoutes = ["/login", "/signup"];
  const hideSidebar = noSidebarRoutes.includes(location.pathname);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {!hideSidebar && isSidebarOpen && (
        <div className="pt-20">
          <Sidebar />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1">
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 mt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
