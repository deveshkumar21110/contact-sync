import React, { useEffect, useCallback, useState } from "react";
import { CircularProgress, IconButton } from "@mui/material";
import { StarBorder, Star, DeleteOutlineOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContacts,
  toggleFavourite,
  STATUSES,
  moveToTrash,
  selectTrashedContacts,
  selectFavouriteContacts,
  recoverContact,
} from "../redux/contactSlice";
import { Link, useNavigate } from "react-router-dom";
import { BasicModal2, useSnackbar } from "..";

const DEFAULT_PROFILE =
  "/contacts_product_24dp_0158CC_FILL0_wght400_GRAD0_opsz24.svg";

function Home({ showFavorites = false, filterLabel = null, trash = false }) {
  const { showSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const handleOpen = (e, contactId) => {
    e.stopPropagation();
    setSelectedContact(contactId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedContact(null);
  };

  const { data: allLabels } = useSelector((state) => state.label);
  const trashContacts = useSelector(selectTrashedContacts);
  const favouriteContacts = useSelector(selectFavouriteContacts);
  let pageTitle = "Contacts";
  if (showFavorites) pageTitle = "Favorites";
  else if (trash) pageTitle = "Trash";
  else if (filterLabel) {
    const label = allLabels.find((l) => l.id === filterLabel);
    pageTitle = label?.name;
  }

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data: contacts,
    status,
    hasFetched,
  } = useSelector((state) => state.contact);

  useEffect(() => {
    if (!hasFetched && contacts.length === 0 && status === STATUSES.IDLE) {
      dispatch(fetchContacts());
    }
  }, [dispatch, hasFetched, contacts.length, status]);

  const handleImageError = useCallback((e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_PROFILE;
  }, []);

  const handleFavouriteToggle = useCallback(
    (e, contactId, currentStatus) => {
      e.stopPropagation();
      dispatch(
        toggleFavourite({ contactId, newFavouriteStatus: !currentStatus })
      );
    },
    [dispatch]
  );
  const handleDelete = useCallback(() => {
    if (selectedContact) {
      dispatch(moveToTrash(selectedContact));
      showSnackbar("Moving contact to trash...", {
        severity: "info",
        autoHideDuration: 2000,
      });
    }
  }, [dispatch, selectedContact, showSnackbar]);

  const handleRecover = (e, contactId) => {
    e.stopPropagation();
    dispatch(recoverContact(contactId));
    showSnackbar("Recovering contact...", {
      severity: "info",
      autoHideDuration: 2000,
    });
  };

  const handleSelectedContact = useCallback(
    (contactId) => {
      navigate(`/person/${contactId}`);
    },
    [navigate]
  );

  const isFetchingContacts = !hasFetched && status === STATUSES.LOADING;
  if (isFetchingContacts) {
    return (
      <div className="flex justify-center items-center h-40">
        <CircularProgress />
      </div>
    );
  }
  if (!contacts || contacts.length === 0) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        No contacts found
      </div>
    );
  }

  let displayedContacts = contacts;
  if (trash) {
    // Show only trashed contacts
    displayedContacts = trashContacts;
  } else {
    // For all other views, filter out trashed contacts first
    displayedContacts = contacts.filter((c) => !c.isDeleted); // ← FIX: Use all non-deleted contacts

    if (showFavorites) {
      displayedContacts = displayedContacts.filter((c) => c.isFavourite);
    } else if (filterLabel) {
      displayedContacts = displayedContacts.filter((c) =>
        c.labels?.some((label) => label.id == filterLabel)
      );
    }
  }
  if (displayedContacts.length === "0") {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        No contacts found with this filter
      </div>
    );
  }

  return (
    <div className="w-full mt-2">
      <h1 className="text-2xl mb-2">
        {pageTitle}{" "}
        <span className="text-base">({displayedContacts.length})</span>
      </h1>

      <div className="overflow-x-auto w-full">
        <div className="overflow-y-auto rounded-lg w-full hidden md:flex">
          <table className="min-w-full w-full">
            <thead className="text-base text-gray-700 sticky top-0 z-10 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Name</th>
                <th className="px-6 py-3 text-left font-medium">
                  {trash ? "Date" : "Phone"}
                </th>
                <th className="px-6 py-3 text-left font-medium">
                  {trash ? "Time" : "Email"}
                </th>
                {trash ? (
                  ""
                ) : (
                  <th className="px-6 py-3 text-left font-medium">
                    Job title & company
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white cursor-pointer">
              {displayedContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="hover:bg-gray-100 group"
                  onClick={() => handleSelectedContact(contact.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap rounded-l-lg hover:bg-gray-100">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={
                            contact.imageUrl ||
                            `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                              contact.displayName
                            )}`
                          }
                          alt={contact.displayName}
                          onError={handleImageError}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {contact.displayName}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Phone Number / Deleted Date*/}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hover:bg-gray-100">
                    {trash
                      ? (() => {
                          if (!contact.deletedAt) return "";
                          const dateObj = new Date(
                            contact.deletedAt.replace(" ", "T")
                          );
                          return dateObj.toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          });
                        })()
                      : contact.phoneNumbers?.[0]?.number || ""}
                  </td>
                  {/* Deleted time / First Email */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hover:bg-gray-100">
                    {trash
                      ? (() => {
                          if (!contact.deletedAt) return "";
                          const dateObj = new Date(
                            contact.deletedAt.replace(" ", "T")
                          );
                          return dateObj.toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          });
                        })()
                      : contact.emails?.[0]?.email || ""}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 relative rounded-r-lg hover:bg-gray-100">
                    <div className="flex items-center justify-between">
                      {[contact.jobTitle, contact.company]
                        .filter(Boolean)
                        .join(", ")}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4">
                        {trash ? (
                          <div
                            onClick={(e) => handleRecover(e, contact.id)}
                            className="text-blue-700 font-medium p-2 hover:bg-gray-200 rounded-lg"
                          >
                            Recover
                          </div>
                        ) : (
                          <>
                            <IconButton
                              onClick={(e) =>
                                handleFavouriteToggle(
                                  e,
                                  contact.id,
                                  contact.isFavourite
                                )
                              }
                              size="large"
                            >
                              {contact.isFavourite ? (
                                <Star
                                  fontSize="medium"
                                  sx={{ color: "blue" }}
                                />
                              ) : (
                                <StarBorder fontSize="medium" />
                              )}
                            </IconButton>
                            <IconButton
                              onClick={(e) => handleOpen(e, contact.id)}
                              size="large"
                            >
                              <DeleteOutlineOutlined
                                fontSize="medium"
                                sx={{ color: "blue" }}
                              />
                            </IconButton>
                            <BasicModal2
                              open={open}
                              handleClose={handleClose}
                              onConfirm={handleDelete}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile view */}
        <div className="md:hidden">
          {displayedContacts.map((contact, index) => (
            <div
              key={contact.id}
              onClick={() => handleSelectedContact(contact.id)}
              className={`flex items-center px-4 py-2 whitespace-nowrap bg-gray-50 border border-gray-300 
        ${index === 0 ? "rounded-t-2xl" : ""} 
        ${index === displayedContacts.length - 1 ? "rounded-b-2xl" : ""} 
        `}
            >
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={
                    contact.imageUrl ||
                    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                      contact.displayName
                    )}`
                  }
                  alt={contact.displayName}
                  onError={handleImageError}
                />
              </div>
              <div className="ml-4">
                <div className="text-base font-medium text-gray-800">
                  {contact.displayName}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
