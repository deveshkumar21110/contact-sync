import React, { useState } from "react";
import { Container, useSnackbar, IconTextField } from "../index";
import BasicModal from "../components/BasicModal";
import { selectUser, updateCurrentUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import {
  ArrowBack,
  StarBorder,
  Star,
  Add,
  Phone,
  LocationOnOutlined,
  LinkOutlined,
  LabelOutlined,
  PermIdentityOutlined,
  EditOutlined,
} from "@mui/icons-material";
import { useForm, useFieldArray } from "react-hook-form";
import { Avatar, TextField, Stack } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";

function UserAccountPage() {
  const [open, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { register, setValue, getValue, handleSubmit, watch, control } =
    useForm({
      defaultValues: {
        username: currentUser?.username || "",
        phone_number: currentUser?.phone_number || "",
        email: currentUser?.email || "",
        profile_image_url: currentUser?.profile_image_url || "",
      },
    });

  const onSubmit = async (data) => {
    showSnackbar("Saving your details...", {
      severity: "info",
      autoHideDuration: null,
    });

    try {
      await dispatch(updateCurrentUser(data)).unwrap();
      showSnackbar("Your Details updated successfully!", {
        severity: "success",
        autoHideDuration: 3000,
      });
      // navigate("/account");
    } catch (error) {
      console.error("Error updating your details: ", error);
      showSnackbar("Failed to update .", {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  };

  return (
    <Container className="min-h-screen bg-pink-100 md:bg-white">
      <div className="md:pl-6 p-2 md:w-1/2 bg-pink-100 md:bg-white">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Header */}
          <div className="bg-pink-100 md:bg-white flex justify-between items-center">
            <ArrowBack
              onClick={() => navigate(-1)}
              className="cursor-pointer"
            />
            <div className="flex gap-4 justify-center items-center">
              <button
                type="submit"
                className="bg-blue-700 text-white px-6 py-2 rounded-full"
              >
                Save
              </button>
            </div>
          </div>

          {/* Avatar */}
          <div className="relative flex justify-center md:justify-normal my-4 pb-4">
            {/* Avatar + button wrapper */}
            <div className="relative">
              <Avatar
                src={watch("profile_image_url") || ""}
                sx={{ width: 128, height: 128 }}
                onClick={openModal}
                className="cursor-pointer"
              />

              <button
                type="button"
                onClick={openModal}
                className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center ring-4 ring-white"
                title="Add photo"
              >
                +
              </button>
            </div>

            <BasicModal
              open={open}
              handleClose={closeModal}
              register={register}
              setValue={setValue}
              fieldName={"profile_image_url"}
            />
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            {/* Name */}
            <Stack spacing={2}>
              <IconTextField
                icon={<PermIdentityOutlined />}
                label="Username"
                name="username"
                register={register}
              />
            </Stack>

            {/* Email */}
            <IconTextField
              icon={<MailOutlineIcon />}
              label="Email"
              name="email"
              register={register}
            />

            {/* Phone number */}
            <Stack spacing={2}>
              <IconTextField
                icon={<Phone />}
                label="Phone"
                name="phone_number"
                register={register}
              />
            </Stack>
          </div>
        </form>
      </div>
    </Container>
  );
}

export default UserAccountPage;
