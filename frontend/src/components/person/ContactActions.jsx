import { ChatOutlined, EmailOutlined, VideocamOutlined } from "@mui/icons-material";
import React from "react";

function ContactActions({ contact }) {
  const iconStyle = {
    padding: "8px",
    color: "#001D35",
    backgroundColor: "#B3D7EF",
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const hoverStyle = {
    backgroundColor: "#A0CBE0",
  };

  // Helper to safely get first email/phone
  const email = contact?.emails?.[0]?.email || "";
  const phone =
    contact?.phoneNumbers?.[0]
      ? `${contact.phoneNumbers[0].countryCode.replace("+", "")}${contact.phoneNumbers[0].number}`
      : "";

  return (
    <div>
      <div className="md:mt-8 mt-2 md:pl-8 md:pb-8 pb-6 flex justify-center md:justify-normal gap-8">
        {/* Email */}
        <div>
          <a
            style={iconStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#B3D7EF")}
            href={email ? `https://mail.google.com/mail/?view=cm&fs=1&to=${email}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Send email"
          >
            <EmailOutlined fontSize="medium" />
          </a>
          <div className="text-sm font-medium pt-1">Email</div>
        </div>

        {/* Chat (WhatsApp) */}
        <div>
          <a
            style={iconStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#B3D7EF")}
            href={phone ? `https://wa.me/${phone}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
          >
            <ChatOutlined fontSize="medium" />
          </a>
          <div className="text-sm font-medium pt-1">Chat</div>
        </div>

        {/* Video (Google Meet) */}
        <div>
          <a
            style={iconStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#B3D7EF")}
            href={email ? `https://meet.google.com/new?calleeId=${email}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Start video call"
          >
            <VideocamOutlined fontSize="medium" />
          </a>
          <div className="text-sm font-medium pt-1">Video</div>
        </div>
      </div>
    </div>
  );
}

export default ContactActions;
