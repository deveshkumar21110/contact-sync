
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

const Sidebar = () => {
  return (
    <div className="w-64  bg-slate-50 h-screen p-4 flex flex-col justify-between">
      <div>

        {/* Create Contact Button */}
        <Button
          variant="contained"
          className=" !normal-case w-full !rounded-lg !py-2 mb-4 "
          startIcon={<Add />}
        >
          Create contact
        </Button>

        {/* Navigation */}
        <div className="space-y-1">
          <SidebarItem icon={<Person />} label="Contacts" badge="3" />
          <SidebarItem icon={<History />} label="Frequent" />
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

const SidebarItem = ({ icon, label, badge }) => (
  <div className="flex items-center justify-between text-sm hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
    <div className="flex items-center space-x-3">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
    {badge && <span className="text-xs">{badge}</span>}
  </div>
);

export default Sidebar;