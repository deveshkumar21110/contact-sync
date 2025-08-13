import React, { createContext, useContext, useState, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
    autoHideDuration: 6000,
    showAction: false,
    anchorOrigin: { vertical: "bottom", horizontal: "center" }, // default
  });

  const showSnackbar = useCallback((message, options = {}) => {
    setSnackbar({
      open: true,
      message,
      severity: options.severity || "info",
      autoHideDuration: options.autoHideDuration ?? 6000,
      showAction: options.showAction ?? false,
      anchorOrigin: options.anchorOrigin || { vertical: "bottom", horizontal: "left" },
    });
  }, []);

  const hideSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const action = snackbar.showAction ? (
    <>
      <Button color="secondary" size="small" onClick={hideSnackbar}>
        UNDO
      </Button>
      <IconButton size="small" color="inherit" onClick={hideSnackbar}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  ) : (
    <IconButton size="small" color="inherit" onClick={hideSnackbar}>
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.autoHideDuration}
        onClose={hideSnackbar}
        message={snackbar.message}
        action={action}
        anchorOrigin={snackbar.anchorOrigin} // now position is dynamic
      />
    </SnackbarContext.Provider>
  );
};

// Hook for consuming
export const useSnackbar = () => useContext(SnackbarContext);
