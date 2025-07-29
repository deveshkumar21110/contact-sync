import React from "react";
import { Button } from "@mui/material";

function AddButton({ label = "Add", icon, onClick }) {
  return (
    <Button
      variant="contained"
      startIcon={icon}
      onClick={onClick}
      fullWidth
      sx={{
        color: "#1976d2",
        backgroundColor: "#e1e6f0",
        borderRadius: "999px",
        textTransform: "none",
        boxShadow: "none",
        border: "none",
        fontWeight: 500,
        fontSize: "1rem",
        py: 1,
        justifyContent: "center",
        pl: 2,
        "&:hover": {
          backgroundColor: "#e7f0fa",
          boxShadow: "none",
          border: "none",
        },
      }}
    >
      {label}
    </Button>
  );
}

export default AddButton;
