import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import personImage from "/contacts_product_24dp_0158CC_FILL0_wght400_GRAD0_opsz24.svg";
import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useSelector } from "react-redux";
import LogoutBtn from "./LogoutBtn";
import HelpIcon from "@mui/icons-material/Help";
import { authService } from "../../Services/authService";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  console.log("Auth Status:", authStatus);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  return (
    <div className="w-full bg-slate-50 h-20 flex items-center">
      <div className="flex gap-4 px-4 py-2 w-full justify-between">
        {/* Left section */}
        <div className="flex items-center justify-center pr-8">
          <div className="px-2 py-1 pr-4">
            <MenuIcon sx={{ fontSize: 28 }} />
          </div>
          <img src={personImage} alt="Person Icon" className="w-10 h-10 pr-1" />
          <h1 className="text-2xl text-gray-600 pl-1">Contacts</h1>
        </div>

        {/* Middle - Search */}
        <div className="flex items-center gap-4 w-[45%] justify-end">
          <div
            className="flex items-center bg-gray-200 h-12 w-full rounded-lg"
            style={{ padding: "0px 30px 0px 10px" }}
          >
            <SearchIcon className="text-gray-600 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-500"
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
            <HelpIcon sx={{ fontSize: 28 }} />
          </div>

          <div className="px-2 py-1 text-gray-600">
            <SettingsOutlinedIcon sx={{ fontSize: 28 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
