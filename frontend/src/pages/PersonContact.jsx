import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { ContactActions, ContactDetails, ContactHeader, Container, LabelModal } from "../index";
import { STATUSES, selectContactById, updateContactLabels } from "../redux/contactSlice";
import { CircularProgress } from "@mui/material";
import { Add, EditOutlined, LabelOutlined } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

function PersonContact() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id:contactId} = useParams();
  const status = useSelector((state) => state.contact.status);
  const [anchorEl, setAnchorEl] = useState(null);
  const openLabel = Boolean(anchorEl);
  const contact = useSelector((state) => selectContactById(state,contactId));

  // Initialize react-hook-form with current contact data
  const { control, setValue, watch, getValues } = useForm({
    defaultValues: {
      labels: contact?.labels || [],
    },
  });
  const selectedLabels = watch("labels") || [];
  // console.log(contact);

  const openLabelModal = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeLabelModal = () => {
    setAnchorEl(null);
    handleLabelsChange(selectedLabels);
  };

  // Optional: Save labels when they change
  const handleLabelsChange = async (newLabels) => {
    try {
      await dispatch(updateContactLabels({
        contactId: contact.id,
        labels: newLabels
      })).unwrap();
      console.log("Labels updated:", newLabels);
    } catch (error) {
      console.error("Failed to update labels:", error);
    }
  };

  // Handle loading
  if (status === STATUSES.LOADING) {
    return (
      <div className="flex justify-center items-center h-40">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container className="bg-pink-100 md:bg-white">
      <div className="md:pt-8 md:bg-white bg-pink-100">
        <ContactHeader />

        {/* Labels Section */}
        <div className="flex items-center flex-wrap gap-2 md:pl-8 justify-center md:justify-normal">
          {/* Selected Labels Display */}
          {selectedLabels.length > 0 &&
            selectedLabels.map((label, index) => (
              <span
                key={label.id || index}
                className="inline-flex cursor-pointer items-center px-3 py-1 text-xs font-medium text-blue-800 rounded-lg border-2 border-blue-200 bg-blue-50 hover:bg-blue-100"
              >
                <LabelOutlined
                  className="mr-2 text-blue-600"
                  fontSize="small"
                />
                {label.name}
                <button
                  type="button"
                  // onClick={(e) => {
                  //   e.stopPropagation();
                  //   removeLabel(index);
                  // }}
                  className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                >
                  ×
                </button>
              </span>
            ))}

          {/* Edit Button */}
          {/* <button
            type="button"
            onClick={openLabelModal}
            className=" items-center px-2 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {selectedLabels.length === 0 ? (
              <>
                <Add fontSize="small" className="mr-2 text-blue-600" /> Label
              </>
            ) : (
              <EditOutlined fontSize="small" className="mr-2 text-blue-600" />
            )}
          </button> */}
        </div>

        {/* Label Modal */}
        <LabelModal
          anchorEl={anchorEl}
          open={openLabel}
          handleClose={closeLabelModal}
          control={control}
          setValue={setValue}
          watch={watch}
        />
        <div className="md:pl-8">
          <ContactDetails />
        </div>
      </div>
    </Container>
  );
}

export default PersonContact;
