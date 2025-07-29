import React from "react";
import { useForm } from "react-hook-form";
import { ArrowBack, StarBorder, Add, Phone, LocationOnOutlined, LinkOutlined } from "@mui/icons-material";
import { Avatar, TextField, Stack } from "@mui/material";
import Container from "../components/Container";
import BusinessIcon from "@mui/icons-material/Business";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { AddButton, AddressSection, IconTextField } from "../index";
import { contactService } from "../Services/contactService";
import { useNavigate } from "react-router-dom";

function CreateContactPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // Convert flat form data into backend-expected format
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      jobTitle: data.jobTitle || "",
      company: data.company,
      imageUrl: "", // handle image upload later
      isFavourite: false,

      emails: [
        {
          email: data.email,
        },
      ],
      phoneNumbers: [
        {
          countryCode: "+91",
          number: data.phoneNumbers
        },
      ],
      addresses: [],
      websites: [],
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
      <div className="mt-8 pl-4 w-1/2 bg-white">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Header */}
          <div className="flex justify-between">
            <ArrowBack
              onClick={() => navigate(-1)}
              className="cursor-pointer"
            />
            <div className="flex gap-4 justify-center items-center">
              <StarBorder fontSize="medium" className="text-gray-700" />
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
              <IconTextField
                icon={<MailOutlineIcon />}
                label="Email"
                name="email"
                register={register}
              />
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <div style={{ width: 40 }}></div>
                <AddButton label="Add email" icon={<Add />} />
              </Stack>
            </Stack>

            {/* Phone number */}
            <Stack spacing={2}>
              <IconTextField
                icon={<Phone />}
                label="Phone"
                name="phoneNumbers"
                register={register}
              />
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <div style={{ width: 40 }}></div>
                <AddButton label="Add phone" icon={<Add />} />
              </Stack>
            </Stack>

            {/* Address */}
            <AddressSection register={register} />

            {/* Website Link */}
            <Stack spacing={2}>
              <IconTextField
                icon={<LinkOutlined />}
                label="Website"
                name="websites"
                register={register}
              />
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <div style={{ width: 40 }}></div>
                <AddButton label="Add website" icon={<Add />} />
              </Stack>
            </Stack>

          </div>
        </form>
      </div>
    </Container>
  );
}

export default CreateContactPage;
