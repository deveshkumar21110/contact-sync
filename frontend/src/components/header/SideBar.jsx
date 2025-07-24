import React from "react";
import {
  Person,
  Add,
  History,
  Info,
  Build,
  Download,
  Delete,
  Folder,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-72 bg-gray-50 h-screen p-6 flex flex-col border-r border-gray-200 shadow-md">
      <div>
        {/* Create Contact Button */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#C2E7FF",
            color: "black",
            textTransform: "none",
            borderRadius: "12px",
            boxShadow: "none",
            px: 4,
            py: 2,
            fontWeight: 500,
            fontSize: "0.95rem",
            "&:hover": {
              backgroundColor: "#A0D7FF",
              boxShadow: "none",
            },
          }}
        >
          Create contact
        </Button>

        {/* Navigation */}
        <div className="space-y-1">
          <SidebarItem
            icon={<Person />}
            label="Contacts"
            badge="3"
            onClick={() => {
              navigate("/home");
            }}
          />
          {/* <SidebarItem icon={<History />} label="Frequent" /> */}
          <SidebarItem icon={<Info />} label="Other contacts" />
        </div>

        {/* Fix & Manage */}
        <p className="text-sm mt-6 mb-2">Fix & manage</p>
        <div className="space-y-1">
          <SidebarItem icon={<Build />} label="Merge & fix" />
          <SidebarItem icon={<Download />} label="Import" />
          <SidebarItem icon={<Delete />} label="Trash" />
        </div>

        {/* Labels */}
        <p className="text-sm mt-6 mb-2">Labels</p>
        <div className="space-y-1">
          <SidebarItem icon={<Folder />} label="Companies" badge="1" />
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, badge, onClick }) => (
  <div
    className="flex items-center justify-between text-[15px] font-medium hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-100 transition-colors duration-150 p-2 rounded-lg cursor-pointer group"
    onClick={onClick}
  >
    <div className="flex items-center space-x-3">
      <span className="text-blue-600 group-hover:text-blue-700 transition-colors duration-150">
        {icon}
      </span>
      <span>{label}</span>
    </div>
    {badge && (
      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2 font-semibold">
        {badge}
      </span>
    )}
  </div>
);

export default Sidebar;
