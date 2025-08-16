import {
  ArrowBack,
  DeleteOutlineOutlined,
  MoreVertOutlined,
  Star,
  StarBorderOutlined,
} from "@mui/icons-material";
import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ContactActions } from "../../index";
import {
  fetchContacts,
  selectContactById,
  selectHasFetched,
  toggleFavourite,
  STATUSES,
} from "../../redux/contactSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { CircularProgress } from "@mui/material";

function ContactHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: contactId } = useParams();

  const hasFetchedContacts = useSelector(selectHasFetched);
  const status = useSelector((state) => state.contact.status);
  const contact = useSelector((state) => selectContactById(state, contactId));
  console.log(contact);
  const handleFavouriteToggle = useCallback(
    (e, contactId, currentStatus) => {
      e.stopPropagation();
      dispatch(
        toggleFavourite({ contactId, newFavouriteStatus: !currentStatus })
      );
    },
    [dispatch]
  );

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
      <div className="flex pl-8 justify-between w-2/3  ">
        <ArrowBack className="cursor-pointer" onClick={() => navigate(-1)} />
        <div className="flex gap-4">
          <button
            onClick={(e) =>
              handleFavouriteToggle(e, contact.id, contact.isFavourite)
            }
            className=" p-2 rounded-full hover:rounded-full hover:bg-gray-100"
          >
            {contact.isFavourite ? (
              <Star fontSize="medium" sx={{ color: "blue" }} />
            ) : (
              <StarBorderOutlined fontSize="medium" />
            )}
          </button>
          <button
            onClick={() => navigate(`/person/${contactId}/edit`)}
            className="px-6 py-2 bg-blue-800 text-gray-100 rounded-full"
          >
            Edit
          </button>
          <button className="p-2 rounded-full hover:rounded-full hover:bg-gray-100">
            <DeleteOutlineOutlined fontSize="medium" />
          </button>
          <button className="p-2 rounded-full hover:rounded-full hover:bg-gray-100">
            <MoreVertOutlined fontSize="medium" />
          </button>
        </div>
      </div>

      {/* Image and some detail */}
      <div className="flex flex-col">
        <div className="flex pl-12 pb-4 pt-2 gap-6 items-center">
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
          <div>
            <div className="text-3xl">{contact.displayName}</div>
            <div className="">
              {contact.jobTitle && <span>{contact.jobTitle}</span>}
              {contact.jobTitle && contact.company && (
                <span className="text-3xl"> . </span>
              )}
              {contact.company && <span>{contact.company}</span>}{" "}
            </div>
          </div>
        </div>
        <div>
          <ContactActions />
        </div>
      </div>
    </div>
  );
}

export default ContactHeader;
