import React, { useState } from "react";
import { Header, Sidebar } from "./index";
import { Outlet, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();
  const noSidebarRoutes = ["/login", "/signup"];
  const noHeaderRoutes = ["/login", "/signup"];
  const hideSidebar = noSidebarRoutes.includes(location.pathname);
  const hideHeader = noHeaderRoutes.includes(location.pathname);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      {!hideSidebar && <Sidebar isOpen={isSidebarOpen} />}

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ${
          !hideSidebar && isSidebarOpen ? "ml-72" : ""
        }`}
      >
        {!hideHeader && <Header onMenuClick={toggleSidebar} />}
        <main
          className={`${
            !hideHeader ? "mt-20" : ""
          } bg-gray-50 transition-all duration-300`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
