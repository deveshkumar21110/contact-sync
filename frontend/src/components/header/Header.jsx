import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import personImage from "/contacts_product_24dp_0158CC_FILL0_wght400_GRAD0_opsz24.svg";
import SearchIcon from "@mui/icons-material/Search";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useSelector } from "react-redux";
import LogoutBtn from "./LogoutBtn";
import { authService } from "../../Services/authService";
import { NavLink, useNavigate } from "react-router-dom";
import { HelpOutlineOutlined } from "@mui/icons-material";
import { ContactSearchModal } from "../../index";

function Header({ onMenuClick }) {
  const authStatus = useSelector((state) => state.auth.status);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, [authStatus]);

  const handleSelectContact = (contact) => {
    // Navigate to contact detail page or handle selection
    console.log("Selected contact:", contact);
    navigate(`/person/${contact.id}`);
  };

  return (
    <>
      <div className="w-full bg-slate-50 h-20 items-center fixed top-0 left-0 z-50 hidden md:flex">
        <div className="flex gap-4 px-4 py-2 w-full justify-between">
          {/* Left section */}
          <div className="flex items-center justify-center pr-8">
            <div className="p-3 rounded-full hover:rounded-full hover:bg-gray-200 cursor-pointer">
              <MenuIcon
                sx={{ fontSize: 28, cursor: "pointer", color: "#818589" }}
                onClick={onMenuClick}
              />
            </div>
            <NavLink to="/" className="flex items-center justify-center">
              <img
                src={personImage}
                alt="Person Icon"
                className="w-10 h-10 pr-1"
              />
              <h1 className="text-2xl text-gray-600 md:pl-1">Contacts</h1>
            </NavLink>
          </div>

          {/* Middle - Search */}
          <div className="flex items-center gap-4 w-[45%] justify-end">
            <div
              className="flex items-center bg-gray-200 h-12 w-full rounded-lg cursor-pointer hover:bg-gray-300 transition-colors"
              style={{ padding: "0px 30px 0px 10px" }}
              onClick={() => setIsSearchModalOpen(true)}
            >
              <SearchIcon className="text-gray-600 mr-2" />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-500 pointer-events-none"
                readOnly
              />
            </div>
          </div>

          {/* Right - Profile, Help, Settings */}
          <div className="flex items-center gap-4 justify-end">
            <div className="px-2 py-1 text-gray-600">
              {currentUser?.profile_image_url ? (
                <img
                  src={currentUser.profile_image_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <AccountCircleOutlinedIcon sx={{ fontSize: 28 }} />
              )}
            </div>

            {authStatus && <LogoutBtn />}

            <div className="px-2 py-1 text-gray-600">
              <HelpOutlineOutlined sx={{ fontSize: 28 }} />
            </div>

            <div className="px-2 py-1 text-gray-600">
              <SettingsOutlinedIcon sx={{ fontSize: 28 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 w-full z-50 bg-white md:hidden h-20">
        <div className="flex items-center bg-pink-100 px-2 w-full h-full">
          {/* Menu Icon */}
          <button onClick={onMenuClick} className="flex-shrink-0 p-1">
            <MenuIcon sx={{ fontSize: 28, color: "#818589" }} />
          </button>

          {/* Search Bar */}
          <div 
            className="flex items-center bg-pink-200 rounded-full h-12 px-3 ml-2 w-0 flex-1 min-w-0 cursor-pointer"
            onClick={() => setIsSearchModalOpen(true)}
          >
            <SearchIcon
              className="text-gray-500 mr-2 flex-shrink-0"
              sx={{ fontSize: 20 }}
            />
            <input
              type="text"
              placeholder="Search contacts"
              className="w-0 flex-1 min-w-0 bg-transparent outline-none text-gray-700 placeholder:text-gray-500 text-sm pointer-events-none"
              readOnly
            />
            <div className="ml-2 flex-shrink-0">
              {currentUser?.profile_image_url ? (
                <img
                  src={currentUser.profile_image_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <AccountCircleOutlinedIcon
                  sx={{ fontSize: 32, color: "#666" }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal - Works for both desktop and mobile */}
      <ContactSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectContact={handleSelectContact}
      />
    </>
  );
}

export default Header;