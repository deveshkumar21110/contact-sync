import React from "react";
import { ContentCopyOutlined } from "@mui/icons-material";
import { useSnackbar } from "../index";

const CopyIcon = ({ value, className = "" }) => {
  const { showSnackbar } = useSnackbar();

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard
      .writeText(value)
      .catch((err) => console.error("Failed to copy!", err));

    showSnackbar("Copied", {
      severity: "info",
      autoHideDuration: null, 
    });
  };

  return (
    <span
      onClick={handleCopy}
      className={`pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-700 cursor-pointer ${className}`}
    >
      <ContentCopyOutlined fontSize="small" />
    </span>
  );
};

export default CopyIcon;
