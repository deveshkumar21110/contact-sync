import React from "react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Avatar, TextField, Stack } from "@mui/material";
import Container from "../components/Container";
import BusinessIcon from "@mui/icons-material/Business";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import {
  AddButton,
  AddressSection,
  IconTextField,
  useSnackbar,
} from "../index";
import { useNavigate } from "react-router-dom";
import { blue } from "@mui/material/colors";
import { useDispatch } from "react-redux";
import BasicModal from "../components/BasicModal";
import { addContact } from "../redux/contactSlice";
import LabelModal from "../components/Modal/LabelModal";

function CreateContactPage() {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const openLabel = Boolean(anchorEl);

  const openModal = () => {
    setOpen(true);
  };

  const openLabelModal = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeModal = () => setOpen(false);

  const closeLabelModal = () => {
    setAnchorEl(null);
  };

  const handleIsFavourite = () => {
    const currentValue = getValues("isFavourite");
    const newValue = !currentValue;
    setValue("isFavourite", newValue);
  };

  // React Hook Form setup with labels included
  const { register, setValue, getValues, handleSubmit, control, watch } =
    useForm({
      defaultValues: {
        isFavourite: false,
        emails: [{ email: "" }],
        phoneNumbers: [{ countryCode: "+91", number: "" }],
        addresses: [
          {
            country: "",
            streetAddress: "",
            streetAddress2: "",
            city: "",
            pincode: "",
            state: "",
          },
        ],
        websites: [{ url: "" }],
        labels: [],
      },
    });

  const isFavourite = watch("isFavourite");
  const selectedLabels = watch("labels") || [];

  // Field arrays for dynamic form sections
  const { fields: emailFields, append: appendEmail } = useFieldArray({
    control,
    name: "emails",
  });

  const { fields: phoneFields, append: appendPhone } = useFieldArray({
    control,
    name: "phoneNumbers",
  });

  const { fields: addressFields, append: appendAddress } = useFieldArray({
    control,
    name: "addresses",
  });

  const { fields: websiteFields, append: appendWebsite } = useFieldArray({
    control,
    name: "websites",
  });

  // Add field functions
  const addEmailField = () => {
    appendEmail({ email: "" });
  };

  const addPhoneField = () => {
    appendPhone({ countryCode: "+91", number: "" });
  };

  const addAddressField = () => {
    appendAddress({
      country: "",
      streetAddress: "",
      streetAddress2: "",
      city: "",
      pincode: "",
      state: "",
    });
  };

  const addWebsiteField = () => {
    appendWebsite({ url: "" });
  };

  // Remove label function
  const removeLabel = (indexToRemove) => {
    const updatedLabels = selectedLabels.filter(
      (_, index) => index !== indexToRemove
    );
    setValue("labels", updatedLabels);
  };

  const onSubmit = async (data) => {
    // Clean up the data before sending
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      jobTitle: data.jobTitle || "",
      company: data.company,
      imageUrl: data.imageUrl || "",
      isFavourite: data.isFavourite,
      emails: data.emails.filter((email) => email.email.trim() !== ""),
      phoneNumbers: data.phoneNumbers.filter(
        (phone) => phone.number.trim() !== ""
      ),
      addresses: data.addresses.filter(
        (addr) =>
          addr.country.trim() !== "" ||
          addr.streetAddress.trim() !== "" ||
          addr.city.trim() !== ""
      ),
      websites: data.websites.filter((website) => website.url.trim() !== ""),
      significantDates: [],
      // Convert label objects to the format expected by your backend
      labels: data.labels.map((label) => ({
        id: label.id,
        name: label.name,
      })),
    };

    showSnackbar("Saving contact...", {
      severity: "info",
      autoHideDuration: null, // keep it open until manually replaced
    });

    try {
      const response = await dispatch(addContact(payload)).unwrap();
      console.log("Add contact response:", response);
      showSnackbar("Contact created successfully!", {
        severity: "success",
        autoHideDuration: 3000,
      });
      navigate("/");
    } catch (error) {
      console.error("Error adding contact: ", error);
      showSnackbar("Failed to create contact.", {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  };

  return (
    <Container className="bg-pink-100 md:bg-white">
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
                className="p-2 rounded-full hover:rounded-full hover:bg-gray-100"
                type="button"
                onClick={handleIsFavourite}
              >
                {isFavourite ? (
                  <Star fontSize="medium" sx={{ color: blue[800] }} />
                ) : (
                  <StarBorder fontSize="medium" className="text-gray-700" />
                )}
              </button>
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
                src={watch("imageUrl") || ""}
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
            />
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            {/* Labels Section */}
            <div className="">
              {/* Label Button */}
              <div className="flex md:justify-normal justify-center w-full">
                {/* Selected Labels Display */}
                {selectedLabels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mr-3">
                    {selectedLabels.map((label, index) => (
                      <span
                        key={label.id || index}
                        onClick={() => removeLabel(index)}
                        className="inline-flex cursor-pointer items-center px-2 py-1 text-xs md:font-medium  text-gray-800 rounded-lg border-2 mt-1 border-black"
                      >
                        <LabelOutlined
                          className="md:mx-2 text-gray-400"
                          fontSize="small"
                        />
                        {label.name}
                        <button
                          type="button"
                          onClick={() => removeLabel(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {selectedLabels.length > 0 ? (
                  <button
                    onClick={openLabelModal}
                    className="flex justify-center items-center border rounded-full px-1 "
                  >
                    <EditOutlined fontSize="medium" sx={{ color: "blue" }} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={openLabelModal}
                    className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Add className="w-2 h-2 mr-2" />
                    {selectedLabels.length === 0
                      ? "Label"
                      : `Labels (${selectedLabels.length})`}
                  </button>
                )}

                {/* Label Modal - Pass react-hook-form props */}
                <LabelModal
                  anchorEl={anchorEl}
                  open={openLabel}
                  handleClose={closeLabelModal}
                  control={control}
                  setValue={setValue}
                  watch={watch}
                />
              </div>
            </div>

            {/* Name */}
            <Stack spacing={2}>
              <IconTextField
                icon={<PermIdentityOutlined />}
                label="First name"
                name="firstName"
                register={register}
              />
              <IconTextField
                icon={<div />} // empty placeholder to keep alignment
                label="Last name"
                name="lastName"
                register={register}
              />
            </Stack>

            {/* Company & Job Title */}
            <Stack spacing={2}>
              <IconTextField
                icon={<BusinessIcon />}
                label="Company"
                name="company"
                register={register}
              />
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <div style={{ width: 40 }}></div>
                <TextField
                  {...register("jobTitle")}
                  label="Job title"
                  sx={{ flexGrow: 1 }}
                />
              </Stack>
            </Stack>

            {/* Email */}
            <Stack spacing={2}>
              {emailFields.map((field, index) => (
                <IconTextField
                  key={field.id}
                  icon={<MailOutlineIcon />}
                  label="Email"
                  name={`emails.${index}.email`}
                  register={register}
                />
              ))}
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <div style={{ width: 40 }}></div>
                <AddButton
                  label="Add email"
                  icon={<Add />}
                  onClick={addEmailField}
                />
              </Stack>
            </Stack>

            {/* Phone number */}
            <Stack spacing={2}>
              {phoneFields.map((field, index) => (
                <IconTextField
                  key={field.id}
                  icon={<Phone />}
                  label="Phone"
                  name={`phoneNumbers.${index}.number`}
                  register={register}
                />
              ))}
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <div style={{ width: 40 }}></div>
                <AddButton
                  label="Add phone"
                  icon={<Add />}
                  onClick={addPhoneField}
                />
              </Stack>
            </Stack>

            {/* Address */}
            <Stack spacing={2}>
              {addressFields.map((field, index) => (
                <AddressSection
                  key={field.id}
                  register={register}
                  index={index}
                />
              ))}
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <div style={{ width: 40 }}></div>
                <AddButton
                  label="Add address"
                  icon={<LocationOnOutlined />}
                  onClick={addAddressField}
                />
              </Stack>
            </Stack>

            {/* Website Link */}
            <Stack spacing={2}>
              {websiteFields.map((field, index) => (
                <IconTextField
                  key={field.id}
                  icon={<LinkOutlined />}
                  label="Website"
                  name={`websites.${index}.url`}
                  register={register}
                />
              ))}
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <div style={{ width: 40 }}></div>
                <AddButton
                  label="Add website"
                  icon={<Add />}
                  onClick={addWebsiteField}
                />
              </Stack>
            </Stack>
          </div>
        </form>
      </div>
    </Container>
  );
}

export default CreateContactPage;
