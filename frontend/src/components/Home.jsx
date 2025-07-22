import React from "react";
import { useEffect, useState } from "react";
import { authService } from "../Services/authService";
import { contactService } from "../Services/contactService";
import { CircularProgress, Box, IconButton } from "@mui/material";
import { StarBorder, Star } from "@mui/icons-material";

const DEFAULT_PROFILE =
  "/contacts_product_24dp_0158CC_FILL0_wght400_GRAD0_opsz24.svg";

function Home() {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const getContactsOfUser = async () => {
      try {
        setLoading(true);
        const user = await authService.getCurrentUser();
        if (user) {
          const contacts = await contactService.getContacts();
          if (contacts) {
            setContacts(contacts);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    getContactsOfUser();
  }, []);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_PROFILE;
  };

  const handleFavouriteToggle = async (contactId) => {
    try {
      // Find the contact in the current state
      const contactToUpdate = contacts.find(contact => contact.id === contactId);
      if (!contactToUpdate) return;

      // Optimistically update the UI
      setContacts(contacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, isFavourite: !contact.isFavourite }
          : contact
      ));

      // Update in the backend
      await contactService.updateContact(contactId, {
        isFavourite: !contactToUpdate.isFavourite
      });
    } catch (error) {
      console.error("Error toggling favourite status:", error);
      // Revert the optimistic update if the backend call fails
      setContacts(contacts.map(contact =>
        contact.id === contactId
          ? { ...contact, isFavourite: contact.isFavourite }
          : contact
      ));
    }
  }

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <CircularProgress />
        </div>
      ) : (
        <div className="rounded-lg  p-4 bg-white ">
          <h1 className="text-2xl">
            Contacts <span className="text-base">({contacts.length})</span>
          </h1>
          {/* <div>
            {contacts.map((contact, index) => (
              <div key={index} className="border-b py-2">
                <p className="text-gray-800 font-medium">
                  {contact.displayName}
                </p>
                <p className="text-sm text-gray-500">
                  {contact.emails?.length > 0
                    ? contact.emails[0].email
                    : "No email"}
                </p>
              </div>
            ))}
          </div> */}

          <div className="overflow-x-auto p-4">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                    Job title & company
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={contact.imageUrl || DEFAULT_PROFILE}
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

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contact.phoneNumbers.length > 0
                        ? contact.phoneNumbers[0].number
                        : ""}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contact.emails.length > 0 ? contact.emails[0].email : ""}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 relative">
                      <div className="flex items-center justify-between">
                        <span>
                          {`${contact.jobTitle || ""}, ${
                            contact.company || ""
                          }`.trim()}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4">
                          <IconButton
                            onClick={() => handleFavouriteToggle(contact.id)}
                            variant="plain"
                            size="large"
                          >
                            {contact.isFavourite ? (
                              <Star
                                fontSize="medium"
                                sx={{ color: "red" }}
                              />
                            ) : (
                              <StarBorder fontSize="medium" />
                            )}
                          </IconButton>
                        </div>
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleDetailsClick(member)}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(member.id)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
