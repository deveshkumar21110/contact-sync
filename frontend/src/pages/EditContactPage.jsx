import React, { useState } from "react";
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
import BusinessIcon from "@mui/icons-material/Business";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { blue } from "@mui/material/colors";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Import from index.js
import {
  Container,
  AddButton,
  AddressSection,
  IconTextField,
  useSnackbar,
  LabelModal,
} from "../index";

import BasicModal from "../components/BasicModal";
import { selectContactById, updateContact } from "../redux/contactSlice";

function EditContactPage() {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { id: contactId } = useParams();
  const contact = useSelector((state) => selectContactById(state, contactId));

  const openLabel = Boolean(anchorEl);

  const openModal = () => setOpen(true);
  const openLabelModal = (event) => setAnchorEl(event.currentTarget);
  const closeModal = () => setOpen(false);
  const closeLabelModal = () => setAnchorEl(null);

  const { register, setValue, getValues, handleSubmit, control, watch } =
    useForm({
      defaultValues: {
        firstName: contact?.firstName || "",
        lastName: contact?.lastName || "",
        company: contact?.company || "",
        jobTitle: contact?.jobTitle || "",
        imageUrl: contact?.imageUrl || "",
        isFavourite: contact?.isFavourite ?? false,
        emails: contact?.emails?.length
          ? contact.emails.map((e) => ({ id: e.id, email: e.email }))
          : [{ email: "" }],
        phoneNumbers: contact?.phoneNumbers?.length
          ? contact.phoneNumbers.map((p) => ({
              id: p.id,
              countryCode: p.countryCode || "+91",
              number: p.number || "",
            }))
          : [{ countryCode: "+91", number: "" }],
        addresses: contact?.addresses?.length
          ? contact.addresses.map((a) => ({
              id: a.id,
              country: a.country || "",
              streetAddress: a.streetAddress || "",
              streetAddress2: a.streetAddress2 || "",
              city: a.city || "",
              pincode: a.pincode || "",
              state: a.state || "",
            }))
          : [
              {
                country: "",
                streetAddress: "",
                streetAddress2: "",
                city: "",
                pincode: "",
                state: "",
              },
            ],
        websites: contact?.websites?.length
          ? contact.websites.map((w) => ({ id: w.id, url: w.url }))
          : [{ url: "" }],
        labels: contact?.labels?.length ? contact.labels : [],
      },
    });

  const isFavourite = watch("isFavourite");
  const selectedLabels = watch("labels") || [];

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

  const handleIsFavourite = () => {
    const currentValue = getValues("isFavourite");
    setValue("isFavourite", !currentValue);
  };

  const removeLabel = (indexToRemove) => {
    const updatedLabels = selectedLabels.filter(
      (_, index) => index !== indexToRemove
    );
    setValue("labels", updatedLabels);
  };

  const onSubmit = async (data) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      jobTitle: data.jobTitle || "",
      company: data.company,
      imageUrl: data.imageUrl || "",
      isFavourite: data.isFavourite,
      emails: data.emails
        .filter((email) => email.email.trim() !== "")
        .map((e, idx) => ({
          id: e.id || contact?.emails?.[idx]?.id,
          email: e.email,
        })),
      phoneNumbers: data.phoneNumbers
        .filter((phone) => phone.number.trim() !== "")
        .map((p, idx) => ({
          id: p.id || contact?.phoneNumbers?.[idx]?.id,
          countryCode: p.countryCode,
          number: p.number,
        })),
      addresses: data.addresses
        .filter(
          (addr) =>
            addr.country.trim() !== "" ||
            addr.streetAddress.trim() !== "" ||
            addr.city.trim() !== ""
        )
        .map((a, idx) => ({
          id: a.id || contact?.addresses?.[idx]?.id,
          country: a.country,
          streetAddress: a.streetAddress,
          streetAddress2: a.streetAddress2,
          city: a.city,
          pincode: a.pincode,
          state: a.state,
        })),
      websites: data.websites
        .filter((website) => website.url.trim() !== "")
        .map((w, idx) => ({
          id: w.id || contact?.websites?.[idx]?.id,
          url: w.url,
        })),
      significantDates: [],
      labels: data.labels.map((label) => ({
        id: label.id,
        name: label.name,
      })),
    };

    showSnackbar("Saving contact...", {
      severity: "info",
      autoHideDuration: null,
    });

    try {
      await dispatch(updateContact(payload)).unwrap();
      showSnackbar("Contact updated successfully!", {
        severity: "success",
        autoHideDuration: 3000,
      });
      navigate(`/person/${contactId}`);
    } catch (error) {
      console.error("Error updating contact: ", error);
      showSnackbar("Failed to update contact.", {
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
                className="p-2 rounded-full hover:bg-gray-100"
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
              fieldName={"imageUrl"}
            />
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            {/* Labels Section */}
            <div className="">
              <div className="flex md:justify-normal justify-center w-full">
                {selectedLabels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mr-3">
                    {selectedLabels.map((label, index) => (
                      <span
                        key={label.id || index}
                        onClick={() => removeLabel(index)}
                        className="inline-flex cursor-pointer items-center px-2 py-1 text-xs md:font-medium text-gray-800 rounded-lg border-2 mt-1 border-black"
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
                icon={<div />}
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
                  onClick={() => appendEmail({ email: "" })}
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
                  onClick={() =>
                    appendPhone({ countryCode: "+91", number: "" })
                  }
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
                  onClick={() =>
                    appendAddress({
                      country: "",
                      streetAddress: "",
                      streetAddress2: "",
                      city: "",
                      pincode: "",
                      state: "",
                    })
                  }
                />
              </Stack>
            </Stack>

            {/* Website */}
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
                  onClick={() => appendWebsite({ url: "" })}
                />
              </Stack>
            </Stack>
          </div>
        </form>
      </div>
    </Container>
  );
}

export default EditContactPage;
