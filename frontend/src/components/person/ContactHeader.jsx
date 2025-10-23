import {
  ArrowBack,
  DeleteOutlineOutlined,
  EditOutlined,
  MoreVertOutlined,
  Star,
  StarBorderOutlined,
} from "@mui/icons-material";
import React, { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BasicModal2, ContactActions } from "../../index";
import {
  fetchContacts,
  selectContactById,
  selectHasFetched,
  toggleFavourite,
  deleteContact,
  STATUSES,
  moveToTrash,
} from "../../redux/contactSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { CircularProgress, IconButton } from "@mui/material";

function ContactHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: contactId } = useParams();

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const hasFetchedContacts = useSelector(selectHasFetched);
  const status = useSelector((state) => state.contact.status);
  const contact = useSelector((state) => selectContactById(state, contactId));
  // console.log(contact);
  const handleFavouriteToggle = useCallback(
    (e, contactId, currentStatus) => {
      e.stopPropagation();
      dispatch(
        toggleFavourite({ contactId, newFavouriteStatus: !currentStatus })
      );
    },
    [dispatch]
  );
  const handleDelete = (contactId) => {
    console.log(contactId);
    dispatch(moveToTrash(contactId));
    navigate(-1);
  };

  useEffect(() => {
    if (contactId && !hasFetchedContacts) {
      dispatch(fetchContacts());
    }
  }, [dispatch, contactId, hasFetchedContacts]);

  // Handle loading
  if (status === STATUSES.LOADING) {
    return (
      <div className="flex justify-center items-center h-40">
        <CircularProgress />
      </div>
    );
  }

  // FIXED: Added safety check
  if (!contact) {
    if (hasFetchedContacts) {
      return (
        <div className="flex items-center gap-4">
          <ArrowBack className="cursor-pointer" onClick={() => navigate(-1)} />
          <div>Contact not found</div>
        </div>
      );
    } else {
      return (
        <div className="flex justify-center items-center h-40">
          <CircularProgress />
        </div>
      );
    }
  }

  return (
    <div>
      <div className="flex items-center md:pl-8 justify-between md:w-2/3  ">
        <ArrowBack className="cursor-pointer" onClick={() => navigate(-1)} />
        <div className="flex items-center gap-">
          <button
            onClick={(e) =>
              handleFavouriteToggle(e, contact.id, contact.isFavourite)
            }
            className="p-2 rounded-full hover:rounded-full hover:bg-gray-100"
          >
            {contact.isFavourite ? (
              <Star fontSize="medium" sx={{ color: "blue" }} />
            ) : (
              <StarBorderOutlined fontSize="medium" />
            )}
          </button>
          <button
            onClick={() => navigate(`/person/${contactId}/edit`)}
            className="hidden md:flex px-6 py-2 bg-blue-800 text-gray-100 rounded-full"
          >
            Edit
          </button>
          <div className="md:hidden">
            <IconButton
              onClick={() => navigate(`/person/${contactId}/edit`)}
              size="large"
            >
              <EditOutlined fontSize="medium" sx={{ color: "black" }} />
            </IconButton>
          </div>

          <IconButton onClick={() => handleOpen()} size="large">
            <DeleteOutlineOutlined fontSize="medium" sx={{ color: "black" }} />
          </IconButton>
          <BasicModal2
            open={open}
            handleClose={handleClose}
            onConfirm={() => handleDelete(contactId)}
          />
          <button className="p-2 rounded-full hover:rounded-full hover:bg-gray-100">
            <MoreVertOutlined fontSize="medium" />
          </button>
        </div>
      </div>

      {/* Image and some detail */}
      <div className="flex flex-col">
        <div className="flex flex-col md:pl-12 pb-4 pt-2 gap-6 items-center md:flex-row">
          <img
            className="h-40 w-40 rounded-full object-cover"
            src={
              contact.imageUrl ||
              `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                contact.displayName
              )}`
            }
            alt="Contact"
          />
          <div className="flex-col items-center justify-center text-center md:text-left">
            <div className="text-3xl">{contact.displayName}</div>
            <div>
              {contact.jobTitle && <span>{contact.jobTitle}</span>}
              {contact.jobTitle && contact.company && (
                <span className="text-3xl"> . </span>
              )}
              {contact.company && <span>{contact.company}</span>}{" "}
            </div>
          </div>
        </div>
        <div>
          <ContactActions contact={contact} />
        </div>
      </div>
    </div>
  );
}

export default ContactHeader;
