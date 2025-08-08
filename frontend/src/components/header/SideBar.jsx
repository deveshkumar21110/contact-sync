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
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = ({ isOpen = true }) => {
    const contactCount = useSelector((state) => state.contact.data.length);
  const navigate = useNavigate();
  return (
    <div
      className={`fixed top-20 left-0 w-72 h-screen bg-gray-50 p-6 flex flex-col  z-40 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
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
          onClick={() => navigate('/new')}
        >
          Create contact
        </Button>

        {/* Navigation */}
        <div className="space-y-1 pt-4">
          <Link to="/">
            <SidebarItem icon={<Person />} label="Contacts" badge={contactCount} />
          </Link>
          {/* <SidebarItem icon={<Info />} label="Other contacts" /> */}
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
