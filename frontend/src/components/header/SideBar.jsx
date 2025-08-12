import React, { useEffect } from "react";
import {
  Person,
  Build,
  Download,
  Delete,
  Label,
  HandymanOutlined,
  FileDownloadDoneOutlined,
  FileDownloadOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { fetchLabels, STATUSES } from "../../redux/labelSlice";

const Sidebar = ({ isOpen = true }) => {
  const contactCount = useSelector((state) => state.contact?.data?.length);
  const dispatch = useDispatch();
  const { data: labels, status } = useSelector((state) => state.label);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (labels.length === 0 && status === STATUSES.IDLE) {
      dispatch(fetchLabels());
    }
  }, [dispatch, labels.length, status]);

  return (
    <div
      className={`fixed top-20 left-0 w-72 h-screen bg-gray-50 p-6 flex flex-col z-40 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
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
            borderRadius: "16px",
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
          onClick={() => navigate("/new")}
        >
          Create contact
        </Button>

        {/* Navigation */}
        <div className="space-y-1 pt-4">
          <Link to="/">
            <SidebarItem
              icon={<Person />}
              label="Contacts"
              badge={contactCount}
              active={location.pathname === "/"}
            />
          </Link>
        </div>

        {/* Fix & Manage */}
        <p className="text-sm mt-6 mb-2">Fix & manage</p>
        <div className="space-y-1">
          <SidebarItem
            icon={<HandymanOutlined />}
            label="Merge & fix"
            active={location.pathname === "/merge-fix"}
          />
          <SidebarItem
            icon={<FileDownloadOutlined />}
            label="Import"
            active={location.pathname === "/import"}
          />
          <SidebarItem
            icon={<DeleteOutlineOutlined />}
            label="Trash"
            active={location.pathname === "/trash"}
          />
        </div>

        {/* Labels */}
        <p className="text-sm mt-6 mb-2">Labels</p>
        {labels.map((label) => (
          <div
            key={label.id}
            className={`flex items-center px-3 py-2 cursor-pointer rounded-3xl transition-colors duration-150
              ${location.pathname === `/label/${label.id}`
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-blue-100 hover:text-blue-700 text-gray-700"}`}
            onClick={() => navigate(`/label/${label.id}`)}
          >
            <Label className="text-gray-700" fontSize="medium" />
            <span className="pl-3 text-base font-medium flex-1">{label.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, badge, onClick, active }) => (
  <div
    className={`flex items-center justify-between text-[15px] font-medium px-3 py-2 rounded-3xl cursor-pointer group
      ${active ? "bg-blue-100 " : "text-gray-700 hover:bg-blue-100 "}`}
    onClick={onClick}
  >
    <div className="flex items-center space-x-3">
      <span
      >
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
