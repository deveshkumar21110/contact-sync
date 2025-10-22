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
  Star,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { fetchLabels, STATUSES } from "../../redux/labelSlice";
import {
  selectContacts,
  selectFavouriteContacts,
  selectTrashedContacts,
} from "../../redux/contactSlice";

const Sidebar = ({ isOpen = true, toggleSidebar }) => {
  const contactCount = useSelector(selectContacts).length;
  const favouriteCount = useSelector(selectFavouriteContacts).length;
  const trashContacts = useSelector(selectTrashedContacts).length;
  const dispatch = useDispatch();
  const {
    data: labels,
    status,
    hasFetched,
  } = useSelector((state) => state.label);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasFetched && status === STATUSES.IDLE) {
      dispatch(fetchLabels());
    }
  }, [dispatch, hasFetched, status]);

  const handleNavClick = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      toggleSidebar?.(); // close sidebar on mobile
    }
  };

  return (
    <div
      className={`fixed top-20 left-0 w-72 h-screen md:bg-gray-50 bg-pink-100 p-6 flex flex-col z-40 transition-transform duration-300
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
            },
          }}
          onClick={() => handleNavClick("/new")}
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
              onClick={() => handleNavClick("/")}
            />
          </Link>
        </div>
        <div className="space-y-1 pt-4">
          <Link to="/favorites">
            <SidebarItem
              icon={<Star />}
              label="Favorites"
              badge={favouriteCount}
              active={location.pathname === "/favorites"}
              onClick={() => handleNavClick("/favorites")}
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
            onClick={() => handleNavClick("/")}
          />
          <SidebarItem
            icon={<FileDownloadOutlined />}
            label="Import"
            active={location.pathname === "/import"}
            onClick={() => handleNavClick("/import")}
            />
          <SidebarItem
            icon={<DeleteOutlineOutlined />}
            label="Trash"
            badge={trashContacts}
            active={location.pathname === "/trash"}
            onClick={() => handleNavClick("/trash")}
          />
        </div>

        {/* Labels */}
        <p className="text-sm mt-6 mb-2">Labels</p>
        {labels.map((label) => (
          <div
            key={label.id}
            className={`flex items-center px-3 py-2 cursor-pointer rounded-3xl transition-colors duration-150
              ${
                location.pathname === `/label/${label.id}`
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-blue-100 hover:text-blue-700 text-gray-700"
              }`}
            onClick={() => handleNavClick(`/label/${label.id}`)}
          >
            <Label className="text-gray-700" fontSize="medium" />
            <span className="md:pl-3 text-base font-medium flex-1">
              {label.name}
            </span>
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
      <span>{icon}</span>
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
