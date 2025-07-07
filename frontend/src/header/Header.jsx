import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import personImage from "/contacts_product_24dp_0158CC_FILL0_wght400_GRAD0_opsz24.svg";
import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

function Header() {

  // javaScript code for this component
  

  


  return (
    <div className="w-full bg-slate-50 h-20 flex items-center">
      {/* div contains all the header divs */}
      <div className="flex gap-4 px-4 py-2 w-full justify-between ">
        {/* single header's div */}
        <div className="flex items-center justify-center pr-8">
          <div className="px-2 py-1">
            <MenuIcon sx={{ fontSize: 28 }} />
          </div>

          <img src={personImage} alt="Person Icon" className="w-10 h-10 pr-1" />
          <h1 className="text-2xl text-gray-600 pl-1">Contacts</h1>
        </div>
        {/* Right Section - Search and Settings */}
        <div className="flex items-center gap-4 w-[55%] justify-end">
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

          <div className="px-2 py-1 text-gray-500">
            <SettingsOutlinedIcon sx={{ fontSize: 28 }} />
          </div>
        </div>

        {/* profile, Login buttons */}
        <div className="flex items-center gap-4  justify-end">
          <AccountCircleOutlinedIcon />
        </div>


      </div>
    </div>
  );
}

export default Header;
