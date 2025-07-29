import React from "react";
import { Stack, TextField } from "@mui/material";

function IconTextField({ icon, label, register, name, ...rest }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%" }}>
      <div style={{ width: 40, display: "flex", justifyContent: "center" }}>
        {icon}
      </div>
      <TextField
        {...register(name)}
        label={label}
        sx={{ flexGrow: 1 }}
        {...rest}
      />
    </Stack>
  );
}

export default IconTextField;