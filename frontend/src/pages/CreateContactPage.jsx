import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  ArrowBack,
  StarBorder,
  Star,
  Add,
  Phone,
  LocationOnOutlined,
  LinkOutlined,
} from "@mui/icons-material";
import { Avatar, TextField, Stack } from "@mui/material";
import Container from "../components/Container";
import BusinessIcon from "@mui/icons-material/Business";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { AddButton, AddressSection, IconTextField } from "../index";
import { contactService } from "../Services/contactService";
import { useNavigate } from "react-router-dom";
import { blue } from "@mui/material/colors";

function CreateContactPage() {
  const navigate = useNavigate();

  const handleIsFavourite = () => {
    const currentValue = getValues("isFavourite");
    const newValue = !currentValue;
    setValue("isFavourite", newValue);
    console.log("isFavourite toggled to: " + newValue);
  };
  

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
      },
    });

  const isFavourite = watch("isFavourite");

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

  const onSubmit = async (data) => {
    // Convert flat form data into backend-expected format
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      jobTitle: data.jobTitle || "",
      company: data.company,
      imageUrl: "", // handle image upload later
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
      labelIds: [],
    };

    try {
      const response = await contactService.addContact(payload);
      console.log("Add contact response:", response);
    } catch (error) {
      console.error("Error adding contact: ", error);
    }
  };

  return (
    <Container>
      <div className="pl-6 w-1/2 bg-white ">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Header */}
          <div className=" bg-white  flex justify-between items-center">
            <ArrowBack
              onClick={() => navigate(-1)}
              className="cursor-pointer"
            />
            <div className="flex gap-4 justify-center items-center">
              <button type="button" onClick={handleIsFavourite}>
                {isFavourite ? (
                  <Star fontSize="medium" sx={{ color: blue[700] }} />
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
          <div className="relative inline-block my-4 pb-4">
            <Avatar sx={{ width: 128, height: 128 }} />
            <button
              type="button"
              className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center ring-4 ring-white"
              title="Add photo"
            >
              +
            </button>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            <div>
              <span className="inline-block text-gray-700 border border-gray-500 rounded-xl px-4 py-2">
                + Label
              </span>
            </div>

            {/* Name */}
            <Stack spacing={2}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <Avatar variant="plain" />
                <TextField
                  {...register("firstName")}
                  label="First name"
                  sx={{ flexGrow: 1 }}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <div style={{ width: 40 }}></div>
                <TextField
                  {...register("lastName")}
                  label="Last name"
                  sx={{ flexGrow: 1 }}
                />
              </Stack>
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
