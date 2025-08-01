import React from "react";
import { Stack } from "@mui/material";
import { LocationOnOutlined } from "@mui/icons-material";
import { IconTextField, AddButton } from "../index"; // adjust the path

function AddressSection({ register, index }) {
  return (
    <Stack spacing={2}>
      <IconTextField
        icon={<LocationOnOutlined />}
        label="Country / Region"
        name={`addresses.${index}.country`}
        register={register}
      />
      <IconTextField
        label="Street address"
        name={`addresses.${index}.streetAddress`}
        register={register}
      />
      <IconTextField
        label="Street address line 2 (Optional)"
        name={`addresses.${index}.streetAddress2`}
        register={register}
      />
      <IconTextField
        label="City"
        name={`addresses.${index}.city`}
        register={register}
      />
      <IconTextField
        label="Pincode"
        name={`addresses.${index}.pincode`}
        register={register}
      />
      <IconTextField
        label="State"
        name={`addresses.${index}.state`}
        register={register}
      />
    </Stack>
  );
}

export default AddressSection;
