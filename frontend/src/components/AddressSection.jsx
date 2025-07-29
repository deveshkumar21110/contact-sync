import React from "react";
import { Stack } from "@mui/material";
import { LocationOnOutlined } from "@mui/icons-material";
import { IconTextField, AddButton } from "../index"; // adjust the path

function AddressSection({ register }) {
  return (
    <Stack spacing={2}>
      <IconTextField
        icon={<LocationOnOutlined />}
        label="Country / Region"
        name="country"
        register={register}
      />
      <IconTextField
        label="Street address"
        name="streetAddress"
        register={register}
      />
      <IconTextField
        label="Street address line 2 (Optional)"
        name="streetAddress2"
        register={register}
      />
      <IconTextField
        label="City"
        name="city"
        register={register}
      />
      <IconTextField
        label="Pincode"
        name="pincode"
        register={register}
      />
      <IconTextField
        label="State"
        name="state"
        register={register}
      />
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <div style={{ width: 40 }}></div>
        <AddButton label="Add address" icon={<LocationOnOutlined />} />
      </Stack>
    </Stack>
  );
}

export default AddressSection;
