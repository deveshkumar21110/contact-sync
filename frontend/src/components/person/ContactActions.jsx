import {
  ChatOutlined,
  EmailOutlined,
  VideocamOutlined,
} from "@mui/icons-material";
import React from "react";

function ContactActions({ contact }) {
  const handleEmailClick = () => {
    console.log(contact);
    console.log("Hello");
    // window.open(
    //   `https://mail.google.com/mail/?view=cm&fs=1&to=${contact.mail}`,
    //   "_blank"
    // );
  };
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
            onClick={handleEmailClick()}
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <EmailOutlined fontSize="medium" />
          </a>
          <div className="text-sm font-medium pt-1">Email</div>
        </div>

        {/* Chat */}
        <div>
          <div
            style={iconStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                hoverStyle.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#B3D7EF")
            }
            // onClick={handleChatClick}
          >
            <ChatOutlined fontSize="medium" />
          </div>
          <div className="text-sm font-medium pt-1">Chat</div>
        </div>

        {/* Video */}
        <div>
          <div
            style={iconStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                hoverStyle.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#B3D7EF")
            }
            // onClick={handleVideoClick}
          >
            <VideocamOutlined fontSize="medium" />
          </div>
          <div className="text-sm font-medium pt-1">Video</div>
        </div>
      </div>
    </div>
  );
}

export default ContactActions;
