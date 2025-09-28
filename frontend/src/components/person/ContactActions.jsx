import {
  ChatOutlined,
  EmailOutlined,
  VideocamOutlined,
} from "@mui/icons-material";
import React from "react";

function ContactActions({ contact }) {
  // const handleChatClick = () => console.log("Chat clicked");
  // const handleVideoClick = () => console.log("Video call clicked");

  const iconStyle = {
    padding: "8px",
    color: "#001D35",
    backgroundColor: "#B3D7EF",
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer", // Cursor pointer
    transition: "background-color 0.3s ease", // Smooth hover transition
  };

  const hoverStyle = {
    backgroundColor: "#A0CBE0", // Slightly darker blue on hover
  };

  return (
    <div>
      <div className="md:mt-8 mt-2 md:pl-8 md:pb-8 pb-6 flex justify-center md:justify-normal gap-8">
        {/* Email */}
        <div>
          <a
            style={iconStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                hoverStyle.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#B3D7EF")
            }
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.emails[0].email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <EmailOutlined fontSize="medium" />
          </a>
          <div className="text-sm font-medium pt-1">Email</div>
        </div>

        {/* Chat */}
        <div>
          <a
            style={iconStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                hoverStyle.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#B3D7EF")
            }
            href={`https://wa.me/${contact.phoneNumbers[0].countryCode.replace(
              "+",
              ""
            )}${contact.phoneNumbers[0].number}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ChatOutlined fontSize="medium" />
          </a>
          <div className="text-sm font-medium pt-1">Chat</div>
        </div>

        {/* Video */}
        <div>
          <a
            style={iconStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                hoverStyle.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#B3D7EF")
            }
            href={`https://meet.google.com/new?calleeId=${contact.emails[0].email}`}
            target="_blank"
            rel="noopener noreferrer"
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
