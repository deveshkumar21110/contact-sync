import React, { useEffect, useCallback } from "react";
import { CircularProgress, IconButton } from "@mui/material";
import { StarBorder, Star } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContacts,
  toggleFavourite,
  STATUSES,
} from "../redux/contactSlice";
import { Link, useNavigate } from "react-router-dom";

const DEFAULT_PROFILE =
  "/contacts_product_24dp_0158CC_FILL0_wght400_GRAD0_opsz24.svg";

function Home() {
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
  const handleSelectedContact = useCallback(
    (contactId) => {
      navigate(`/person/${contactId}`);
    },
    [navigate]
  );

  if (status === STATUSES.LOADING) {
    return (
      <div className="flex justify-center items-center h-40">
        <CircularProgress />
      </div>
    );
  } else if (contacts.length === 0) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        No contact found
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl mb-2">
        Contacts <span className="text-base">({contacts.length})</span>
      </h1>

      <div className="overflow-x-auto w-full">
        <div className="overflow-y-auto rounded-lg w-full">
          <table className="min-w-full w-full">
            <thead className="text-base text-gray-700 sticky top-0 z-10 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Name</th>
                <th className="px-6 py-3 text-left font-medium">Phone</th>
                <th className="px-6 py-3 text-left font-medium">Email</th>
                <th className="px-6 py-3 text-left font-medium">
                  Job title & company
                </th>
              </tr>
            </thead>
            <tbody className="bg-white cursor-pointer">
              {contacts.map((contact) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hover:bg-gray-100">
                    {contact.phoneNumbers?.[0]?.number || ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hover:bg-gray-100">
                    {contact.emails?.[0]?.email || ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 relative rounded-r-lg hover:bg-gray-100">
                    <div className="flex items-center justify-between">
                      {[contact.jobTitle, contact.company]
                        .filter(Boolean)
                        .join(", ")}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4">
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
                            <Star fontSize="medium" sx={{ color: "blue" }} />
                          ) : (
                            <StarBorder fontSize="medium" />
                          )}
                        </IconButton>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;
