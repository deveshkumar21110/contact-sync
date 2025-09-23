import React, { useState, useEffect } from "react";
import { Header, Sidebar } from "./index";
import { Outlet, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();
  const noSidebarRoutes = ["/login", "/signup"];
  const noHeaderRoutes = ["/login", "/signup"];
  const hideSidebar = noSidebarRoutes.includes(location.pathname);
  const hideHeader = noHeaderRoutes.includes(location.pathname);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // open sidebar only if screen is >= 1024px (lg in Tailwind)
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      {!hideSidebar && (
        <>
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          {/* Overlay only for mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-y-0 left-72 right-0 bg-black transition-all duration-800 bg-opacity-50 z-40 lg:hidden"
              onClick={toggleSidebar}
            />
          )}
        </>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ${
          !hideSidebar && isSidebarOpen ? "lg:ml-72" : ""
        }`}
      >
        {!hideHeader && <Header onMenuClick={toggleSidebar} />}
        <main
          className={`${
            !hideHeader ? "mt-20" : ""
          } bg-gray-50 transition-all duration-300 min-h-screen`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
