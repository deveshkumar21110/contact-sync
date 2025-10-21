import React, { useEffect, useMemo, useRef, useState } from "react";
import Modal from "@mui/material/Modal";
import DevicesIcon from "@mui/icons-material/Devices";
import { Avatar, CircularProgress, Button } from "@mui/material";

// Hardcoded avatar styles
const avatarStyles = [
  { name: "adventurer", version: "7.x" },
  { name: "thumbs", version: "9.x" },
  { name: "lorelei", version: "7.x" },
  { name: "avataaars", version: "7.x" },
  { name: "bottts", version: "7.x" },
  { name: "croodles", version: "7.x" },
  { name: "icons", version: "9.x" },
  { name: "identicon", version: "9.x" },
  { name: "micah", version: "7.x" },
  { name: "miniavs", version: "7.x" },
  { name: "notionists", version: "7.x" },
  { name: "notionists-neutral", version: "7.x" },
  { name: "open-peeps", version: "7.x" },
  { name: "personas", version: "9.x" },
  { name: "pixel-art", version: "7.x" },
  { name: "pixel-art-neutral", version: "7.x" },
  { name: "rings", version: "9.x" },
  { name: "shapes", version: "9.x" },
];

export default function BasicModal({
  open,
  handleClose,
  register,
  fieldName,
  setValue,
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Generate variations from styles
  const variations = useMemo(() => {
    const seeds = [
      "Ice",
      "Rahul",
      "Priya",
      "Friend",
      "Brother",
      "Mother",
      "Father",
    ];
    const generated = [];

    seeds.forEach((seed) => {
      avatarStyles.forEach((style) => {
        generated.push({
          styleName: style.name,
          styleVersion: style.version,
          seed,
          uri: `https://api.dicebear.com/${style.version}/${style.name}/svg?seed=${seed}&backgroundType=solid&size=128&backgroundColor=c0aede`,
        });
      });
    });

    return generated;
  }, []);

  useEffect(() => {
    if (open) {
      setActiveTab("illustrations");
      setLoading(true);

      let loadedCount = 0;
      variations.forEach((v) => {
        const img = new Image();
        img.src = v.uri;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === variations.length) {
            setLoading(false);
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === variations.length) {
            setLoading(false);
          }
        };
      });
    }
  }, [open, variations]);

  const handleClick = (uri) => {
    setSelectedImage(uri);
    setValue(fieldName, uri);
    console.log(uri);
    handleClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setSelectedImage(localUrl);
      setValue(fieldName, localUrl);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (open) setActiveTab("illustrations");
  }, [open]);

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] h-[80vh] p-6 overflow-y-auto">
          {/* Header X */}
          <div className="flex items-center pb-2 mb-4">
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-800 text-lg"
            >
              ✕
            </button>
            <h2 className="flex-1 text-center font-medium">Choose picture</h2>

            {/* Hidden input to register selected image */}
            <input
              type="hidden"
              value={selectedImage || ""}
              {...register(fieldName)}
            />
          </div>

          {/* selection type */}
          <div className="flex justify-around border-b mb-4">
            <button
              className={`pb-2 text-lg font-medium ${
                activeTab === "illustrations"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("illustrations")} // ✅ Add this
            >
              Illustrations
            </button>

            <button
              className={`pb-2 text-lg font-medium ${
                activeTab === "device"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("device")}
            >
              From Device
            </button>
            {/* Hidden input to register selected image */}
            <input
              type="hidden"
              value={selectedImage || ""}
              {...register(fieldName)}
            />
          </div>

          {/* Variations grouped by style */}
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <CircularProgress />
            </div>
          ) : (
            <>
              {activeTab === "illustrations" && (
                <div className="flex flex-col gap-4">
                  {avatarStyles.map((style) => (
                    <div key={style.name}>
                      <h3 className="text-sm font-medium mb-2">
                        {style.name.toUpperCase()}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {variations
                          .filter((v) => v.styleName === style.name)
                          .map((v) => (
                            <img
                              onClick={() => handleClick(v.uri)}
                              key={`${v.styleName}-${v.seed}`}
                              src={v.uri}
                              alt={`${v.styleName}-${v.seed}`}
                              loading="lazy"
                              className="w-20 h-20 cursor-pointer hover:scale-105 transition rounded-xl"
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Variations grouped by style */}
          {activeTab === "device" && (
            <div className="flex justify-center items-center align-middle flex-col gap-4">
              <Avatar
                src={selectedImage || ""}
                sx={{ width: 200, height: 200 }}
                className="cursor-pointer"
              />
              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="flex gap-4">
                <Button
                  onClick={handleUploadClick}
                  sx={{
                    bgcolor: "#C2E7FF",
                    color: "black",
                    px: 2,
                    py: 1,
                    fontSize: "14px",
                    gap: 1,
                    textTransform: "none",
                    borderRadius: "30px",
                  }}
                >
                  <DevicesIcon />
                  Upload from device
                </Button>
                <Button
                  sx={{
                    bgcolor: "#C2E7FF",
                    color: "black",
                    px: 2,
                    py: 1,
                    fontSize: "14px",
                    gap: 1,
                    textTransform: "none",
                    borderRadius: "30px",
                  }}
                >
                  <DevicesIcon />
                  Take a picture
                </Button>
              </div>
              {selectedImage && (
                <Button
                  sx={{
                    bgcolor: "#1D4ED8",
                    color: "white",
                    px: 2,
                    py: 1,
                    fontSize: "14px",
                    gap: 1,
                    textTransform: "none",
                    borderRadius: "30px",
                  }}
                  onClick={() => handleClose()}
                >
                  Done
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
