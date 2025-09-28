import {
  ContentCopyOutlined,
  EmailOutlined,
  LinkOutlined,
  LocationOnOutlined,
  PhoneOutlined,
} from "@mui/icons-material";
import { selectContactById } from "../../redux/contactSlice";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CopyIcon } from "../../index";

function ContactDetails() {
  const { id: contactId } = useParams();

  const contact = useSelector((state) => selectContactById(state, contactId));

  return (
    <div className="flex flex-col gap-3 p-4 mt-4 mb-4 bg-gray-100 md:h-2/4 md:w-2/5 rounded-3xl">
      <div className="text-lg">Contact Details</div>

      {/* Emails */}
      {contact?.emails?.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <EmailOutlined sx={{ color: "#444746" }} />
            <div className="flex flex-col gap-2 pl-2">
              {contact.emails.map(
                (email, index) =>
                  email.email && (
                    <span
                      key={index}
                      className="group flex items-center hover:text-blue-600"
                    >
                      {email.email}
                      <CopyIcon value={email.email} />
                    </span>
                  )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Phones */}
      {contact?.phoneNumbers?.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <PhoneOutlined sx={{ color: "#444746" }} />
            <div className="flex flex-col gap-2 pl-2">
              {contact.phoneNumbers.map(
                (phone, index) =>
                  phone.number && (
                    <span
                      key={index}
                      className="group flex items-center hover:text-blue-600"
                    >
                      {phone.number}
                      <CopyIcon value={phone.number} />
                    </span>
                  )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Links */}
      {contact?.websites?.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <LinkOutlined sx={{ color: "#444746" }} />
            <div className="flex flex-col gap-2 pl-2">
              {contact.websites.map(
                (sites, index) =>
                  sites.url && (
                    <a
                      key={index}
                      href={sites.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center hover:text-blue-600"
                    >
                      {sites.url}
                    </a>
                  )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Addresses */}
      {contact?.addresses?.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <LocationOnOutlined sx={{ color: "#444746" }} />
            <div className="flex flex-col gap-1 pl-2">
              {contact.addresses.map((address, index) => (
                <div key={index} className="flex flex-col group">
                  {address.streetAddress && <div>{address.streetAddress}</div>}
                  {address.streetAddress2 && (
                    <div>{address.streetAddress2}</div>
                  )}
                  {(address.city || address.state || address.pincode) && (
                    <div>
                      {address.city && `${address.city}, `}
                      {address.state && `${address.state}, `}
                      {address.pincode && address.pincode}
                    </div>
                  )}
                  {address.country && <div>{address.country}</div>}
                  <CopyIcon
                    value={`${address.streetAddress || ""} ${
                      address.streetAddress2 || ""
                    } ${address.city || ""} ${address.state || ""} ${
                      address.pincode || ""
                    } ${address.country || ""}`.trim()}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactDetails;
