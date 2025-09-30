import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useSelector } from "react-redux";
import { selectContacts } from "../../redux/contactSlice";

const ContactSearchModal = ({ isOpen, onClose, onSelectContact }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);

  const contacts = useSelector(selectContacts);

  // Filter contacts
  const filteredContacts = searchQuery.trim()
    ? contacts
        .filter((contact) => {
          const query = searchQuery.toLowerCase();
          const name = (contact.displayName || "").toLowerCase();
          const email = (contact.emails?.[0]?.email || "").toLowerCase();
          const phone = (contact.phoneNumbers?.[0]?.number || "").toLowerCase();
          const company = (contact.company || "").toLowerCase();

          return (
            name.includes(query) ||
            email.includes(query) ||
            phone.includes(query) ||
            company.includes(query)
          );
        })
        .sort((a, b) =>
          (a.displayName || "")
            .toLowerCase()
            .localeCompare((b.displayName || "").toLowerCase())
        )
    : [];

  // Auto focus input
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (filteredContacts.length === 0) {
      if (e.key === "Escape") onClose();
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredContacts.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredContacts.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelectContact(filteredContacts[highlightedIndex]);
        }
        break;
      case "Escape":
        onClose();
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setHighlightedIndex(-1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleSelectContact = (contact) => {
    if (onSelectContact) onSelectContact(contact);
    onClose();
  };

  // Generate a DiceBear avatar URL from name
  const getDicebearUrl = (name) => {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
    name
  )}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-[60] transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-0 left-0 right-0 z-[70] flex justify-center pt-16 px-4">
        <div className="w-full max-w-2xl">
          {/* Search Input */}
          <div className="bg-white rounded-lg shadow-xl">
            <div className="flex items-center h-14 border-b border-gray-200 px-4">
              <Search className="text-gray-600 w-5 h-5 mr-3 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-500 text-base"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>

            {/* Suggestions List */}
            {searchQuery && (
              <div className="max-h-96 overflow-y-auto">
                {filteredContacts.length > 0 ? (
                  <ul>
                    {filteredContacts.map((contact, index) => (
                      <li key={contact.id}>
                        <button
                          onClick={() => handleSelectContact(contact)}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors text-left ${
                            highlightedIndex === index ? "bg-gray-100" : ""
                          }`}
                        >
                          {/* Avatar */}
                          <img
                            src={
                              contact.imageUrl ||
                              getDicebearUrl(contact.displayName)
                            }
                            alt={contact.displayName}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />

                          {/* Contact Info */}
                          <div className="flex-1 min-w-0">
                            <div className="text-gray-900 font-medium truncate">
                              {contact.displayName || "Unnamed Contact"}
                            </div>
                            {contact.emails?.length > 0 ? (
                              <div className="text-gray-500 text-sm truncate">
                                {contact.emails[0].email}
                              </div>
                            ) : contact.phoneNumbers?.length > 0 ? (
                              <div className="text-gray-500 text-sm truncate">
                                {contact.phoneNumbers[0].countryCode}{" "}
                                {contact.phoneNumbers[0].number}
                              </div>
                            ) : (
                              <div className="text-gray-400 text-sm">
                                No email/phone
                              </div>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No contacts found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactSearchModal;
